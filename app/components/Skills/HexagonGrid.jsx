"use client";
import { motion } from 'framer-motion';
import { useState, useCallback, useMemo, useEffect } from 'react';

// Seeded random number generator for consistent SSR/client values
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Single Hexagon Component
function Hexagon({ q, r, skill, onHover, waveIntensity, gridConfig, animationDelay, isInView }) {
  const { size, cols, rows, offsetX, offsetY } = gridConfig;

  // Calculate position for rectangular honeycomb grid
  // Offset every other row by half a hexagon width for honeycomb pattern
  const hexWidth = size * Math.sqrt(3);
  const hexHeight = size * 1.5;

  // Center the grid by calculating offsets
  const gridWidth = cols * hexWidth + (hexWidth / 2); // Extra half width for offset
  const gridHeight = rows * hexHeight + (size / 2); // Extra half size for top/bottom

  const x = q * hexWidth + (r % 2) * (hexWidth / 2) - gridWidth / 2 + offsetX;
  const y = r * hexHeight - gridHeight / 2 + offsetY;

  // Create hexagon path (rotated 90 degrees)
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 2; // Add 90 degree rotation
    const px = size * Math.cos(angle);
    const py = size * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  const pathData = `M ${points.join(' L ')} Z`;

  // Determine if this hex has a skill or is empty
  const hasSkill = skill !== null;

  // Calculate glow intensity based on wave
  const glowIntensity = Math.max(0, Math.min(1, waveIntensity));

  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{
          duration: 0.4,
          delay: animationDelay,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
      {/* Glow effect (outer) */}
      <motion.path
        d={pathData}
        fill="none"
        stroke="url(#hexGradient)"
        strokeWidth={hasSkill ? 2 : 1}
        opacity={hasSkill ? 0.6 : 0.2}
        animate={{
          strokeWidth: hasSkill ? (2 + glowIntensity * 2) : (1 + glowIntensity),
          opacity: hasSkill ? (0.6 + glowIntensity * 0.4) : (0.2 + glowIntensity * 0.3),
          filter: `drop-shadow(0 0 ${glowIntensity * 20}px rgba(139, 92, 246, ${glowIntensity * 0.8}))`
        }}
        transition={{ duration: 0.05 }}
      />

      {/* Main hexagon */}
      <motion.path
        d={pathData}
        fill={hasSkill ? "rgba(139, 92, 246, 0.1)" : "rgba(255, 255, 255, 0.02)"}
        stroke={hasSkill ? "rgba(139, 92, 246, 0.3)" : "rgba(255, 255, 255, 0.1)"}
        strokeWidth={1}
        className="cursor-pointer transition-colors duration-300"
        onMouseEnter={() => onHover(q, r)}
        animate={{
          fill: hasSkill
            ? `rgba(139, 92, 246, ${0.1 + glowIntensity * 0.2})`
            : `rgba(255, 255, 255, ${0.02 + glowIntensity * 0.05})`,
        }}
        transition={{ duration: 0.05 }}
        whileHover={{
          scale: 1.05,
          fill: hasSkill ? "rgba(139, 92, 246, 0.3)" : "rgba(255, 255, 255, 0.05)",
          transition: { duration: 0.05 }
        }}
      />

      {/* Skill content */}
      {hasSkill && (
        <g>
          {/* Icon */}
          <foreignObject
            x={-28}
            y={-42}
            width={56}
            height={56}
          >
            <div className="flex items-center justify-center w-full h-full">
              {skill.icon && <skill.icon className="w-14 h-14 text-gradient-purple" />}
            </div>
          </foreignObject>

          {/* Skill name */}
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            y={30}
            fontSize="15"
            fill="rgba(248, 249, 250, 0.9)"
            className="font-medium"
          >
            {skill.name}
          </text>
        </g>
      )}
      </motion.g>
    </g>
  );
}

export default function HexagonGrid({ skills = [], isInView = false }) {
  const [hoveredHex, setHoveredHex] = useState(null);
  const [waveMap, setWaveMap] = useState(new Map());
  const [screenSize, setScreenSize] = useState('desktop');

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Grid configuration based on screen size
  const gridConfig = useMemo(() => {
    if (screenSize === 'mobile') {
      // 5 cols x 12 rows for mobile screens
      return { cols: 5, rows: 12, size: 80, offsetX: 0, offsetY: 0 };
    }
    if (screenSize === 'tablet') {
      // 8 cols x 8 rows for tablet (square-ish)
      return { cols: 8, rows: 8, size: 80, offsetX: 0, offsetY: 0 };
    }
    return { cols: 15, rows: 8, size: 90, offsetX: 100, offsetY: 80 };
  }, [screenSize]);

  const isMobile = screenSize === 'mobile';

  const { cols, rows } = gridConfig;

  // Calculate distance between two hexagons (offset coordinates)
  const hexDistance = (col1, row1, col2, row2) => {
    // Convert offset coordinates to axial coordinates
    const q1 = col1 - Math.floor(row1 / 2);
    const r1 = row1;
    const q2 = col2 - Math.floor(row2 / 2);
    const r2 = row2;

    // Calculate distance using axial coordinates
    return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
  };

  // Handle hover and propagate wave
  const handleHover = useCallback((q, r) => {
    setHoveredHex({ q, r });

    // Calculate wave intensities for all hexagons
    const newWaveMap = new Map();
    const maxDistance = 3; // Wave propagation distance (reduced from 5)

    // Generate all hexagons in range
    for (let dq = -maxDistance; dq <= maxDistance; dq++) {
      for (let dr = -maxDistance; dr <= maxDistance; dr++) {
        const hexQ = q + dq;
        const hexR = r + dr;
        const distance = hexDistance(q, r, hexQ, hexR);

        if (distance <= maxDistance) {
          // Calculate intensity: 1 at center, fades with distance
          const intensity = 1 - (distance / maxDistance);
          newWaveMap.set(`${hexQ},${hexR}`, intensity);
        }
      }
    }

    setWaveMap(newWaveMap);
  }, []);

  // Memoize skill distribution to prevent re-shuffling on every render
  const skillMap = useMemo(() => {
    const map = new Map();

    // Collect all inner cell positions (excluding edges)
    const innerCells = [];
    for (let row = 1; row < rows - 1; row++) { // Skip first and last row
      for (let col = 1; col < cols - 1; col++) { // Skip first and last column
        innerCells.push({ col, row });
      }
    }

    // Shuffle inner cells for random distribution (Fisher-Yates shuffle with seeded random)
    for (let i = innerCells.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i * 7 + 500) * (i + 1));
      [innerCells[i], innerCells[j]] = [innerCells[j], innerCells[i]];
    }

    // Place skills randomly
    skills.forEach((skill, index) => {
      if (index < innerCells.length) {
        const { col, row } = innerCells[index];
        map.set(`${col},${row}`, skill);
      }
    });

    return map;
  }, [skills, cols, rows]); // Recalculate if skills or grid size changes

  // Pre-calculate random delays for each hexagon (using seeded random for consistency)
  const animationDelays = useMemo(() => {
    const delays = new Map();
    const totalHexagons = cols * rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = `${col},${row}`;
        const seed = col * 100 + row * 7 + 42; // Unique seed for each hexagon
        // Random delay between 0.8s and 2s for staggered pop-in
        const delay = 0.8 + seededRandom(seed) * 1.2;
        delays.set(key, delay);
      }
    }
    return delays;
  }, [cols, rows]);

  const hexagons = [];

  // Generate hexagons in rectangular pattern
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${col},${row}`;
      const skill = skillMap.get(key) || null;
      const waveIntensity = waveMap.get(key) || 0;
      const animationDelay = animationDelays.get(key) || 0;

      hexagons.push(
        <Hexagon
          key={key}
          q={col}
          r={row}
          skill={skill}
          onHover={handleHover}
          waveIntensity={waveIntensity}
          gridConfig={gridConfig}
          animationDelay={animationDelay}
          isInView={isInView}
        />
      );
    }
  }

  // Calculate viewBox based on actual grid dimensions
  const getViewBox = useMemo(() => {
    const { size, cols, rows, offsetX, offsetY } = gridConfig;
    const hexWidth = size * Math.sqrt(3);
    const hexHeight = size * 1.5;

    const gridWidth = cols * hexWidth + (hexWidth / 2);
    const gridHeight = rows * hexHeight + (size / 2);

    // Add padding around the grid
    const padding = size;

    const viewWidth = gridWidth + padding * 2;
    const viewHeight = gridHeight + padding * 2;

    const viewX = -gridWidth / 2 + offsetX - padding;
    const viewY = -gridHeight / 2 + offsetY - padding;

    return `${viewX} ${viewY} ${viewWidth} ${viewHeight}`;
  }, [gridConfig]);

  const viewBox = getViewBox;
  console.log('viewBox:', viewBox, 'isMobile:', isMobile, 'gridConfig:', gridConfig);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* SVG Container */}
      <svg
        className="w-full h-full cursor-pointer"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
          </linearGradient>

          {/* Linear gradients for rectangular fade */}
          <linearGradient id="fadeTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(10, 14, 39, 1)" />
            <stop offset="65%" stopColor="rgba(10, 14, 39, 0)" />
          </linearGradient>

          <linearGradient id="fadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="35%" stopColor="rgba(10, 14, 39, 0)" />
            <stop offset="100%" stopColor="rgba(10, 14, 39, 1)" />
          </linearGradient>

          <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(10, 14, 39, 1)" />
            <stop offset="20%" stopColor="rgba(10, 14, 39, 0)" />
          </linearGradient>

          <linearGradient id="fadeRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="80%" stopColor="rgba(10, 14, 39, 0)" />
            <stop offset="100%" stopColor="rgba(10, 14, 39, 1)" />
          </linearGradient>
        </defs>

        {/* Render all hexagons */}
        {hexagons}
      </svg>

      {/* Rectangular fade overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Top fade */}
          <rect width="100%" height="65%" fill="url(#fadeTop)" />

          {/* Bottom fade */}
          <rect y="35%" width="100%" height="65%" fill="url(#fadeBottom)" />

          {/* Left fade */}
          <rect width="20%" height="100%" fill="url(#fadeLeft)" />

          {/* Right fade */}
          <rect x="80%" width="20%" height="100%" fill="url(#fadeRight)" />
        </svg>
      </div>
    </div>
  );
}

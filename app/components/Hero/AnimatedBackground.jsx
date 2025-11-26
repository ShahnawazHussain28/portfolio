"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

// Seeded random number generator for consistent SSR/client values
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AnimatedBackground() {
  // Generate CSS particles with seeded random for hydration consistency
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.round(seededRandom(i * 1) * 100)}%`,
      top: `${Math.round(seededRandom(i * 2 + 100) * 100)}%`,
      size: Math.round(seededRandom(i * 3 + 200) * 3 + 1),
      duration: Math.round(seededRandom(i * 4 + 300) * 20 + 15),
      delay: Math.round(seededRandom(i * 5 + 400) * 5),
    })), []);

  return (
    <div className="overflow-hidden absolute inset-0 -z-10">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-accent" />

      {/* Radial gradient overlays */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgb(139 92 246 / 0.15) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgb(236 72 153 / 0.15) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 80%, rgb(59 130 246 / 0.15) 0%, transparent 50%)',
        }}
      />

      {/* CSS-only particles - Desktop only */}
      <div className="hidden md:block absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-purple"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}

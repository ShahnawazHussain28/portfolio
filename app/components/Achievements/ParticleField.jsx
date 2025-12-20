"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

// Seeded random for consistent SSR/client rendering
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function ParticleField({ stage }) {
  const isActive = stage >= 1;

  // Gold particles for champion
  const goldParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.round(seededRandom(i * 1) * 100),
      y: Math.round(seededRandom(i * 2 + 100) * 100),
      size: Math.round(seededRandom(i * 3 + 200) * 4 + 2),
      duration: Math.round(seededRandom(i * 4 + 300) * 3 + 2),
      delay: Math.round(seededRandom(i * 5 + 400) * 2),
    }));
  }, []);

  // Silver particles for finalist
  const silverParticles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i + 100,
      x: Math.round(seededRandom(i * 6 + 500) * 100),
      y: Math.round(seededRandom(i * 7 + 600) * 100),
      size: Math.round(seededRandom(i * 8 + 700) * 3 + 2),
      duration: Math.round(seededRandom(i * 9 + 800) * 3 + 2),
      delay: Math.round(seededRandom(i * 10 + 900) * 2),
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gold particles - appear when stage >= 1 */}
      {stage >= 1 && goldParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "radial-gradient(circle, #FFD700, #FFA500)",
            boxShadow: "0 0 6px #FFD700",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            y: [0, -80],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Silver particles - appear when stage >= 2 */}
      {stage >= 2 && silverParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "radial-gradient(circle, #C0C0C0, #A8A8A8)",
            boxShadow: "0 0 6px #C0C0C0",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
            y: [0, -60],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay + 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Light beams - appear at finale */}
      {stage >= 3 && (
        <>
          <motion.div
            className="absolute left-1/3 top-0 w-[2px] h-full"
            style={{
              background: "linear-gradient(to bottom, transparent, #FFD70050, transparent)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/3 top-0 w-[2px] h-full"
            style={{
              background: "linear-gradient(to bottom, transparent, #C0C0C050, transparent)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Confetti burst at finale */}
      {stage >= 3 && [...Array(12)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "#FFD700" : "#EC4899",
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * 30 * Math.PI) / 180) * 150,
            y: Math.sin((i * 30 * Math.PI) / 180) * 150,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

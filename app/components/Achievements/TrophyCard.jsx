"use client";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa";

export default function TrophyCard({ achievement, isVisible }) {
  const Icon = achievement.icon === "trophy" ? FaTrophy : FaMedal;
  const isGold = achievement.icon === "trophy";

  return (
    <div className="relative flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${achievement.color.primary}40, transparent, ${achievement.color.primary}40, transparent)`,
        }}
        animate={isVisible ? { rotate: 360 } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner rotating ring (opposite direction) */}
      <motion.div
        className="absolute w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full"
        style={{
          background: `conic-gradient(from 180deg, transparent, ${achievement.color.secondary}30, transparent, ${achievement.color.secondary}30, transparent)`,
        }}
        animate={isVisible ? { rotate: -360 } : {}}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing glow circle */}
      <motion.div
        className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full"
        style={{
          background: `radial-gradient(circle, ${achievement.color.glow} 0%, transparent 70%)`,
        }}
        animate={isVisible ? {
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Trophy container with glass effect */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${achievement.color.primary}20 0%, ${achievement.color.secondary}10 100%)`,
          backdropFilter: "blur(10px)",
          border: `2px solid ${achievement.color.primary}50`,
          boxShadow: `
            0 0 40px ${achievement.color.glow},
            inset 0 0 20px ${achievement.color.primary}20
          `,
        }}
        animate={isVisible ? {
          y: [0, -8, 0],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* The Trophy Icon - HERO element */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isVisible ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <Icon
            className="text-4xl sm:text-5xl md:text-7xl"
            style={{
              color: achievement.color.primary,
              filter: `drop-shadow(0 0 15px ${achievement.color.glow}) drop-shadow(0 0 30px ${achievement.color.glow})`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Sparkle burst particles - hidden on very small screens */}
      {isVisible && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full hidden sm:block"
          style={{
            background: achievement.color.primary,
            boxShadow: `0 0 6px ${achievement.color.primary}`,
            top: "20%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * 45 * Math.PI) / 180) * 80],
            y: [0, Math.sin((i * 45 * Math.PI) / 180) * 80],
            opacity: [1, 0],
            scale: [1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Position/Rank Badge - floating above */}
      <motion.div
        className="absolute -top-2 sm:-top-4 md:-top-6 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div
          className="px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-black tracking-wider uppercase"
          style={{
            background: `linear-gradient(135deg, ${achievement.color.primary}, ${achievement.color.secondary})`,
            color: "#1a1a2e",
            boxShadow: `0 0 20px ${achievement.color.glow}, 0 4px 15px rgba(0,0,0,0.3)`,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          #{achievement.stats.position} {achievement.stats.label}
        </div>
      </motion.div>

      {/* Event Details - below trophy */}
      <motion.div
        className="mt-6 sm:mt-8 md:mt-10 text-center z-10 px-2"
        initial={{ y: 30, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Event Name */}
        <motion.h3
          className="text-base sm:text-xl md:text-2xl font-bold leading-tight"
          style={{
            background: `linear-gradient(90deg, ${achievement.color.primary}, #fff, ${achievement.color.primary})`,
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: isVisible ? "shimmer 3s linear infinite" : "none",
          }}
        >
          {achievement.event}
        </motion.h3>
      </motion.div>

      {/* Horizontal light rays */}
      <motion.div
        className="absolute top-[25%] sm:top-1/3 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${achievement.color.primary}50, transparent)`,
        }}
        animate={isVisible ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

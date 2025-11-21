"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide scroll indicator after scrolling 100px
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth',
        });
      }}
      data-cursor-hover
    >
      <span className="text-light-secondary text-sm font-medium">Scroll to explore</span>

      {/* Animated arrow */}
      <motion.div
        className="relative w-6 h-10 border-2 border-light-secondary/30 rounded-full flex items-start justify-center p-1"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 bg-gradient-to-b from-gradient-purple to-gradient-pink rounded-full"
          animate={{
            y: [0, 16, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Bouncing arrow icon */}
      <motion.svg
        className="w-6 h-6 text-light-secondary"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </motion.svg>
    </motion.div>
  );
}

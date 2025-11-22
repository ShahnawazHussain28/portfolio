"use client";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Timeline({ children }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Timeline line container */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden lg:block">
        {/* Background line */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-accent/30 to-dark-accent/10 rounded-full" />

        {/* Animated progress line */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gradient-purple via-gradient-pink to-gradient-blue rounded-full origin-top"
          style={{ height: lineHeight }}
        />
      </div>

      {/* Experience items */}
      <div className="space-y-12 lg:space-y-24">
        {children}
      </div>
    </div>
  );
}

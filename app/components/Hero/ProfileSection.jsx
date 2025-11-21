"use client";
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function ProfileSection({ profileImage }) {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div
        className="relative preserve-3d"
        style={{
          rotateX,
          rotateY,
        }}
      >
        {/* Gradient glow background */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-3xl opacity-50 blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Profile image container */}
        <div className="relative rounded-3xl overflow-hidden glass-dark p-2">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={profileImage}
              alt="Shahnawaz Hussain"
              fill
              className="object-cover"
              priority
            />

            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-gradient-purple/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-gradient-purple to-gradient-pink rounded-full blur-xl opacity-60"
          animate={{
            y: [-10, 10, -10],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-gradient-blue to-gradient-cyan rounded-full blur-xl opacity-60"
          animate={{
            y: [10, -10, 10],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

"use client";
import { motion } from 'framer-motion';

export default function TextAnimations() {
  const greeting = "Hello,";
  const name = "I'm Shahnawaz";
  const title = "Full Stack Web Developer";
  const description = "I craft stunning, modern web experiences with cutting-edge technologies. Passionate about creating seamless user interfaces and robust backend systems that bring ideas to life.";

  // Stagger animation for letters
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    }),
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Greeting */}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold text-light-primary"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {greeting.split('').map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            custom={index}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Name with gradient */}
      <motion.h2
        className="text-5xl md:text-7xl lg:text-8xl font-bold"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <span className="text-light-primary mr-4">I&apos;m</span>
        <motion.span
          className="gradient-text inline-block"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        >
          Shahnawaz
        </motion.span>
      </motion.h2>

      {/* Title */}
      <motion.div
        className="relative inline-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-light-secondary">
          {title}
        </p>

        {/* Animated underline */}
        <motion.div
          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Description */}
      <motion.p
        className="text-base md:text-lg text-light-secondary/80 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        {description}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-wrap gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.a
          href="#projects"
          className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue text-white relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-cursor-hover
        >
          <span className="relative z-10">View My Work</span>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.a>

        <motion.a
          href="#contact"
          className="px-8 py-4 text-lg font-semibold rounded-full glass border border-light-primary/20 text-light-primary relative overflow-hidden group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-cursor-hover
        >
          <span className="relative z-10">Get In Touch</span>

          {/* Gradient border on hover */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #3B82F6)',
              padding: '2px',
            }}
          />
        </motion.a>
      </motion.div>
    </div>
  );
}

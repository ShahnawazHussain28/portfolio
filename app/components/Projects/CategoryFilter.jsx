"use client";
import { motion } from 'framer-motion';

const categories = ['All', 'Web', 'Mobile', 'Game', 'AI/ML', 'Other'];

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all ${
              isActive
                ? 'text-white'
                : 'text-light-secondary hover:text-light-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-cursor-hover
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            {/* Inactive background */}
            {!isActive && (
              <div className="absolute inset-0 glass border border-light-primary/10 rounded-full" />
            )}

            {/* Text */}
            <span className="relative z-10">{category}</span>

            {/* Glow effect when active */}
            {isActive && (
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-full blur-lg -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

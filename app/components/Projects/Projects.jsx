"use client";
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import ProjectCard from './ProjectCard';
import CategoryFilter from './CategoryFilter';
import { projects } from '@/app/data/projects';

const MAX_PROJECTS_HOME = 6;

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('All');
  const [hasAnimated, setHasAnimated] = useState(false);

  // Track when initial animation completes
  if (isInView && !hasAnimated) {
    setTimeout(() => setHasAnimated(true), 1500);
  }

  const allFilteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  // Limit to MAX_PROJECTS_HOME on homepage
  const filteredProjects = allFilteredProjects.slice(0, MAX_PROJECTS_HOME);
  const hasMoreProjects = allFilteredProjects.length > MAX_PROJECTS_HOME;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
      id="projects"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-dark-secondary/30 -z-10" />
      <div
        className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-blue/5 rounded-full blur-3xl -z-10"
      />
      <div
        className="absolute bottom-1/3 right-0 w-96 h-96 bg-gradient-purple/5 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="gradient-text">Featured Projects</span>
          </motion.h2>

          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue rounded-full mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.p
            className="text-lg md:text-xl text-light-secondary/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Showcasing my passion for building innovative solutions
          </motion.p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Projects grid - Bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${activeCategory}-${project.slug}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: hasAnimated ? 0 : 30 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: hasAnimated ? 0.3 : 0.4,
                  delay: hasAnimated ? index * 0.05 : 1 + index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-2xl text-light-secondary/60">
              No projects found in this category
            </p>
          </motion.div>
        )}

        {/* View All button */}
        {hasMoreProjects && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <Link href="/projects">
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-gradient-purple to-gradient-pink rounded-full text-white font-medium inline-flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                View All Projects
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

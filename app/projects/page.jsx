"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import ProjectCard from "@/app/components/Projects/ProjectCard";
import CategoryFilter from "@/app/components/Projects/CategoryFilter";
import { projects } from "@/app/data/projects";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Background elements */}
      <div className="fixed inset-0 bg-dark-secondary/30 -z-10" />
      <div className="fixed left-0 top-1/4 w-96 h-96 rounded-full bg-gradient-blue/5 blur-3xl -z-10" />
      <div className="fixed right-0 bottom-1/4 w-96 h-96 rounded-full bg-gradient-purple/5 blur-3xl -z-10" />

      <div className="container px-6 mx-auto">
        {/* Page header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="gradient-text">All Projects</span>
          </motion.h1>

          <motion.div
            className="mx-auto mb-6 w-24 h-1 bg-gradient-to-r rounded-full from-gradient-purple via-gradient-pink to-gradient-blue"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.p
            className="mx-auto max-w-2xl text-lg md:text-xl text-light-secondary/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            A complete collection of my work across different domains
          </motion.p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Projects count */}
        <motion.p
          className="mb-8 text-center text-light-secondary/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
        >
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </motion.p>

        {/* Projects grid */}
        <div className="grid grid-cols-1 auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={`${activeCategory}-${project.slug}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
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
            className="py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-2xl text-light-secondary/60">
              No projects found in this category
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}

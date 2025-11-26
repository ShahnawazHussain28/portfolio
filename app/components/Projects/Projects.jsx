"use client";
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import CategoryFilter from './CategoryFilter';

// Your actual projects
const projects = [
  {
    id: 1,
    title: "Gauge Ecommerce Website",
    description: "Fully functional eCommerce website with user-friendly landing page, blog section, and seamless purchase experience for Gauge RO products with detailed descriptions and customer reviews.",
    image: "/screenshots/ecommerce-short.png",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    liveUrl: "https://gauge.komsup.com",
    githubUrl: null,
    category: "Web",
    featured: true,
  },
  {
    id: 2,
    title: "Consumer App",
    description: "PWA for Smart Water Purifier customers to view purifier data, operate RO remotely, and perform complex troubleshooting. Includes FAQ, tutorials, and issues section.",
    image: "/screenshots/consumerapp-short.png",
    technologies: ["React", "PWA", "Node.js", "MongoDB", "WebSocket"],
    liveUrl: "https://pwa2.komsup.com/",
    githubUrl: null,
    category: "Mobile",
    featured: false,
  },
  {
    id: 3,
    title: "Technician App",
    description: "PWA for technicians to manage teams and assigned tasks. Features task assignment, ticket status tracking, revisiting, and rescheduling functionality.",
    image: "/screenshots/pegapp-short.png",
    technologies: ["React", "PWA", "Firebase", "Material-UI"],
    liveUrl: "https://pegpwa.komsup.com/",
    githubUrl: null,
    category: "Mobile",
    featured: false,
  },
  {
    id: 4,
    title: "Digital Circuit Simulator",
    description: "Real-time digital circuit simulator with drag-and-drop interface. Build Adder circuits, 7-segment displays, or your own computer design.",
    image: "/screenshots/circuitsim-short.png",
    technologies: ["JavaScript", "Canvas API", "HTML5", "CSS3"],
    liveUrl: "https://shahnawazhussain28.github.io/circuitsim/",
    githubUrl: "https://github.com/ShahnawazHussain28/ShahnawazHussain28.github.io/tree/main/circuitsim",
    category: "Web",
    featured: false,
  },
  {
    id: 5,
    title: "Squid Game - Survival Island",
    description: '3D survival game made with Unity based on "Squid Game" series. Play as Player-456 through 4 games: Red Light Green Light, Sugar Honeycomb, Even Odd Marbles, and Glass Bridge.',
    image: "/screenshots/squidgame-short.png",
    technologies: ["Unity", "C#", "3D Modeling", "Game Design"],
    liveUrl: null,
    githubUrl: null,
    category: "Game",
    featured: false,
  },
  {
    id: 6,
    title: "Whatsy - WhatsApp Bot",
    description: "AI-powered WhatsApp bot that answers questions, finds images, translates languages, discovers music, and solves math problems. Powered by Google and DuckDuckGo APIs.",
    image: "/screenshots/whatsy-1.jpeg",
    technologies: ["Node.js", "WhatsApp API", "Google API", "AI"],
    liveUrl: null,
    githubUrl: "https://github.com/ShahnawazHussain28/whatsapp-bot",
    category: "AI/ML",
    featured: false,
  },
  {
    id: 7,
    title: "Unfair Chat",
    description: "Full-featured chat app with a twist! See friends' online status, change profile pictures, and have fun seeing who they're talking to and what they're typing.",
    image: "/screenshots/unfairchat-short.png",
    technologies: ["React", "Socket.io", "Node.js", "MongoDB", "Express"],
    liveUrl: "https://unfairchat.onrender.com",
    githubUrl: "https://github.com/ShahnawazHussain28/unfair-chat-react/",
    category: "Web",
    featured: false,
  },
  {
    id: 8,
    title: "Automated Integration Testing",
    description: "Complete testing environment for Smart RO with flows for every possible failure. Saves 5 hours of manual testing per day.",
    image: "/screenshots/testing-short.jpg",
    technologies: ["Selenium", "Python", "Jest", "Automation"],
    liveUrl: null,
    githubUrl: null,
    category: "Other",
    featured: false,
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

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
                key={`${activeCategory}-${project.id}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
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
      </div>
    </section>
  );
}

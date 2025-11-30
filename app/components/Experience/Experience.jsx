"use client";
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Timeline from './Timeline';
import ExperienceCard from './ExperienceCard';
import { experiences } from '@/app/data/experience';

export default function Experience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 md:py-32 overflow-hidden"
      id="experience"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-dark-primary -z-10" />
      <div
        className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-purple/5 rounded-full blur-3xl -z-10"
      />
      <div
        className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-pink/5 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
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
            <span className="gradient-text">Work Experience</span>
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
            My professional journey building amazing digital experiences
          </motion.p>
        </motion.div>

        {/* Timeline with experience cards */}
        <Timeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={index}
              {...experience}
              index={index}
            />
          ))}
        </Timeline>
      </div>
    </section>
  );
}

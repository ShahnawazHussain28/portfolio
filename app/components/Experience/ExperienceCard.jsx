"use client";
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function ExperienceCard({
  company,
  position,
  period,
  description,
  achievements = [],
  technologies = [],
  logo,
  index
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [isExpanded, setIsExpanded] = useState(false);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      className={`relative lg:grid lg:grid-cols-2 gap-8 ${isEven ? '' : 'lg:grid-flow-dense'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute top-8 w-6 h-6 hidden lg:block z-20"
        style={{ left: 'calc(50% - 0.75rem)', transform: 'translateX(-50%)' }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-br from-gradient-purple to-gradient-pink"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(139, 92, 246, 0.7)',
              '0 0 0 10px rgba(139, 92, 246, 0)',
              '0 0 0 0 rgba(139, 92, 246, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {/* Content card */}
      <motion.div
        className={`${isEven ? 'lg:col-start-2' : 'lg:col-start-1'} relative group`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Gradient border wrapper */}
        <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue">
          {/* Card content */}
          <div className="bg-dark-secondary/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 relative overflow-hidden border border-white/5">
            {/* Animated gradient background on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gradient-purple/10 via-gradient-pink/10 to-gradient-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-light-primary mb-2">
                    {position}
                  </h3>
                  <p className="text-lg md:text-xl font-semibold gradient-text mb-1">
                    {company}
                  </p>
                  <p className="text-sm md:text-base text-light-secondary/60">
                    {period}
                  </p>
                </div>

                {/* Logo if provided */}
                {logo && (
                  <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-light-primary/5 p-2 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {logo}
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <p className="text-light-secondary/90 mb-4 leading-relaxed">
                {description}
              </p>

              {/* Achievements */}
              {achievements.length > 0 && (
                <motion.div
                  className="mb-4"
                  initial={false}
                  animate={{ height: isExpanded ? "auto" : 0 }}
                >
                  <ul className="space-y-2">
                    {achievements.map((achievement, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-2 text-light-secondary/80 text-sm md:text-base"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <span className="text-gradient-purple mt-1">▸</span>
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Technologies */}
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies.map((tech, idx) => (
                    <motion.span
                      key={idx}
                      className="px-3 py-1 text-xs md:text-sm rounded-full glass border border-gradient-purple/30 text-light-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ delay: index * 0.2 + 0.5 + idx * 0.05 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Expand button */}
              {achievements.length > 0 && (
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm font-medium text-gradient-purple hover:text-gradient-pink transition-colors flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  data-cursor-hover
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↓
                  </motion.span>
                </motion.button>
              )}
            </div>

            {/* Decorative corner accent */}
            <motion.div
              className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gradient-purple/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-gradient-purple/20 via-gradient-pink/20 to-gradient-blue/20 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </motion.div>

      {/* Empty space for alternating layout */}
      <div className={`hidden lg:block ${isEven ? 'lg:col-start-1' : 'lg:col-start-2'}`} />
    </motion.div>
  );
}

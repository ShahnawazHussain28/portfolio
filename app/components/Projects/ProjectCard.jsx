"use client";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectCard({
  slug,
  title,
  description,
  image,
  technologies = [],
  category,
  featured = false,
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Card rotation (main 3D tilt)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 25,
  });

  // Parallax effects - 2 layers only
  // Image layer - moves LESS (furthest back, slow movement)
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20,
  });
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20,
  });

  // Text/Content layer - moves MORE (front layer, fast movement)
  const contentX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), {
    stiffness: 200,
    damping: 25,
  });
  const contentY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), {
    stiffness: 200,
    damping: 25,
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
    setIsHovered(false);
  };

  return (
    <Link href={`/projects/${slug}`}>
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer h-full ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1'
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      data-cursor-hover
    >
      <motion.div
        className="relative h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-visible"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          perspective: 1000, // Add perspective for depth
        }}
      >
        {/* Gradient border wrapper */}
        <div className="absolute inset-0 p-[2px] rounded-2xl bg-gradient-to-br from-gradient-purple via-gradient-pink to-gradient-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-[2px] rounded-2xl bg-dark-secondary" />
        </div>

        {/* Image Layer - Back layer with more movement */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-dark-accent"
          style={{
            x: imageX,
            y: imageY,
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)", // Push back in 3D space
          }}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-accent to-dark-secondary flex items-center justify-center">
              <span className="text-6xl opacity-20">💻</span>
            </div>
          )}

          {/* Gradient overlay - stays with image layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/80 to-transparent" />
        </motion.div>

        {/* Text/Content Layer - Front layer with subtle floating */}
        <motion.div
          className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10"
          style={{
            x: contentX,
            y: contentY,
            transformStyle: "preserve-3d",
            transform: "translateZ(60px)", // Front layer
          }}
        >
          {/* Category badge */}
          <motion.div
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(10px)", // Extra pop
            }}
          >
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-dark-primary/80 backdrop-blur-md border border-gradient-purple/40 text-light-primary shadow-lg">
              {category}
            </span>
          </motion.div>

          {/* Info panel - slides up on hover */}
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-light-primary mb-2">
                {title}
              </h3>
              <p className="text-sm md:text-base text-light-secondary/90 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-md bg-white/10 text-light-primary border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="px-2 py-1 text-xs rounded-md bg-white/10 text-light-primary border border-white/20">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* View Project indicator */}
            <motion.div
              className="flex items-center gap-2 text-gradient-purple"
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-medium">View Project</span>
              <svg
                className="w-4 h-4"
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
            </motion.div>
          </motion.div>

          {/* Always visible title when not hovered */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-6"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(10px)", // Slight pop
            }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-light-primary">
              {title}
            </h3>
          </motion.div>
        </motion.div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-2 bg-gradient-to-r from-gradient-purple/30 via-gradient-pink/30 to-gradient-blue/30 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </motion.div>
    </motion.div>
    </Link>
  );
}

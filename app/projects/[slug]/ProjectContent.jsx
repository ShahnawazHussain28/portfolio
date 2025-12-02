"use client";
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { projects } from '@/app/data/projects';

// Epic Image Carousel with Lightbox
function ImageCarousel({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);

  if (!images || images.length === 0) return null;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      if (newDirection === 1) {
        return prev === images.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <>
      <div className="relative">
        {/* Main Carousel */}
        <div
          ref={carouselRef}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-dark-secondary"
        >
          {/* Gradient border effect */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-gradient-purple via-gradient-pink to-gradient-blue opacity-50" />
          <div className="absolute inset-[1px] rounded-2xl bg-dark-secondary overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                  // Reset dragging state after a short delay
                  setTimeout(() => setIsDragging(false), 100);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                onClick={() => {
                  if (!isDragging) {
                    setSelectedImage(images[activeIndex]);
                  }
                }}
              >
                <Image
                  src={images[activeIndex]}
                  alt={`${title} screenshot ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          {images.length > 1 && (
            <>
              <motion.button
                className="hidden md:flex absolute left-4 top-1/2 w-12 h-12 rounded-full bg-dark-primary/80 backdrop-blur-md items-center justify-center text-white border border-white/10 hover:bg-dark-primary hover:border-gradient-purple/50 z-10"
                initial={{ y: "-50%" }}
                whileHover={{ scale: 1.1, x: -2, y: "-50%" }}
                whileTap={{ scale: 0.9, y: "-50%" }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                className="hidden md:flex absolute right-4 top-1/2 w-12 h-12 rounded-full bg-dark-primary/80 backdrop-blur-md items-center justify-center text-white border border-white/10 hover:bg-dark-primary hover:border-gradient-purple/50 z-10"
                initial={{ y: "-50%" }}
                whileHover={{ scale: 1.1, x: 2, y: "-50%" }}
                whileTap={{ scale: 0.9, y: "-50%" }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

        </div>

        {/* Thumbnail Strip - Hidden on mobile */}
        {images.length > 1 && (
          <div className="mt-4 hidden md:flex justify-center gap-3">
            {images.map((img, idx) => (
              <motion.button
                key={idx}
                className={`relative w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-gradient-purple shadow-lg shadow-gradient-purple/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => goToSlide(idx)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                {idx !== activeIndex && (
                  <div className="absolute inset-0 bg-dark-primary/50" />
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Dot indicators for mobile */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 md:hidden">
            {images.map((_, idx) => (
              <motion.button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'w-6 bg-gradient-to-r from-gradient-purple to-gradient-pink'
                    : 'bg-white/30'
                }`}
                onClick={() => goToSlide(idx)}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-primary/98 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Navigation arrows in lightbox */}
            {images.length > 1 && (
              <>
                <motion.button
                  className="absolute left-6 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                    setSelectedImage(images[activeIndex === 0 ? images.length - 1 : activeIndex - 1]);
                  }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  className="absolute right-6 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                    setSelectedImage(images[activeIndex === images.length - 1 ? 0 : activeIndex + 1]);
                  }}
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}

            {/* Image */}
            <motion.div
              className="relative w-[95vw] h-[85vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={title}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Image counter */}
            {images.length > 1 && (
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {activeIndex + 1} / {images.length}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// YouTube Embed Component
function YouTubeEmbed({ videoId, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <motion.div
      className="relative aspect-video rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {!isPlaying ? (
        <>
          {/* Thumbnail with play button */}
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={`${title} video thumbnail`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-dark-primary/40 group-hover:bg-dark-primary/20 transition-colors duration-300" />

          {/* Play button */}
          <motion.button
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setIsPlaying(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />

              {/* Play icon */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink flex items-center justify-center shadow-2xl shadow-gradient-purple/50">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </motion.button>

          {/* Watch video text */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
              Watch Demo Video
            </div>
          </div>
        </>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </motion.div>
  );
}

// Feature Card
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gradient-purple/50 transition-colors group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-gradient-purple to-gradient-pink flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-light-secondary group-hover:text-light-primary transition-colors pt-2">
        {feature}
      </span>
    </motion.div>
  );
}

// Tech Badge with hover effect
function TechBadge({ tech, index }) {
  return (
    <motion.span
      className="px-4 py-2 text-sm font-medium rounded-xl bg-white/5 text-light-primary border border-white/10 hover:border-gradient-purple/50 hover:bg-gradient-purple/10 transition-all cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      {tech}
    </motion.span>
  );
}

export default function ProjectContent({ slug }) {
  const project = projects.find(p => p.slug === slug);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  if (!project) {
    return (
      <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gradient-purple/20 to-gradient-pink/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-gradient-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-light-primary mb-4">Project Not Found</h1>
          <p className="text-light-secondary/60 mb-8">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/projects">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-gradient-purple to-gradient-pink rounded-full text-white font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Browse All Projects
            </motion.button>
          </Link>
        </motion.div>
      </main>
    );
  }

  // Find adjacent projects for navigation
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-[80vh] overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: heroY }}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-accent to-dark-secondary" />
          )}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-primary/50 to-transparent" />
        {/* Top gradient for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-primary/80 to-transparent" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex items-end"
          style={{ opacity: heroOpacity }}
        >
          <div className="container mx-auto px-6 pb-16 md:pb-24">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link href="/projects">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-light-secondary hover:text-light-primary hover:bg-white/20 transition-all"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Projects
                </motion.button>
              </Link>
            </motion.div>

            {/* Category & Year */}
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink text-white">
                {project.category}
              </span>
              {project.year && (
                <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-white/10 backdrop-blur-md text-light-secondary">
                  {project.year}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="gradient-text">{project.title}</span>
            </motion.h1>

            {/* Short Description */}
            <motion.p
              className="text-lg md:text-xl text-light-secondary/80 max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {project.shortDescription}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-gradient-purple to-gradient-pink text-white font-medium shadow-lg shadow-gradient-purple/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live Demo
                </motion.a>
              )}
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-light-primary font-medium hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Source Code
                </motion.a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="relative py-20 md:py-32">
        {/* Background */}
        <div className="absolute inset-0 bg-dark-primary -z-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-purple/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-blue/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-6">
          {/* Project Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Long Description */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-light-primary mb-6">
                About This Project
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                {project.description.split('\n\n').map((paragraph, idx) => {
                  // Parse **bold** markdown syntax
                  const renderWithBold = (text) => {
                    const parts = text.split(/(\*\*.*?\*\*)/g);
                    return parts.map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-light-primary font-semibold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    });
                  };

                  return (
                    <motion.p
                      key={idx}
                      className="text-light-secondary/80 leading-relaxed mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      {renderWithBold(paragraph)}
                    </motion.p>
                  );
                })}
              </div>
            </motion.div>

            {/* Project Info Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-24 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-light-primary mb-6">Project Info</h3>

                <div className="space-y-4">
                  {project.year && (
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-light-secondary/60">Year</span>
                      <span className="text-light-primary font-medium">{project.year}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-light-secondary/60">Category</span>
                    <span className="text-light-primary font-medium">{project.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-light-secondary/60">Technologies</span>
                    <span className="text-light-primary font-medium">{project.technologies.length}</span>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gradient-purple hover:text-gradient-pink transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-light-secondary hover:text-light-primary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Carousel - Visual showcase first */}
          {project.images && project.images.length > 0 && (
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-light-primary mb-8">
                Project Gallery
              </h2>
              <ImageCarousel images={project.images} title={project.title} />
            </motion.div>
          )}

          {/* YouTube Video */}
          {project.youtubeId && (
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-light-primary mb-8">
                Demo Video
              </h2>
              <YouTubeEmbed videoId={project.youtubeId} title={project.title} />
            </motion.div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-light-primary mb-8">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, idx) => (
                  <FeatureCard key={idx} feature={feature} index={idx} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Technologies */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-light-primary mb-8">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, idx) => (
                <TechBadge key={idx} tech={tech} index={idx} />
              ))}
            </div>
          </motion.div>

          {/* Project Navigation */}
          <motion.div
            className="pt-12 border-t border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Previous Project */}
              {prevProject ? (
                <Link href={`/projects/${prevProject.slug}`} className="flex-1 group">
                  <motion.div
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gradient-purple/50 transition-all"
                    whileHover={{ x: -5 }}
                  >
                    <span className="text-sm text-light-secondary/60 flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous Project
                    </span>
                    <h3 className="text-xl font-bold text-light-primary group-hover:text-gradient-purple transition-colors">
                      {prevProject.title}
                    </h3>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {/* Next Project */}
              {nextProject ? (
                <Link href={`/projects/${nextProject.slug}`} className="flex-1 group">
                  <motion.div
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gradient-purple/50 transition-all text-right"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm text-light-secondary/60 flex items-center justify-end gap-2 mb-2">
                      Next Project
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <h3 className="text-xl font-bold text-light-primary group-hover:text-gradient-purple transition-colors">
                      {nextProject.title}
                    </h3>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

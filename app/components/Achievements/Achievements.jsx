"use client";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { achievements } from "@/app/data/achievements";
import TrophyCard from "./TrophyCard";
import ParticleField from "./ParticleField";

export default function Achievements() {
  const containerRef = useRef(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  });

  // Track when section is in view
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsInView(latest > 0 && latest < 1);

    if (latest < 0.2) setCurrentStage(0);
    else if (latest < 0.45) setCurrentStage(1);
    else if (latest < 0.7) setCurrentStage(2);
    else setCurrentStage(3);
  });

  // Intro text animations
  const introOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.2], ["0%", "-30%"]);

  // Trophy 1 - rises from bottom (Champion - Gold)
  const trophy1Y = useTransform(scrollYProgress, [0.15, 0.4], ["100%", "0%"]);
  const trophy1Opacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.95, 1],
    [0, 1, 1, 0],
  );
  const trophy1X = useTransform(scrollYProgress, [0.5, 0.7], ["0%", "-30%"]);

  // Trophy 2 - rises from bottom (Finalist - Silver)
  const trophy2Y = useTransform(scrollYProgress, [0.4, 0.65], ["100%", "0%"]);
  const trophy2Opacity = useTransform(
    scrollYProgress,
    [0.4, 0.5, 0.95, 1],
    [0, 1, 1, 0],
  );
  const trophy2X = useTransform(scrollYProgress, [0.5, 0.7], ["0%", "30%"]);

  // Fog animations
  const fogOpacity = useTransform(scrollYProgress, [0, 0.1], [0.7, 1]);
  const fogY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Light beams when trophies emerge
  const beam1Opacity = useTransform(
    scrollYProgress,
    [0.25, 0.35, 0.6],
    [0, 1, 0.3],
  );
  const beam2Opacity = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.75],
    [0, 1, 0.3],
  );

  // Finale - appears earlier so user has time to read before fade
  const finaleOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  // Progress bar
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Smooth overlay fade in/out - fade early so next section is visible during transition
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.65, 0.95],
    [0, 1, 1, 0],
  );

  return (
    <>
      {/* Spacer section */}
      <section
        ref={containerRef}
        className="relative bg-dark-primary"
        style={{ height: "350vh" }}
        id="achievements"
      ></section>

      {/* Fixed overlay */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{
          opacity: overlayOpacity,
          visibility: isInView ? "visible" : "hidden",
          pointerEvents: isInView ? "auto" : "none",
        }}
      >
        {/* Background - matches Experience section */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #2D3561 0%,
              #1A1F3A 5%,
              #0A0E27 12%,
              #0A0E27 100%
            )`,
          }}
        />

        {/* Particles - fewer on mobile */}
        <ParticleField stage={currentStage} />

        {/* Light beams behind trophies */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 md:left-[35%] bottom-0 w-24 sm:w-32 md:w-[200px] h-full"
          style={{
            opacity: beam1Opacity,
            background:
              "linear-gradient(to top, #FFD70080 0%, #FFD70020 30%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 md:left-[65%] md:-translate-x-1/2 bottom-0 w-24 sm:w-32 md:w-[200px] h-full"
          style={{
            opacity: beam2Opacity,
            background:
              "linear-gradient(to top, #C0C0C080 0%, #C0C0C020 30%, transparent 70%)",
            filter: "blur(15px)",
          }}
        />

        {/* Section Title */}
        <motion.div
          className="absolute right-0 left-0 top-20 z-20 text-center sm:top-24 md:top-28"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl gradient-text">
            Achievements
          </h2>
          <div className="mx-auto mt-2 w-16 h-1 bg-gradient-to-r rounded-full sm:mt-3 sm:w-20 from-gradient-purple via-gradient-pink to-gradient-blue" />
        </motion.div>

        {/* Intro text - "2024 The Year of Victories" */}
        <motion.div
          className="flex absolute inset-0 z-10 flex-col justify-center items-center px-4"
          style={{ opacity: introOpacity, y: introY }}
        >
          <motion.span
            className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #EC4899, #FFD700)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            2024
          </motion.span>
          <motion.p className="mt-2 text-base font-light text-center sm:mt-4 sm:text-xl md:text-2xl lg:text-3xl text-light-secondary/80">
            The Year of Victories
          </motion.p>
          <motion.div
            className="flex flex-col gap-2 items-center mt-8 sm:mt-12 text-light-secondary/50"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs sm:text-sm">Scroll to reveal</span>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Trophy Cards - Rising from bottom */}
        <div className="flex overflow-hidden absolute inset-0 justify-center items-center">
          <div className="flex relative z-10 flex-col gap-4 justify-center items-center px-4 sm:gap-6 sm:px-6 md:flex-row md:gap-12 lg:gap-16">
            {/* Trophy 1 - Champion */}
            <motion.div
              className="md:transform-none"
              style={{
                y: trophy1Y,
                opacity: trophy1Opacity,
                x:
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? trophy1X
                    : 0,
              }}
            >
              <TrophyCard
                achievement={achievements[0]}
                isVisible={currentStage >= 1}
              />
            </motion.div>

            {/* Trophy 2 - Finalist */}
            <motion.div
              className="md:transform-none"
              style={{
                y: trophy2Y,
                opacity: trophy2Opacity,
                x:
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? trophy2X
                    : 0,
              }}
            >
              <TrophyCard
                achievement={achievements[1]}
                isVisible={currentStage >= 2}
              />
            </motion.div>
          </div>
        </div>

        {/* FOG LAYER - at the bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[35%] sm:h-[40%] pointer-events-none z-20"
          style={{ opacity: fogOpacity, y: fogY }}
        >
          {/* Multiple fog layers for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, #0A0E27 0%, #0A0E27 20%, transparent 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(139, 92, 246, 0.3) 0%, transparent 60%)",
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
            }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Fog wisps */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-20 opacity-60 sm:h-32"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            }}
            animate={{ x: ["-5%", "5%", "-5%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-16 opacity-50 sm:h-24"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 30% 100%, rgba(236, 72, 153, 0.3) 0%, transparent 60%)",
            }}
            animate={{ x: ["5%", "-5%", "5%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Finale text */}
        <motion.div
          className="absolute right-0 left-0 bottom-20 z-30 px-4 text-center sm:bottom-24 md:bottom-28"
          style={{ opacity: finaleOpacity }}
        >
          <motion.p
            className="text-base font-bold sm:text-xl md:text-2xl lg:text-3xl"
            style={{
              background:
                "linear-gradient(90deg, #FFD700, #EC4899, #8B5CF6, #FFD700)",
              backgroundSize: "300% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Back to Back. National Stage.
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 sm:bottom-8">
          <div className="overflow-hidden w-24 h-1 rounded-full sm:w-32 sm:h-1.5 md:w-48 bg-dark-accent/50 backdrop-blur-sm">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: progressWidth,
                background: "linear-gradient(90deg, #8B5CF6, #EC4899, #FFD700)",
              }}
            />
          </div>
          <p className="mt-1 text-center sm:mt-2 sm:text-xs text-[10px] text-light-secondary/40">
            {currentStage === 0 && "Keep scrolling..."}
            {currentStage === 1 && "Champion emerges!"}
            {currentStage === 2 && "Finalist rises!"}
            {currentStage === 3 && "Victory!"}
          </p>
        </div>
      </motion.div>
    </>
  );
}

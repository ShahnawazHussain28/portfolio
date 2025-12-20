"use client";
import { motion, useTransform } from "framer-motion";

export default function ScrollProgress({ progress }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <div className="relative w-48 h-1 rounded-full overflow-hidden bg-dark-accent/50 backdrop-blur-sm">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width,
            background: "linear-gradient(90deg, #8B5CF6, #EC4899, #FFD700)",
          }}
        />
      </div>
      <motion.p
        className="text-xs text-light-secondary/50 text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Scroll to explore
      </motion.p>
    </div>
  );
}

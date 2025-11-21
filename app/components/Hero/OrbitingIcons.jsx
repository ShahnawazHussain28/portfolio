"use client";
import { motion } from 'framer-motion';
import { SiNextdotjs, SiReact, SiNodedotjs, SiMongodb, SiTailwindcss, SiJavascript } from 'react-icons/si';

const icons = [
  { Icon: SiReact, color: '#61DAFB', delay: 0 },
  { Icon: SiNextdotjs, color: '#FFFFFF', delay: 0.5 },
  { Icon: SiNodedotjs, color: '#339933', delay: 1 },
  { Icon: SiMongodb, color: '#47A248', delay: 1.5 },
  { Icon: SiTailwindcss, color: '#06B6D4', delay: 2 },
  { Icon: SiJavascript, color: '#F7DF1E', delay: 2.5 },
];

export default function OrbitingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => {
        const angle = (index * 360) / icons.length;
        const radius = 180; // Distance from center

        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 360,
            }}
            transition={{
              opacity: { duration: 0.5, delay: delay * 0.2 },
              scale: { duration: 0.5, delay: delay * 0.2 },
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: delay * 0.2,
              },
            }}
            style={{
              x: '-50%',
              y: '-50%',
            }}
          >
            <motion.div
              className="relative"
              style={{
                x: Math.cos((angle * Math.PI) / 180) * radius,
                y: Math.sin((angle * Math.PI) / 180) * radius,
              }}
              animate={{
                rotate: -360, // Counter-rotate to keep icon upright
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: delay * 0.2,
              }}
            >
              <motion.div
                className="glass p-3 rounded-xl backdrop-blur-glass"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="text-3xl md:text-4xl" style={{ color }} />
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl blur-lg -z-10"
                style={{ backgroundColor: color }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

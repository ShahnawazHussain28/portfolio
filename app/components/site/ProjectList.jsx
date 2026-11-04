"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

// Rows of projects. On devices with a mouse, a preview image trails the cursor.
export default function ProjectList({ projects }) {
  const [hovered, setHovered] = useState(null);
  const [canHover, setCanHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const onMove = (e) => {
    x.set(e.clientX + 24);
    y.set(e.clientY - 90);
  };

  const preview = canHover ? projects.find((p) => p.slug === hovered && p.image) : null;

  return (
    <div onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
      <ul className="border-t border-rule">
        {projects.map((p) => (
          <li key={p.slug} className="border-b border-rule">
            <Link
              href={`/projects/${p.slug}`}
              onMouseEnter={() => setHovered(p.slug)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 py-5 md:grid-cols-[4rem_minmax(0,15rem)_1fr_auto] md:gap-x-6"
            >
              <span className="text-sm tabular-nums text-graphite">{p.year}</span>
              <span className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-cobalt md:text-2xl">
                {p.title}
              </span>
              <span className="col-start-2 mt-1 text-[0.95rem] leading-snug text-graphite md:col-start-auto md:mt-0">
                {p.shortDescription}
              </span>
              <span className="col-start-3 row-start-1 text-sm text-graphite md:col-start-auto">{p.category}</span>
            </Link>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview"
            className="pointer-events-none fixed left-0 top-0 z-40 w-72 overflow-hidden rounded-[3px] bg-surface shadow-[0_20px_50px_-20px_rgb(var(--ink)/0.45)]"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={preview.slug}
                src={preview.image}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

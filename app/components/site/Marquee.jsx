"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";
import { palettes } from "./palette";

/*
  A strip of project names, each in its own colour. It drifts on its own and
  speeds up with scroll velocity; scrolling up reverses it.
*/
export default function Marquee({ items }) {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = track.current;
      let x = 0;
      let dir = -1;
      let boost = 0;
      const tick = (_, delta) => {
        const v = window.__scrollVelocity || 0;
        if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
        boost += (Math.min(Math.abs(v) * 0.6, 14) - boost) * 0.08;
        x += dir * (0.6 + boost) * (delta / 16.67);
        const half = el.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(el, { x, skewX: dir * -boost * 0.6 });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root }
  );

  // Two copies so the loop is seamless.
  const row = [...items, ...items];

  return (
    <div ref={root} className="overflow-hidden py-2" aria-label="Featured projects">
      <ul ref={track} className="flex w-max gap-3 will-change-transform">
        {row.map((p, i) => {
          const c = palettes[p.slug];
          return (
            <li key={`${p.slug}-${i}`} aria-hidden={i >= items.length ? "true" : undefined}>
              <Link
                href={`/projects/${p.slug}`}
                tabIndex={i >= items.length ? -1 : undefined}
                data-cursor="View"
                className="block rounded-full px-6 py-3 font-display text-2xl font-semibold tracking-tight transition-transform duration-300 ease-out hover:-rotate-2 hover:scale-105 md:px-8 md:py-4 md:text-4xl"
                style={{ background: c?.bg, color: c?.fg, fontVariationSettings: "'wdth' 85" }}
              >
                {p.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

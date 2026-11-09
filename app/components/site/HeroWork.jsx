"use client";
import { useEffect, useState } from "react";
import { palettes, paletteVars } from "./palette";

/*
  Three small cards in the hero, one per thing I'm working on. Each has a tiny
  animated sketch of what the project does, and links to its section below.
  Their colours preview the sections they link to.
*/

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

// A ball rolling down to the bottom of a valley, drawn as contour lines.
function Descent({ still }) {
  const path = "M14 10 C 52 6, 70 44, 104 40 S 150 30, 158 34";
  return (
    <svg viewBox="0 0 200 56" className="h-full w-full" aria-hidden="true">
      {[10, 20, 31, 43, 56].map((r, i) => (
        <ellipse
          key={r}
          cx="158"
          cy="34"
          rx={r * 1.9}
          ry={r * 0.8}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.4 - i * 0.06}
          strokeWidth="1"
        />
      ))}
      <path d={path} fill="none" stroke="rgb(var(--cobalt))" strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" />
      <circle r="4.5" fill="rgb(var(--cobalt))" cx={still ? 158 : 0} cy={still ? 34 : 0}>
        {!still && (
          <animateMotion
            dur="3.4s"
            repeatCount="indefinite"
            path={path}
            keyPoints="0;1;1"
            keyTimes="0;0.7;1"
            calcMode="spline"
            keySplines="0.3 0 0.2 1; 0 0 1 1"
          />
        )}
      </circle>
    </svg>
  );
}

// A voice line as a waveform.
const BARS = [3, 5, 8, 12, 7, 4, 9, 14, 18, 11, 6, 3, 2, 5, 10, 16, 20, 13, 8, 12, 17, 9, 5, 3, 6, 11, 7, 4];
function Voice({ still }) {
  return (
    <div className="flex h-full items-center gap-[3px]" aria-hidden="true">
      {BARS.map((h, i) => (
        <span
          key={i}
          className={`hero-wave w-[3px] rounded-full ${i < 12 ? "bg-cobalt" : "bg-ink/35"}`}
          style={{
            height: `${(h / 20) * 100}%`,
            animationDelay: still ? undefined : `${-i * 0.11}s`,
            animationName: still ? "none" : undefined,
          }}
        />
      ))}
    </div>
  );
}

// A pulse trace, read on the phone.
function Pulse({ still }) {
  const d = "M0 30 H46 L54 30 L60 12 L68 46 L75 22 L80 30 H120 L128 30 L134 14 L142 44 L149 24 L154 30 H200";
  return (
    <svg viewBox="0 0 200 56" className="h-full w-full" aria-hidden="true" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path
        d={d}
        pathLength="100"
        fill="none"
        stroke="rgb(var(--cobalt))"
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={still ? undefined : "hero-pulse"}
        strokeDasharray={still ? undefined : "26 74"}
      />
    </svg>
  );
}

const CARDS = [
  {
    href: "#work",
    tag: "Now building",
    title: "Incognition",
    line: "ML, taught from zero",
    vars: paletteVars(palettes.incognition),
    Visual: Descent,
  },
  {
    href: "#dastaan",
    tag: "Built in 2026",
    title: "Dastaan",
    line: "Books in, audio dramas out",
    vars: paletteVars(palettes.dastaan),
    Visual: Voice,
  },
  {
    href: "#experience",
    tag: "At Bharathaap",
    title: "Nimba",
    line: "AI health checks, on the phone",
    vars: undefined,
    Visual: Pulse,
  },
];

export default function HeroWork({ className = "" }) {
  const still = useReducedMotion();
  return (
    <ul className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`} aria-label="What I'm working on">
      {CARDS.map(({ href, tag, title, line, vars, Visual }) => (
        <li key={title}>
          <a
            href={href}
            style={vars}
            className={`group flex h-full flex-col gap-3 rounded-2xl p-4 text-ink transition-transform duration-300 ease-out hover:-translate-y-1 ${
              vars ? "bg-paper" : "border border-rule bg-surface"
            }`}
          >
            <span className="flex items-center justify-between text-xs text-graphite">
              {tag}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </span>
            <span className="block h-12">
              <Visual still={still} />
            </span>
            <span className="block">
              <strong className="block font-display text-lg font-semibold leading-tight tracking-tight">{title}</strong>
              <span className="block text-sm leading-snug text-graphite">{line}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { recognition } from "@/app/data/profile";
import { palettes, paletteVars } from "./palette";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";

/*
  Awards as two tiles in the same style as the About tiles. The win gets the
  wider tile. Each shows a photo from the day; until one is added, it falls back
  to the project's screenshot or a small podium.
*/

export default function Recognition() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-award]", {
        clipPath: "inset(100% 0% 0% 0% round 1.75rem)",
        y: 60,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mt-24">
      <h3 className="t-title">Recognition</h3>
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
        {recognition.map((r, i) => (
          <li
            key={r.event}
            data-award
            className={`flex flex-col overflow-hidden rounded-[1.75rem] bg-paper p-3 text-ink ${
              i === 0 ? "md:col-span-7" : "md:col-span-5"
            }`}
            style={paletteVars(palettes[r.palette])}
          >
            <Photo award={r} grow={i > 0} />
            <div className={`flex flex-col px-4 pb-4 pt-6 md:px-6 md:pb-6 ${i > 0 ? "" : "flex-1"}`}>
              <div className="flex items-start justify-between gap-4">
                <span
                  className="t-figure block leading-[0.85]"
                  style={{ fontSize: i === 0 ? "clamp(4.5rem, 9vw, 8rem)" : "clamp(3.75rem, 6.5vw, 6rem)", fontWeight: 700 }}
                >
                  {r.place}
                </span>
                <span className="mt-2 text-sm text-graphite">{r.year}</span>
              </div>
              <p className="mt-5 text-xl font-medium leading-snug">{r.event}</p>
              <p className="mt-1 text-graphite">{r.note}</p>
              {r.href && (
                <Link href={r.href} data-cursor="View" className="link mt-auto self-start pt-6 font-medium">
                  {r.linkLabel} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The photo from the day, or a stand-in until there is one.
function Photo({ award, grow }) {
  const img = useRef(null);
  const [src, setSrc] = useState(award.photo);
  const failed = () => setSrc(award.fallback || null);

  // The image can fail before React is listening, so check once on mount.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) failed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.25rem] bg-surface ${
        grow ? "aspect-[16/10] md:aspect-auto md:min-h-[14rem] md:flex-1" : "aspect-[16/10]"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={img} src={src} alt={`${award.event}, ${award.year}`} onError={failed} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Podium />
      )}
    </div>
  );
}

// Top 3: all three steps of the podium, none singled out.
function Podium() {
  const steps = [
    { x: 45, h: 60, n: 2 },
    { x: 115, h: 86, n: 1 },
    { x: 185, h: 42, n: 3 },
  ];
  return (
    <svg viewBox="0 0 300 188" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {steps.map((s) => (
        <g key={s.n}>
          <rect x={s.x} y={164 - s.h} width="70" height={s.h} fill="rgb(var(--cobalt))" />
          <text
            x={s.x + 35}
            y={164 - s.h + 26}
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
            fontFamily="var(--font-display), sans-serif"
            fill="rgb(var(--paper))"
          >
            {s.n}
          </text>
        </g>
      ))}
      <line x1="25" y1="164" x2="275" y2="164" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );
}

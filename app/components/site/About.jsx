"use client";
import { useRef } from "react";
import ToolBox from "./ToolBox";
import AboutTiles from "./AboutTiles";
import { recognition, stack } from "@/app/data/profile";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The placings thicken from hairline to heavy as they scroll through.
      gsap.utils.toArray("[data-place]").forEach((el) => {
        const state = { w: 200, x: 70 };
        gsap.to(state, {
          w: 700,
          x: 90,
          ease: "none",
          onUpdate: () => (el.style.fontVariationSettings = `'wght' ${state.w}, 'wdth' ${state.x}, 'opsz' 96`),
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 35%", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="relative">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:pb-36 md:pt-20">
        <h2
          id="about-title"
          className="t-display"
        >
          About
        </h2>

        <AboutTiles />

        <ul className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-2" aria-label="Recognition">
          {recognition.map((r) => (
            <li key={r.event}>
              <span
                data-place
                className="t-figure block leading-[0.8] text-cobalt"
                style={{ fontSize: "clamp(5.5rem, 15vw, 13rem)", fontWeight: 700 }}
              >
                {r.place.replace(" place", "")}
              </span>
              <p className="mt-4 text-xl">{r.event}</p>
              <p className="mt-1 text-graphite">
                {r.note}, {r.year}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-24">
          <h3 className="t-title">What I build with</h3>
          <p className="mt-2 text-graphite">Grab a block and throw it.</p>
          <div className="mt-8">
            <ToolBox stack={stack} />
          </div>
        </div>
      </div>
    </section>
  );
}

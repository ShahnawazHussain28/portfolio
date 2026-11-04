"use client";
import { useRef } from "react";
import ToolBox from "./ToolBox";
import { recognition, stack } from "@/app/data/profile";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The placings thicken from hairline to heavy as they scroll through.
      gsap.utils.toArray("[data-place]").forEach((el) => {
        const state = { w: 200, x: 75 };
        gsap.to(state, {
          w: 800,
          x: 100,
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
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-36">
        <h2
          id="about-title"
          className="font-display font-semibold leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", fontVariationSettings: "'wdth' 80, 'opsz' 96" }}
        >
          About
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
          <p className="text-2xl leading-snug md:col-span-7 md:text-3xl">
            I started out building small browser games and simulators: a digital circuit simulator, a maze solver, a 3D
            solar system. The habit of building the whole thing myself stuck.
          </p>
          <p className="text-lg text-graphite md:col-span-4 md:col-start-9 md:pt-2">
            At work I&apos;ve built a config-driven multiplayer game engine that designers use without writing code, a
            remote testing system for IoT water purifiers, and the cloud backend that talks to those devices. On my own
            time I&apos;ve been going deep on LLM pipelines and speech models.
          </p>
        </div>

        <ul className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-2" aria-label="Recognition">
          {recognition.map((r) => (
            <li key={r.event}>
              <span
                data-place
                className="block font-display leading-[0.8] tracking-[-0.05em] text-cobalt"
                style={{ fontSize: "clamp(5.5rem, 15vw, 13rem)", fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 96" }}
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
          <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">What I build with</h3>
          <p className="mt-2 text-graphite">Grab a block and throw it.</p>
          <div className="mt-8">
            <ToolBox stack={stack} />
          </div>
        </div>
      </div>
    </section>
  );
}

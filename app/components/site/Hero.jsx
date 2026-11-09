"use client";
import { useRef } from "react";
import Portrait from "./Portrait";
import VariableName from "./VariableName";
import HeroWork from "./HeroWork";
import DotField from "./motion/DotField";
import { profile } from "@/app/data/profile";
import { gsap, useGSAP, whenIntroDone, prefersReducedMotion } from "./motion/gsap";

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const fades = gsap.utils.toArray("[data-hero-fade]");
      gsap.set(fades, { opacity: 0, y: 24 });
      whenIntroDone().then(() =>
        gsap.to(fades, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.35 })
      );

      // Portrait drifts slower than the page as the hero scrolls out.
      gsap.to("[data-hero-portrait]", {
        yPercent: 18,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      // One size for the name, also used to place the portrait. Capped by height so the hero fits one screen.
      style={{ "--name": "clamp(3.6rem, min(14vw, 17svh), 13.5rem)" }}
      className="relative flex flex-col bg-paper pb-16 pt-28 md:min-h-[100svh] md:pb-10 md:pt-24"
    >
      {/* Own background + dots, so the name's difference blend has something to invert. */}
      <DotField fixed={false} />
      <div className="relative mx-auto w-full max-w-page px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-0">
          {/* The name runs across the portrait; difference blending inverts the photo inside the letters. */}
          <VariableName
            lines={["Shahnawaz", "Hussain"]}
            className="pointer-events-none relative z-10 font-display leading-[0.84] tracking-[-0.045em] text-white mix-blend-difference md:col-start-1 md:col-end-13 md:row-start-1"
            style={{ fontSize: "var(--name)" }}
          />

          <div className="md:col-start-1 md:col-end-8 md:row-start-2">
            <div className="mt-2 max-w-prose space-y-3 text-lg text-graphite md:mt-5">
              <p data-hero-fade className="text-ink">
                I build products end to end, from the interface to the server to the device, and lately the AI systems
                inside them.
              </p>
              <p data-hero-fade>
                AI/ML engineer at Bharathaap Technologies (IIT Hyderabad). Open to full-stack and AI/ML roles.
              </p>
            </div>

            <ul data-hero-fade className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-[1.05rem]">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-paper transition-[background-color,transform] duration-300 hover:-rotate-2 hover:bg-cobalt"
                >
                  Email me
                </a>
              </li>
              {profile.links.slice(0, 2).map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div data-hero-fade>
              <HeroWork className="mt-10 md:mt-8" />
            </div>
          </div>

          <figure data-hero-portrait className="md:col-start-8 md:col-end-12 md:row-start-1 md:row-end-3 md:mt-[calc(var(--name)*0.78)] md:max-w-[calc((100svh-12rem-var(--name)*0.78)*0.8)]">
            <Portrait src="/portrait.jpg" alt="Shahnawaz Hussain, wearing glasses and a light blue shirt" />
            <figcaption data-hero-fade className="mt-3 text-sm text-graphite">
              Move your cursor and I&apos;ll turn. Hover the photo to see its depth map.
            </figcaption>
          </figure>
        </div>
      </div>

    </section>
  );
}

"use client";
import { useRef } from "react";
import { palettes, paletteVars } from "./palette";
import { gsap, useGSAP, whenIntroDone, prefersReducedMotion } from "./motion/gsap";

/*
  Hero card for Incognition, my main project right now. The numbers count up
  once the intro is done; on hover the screenshot straightens and the arrow moves.
*/
const numbers = [
  { value: 16, label: "courses" },
  { value: 819, label: "lessons" },
  { value: 1400, suffix: "+", label: "problems" },
];

export default function NowBuilding() {
  const root = useRef(null);

  useGSAP(
    () => {
      const els = root.current.querySelectorAll("[data-n]");
      if (prefersReducedMotion()) return;
      els.forEach((el) => (el.textContent = "0"));
      whenIntroDone().then(() =>
        els.forEach((el) => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: Number(el.dataset.n),
            duration: 2,
            delay: 0.8,
            ease: "power3.out",
            onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString("en-IN")),
          });
        })
      );
    },
    { scope: root }
  );

  return (
    <a
      ref={root}
      data-hero-fade
      data-cursor="Visit"
      href="https://theincognition.com"
      target="_blank"
      rel="noopener noreferrer"
      style={paletteVars(palettes.incognition)}
      className="group relative mt-10 flex max-w-xl items-stretch gap-5 overflow-hidden rounded-[1.5rem] bg-paper p-5 text-ink transition-transform duration-500 ease-out hover:-rotate-1 md:p-6"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm text-graphite">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cobalt opacity-75 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-cobalt" />
          </span>
          Now building
        </p>
        <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Incognition{" "}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        </p>
        <p className="mt-1 text-graphite">Learn machine learning from zero, with Python that runs in your browser.</p>
        <dl className="mt-4 flex gap-6">
          {numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse">
              <dt className="text-sm text-graphite">{n.label}</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">
                <span data-n={n.value}>{n.value.toLocaleString("en-IN")}</span>
                {n.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/thumbnails/incognition.jpg"
        alt=""
        className="hidden w-40 shrink-0 rotate-3 self-center rounded-xl object-cover object-left shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-105 sm:block"
        style={{ aspectRatio: "4 / 3" }}
      />
    </a>
  );
}

"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Resolves once the intro overlay has finished (or immediately if it was skipped).
export function whenIntroDone() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || window.__introDone) return resolve();
    window.addEventListener("intro:done", () => resolve(), { once: true });
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

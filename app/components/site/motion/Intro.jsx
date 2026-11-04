"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./gsap";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NAME = "Shahnawaz Hussain";

function done() {
  window.__introDone = true;
  window.dispatchEvent(new Event("intro:done"));
}

/*
  First-visit intro: the name decodes letter by letter while a counter runs to
  100, then the panel wipes up to reveal the page. Plays once per browser
  session. The markup is server-rendered so it covers the page from the first
  paint; a CSS failsafe hides it after 6s if JavaScript never runs.
*/
export default function Intro() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const seen = document.documentElement.dataset.intro === "seen";
    if (!el || seen || prefersReducedMotion()) {
      if (el) el.style.display = "none";
      done();
      return;
    }
    el.style.animation = "none";
    document.documentElement.style.overflow = "hidden";

    const nameEl = el.querySelector("[data-intro-name]");
    const countEl = el.querySelector("[data-intro-count]");
    const state = { p: 0 };

    const render = () => {
      const settled = Math.floor(state.p * NAME.length);
      let out = "";
      for (let i = 0; i < NAME.length; i++) {
        const c = NAME[i];
        out += i < settled || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      nameEl.textContent = out;
      countEl.textContent = String(Math.round(state.p * 100)).padStart(3, "0");
    };

    const ready = Promise.all([
      document.fonts?.ready,
      new Promise((r) => {
        const img = new Image();
        img.onload = img.onerror = r;
        img.src = "/portrait.jpg";
      }),
    ]);

    const tl = gsap.timeline({ paused: true });
    tl.to(state, { p: 1, duration: 1.5, ease: "power2.inOut", onUpdate: render })
      .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "+=0.15")
      .add(() => {
        document.documentElement.style.overflow = "";
        try {
          sessionStorage.setItem("intro", "seen");
        } catch {}
        el.style.display = "none";
      })
      .add(done, "-=0.55");

    // Start the counter right away; only hold at 100 if assets are still loading.
    tl.play();
    tl.addPause(1.5, () => ready.then(() => tl.play()));

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      id="intro"
      ref={ref}
      aria-hidden="true"
      className="intro fixed inset-0 z-[200] flex flex-col justify-between bg-[#2440F0] p-5 text-[#F2F4FF] md:p-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="text-sm opacity-70">Portfolio, 2026</span>
      <div className="flex items-end justify-between gap-6">
        <span
          data-intro-name
          className="font-display font-semibold leading-[0.9] tracking-[-0.035em]"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6.5rem)", fontVariationSettings: "'wdth' 82, 'opsz' 96" }}
        >
          {NAME}
        </span>
        <span
          data-intro-count
          className="font-display font-semibold tabular-nums leading-none"
          style={{ fontSize: "clamp(2.4rem, 7vw, 6.5rem)" }}
        >
          000
        </span>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, whenIntroDone, prefersReducedMotion } from "./motion/gsap";

/*
  The hero name. Each letter's weight and width respond to cursor distance
  (Bricolage Grotesque is a variable font), so letters swell as you pass over
  them. Letters rise in after the intro, and scatter apart as you scroll away.
*/
const BASE = { wght: 700, wdth: 92 };
const NEAR = { wght: 800, wdth: 100 };
const FAR = { wght: 480, wdth: 88 };
const REACH = 300;

export default function VariableName({ lines, className = "", style }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray("[data-letter]", root.current);
      if (prefersReducedMotion()) return;

      gsap.set(letters, { yPercent: 110 });
      whenIntroDone().then(() =>
        gsap.to(letters, {
          yPercent: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.035,
          // The mask is only for the entrance; let letters fly free when scattering.
          onComplete: () => gsap.set(root.current.querySelectorAll("[data-line]"), { overflow: "visible" }),
        })
      );

      // Scatter: every letter drifts by its own amount while the hero scrolls out.
      letters.forEach((el, i) => {
        const r = gsap.utils.random(-1, 1, 0.01);
        gsap.to(el, {
          y: () => -120 - 260 * Math.abs(r),
          rotate: r * 18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top+=80", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    const letters = Array.from(root.current.querySelectorAll("[data-letter]"));
    const state = letters.map(() => ({ ...BASE }));
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;

    const frame = () => {
      let settling = false;
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(mouse.x - (r.left + r.width / 2), mouse.y - (r.top + r.height / 2));
        let target = BASE;
        if (mouse.active) {
          const t = Math.max(0, 1 - d / REACH);
          const e = t * t * (3 - 2 * t);
          // Near letters swell; the rest of the word thins slightly for contrast.
          target = {
            wght: FAR.wght + (NEAR.wght - FAR.wght) * e,
            wdth: FAR.wdth + (NEAR.wdth - FAR.wdth) * e,
          };
        }
        const s = state[i];
        s.wght += (target.wght - s.wght) * 0.16;
        s.wdth += (target.wdth - s.wdth) * 0.16;
        if (Math.abs(target.wght - s.wght) > 0.5) settling = true;
        el.style.fontVariationSettings = `'wght' ${s.wght.toFixed(1)}, 'wdth' ${s.wdth.toFixed(1)}, 'opsz' 96`;
      });
      raf = settling ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onMove = (e) => {
      const box = root.current.getBoundingClientRect();
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = e.clientY > box.top - 120 && e.clientY < box.bottom + 120;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <h1 ref={root} className={className} style={style} aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <span key={line} data-line aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
          {Array.from(line).map((ch, i) => (
            <span
              key={i}
              data-letter
              className="inline-block will-change-transform"
              style={{ fontVariationSettings: `'wght' ${BASE.wght}, 'wdth' ${BASE.wdth}, 'opsz' 96` }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

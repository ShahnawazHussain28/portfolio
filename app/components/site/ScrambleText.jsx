"use client";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

// Letters briefly cycle through random glyphs and settle left to right.
// Triggered by hovering or focusing the closest link/button.
export default function ScrambleText({ children, className = "" }) {
  const text = String(children);
  const [shown, setShown] = useState(text);
  const ref = useRef(null);
  const frame = useRef(0);

  useEffect(() => {
    const host = ref.current?.closest("a, button");
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const run = () => {
      cancelAnimationFrame(frame.current);
      const start = performance.now();
      const duration = 380;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const settled = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          out += i < settled || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setShown(out);
        if (p < 1) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    };

    host.addEventListener("mouseenter", run);
    host.addEventListener("focus", run);
    return () => {
      host.removeEventListener("mouseenter", run);
      host.removeEventListener("focus", run);
      cancelAnimationFrame(frame.current);
    };
  }, [text]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {/* Invisible copy keeps the width fixed while letters change. */}
      <span className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

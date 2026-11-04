"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";

/*
  Custom cursor for mouse users. A small dot follows the pointer exactly; over
  anything with data-cursor="Label" it grows into a disc showing that label
  (View, Listen, Drag...). Over links and buttons it shrinks to a ring.
*/
export default function Cursor() {
  const dotRef = useRef(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState("dot"); // dot | link | label
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const dot = dotRef.current;
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });
    const toX = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
    const toY = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });

    const onMove = (e) => {
      toX(e.clientX);
      toY(e.clientY);
      gsap.to(dot, { opacity: 1, duration: 0.2, overwrite: "auto" });
    };
    const onOver = (e) => {
      const target = e.target.closest?.("[data-cursor]");
      if (target) {
        setLabel(target.dataset.cursor);
        setMode("label");
        return;
      }
      setMode(e.target.closest?.("a, button, [role=option], input, textarea") ? "link" : "dot");
    };
    const onLeave = () => gsap.to(dot, { opacity: 0, duration: 0.2 });
    const onDown = () => gsap.to(dot, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(dot, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!enabled) return <div ref={dotRef} hidden />;

  const size = mode === "label" ? 92 : mode === "link" ? 44 : 12;

  return (
    <div ref={dotRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[300]">
      <div
        className="grid place-items-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out"
        style={{
          width: size,
          height: size,
          background: mode === "label" ? "#FFFFFF" : mode === "link" ? "transparent" : "#FFFFFF",
          border: mode === "link" ? "1.5px solid #FFFFFF" : "0 solid transparent",
          mixBlendMode: mode === "label" ? "normal" : "difference",
          boxShadow: mode === "label" ? "0 10px 30px -10px rgba(0,0,0,.45)" : "none",
        }}
      >
        <span
          className={`text-[0.8rem] font-medium text-black transition-opacity duration-200 ${
            mode === "label" ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

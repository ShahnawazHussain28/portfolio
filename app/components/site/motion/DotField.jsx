"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./gsap";

/*
  A fixed grid of fine dots behind the page. Dots near the cursor get pushed
  away and spring back, so the background ripples as you move. Sections with
  their own colour sit on top and hide it.
*/
const GAP = 26;
const RADIUS = 150;
const PUSH = 26;

export default function DotField({ fixed = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();
    let w = 0,
      h = 0,
      dpr = 1,
      cols = 0,
      rows = 0;
    let ox, oy, vx, vy; // per-dot offset and velocity
    const mouse = { x: -9999, y: -9999 };
    let color = "0 0 0";
    let raf = 0;
    let idleFrames = 0;

    const readColor = () => {
      color = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim();
      draw();
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = fixed ? { width: window.innerWidth, height: window.innerHeight } : canvas.parentElement.getBoundingClientRect();
      w = box.width;
      h = box.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1;
      rows = Math.ceil(h / GAP) + 1;
      const n = cols * rows;
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = color.split(/\s+/);
      ctx.fillStyle = `rgba(${r},${g},${b},0.22)`;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const x = i * GAP + ox[k];
          const y = j * GAP + oy[k];
          const s = 1.1 + Math.min(Math.hypot(ox[k], oy[k]) / 14, 1.6);
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
    };

    const step = () => {
      let moving = false;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const bx = i * GAP;
          const by = j * GAP;
          const dx = bx + ox[k] - mouse.x;
          const dy = by + oy[k] - mouse.y;
          const d = Math.hypot(dx, dy);
          let tx = 0,
            ty = 0;
          if (d < RADIUS && d > 0.01) {
            const f = Math.pow(1 - d / RADIUS, 2) * PUSH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
          // Spring toward target offset.
          vx[k] = (vx[k] + (tx - ox[k]) * 0.08) * 0.82;
          vy[k] = (vy[k] + (ty - oy[k]) * 0.08) * 0.82;
          ox[k] += vx[k];
          oy[k] += vy[k];
          if (Math.abs(vx[k]) > 0.01 || Math.abs(vy[k]) > 0.01) moving = true;
        }
      }
      draw();
      idleFrames = moving ? 0 : idleFrames + 1;
      raf = idleFrames < 10 ? requestAnimationFrame(step) : 0;
    };

    const onMove = (e) => {
      const r = fixed ? { left: 0, top: 0 } : canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (!raf && !reduce) {
        idleFrames = 0;
        raf = requestAnimationFrame(step);
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
      if (!raf && !reduce) raf = requestAnimationFrame(step);
    };

    resize();
    readColor();
    const mo = new MutationObserver(readColor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", resize);
    const ro = fixed ? null : new ResizeObserver(resize);
    ro?.observe(canvas.parentElement);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [fixed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none inset-0 h-full w-full ${fixed ? "fixed z-0" : "absolute"}`}
    />
  );
}

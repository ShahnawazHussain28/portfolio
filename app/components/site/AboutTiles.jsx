"use client";
import { useEffect, useRef } from "react";
import { projects } from "@/app/data/projects";
import { palettes, paletteVars } from "./palette";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "./motion/gsap";

/*
  Four facts about me, each on its own coloured tile with its own bit of motion:
  a globe with arcs out of Kolkata, a graduation year that counts up, a YouTube
  filmstrip, and a skate whose wheels turn as far as it rolls.
*/

const tile = "relative overflow-hidden rounded-[1.75rem] bg-paper text-ink";
const label = "text-sm text-graphite";

export default function AboutTiles() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-tile]", {
        clipPath: "inset(100% 0% 0% 0% round 1.75rem)",
        y: 60,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
      <PlaceTile />
      <div className="grid gap-4 md:col-span-5">
        <StudyTile />
        <YouTubeTile />
      </div>
      <SkateTile />
    </div>
  );
}

/* ---------- Kolkata: dotted globe, arcs to places I'd move to ---------- */

const HOME = { name: "Kolkata", lat: 22.57, lon: 88.36 };
const PLACES = [
  { lat: 12.97, lon: 77.59 }, // Bengaluru
  { lat: 25.2, lon: 55.27 }, // Dubai
  { lat: 1.35, lon: 103.82 }, // Singapore
  { lat: 35.68, lon: 139.69 }, // Tokyo
  { lat: 52.52, lon: 13.4 }, // Berlin
  { lat: 51.5, lon: -0.13 }, // London
  { lat: 37.77, lon: -122.42 }, // San Francisco
];
const rad = (d) => (d * Math.PI) / 180;
const toVec = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];

function slerp(a, b, t) {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(dot);
  if (w < 1e-4) return a;
  const s = Math.sin(w);
  const k1 = Math.sin((1 - t) * w) / s;
  const k2 = Math.sin(t * w) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

function PlaceTile() {
  const canvas = useRef(null);
  const time = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext("2d");
    const reduce = prefersReducedMotion();
    const css = getComputedStyle(c);
    const ink = css.getPropertyValue("--ink").trim().split(/\s+/).join(",");
    const accent = css.getPropertyValue("--cobalt").trim().split(/\s+/).join(",");

    // Evenly spread dots over the sphere.
    const N = 900;
    const dots = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      dots.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    const home = toVec(HOME.lat, HOME.lon);
    const arcs = PLACES.map((p) => toVec(p.lat, p.lon));

    let w = 0,
      h = 0,
      R = 0,
      cx = 0,
      cy = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = c.getBoundingClientRect();
      w = box.width;
      h = box.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Wide tile: globe sits right, clear of the title. Narrow: below it.
      const wide = w > 560;
      R = wide ? Math.min(w * 0.3, h * 0.33) : Math.min(w * 0.38, h * 0.28);
      cx = wide ? w - R - w * 0.1 : w * 0.5;
      cy = wide ? h * 0.57 : h * 0.5;
    };

    // Spin so Kolkata faces us, then sway; dragging adds an offset that springs back.
    const baseRot = -rad(HOME.lon);
    const tilt = rad(HOME.lat) - 0.25;
    let drag = 0,
      dragV = 0,
      dragging = false,
      lastX = 0;

    const project = (v, rot) => {
      const cr = Math.cos(rot),
        sr = Math.sin(rot);
      const x = v[0] * cr + v[2] * sr;
      const z0 = -v[0] * sr + v[2] * cr;
      const ct = Math.cos(tilt),
        st = Math.sin(tilt);
      const y = v[1] * ct - z0 * st;
      const z = v[1] * st + z0 * ct;
      return [cx + x * R, cy - y * R, z];
    };

    const draw = (now) => {
      const t = now / 1000;
      const rot = baseRot + (reduce ? 0 : Math.sin(t * 0.25) * 0.7) + drag;
      ctx.clearRect(0, 0, w, h);

      // Outline
      ctx.strokeStyle = `rgba(${ink},0.25)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      for (const d of dots) {
        const [x, y, z] = project(d, rot);
        if (z < 0) continue;
        ctx.fillStyle = `rgba(${ink},${0.12 + z * 0.5})`;
        const s = 1 + z * 1.4;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }

      // Arcs out of Kolkata, each one drawing in, holding, then clearing.
      ctx.lineCap = "round";
      arcs.forEach((dest, i) => {
        const phase = reduce ? 0.6 : ((t * 0.22 + i / arcs.length) % 1);
        const head = Math.min(1, phase / 0.55);
        const tail = Math.max(0, (phase - 0.7) / 0.3);
        const SEG = 48;
        ctx.strokeStyle = `rgb(${accent})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        let pen = false;
        let end = null;
        for (let s = 0; s <= SEG; s++) {
          const k = s / SEG;
          if (k < tail || k > head) {
            pen = false;
            continue;
          }
          const v = slerp(home, dest, k);
          const lift = 1 + Math.sin(Math.PI * k) * 0.22;
          const [x, y, z] = project([v[0] * lift, v[1] * lift, v[2] * lift], rot);
          if (z < -0.15) {
            pen = false;
            continue;
          }
          pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          pen = true;
          end = [x, y, z];
        }
        ctx.stroke();
        if (end && head < 1 && end[2] > 0) {
          ctx.fillStyle = `rgb(${accent})`;
          ctx.beginPath();
          ctx.arc(end[0], end[1], 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Home pin with a ring that keeps spreading out.
      const [hx, hy, hz] = project(home, rot);
      if (hz > 0) {
        const p = reduce ? 0.5 : (t * 0.8) % 1;
        ctx.strokeStyle = `rgba(${accent},${1 - p})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hx, hy, 6 + p * 26, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgb(${accent})`;
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${ink})`;
        ctx.font = "600 13px var(--font-sans, sans-serif)";
        ctx.fillText(HOME.name, hx + 12, hy - 10);
      }
    };

    let raf = 0,
      visible = false;
    const loop = (now) => {
      if (!dragging) {
        dragV *= 0.92;
        drag += dragV;
        drag *= 0.97; // spring back toward Kolkata
      }
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(c);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(c);

    const down = (e) => {
      dragging = true;
      lastX = e.clientX;
      c.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) / R;
      lastX = e.clientX;
      drag += dx;
      dragV = dx;
    };
    const up = () => (dragging = false);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);

    // Local time in Kolkata.
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    const tick = () => time.current && (time.current.textContent = fmt.format(new Date()));
    tick();
    const clock = setInterval(tick, 10000);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearInterval(clock);
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div data-tile className={`${tile} min-h-[30rem] md:col-span-7`} style={paletteVars(palettes["about-place"])}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
      <div className="pointer-events-none relative flex h-full flex-col justify-between p-7 md:p-9">
        <div>
          <p className={label}>Based in</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">Kolkata, India</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p className="text-lg">
            Open to relocating.
            <span className="block text-sm text-graphite">Drag the globe.</span>
          </p>
          <p className="text-right text-sm text-graphite">
            <span ref={time} className="block font-display text-3xl font-semibold tabular-nums text-ink">
              --:--
            </span>
            IST, 22.57° N 88.36° E
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Study: the year counts through the degree ---------- */

function StudyTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      const year = root.current.querySelector("[data-year]");
      const bars = root.current.querySelectorAll("[data-sem]");
      if (prefersReducedMotion()) return;
      const st = { v: 2021, w: 250 };
      year.textContent = "’21";
      gsap.set(bars, { scaleX: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%" } })
        .to(st, {
          v: 2025,
          w: 800,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            year.textContent = "’" + String(Math.floor(st.v)).slice(2);
            year.style.fontVariationSettings = `'wght' ${st.w}, 'wdth' 100, 'opsz' 96`;
          },
        })
        .to(bars, { scaleX: 1, duration: 0.22, ease: "power2.out", stagger: 0.22 }, 0);
    },
    { scope: root }
  );

  return (
    <div ref={root} data-tile className={`${tile} p-7 md:p-9`} style={paletteVars(palettes["about-study"])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={label}>Studied</p>
          <p className="mt-2 text-xl leading-snug">BTech, Computer Science and Engineering</p>
          <a
            href="https://gcetts.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink/40 px-4 py-1.5 text-base transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            GCETTS <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span
          data-year
          aria-label="Class of 2025"
          className="font-display leading-[0.8] tracking-[-0.05em]"
          style={{ fontSize: "clamp(4.5rem, 8vw, 7rem)", fontVariationSettings: "'wght' 800, 'wdth' 100, 'opsz' 96" }}
        >
          ’25
        </span>
      </div>
      {/* Eight semesters */}
      <div aria-hidden="true" className="mt-7 grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="h-2 overflow-hidden rounded-full bg-ink/15">
            <span data-sem className="block h-full origin-left rounded-full bg-cobalt" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- YouTube: a filmstrip of project thumbnails with a playhead ---------- */

const thumbs = projects.filter((p) => p.image).map((p) => p.image);

function YouTubeTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const strip = root.current.querySelector("[data-strip]");
      const loop = gsap.to(strip, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      const el = root.current;
      const fast = () => gsap.to(loop, { timeScale: 5, duration: 0.6, ease: "power2.out" });
      const slow = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.out" });
      el.addEventListener("pointerenter", fast);
      el.addEventListener("pointerleave", slow);
      return () => {
        el.removeEventListener("pointerenter", fast);
        el.removeEventListener("pointerleave", slow);
      };
    },
    { scope: root }
  );

  return (
    <a
      ref={root}
      data-tile
      data-cursor="Watch"
      href="https://www.youtube.com/@codeuniverse9015"
      target="_blank"
      rel="noopener noreferrer"
      className={`${tile} group block`}
      style={paletteVars(palettes["about-youtube"])}
    >
      <div aria-hidden="true" className="relative overflow-hidden pt-6">
        <div data-strip className="flex w-max gap-2 pl-2">
          {[...thumbs, ...thumbs].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" loading="lazy" className="h-20 w-32 rounded-lg object-cover" />
          ))}
        </div>
        {/* Playhead */}
        <span className="absolute bottom-0 left-1/2 top-3 w-0.5 bg-cobalt" />
        <span className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-[40%] rounded-full bg-cobalt" />
      </div>
      <div className="flex items-end justify-between gap-4 p-7 pt-6 md:p-9 md:pt-6">
        <div>
          <p className={label}>On YouTube</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Code Universe <span aria-hidden="true">↗</span>
          </p>
          <p className="mt-1 text-graphite">Project demos, and technical things explained simply.</p>
        </div>
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-cobalt text-paper transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </span>
      </div>
    </a>
  );
}

/* ---------- Skating: the skate rolls with the scroll, wheels turn to match ---------- */

// Three big wheels, like a 3x110 frame.
const WHEELS = [60, 115, 170];
const WHEEL_R = 23;
const WHEEL_Y = 134;

function SkateTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const skate = el.querySelector("[data-skate]");
      const wheels = el.querySelectorAll("[data-wheel]");
      const trail = el.querySelector("[data-trail]");
      if (prefersReducedMotion()) {
        gsap.set(skate, { x: el.clientWidth * 0.55 });
        return;
      }
      const setX = gsap.quickSetter(skate, "x", "px");
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const width = el.clientWidth;
          const sw = skate.getBoundingClientRect().width;
          const x = -sw + self.progress * (width + sw);
          setX(x);
          // Wheels turn by exactly the distance travelled.
          const r = WHEEL_R * (sw / 230);
          const deg = (x / r) * (180 / Math.PI);
          wheels.forEach((w) => (w.style.transform = `rotate(${deg}deg)`));
          gsap.to(trail, { opacity: Math.min(1, Math.abs(self.getVelocity()) / 1500), duration: 0.2, overwrite: true });
        },
      });

      // Hop on hover.
      const hop = () =>
        gsap
          .timeline()
          .to(skate.firstElementChild, { y: -46, rotate: -10, duration: 0.28, ease: "power2.out" })
          .to(skate.firstElementChild, { y: 0, rotate: 0, duration: 0.5, ease: "bounce.out" });
      el.addEventListener("pointerenter", hop);
      return () => el.removeEventListener("pointerenter", hop);
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      data-tile
      className={`${tile} min-h-[17rem] md:col-span-12`}
      style={paletteVars(palettes["about-skate"])}
    >
      <div className="relative p-7 md:p-9">
        <p className={label}>Off screen</p>
        <p
          className="mt-2 font-display font-semibold leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)", fontVariationSettings: "'wdth' 85, 'opsz' 96" }}
        >
          Rollerblading
        </p>
      </div>

      {/* Ground */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-8 h-px bg-ink/30" />

      <div data-skate aria-hidden="true" className="absolute bottom-8 left-0 w-[150px] md:w-[230px]">
        <div className="relative origin-bottom-right">
          <div data-trail className="absolute -left-16 bottom-6 space-y-2 opacity-0">
            <span className="block h-0.5 w-12 rounded-full bg-ink/60" />
            <span className="ml-4 block h-0.5 w-10 rounded-full bg-ink/40" />
            <span className="block h-0.5 w-14 rounded-full bg-ink/60" />
          </div>
          <svg viewBox="0 0 230 160" className="block w-full">
            {/* Boot */}
            <path
              d="M58 8h56c8 0 12 4 13 11l7 55c34 4 58 14 70 28 7 8 6 18-3 18H40c-7 0-10-5-9-11l13-89c1-8 6-12 14-12z"
              className="fill-ink"
            />
            <path d="M58 8h56c8 0 12 4 13 11l2 14H50l3-21c1-3 3-4 5-4z" className="fill-cobalt" />
            {/* Laces */}
            {[56, 72, 88].map((y) => (
              <path key={y} d={`M${92 + (y - 56) * 0.3} ${y}l28 4`} className="stroke-paper" strokeWidth="4" strokeLinecap="round" />
            ))}
            {/* Frame */}
            <rect x="30" y="112" width="170" height="10" rx="5" className="fill-ink" />
            {/* Wheels */}
            {WHEELS.map((cx) => (
              <g key={cx} data-wheel style={{ transformOrigin: `${cx}px ${WHEEL_Y}px`, transformBox: "view-box" }}>
                <circle cx={cx} cy={WHEEL_Y} r={WHEEL_R} className="fill-cobalt stroke-ink" strokeWidth="4" />
                <path
                  d={`M${cx - 15} ${WHEEL_Y}h30M${cx} ${WHEEL_Y - 15}v30`}
                  className="stroke-ink"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx={cx} cy={WHEEL_Y} r="4" className="fill-ink" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

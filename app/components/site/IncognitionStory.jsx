"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "./motion/gsap";
import { palettes, paletteVars } from "./palette";

/*
  Incognition, pitched the way the platform teaches: by showing.
  A pinned scroll story over a 3D landscape. A ball drops on the hill and rolls
  down to the bottom as you scroll — the way every AI model learns (gradient
  descent), explained in plain words. At the end, visitors can drop the ball
  anywhere themselves.
*/

const SITE = "https://theincognition.com";

/* ---------------- the landscape ---------------- */

// A gently rippled bowl with one deepest valley, kept smooth so ridges never hide the ball. Every start point rolls down into it.
const f = (x, z) =>
  0.16 * (x * x + z * z) +
  0.2 * Math.sin(1.1 * x + 0.4) * Math.cos(1.0 * z - 0.3) +
  0.3 * Math.exp(-((x - 1.3) ** 2 + (z + 0.9) ** 2) / 0.9) -
  1.1 * Math.exp(-((x + 0.9) ** 2 + (z - 0.7) ** 2) / 0.9);
const F_MIN = -1.01;
const grad = (x, z, h = 1e-3) => [(f(x + h, z) - f(x - h, z)) / (2 * h), (f(x, z + h) - f(x, z - h)) / (2 * h)];

function descend(x, z, steps = 90, lr = 0.05, mom = 0.8) {
  const path = [[x, z]];
  let vx = 0,
    vz = 0;
  for (let i = 0; i < steps; i++) {
    const [gx, gz] = grad(x, z);
    vx = mom * vx - lr * gx;
    vz = mom * vz - lr * gz;
    x = Math.max(-3, Math.min(3, x + vx));
    z = Math.max(-3, Math.min(3, z + vz));
    path.push([x, z]);
  }
  return path;
}

const START = [2.6, -2.5];
const STORY_PATH = descend(...START);
const F_START = f(...START);
const errorAt = (x, z) => Math.max(0, Math.round(((f(x, z) - F_MIN) / (F_START - F_MIN)) * 92));

// Colours (on the purple section)
// Height colours: deep indigo valleys, magenta slopes, peach peaks.
const STOPS = [
  [0, [33, 12, 110]],
  [0.5, [214, 64, 160]],
  [1, [255, 196, 140]],
];
const heightColor = (t) => {
  const i = t < STOPS[1][0] ? 0 : 1;
  const [t0, c0] = STOPS[i];
  const [t1, c1] = STOPS[i + 1];
  const k = (t - t0) / (t1 - t0);
  return c0.map((v, q) => v + (c1[q] - v) * k);
};
const BALL = "#FFD84D";
const INK = "#160F38";

const N = 54; // grid cells per side
const H = 1.0; // height scale

/* ---------------- story beats ---------------- */

const BEATS = [
  { at: 0.0, title: "Every AI learns the same way.", sub: "Here’s how, in ten seconds. Keep scrolling." },
  { at: 0.14, title: "It starts with a guess. A bad one.", sub: "The higher the ball, the more wrong the guess." },
  { at: 0.3, title: "It checks how wrong it is, and takes a step downhill.", sub: "Then again. And again." },
  { at: 0.62, title: "Until it gets it right.", sub: "That’s gradient descent: how every model, ChatGPT included, learns." },
  { at: 0.8, final: true },
];

/* ---------------- component ---------------- */

export default function IncognitionStory() {
  const root = useRef(null);
  const stage = useRef(null);
  const canvas = useRef(null);
  const errRef = useRef(null);
  const errBar = useRef(null);
  const api = useRef({});
  const [beat, setBeat] = useState(0);
  const [free, setFree] = useState(false);

  // Drawing + interaction
  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext("2d");
    const reduce = prefersReducedMotion();

    // Precompute heights and normals for the grid.
    const V = N + 1;
    const wx = new Float32Array(V * V),
      wy = new Float32Array(V * V),
      wz = new Float32Array(V * V);
    for (let j = 0; j < V; j++)
      for (let i = 0; i < V; i++) {
        const x = -3 + (6 * i) / N,
          z = -3 + (6 * j) / N;
        const k = j * V + i;
        wx[k] = x;
        wz[k] = z;
        wy[k] = f(x, z) * H;
      }
    const quads = [];
    const L = (() => {
      const v = [-0.4, 0.85, -0.35];
      const n = Math.hypot(...v);
      return v.map((a) => a / n);
    })();
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const a = j * V + i,
          b = a + 1,
          cc = a + V + 1,
          d = a + V;
        // Normal from two edges.
        const ux = wx[b] - wx[a],
          uy = wy[b] - wy[a],
          uz = wz[b] - wz[a];
        const vx = wx[d] - wx[a],
          vy = wy[d] - wy[a],
          vz = wz[d] - wz[a];
        let nx = uy * vz - uz * vy,
          ny = uz * vx - ux * vz,
          nz = ux * vy - uy * vx;
        const nl = Math.hypot(nx, ny, nz) || 1;
        if (ny < 0) (nx = -nx), (ny = -ny), (nz = -nz);
        const shade = 0.6 + 0.4 * Math.max(0, (nx * L[0] + ny * L[1] + nz * L[2]) / nl);
        const hgt = ((wy[a] + wy[cc]) / 2 / H - F_MIN) / (3.0 - F_MIN);
        const t = Math.pow(Math.min(1, Math.max(0, hgt)), 0.8);
        const col = heightColor(t).map((v) => Math.round(v * shade));
        quads.push({ v: [a, b, cc, d], fill: `rgb(${col[0]},${col[1]},${col[2]})`, depth: 0, gi: i % 3 === 0, gj: j % 3 === 0 });
      }

    const sx = new Float32Array(V * V),
      sy = new Float32Array(V * V),
      sd = new Float32Array(V * V);
    let w = 0,
      h = 0,
      cx = 0,
      cy = 0,
      scale = 1;
    // Turned so the story ball starts on a tall peak at the back and rolls toward you.
    const YAW = 2.35;
    let yaw = YAW;
    const pitch = 0.98; // high enough to see down into the valley
    const D = 11;

    const project = (x, y, z, out) => {
      const cs = Math.cos(yaw),
        sn = Math.sin(yaw);
      const x1 = x * cs - z * sn;
      const z1 = x * sn + z * cs;
      const cp = Math.cos(pitch),
        sp = Math.sin(pitch);
      const y2 = y * cp + z1 * sp;
      const z2 = z1 * cp - y * sp;
      const s = D / (D + z2);
      out[0] = cx + x1 * s * scale;
      out[1] = cy - y2 * s * scale;
      out[2] = z2;
      out[3] = s;
      return out;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = w > 900;
      // Wide: landscape on the right, clear of the text. Narrow: below the text.
      scale = wide ? Math.min(w * 0.36, h * 0.85) / 6.2 : Math.min(w * 0.9, h * 0.55) / 6.2;
      cx = wide ? w * 0.68 : w * 0.5;
      cy = wide ? h * 0.6 : h * 0.72;
    };

    // State the story sets each frame.
    let path = STORY_PATH;
    let progress = 0; // 0..1 along path
    let dropT = 0; // 0..1 ball falling in
    let freeMode = false;
    let freeStart = 0;
    let raf = 0;
    let visible = false;
    const tmp = [0, 0, 0, 0];

    const ballAt = () => {
      const idx = progress * (path.length - 1);
      const i0 = Math.floor(idx),
        i1 = Math.min(path.length - 1, i0 + 1);
      const t = idx - i0;
      return [path[i0][0] + (path[i1][0] - path[i0][0]) * t, path[i0][1] + (path[i1][1] - path[i0][1]) * t];
    };

    // Painter's algorithm: landscape tiles, trail pieces and the ball are sorted
    // together far-to-near, so hills correctly hide whatever is behind them.
    const items = [];
    const pt = (x, z, lift = 0) => {
      project(x, f(x, z) * H + lift, z, tmp);
      return [tmp[0], tmp[1], tmp[2], tmp[3]];
    };

    const drawQuad = (q) => {
      const [a, b, cc, d] = q.v;
      ctx.beginPath();
      ctx.moveTo(sx[a], sy[a]);
      ctx.lineTo(sx[b], sy[b]);
      ctx.lineTo(sx[cc], sy[cc]);
      ctx.lineTo(sx[d], sy[d]);
      ctx.closePath();
      ctx.fillStyle = q.fill;
      ctx.strokeStyle = q.fill;
      ctx.lineWidth = 0.7;
      ctx.fill();
      ctx.stroke();
      // Grid lines every third row and column, drawn with their own tile.
      if (q.gi || q.gj) {
        ctx.strokeStyle = "rgba(22,15,56,0.2)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        if (q.gi) ctx.moveTo(sx[a], sy[a]), ctx.lineTo(sx[d], sy[d]);
        if (q.gj) ctx.moveTo(sx[a], sy[a]), ctx.lineTo(sx[b], sy[b]);
        ctx.stroke();
      }
    };

    const drawSeg = (it) => {
      ctx.strokeStyle = BALL;
      ctx.lineWidth = 3 * it.s;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(it.x0, it.y0);
      ctx.lineTo(it.x1, it.y1);
      ctx.stroke();
      if (it.mark) {
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.arc(it.x0, it.y0, 2.2 * it.s, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawBall = (it) => {
      const k = scale / 90;
      ctx.fillStyle = "rgba(22,15,56,0.35)";
      ctx.beginPath();
      ctx.ellipse(it.gx, it.gy, 14 * it.gs * k, 6 * it.gs * k, 0, 0, Math.PI * 2);
      ctx.fill();
      const r = 13 * k * it.s;
      const by = it.y - r;
      ctx.fillStyle = BALL;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(it.x, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(it.x - r * 0.35, by - r * 0.35, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < V * V; k++) {
        project(wx[k], wy[k], wz[k], tmp);
        sx[k] = tmp[0];
        sy[k] = tmp[1];
        sd[k] = tmp[2];
      }
      items.length = 0;
      for (const q of quads) {
        q.depth = sd[q.v[0]] + sd[q.v[1]] + sd[q.v[2]] + sd[q.v[3]];
        items.push(q);
      }

      let bx = 0,
        bz = 0;
      if (dropT > 0) {
        [bx, bz] = ballAt();
        // Trail, cut into short pieces so each can be hidden independently.
        const upto = Math.floor(progress * (path.length - 1));
        const pts = path.slice(0, upto + 1).concat([[bx, bz]]);
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, z0] = pts[i];
          const [x1, z1] = pts[i + 1];
          const pieces = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.08));
          for (let p = 0; p < pieces; p++) {
            const ta = p / pieces,
              tb = (p + 1) / pieces;
            const A = pt(x0 + (x1 - x0) * ta, z0 + (z1 - z0) * ta, 0.03);
            const B = pt(x0 + (x1 - x0) * tb, z0 + (z1 - z0) * tb, 0.03);
            items.push({
              kind: "seg",
              x0: A[0],
              y0: A[1],
              x1: B[0],
              y1: B[1],
              s: A[3],
              mark: p === 0 && i % 6 === 0 && i < pts.length - 2,
              depth: (A[2] + B[2]) * 2 - 0.25,
            });
          }
        }
        const g = pt(bx, bz);
        const lift = (1 - easeOutBounce(dropT)) * 3.2;
        const top = pt(bx, bz, lift);
        items.push({ kind: "ball", gx: g[0], gy: g[1], gs: g[3], x: top[0], y: top[1], s: top[3], depth: g[2] * 4 - 0.6 });
      }

      items.sort((a, b) => b.depth - a.depth);
      ctx.lineJoin = "round";
      for (const it of items) {
        if (it.kind === "seg") drawSeg(it);
        else if (it.kind === "ball") drawBall(it);
        else drawQuad(it);
      }

      if (dropT > 0) {
        const e = errorAt(bx, bz);
        if (errRef.current) errRef.current.textContent = `${e}%`;
        if (errBar.current) errBar.current.style.transform = `scaleX(${e / 92})`;
      }
    };

    const loop = (now) => {
      raf = 0;
      if (!reduce) yaw = YAW + Math.sin(now / 5200) * 0.16;
      if (freeMode) {
        const t = Math.min(1, (now - freeStart) / 2600);
        dropT = Math.min(1, (now - freeStart) / 600);
        progress = Math.max(0, (t - 0.18) / 0.82);
      }
      draw();
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    api.current = {
      // Scroll drives the story: p is 0..1 over the pinned section.
      story: (p) => {
        if (freeMode) return;
        dropT = Math.min(1, Math.max(0, (p - 0.12) / 0.08));
        progress = Math.min(1, Math.max(0, (p - 0.24) / 0.42));
        kick();
      },
      reset: () => {
        freeMode = false;
        path = STORY_PATH;
      },
    };

    // Drop the ball wherever the visitor clicks on the landscape.
    const onClick = (e) => {
      if (!api.current.interactive) return;
      const r = c.getBoundingClientRect();
      const mx = e.clientX - r.left,
        my = e.clientY - r.top;
      let best = -1,
        bestD = 30 * 30;
      for (let k = 0; k < V * V; k++) {
        const d = (sx[k] - mx) ** 2 + (sy[k] - my) ** 2;
        if (d < bestD) (bestD = d), (best = k);
      }
      if (best < 0) return;
      path = descend(wx[best], wz[best]);
      freeMode = true;
      freeStart = performance.now();
      setFree(true);
      kick();
    };
    c.addEventListener("click", onClick);

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    });
    io.observe(c);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(c);
    resize();
    if (reduce) {
      dropT = 1;
      progress = 1;
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      c.removeEventListener("click", onClick);
    };
  }, []);

  // Scroll story
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setBeat(BEATS.length - 1);
        api.current.interactive = true;
        return;
      }
      ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          api.current.story?.(p);
          let b = 0;
          BEATS.forEach((bt, i) => p >= bt.at && (b = i));
          setBeat(b);
          const done = b === BEATS.length - 1;
          api.current.interactive = done;
          if (!done) {
            api.current.reset?.();
            setFree(false);
          }
        },
      });
    },
    { scope: root }
  );

  const finalBeat = beat === BEATS.length - 1;

  return (
    <section
      id="work"
      ref={root}
      aria-labelledby="incognition-title"
      className="relative bg-paper text-ink"
      style={paletteVars(palettes.incognition)}
    >
      <div ref={stage} className="relative h-[100svh] min-h-[38rem] overflow-hidden">
        <canvas
          ref={canvas}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full ${finalBeat ? "cursor-pointer" : ""}`}
        />

        <div className="pointer-events-none relative mx-auto flex h-full max-w-page flex-col px-5 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <p className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-cobalt px-2.5 py-0.5 text-xs font-semibold text-[#160F38]">Now building</span>
            <span id="incognition-title" className="font-display text-lg font-semibold tracking-tight">
              Incognition
            </span>
          </p>

          {/* Story beats, stacked; the active one is shown. */}
          <div className="relative mt-6 flex-1 md:mt-10 md:max-w-[34rem]">
            {BEATS.map((b, i) =>
              b.final ? (
                <div
                  key={i}
                  data-active={beat === i}
                  aria-hidden={beat !== i}
                  className="pointer-events-none absolute inset-x-0 top-0 translate-y-6 opacity-0 transition-all duration-700 ease-out data-[active=true]:pointer-events-auto data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                >
                  <p className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
                    That was one lesson.
                    <br />
                    <span className="text-cobalt">Incognition has 852 more.</span>
                  </p>
                  <p className="mt-4 max-w-md text-lg text-graphite">
                    Machine learning from zero, taught by letting you play with it. Python runs in your browser. I lead
                    engineering on it.
                  </p>
                  <dl className="mt-6 flex gap-8">
                    {[
                      ["16", "courses"],
                      ["853", "lessons"],
                      ["1,649", "problems"],
                    ].map(([v, l]) => (
                      <div key={l} className="flex flex-col-reverse">
                        <dt className="text-sm text-graphite">{l}</dt>
                        <dd className="font-display text-3xl font-semibold tabular-nums">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <a
                      href={SITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Visit"
                      className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-lg font-semibold text-[#160F38] transition-transform duration-300 hover:-rotate-2"
                    >
                      Start learning free <span aria-hidden="true">↗</span>
                    </a>
                    <Link href="/projects/incognition" className="link">
                      How I built it
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  data-active={beat === i}
                  aria-hidden={beat !== i}
                  className="absolute inset-x-0 top-0 translate-y-6 opacity-0 transition-all duration-700 ease-out data-[active=true]:translate-y-0 data-[active=true]:opacity-100"
                >
                  <p className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl">
                    {b.title}
                  </p>
                  <p className="mt-4 text-lg text-graphite md:text-xl">{b.sub}</p>
                </div>
              )
            )}
          </div>

          {/* Error meter + beat dots */}
          <div className="flex items-end justify-between gap-6">
            <div className={`transition-opacity duration-500 ${beat >= 1 ? "opacity-100" : "opacity-0"}`}>
              <p className="text-sm text-graphite">How wrong the guess is</p>
              <p className="font-display text-5xl font-semibold tabular-nums md:text-6xl">
                <span ref={errRef}>92%</span>
              </p>
              <span className="mt-2 block h-2 w-48 overflow-hidden rounded-full bg-ink/15">
                <span ref={errBar} className="block h-full origin-left rounded-full bg-cobalt" />
              </span>
            </div>
            <p className="hidden text-right text-sm text-graphite md:block">
              {finalBeat ? (free ? "Click anywhere else to try again." : "Click the hill to drop the ball yourself.") : "Scroll"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function easeOutBounce(x) {
  const n1 = 7.5625,
    d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

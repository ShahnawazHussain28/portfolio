"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";
import { palettes, paletteVars } from "./palette";

/*
  Incognition teaches ML with interactive visualisations, so this section is one:
  a small neural network that trains live in the browser. Every neuron shows
  what it has learned as a tiny map, edges show the weights, and the big
  canvas shows the decision boundary forming. Visitors can add points and
  switch datasets.
*/

const SITE = "https://theincognition.com";

// Colours inside the playground card.
const BG = [22, 15, 56];
const A = [255, 216, 77]; // class 1
const B = [185, 168, 255]; // class 0

/* ---------------- data ---------------- */

const rand = (a, b) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.6;

const DATASETS = {
  Spiral: () => {
    const pts = [];
    for (let k = 0; k < 2; k++)
      for (let i = 0; i < 90; i++) {
        const t = i / 90;
        const r = 0.08 + t * 0.85;
        const a = t * 3.2 * Math.PI + k * Math.PI;
        pts.push({ x: r * Math.cos(a) + gauss() * 0.05, y: r * Math.sin(a) + gauss() * 0.05, c: k });
      }
    return pts;
  },
  Circle: () => {
    const pts = [];
    for (let i = 0; i < 170; i++) {
      const inner = i % 2 === 0;
      const r = inner ? rand(0, 0.42) : rand(0.62, 0.95);
      const a = rand(0, Math.PI * 2);
      pts.push({ x: r * Math.cos(a), y: r * Math.sin(a), c: inner ? 1 : 0 });
    }
    return pts;
  },
  Moons: () => {
    const pts = [];
    for (let i = 0; i < 170; i++) {
      const k = i % 2;
      const a = rand(0, Math.PI);
      const x = k ? 1 - Math.cos(a) : Math.cos(a);
      const y = k ? 0.5 - Math.sin(a) : Math.sin(a);
      pts.push({ x: (x - 0.5) * 0.75 + gauss() * 0.06, y: (y - 0.25) * 0.75 + gauss() * 0.06, c: k });
    }
    return pts;
  },
  XOR: () => {
    const pts = [];
    for (let i = 0; i < 170; i++) {
      const x = rand(-0.95, 0.95);
      const y = rand(-0.95, 0.95);
      if (Math.abs(x) < 0.06 || Math.abs(y) < 0.06) continue;
      pts.push({ x, y, c: x * y > 0 ? 1 : 0 });
    }
    return pts;
  },
};

/* ---------------- network ---------------- */

const FEATURES = ["x", "y", "x²", "y²", "xy", "sin x", "sin y"];
const feats = (x, y, out) => {
  out[0] = x;
  out[1] = y;
  out[2] = x * x;
  out[3] = y * y;
  out[4] = x * y;
  out[5] = Math.sin(Math.PI * x);
  out[6] = Math.sin(Math.PI * y);
  return out;
};
const SIZES = [FEATURES.length, 8, 6, 1];

function createNet() {
  // Flat parameter vector with views per layer, so Adam can run over one array.
  const layers = [];
  let n = 0;
  for (let l = 1; l < SIZES.length; l++) {
    layers.push({ inN: SIZES[l - 1], outN: SIZES[l], w: n, b: n + SIZES[l - 1] * SIZES[l] });
    n += SIZES[l - 1] * SIZES[l] + SIZES[l];
  }
  const p = new Float64Array(n);
  const net = { layers, p, g: new Float64Array(n), m: new Float64Array(n), v: new Float64Array(n), t: 0 };
  reset(net);
  return net;
}
function reset(net) {
  for (const L of net.layers) {
    const s = Math.sqrt(1 / L.inN);
    for (let i = 0; i < L.inN * L.outN; i++) net.p[L.w + i] = (Math.random() * 2 - 1) * s * 1.6;
    for (let i = 0; i < L.outN; i++) net.p[L.b + i] = 0;
  }
  net.m.fill(0);
  net.v.fill(0);
  net.t = 0;
}

// Forward pass. acts[0] is the input; returns the output probability.
function forward(net, x, acts) {
  const { p, layers } = net;
  for (let l = 0; l < layers.length; l++) {
    const L = layers[l];
    const inp = acts[l];
    const out = acts[l + 1];
    for (let j = 0; j < L.outN; j++) {
      let z = p[L.b + j];
      const row = L.w + j * L.inN;
      for (let i = 0; i < L.inN; i++) z += p[row + i] * inp[i];
      out[j] = l === layers.length - 1 ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
    }
  }
  return acts[layers.length][0];
}

function makeActs() {
  return SIZES.map((s) => new Float64Array(s));
}

// One full-batch Adam step on binary cross-entropy. Returns the loss.
// lr is kept low on purpose so visitors can watch the boundary form over a few seconds.
function trainStep(net, data, acts, deltas, lr = 0.005) {
  const { p, g, layers } = net;
  g.fill(0);
  let loss = 0;
  for (const d of data) {
    feats(d.x, d.y, acts[0]);
    const o = Math.min(1 - 1e-7, Math.max(1e-7, forward(net, null, acts)));
    loss += -(d.c * Math.log(o) + (1 - d.c) * Math.log(1 - o));
    // Output delta for sigmoid + BCE.
    deltas[layers.length][0] = o - d.c;
    for (let l = layers.length - 1; l >= 0; l--) {
      const L = layers[l];
      const dOut = deltas[l + 1];
      const inp = acts[l];
      for (let j = 0; j < L.outN; j++) {
        const row = L.w + j * L.inN;
        g[L.b + j] += dOut[j];
        for (let i = 0; i < L.inN; i++) g[row + i] += dOut[j] * inp[i];
      }
      if (l > 0) {
        const dIn = deltas[l];
        for (let i = 0; i < L.inN; i++) {
          let s = 0;
          for (let j = 0; j < L.outN; j++) s += p[L.w + j * L.inN + i] * dOut[j];
          dIn[i] = s * (1 - inp[i] * inp[i]); // tanh'
        }
      }
    }
  }
  const N = data.length || 1;
  net.t++;
  const b1 = 0.9,
    b2 = 0.999;
  for (let i = 0; i < p.length; i++) {
    const gi = g[i] / N;
    net.m[i] = b1 * net.m[i] + (1 - b1) * gi;
    net.v[i] = b2 * net.v[i] + (1 - b2) * gi * gi;
    const mh = net.m[i] / (1 - Math.pow(b1, net.t));
    const vh = net.v[i] / (1 - Math.pow(b2, net.t));
    p[i] -= (lr * mh) / (Math.sqrt(vh) + 1e-8);
  }
  return loss / N;
}

/* ---------------- drawing helpers ---------------- */

const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

function fitCanvas(c) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = c.getBoundingClientRect();
  c.width = Math.max(1, Math.round(width * dpr));
  c.height = Math.max(1, Math.round(height * dpr));
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: width, h: height };
}

/* ---------------- playground ---------------- */

function Playground() {
  const boardRef = useRef(null);
  const netRef = useRef(null);
  const epochRef = useRef(null);
  const lossRef = useRef(null);
  const sparkRef = useRef(null);
  const api = useRef({});
  const [dataset, setDataset] = useState("Spiral");
  const [brush, setBrush] = useState(1);
  const brushRef = useRef(1);
  brushRef.current = brush;

  useEffect(() => {
    const board = boardRef.current;
    const netCanvas = netRef.current;
    const reduce = prefersReducedMotion();
    const net = createNet();
    const acts = makeActs();
    const deltas = makeActs();
    let data = DATASETS.Spiral();
    let epoch = 0;
    let losses = [];
    let raf = 0;
    let visible = false;
    let calm = 0; // frames since the loss stopped improving

    let B_ = fitCanvas(board);
    let N_ = fitCanvas(netCanvas);

    // Decision boundary at low resolution, scaled up smoothly.
    const G = 56;
    const off = document.createElement("canvas");
    off.width = off.height = G;
    const offCtx = off.getContext("2d");
    const img = offCtx.createImageData(G, G);

    // Tiny per-neuron maps.
    const M = 14;
    const maps = SIZES.slice(0, 3).map((s) => Array.from({ length: s }, () => new Float32Array(M * M)));
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = mapCanvas.height = M;
    const mapCtx = mapCanvas.getContext("2d");
    const mapImg = mapCtx.createImageData(M, M);

    const toX = (px, w) => (px / w) * 2 - 1;
    const toY = (py, h) => 1 - (py / h) * 2;

    const drawBoard = () => {
      const { ctx, w, h } = B_;
      for (let j = 0; j < G; j++)
        for (let i = 0; i < G; i++) {
          feats(toX(i + 0.5, G), toY(j + 0.5, G), acts[0]);
          const o = forward(net, null, acts);
          const c = mixc(BG, o > 0.5 ? A : B, Math.min(1, Math.abs(o - 0.5) * 2) * 0.55);
          const k = (j * G + i) * 4;
          img.data[k] = c[0];
          img.data[k + 1] = c[1];
          img.data[k + 2] = c[2];
          img.data[k + 3] = 255;
        }
      offCtx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, w, h);

      // Axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      for (const d of data) {
        const px = ((d.x + 1) / 2) * w;
        const py = ((1 - d.y) / 2) * h;
        ctx.beginPath();
        ctx.arc(px, py, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = rgb(d.c ? A : B);
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = rgb(BG);
        ctx.stroke();
      }
    };

    const paintMap = (values, color) => {
      for (let k = 0; k < M * M; k++) {
        const v = values[k];
        const c = mixc(BG, v >= 0 ? A : B, Math.min(1, Math.abs(v)) * 0.9);
        mapImg.data[k * 4] = c[0];
        mapImg.data[k * 4 + 1] = c[1];
        mapImg.data[k * 4 + 2] = c[2];
        mapImg.data[k * 4 + 3] = 255;
      }
      mapCtx.putImageData(mapImg, 0, 0);
      return mapCanvas;
    };

    const drawNet = () => {
      const { ctx, w, h } = N_;
      ctx.clearRect(0, 0, w, h);
      // What each neuron responds to, sampled over the plane.
      for (let j = 0; j < M; j++)
        for (let i = 0; i < M; i++) {
          feats(toX(i + 0.5, M), toY(j + 0.5, M), acts[0]);
          forward(net, null, acts);
          const k = j * M + i;
          maps[0].forEach((m, n) => (m[k] = acts[0][n]));
          maps[1].forEach((m, n) => (m[k] = acts[1][n]));
          maps[2].forEach((m, n) => (m[k] = acts[2][n]));
        }

      const cols = SIZES.length;
      const padX = 34;
      const colX = (l) => padX + (l / (cols - 1)) * (w - padX * 2 - 10);
      const tileFor = (n) => Math.min(30, (h - 20) / n - 6);
      const pos = SIZES.map((s, l) => {
        const t = l === cols - 1 ? 34 : tileFor(SIZES[0]);
        const gap = (h - s * t) / (s + 1);
        return Array.from({ length: s }, (_, i) => ({ x: colX(l), y: gap + i * (t + gap) + t / 2, t }));
      });

      // Edges: colour is the sign of the weight, thickness its size.
      net.layers.forEach((L, l) => {
        for (let j = 0; j < L.outN; j++)
          for (let i = 0; i < L.inN; i++) {
            const wv = net.p[L.w + j * L.inN + i];
            const a = pos[l][i];
            const b = pos[l + 1][j];
            ctx.strokeStyle = rgb(wv >= 0 ? A : B, Math.min(0.85, 0.12 + Math.abs(wv) * 0.35));
            ctx.lineWidth = Math.min(4, 0.4 + Math.abs(wv) * 1.2);
            ctx.beginPath();
            ctx.moveTo(a.x + a.t / 2, a.y);
            ctx.bezierCurveTo((a.x + b.x) / 2, a.y, (a.x + b.x) / 2, b.y, b.x - b.t / 2, b.y);
            ctx.stroke();
          }
      });

      // Nodes as little heatmaps.
      ctx.imageSmoothingEnabled = false;
      pos.forEach((col, l) =>
        col.forEach((n, i) => {
          if (l < 3) ctx.drawImage(paintMap(maps[l][i]), n.x - n.t / 2, n.y - n.t / 2, n.t, n.t);
          else ctx.drawImage(off, n.x - n.t / 2, n.y - n.t / 2, n.t, n.t);
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - n.t / 2 + 0.5, n.y - n.t / 2 + 0.5, n.t - 1, n.t - 1);
        })
      );
      ctx.imageSmoothingEnabled = true;

      // Input labels
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "11px var(--font-body, sans-serif)";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      pos[0].forEach((n, i) => ctx.fillText(FEATURES[i], n.x - n.t / 2 - 6, n.y));
    };

    const drawStats = (loss) => {
      if (epochRef.current) epochRef.current.textContent = String(epoch).padStart(4, "0");
      if (lossRef.current) lossRef.current.textContent = loss.toFixed(3);
      if (sparkRef.current && losses.length > 1) {
        const max = Math.max(...losses, 0.7);
        const d = losses
          .map((v, i) => `${i ? "L" : "M"}${((i / (losses.length - 1)) * 120).toFixed(1)},${(28 - (v / max) * 26).toFixed(1)}`)
          .join(" ");
        sparkRef.current.setAttribute("d", d);
      }
    };

    const render = (loss) => {
      drawBoard();
      drawNet();
      drawStats(loss);
    };

    let lastLoss = 0.69;
    const frame = () => {
      raf = 0;
      let loss = lastLoss;
      loss = trainStep(net, data, acts, deltas);
      epoch += 1;
      if (epoch % 4 === 0) losses = [...losses, loss].slice(-90);
      calm = Math.abs(lastLoss - loss) < 1e-5 ? calm + 1 : 0;
      lastLoss = loss;
      render(loss);
      // Rest once it has converged; any change wakes it up.
      if (visible && calm < 60 && loss > 0.003 && epoch < 6000) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      calm = 0;
      if (reduce) {
        for (let s = 0; s < 1500; s++) lastLoss = trainStep(net, data, acts, deltas);
        epoch += 1500;
        losses = [lastLoss];
        render(lastLoss);
        return;
      }
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    api.current = {
      setData: (name) => {
        data = DATASETS[name]();
        reset(net);
        epoch = 0;
        losses = [];
        render(0.693);
        kick();
      },
      resetWeights: () => {
        reset(net);
        epoch = 0;
        losses = [];
        render(0.693);
        kick();
      },
    };

    const onDown = (e) => {
      const r = board.getBoundingClientRect();
      const x = toX(e.clientX - r.left, r.width);
      const y = toY(e.clientY - r.top, r.height);
      const c = e.shiftKey ? 1 - brushRef.current : brushRef.current;
      // A small cluster, so a click visibly changes the boundary.
      for (let i = 0; i < 4; i++) data.push({ x: x + gauss() * 0.06, y: y + gauss() * 0.06, c });
      kick();
      if (!raf) render(lastLoss);
    };
    board.addEventListener("pointerdown", onDown);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) kick();
      },
      { threshold: 0.25 }
    );
    io.observe(board);
    const ro = new ResizeObserver(() => {
      B_ = fitCanvas(board);
      N_ = fitCanvas(netCanvas);
      render(lastLoss);
    });
    ro.observe(board);
    ro.observe(netCanvas);
    render(0.693);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      board.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const pill = (active) =>
    `rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ${
      active ? "bg-[#FFD84D] text-[#160F38]" : "bg-white/10 text-white/80 hover:bg-white/20"
    }`;

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-[#160F38] text-white">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-7">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Dataset">
          {Object.keys(DATASETS).map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={dataset === name}
              onClick={() => {
                setDataset(name);
                api.current.setData?.(name);
              }}
              className={pill(dataset === name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 text-sm text-white/60">
          <span>
            Epoch <span ref={epochRef} className="font-display text-lg font-semibold tabular-nums text-white">0000</span>
          </span>
          <span>
            Loss <span ref={lossRef} className="font-display text-lg font-semibold tabular-nums text-white">0.693</span>
          </span>
          <svg viewBox="0 0 120 30" className="hidden h-7 w-28 sm:block" aria-hidden="true">
            <path ref={sparkRef} fill="none" stroke="#FFD84D" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="relative border-b border-white/10 md:col-span-7 md:border-b-0 md:border-r">
          <p className="absolute left-5 top-4 text-xs uppercase tracking-[0.14em] text-white/50 md:left-7">
            Inputs → hidden layers → output
          </p>
          <canvas ref={netRef} aria-hidden="true" className="block h-[19rem] w-full md:h-[27rem]" />
        </div>
        <div className="md:col-span-5">
          <canvas
            ref={boardRef}
            role="img"
            aria-label="Decision boundary of the network, updating as it trains"
            className="block aspect-square w-full cursor-crosshair touch-manipulation"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-sm text-white/70 md:px-7">
        <div className="flex items-center gap-3">
          <span>Click the plot to add</span>
          <button type="button" onClick={() => setBrush(1)} aria-pressed={brush === 1} className={pill(brush === 1)}>
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#FFD84D] align-middle ring-1 ring-[#160F38]" />
            Yellow
          </button>
          <button type="button" onClick={() => setBrush(0)} aria-pressed={brush === 0} className={pill(brush === 0)}>
            <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#B9A8FF] align-middle" />
            Lilac
          </button>
        </div>
        <button type="button" onClick={() => api.current.resetWeights?.()} className="link text-white">
          Reset the weights
        </button>
      </div>
    </div>
  );
}

/* ---------------- section ---------------- */

const stats = [
  { value: 16, label: "courses" },
  { value: 819, label: "lessons" },
  { value: 1400, suffix: "+", label: "practice problems" },
  { value: 300, prefix: "~", label: "visualisations like this one" },
];

const built = [
  { title: "Python in the browser", text: "NumPy, pandas and scikit-learn run in a Web Worker through Pyodide. No setup, no server bill." },
  { title: "A judge with hidden tests", text: "LeetCode-style practice. Answers are stripped on the server, so they never reach the client." },
  { title: "Lessons written with agents", text: "An MCP server lets AI agents write and publish schema-checked lessons: 8,600+ steps so far." },
];

export default function IncognitionStory() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current;

      // Title letters drop in, then thicken as the section scrolls up.
      const letters = el.querySelectorAll("[data-ltr]");
      gsap.from(letters, {
        yPercent: 105,
        duration: 1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      const st = { w: 300 };
      gsap.to(st, {
        w: 800,
        ease: "none",
        onUpdate: () => letters.forEach((l) => (l.style.fontVariationSettings = `'wght' ${st.w}, 'wdth' 90, 'opsz' 96`)),
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 10%", scrub: true },
      });

      gsap.from("[data-inc-fade]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 60%" },
      });
      gsap.from("[data-playground]", {
        clipPath: "inset(12% 6% 12% 6% round 1.75rem)",
        scale: 0.96,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-playground]", start: "top 85%" },
      });

      el.querySelectorAll("[data-stat]").forEach((s) => {
        const obj = { v: 0 };
        const to = Number(s.dataset.stat);
        s.textContent = "0";
        gsap.to(obj, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (s.textContent = Math.round(obj.v).toLocaleString("en-IN")),
          scrollTrigger: { trigger: s, start: "top 90%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="work"
      ref={root}
      aria-labelledby="incognition-title"
      className="relative overflow-hidden bg-paper text-ink"
      style={paletteVars(palettes.incognition)}
    >
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-32">
        <p data-inc-fade className="flex items-center gap-2 text-sm text-graphite">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cobalt opacity-75 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-cobalt" />
          </span>
          Now building, 2026
        </p>

        <div className="mt-4 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <h2
            id="incognition-title"
            aria-label="Incognition"
            className="font-display leading-[0.85] tracking-[-0.05em] md:col-span-8"
            style={{ fontSize: "clamp(4rem, 13vw, 12rem)" }}
          >
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              {Array.from("Incognition").map((ch, i) => (
                <span
                  key={i}
                  data-ltr
                  className="inline-block"
                  style={{ fontVariationSettings: "'wght' 800, 'wdth' 90, 'opsz' 96" }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h2>
          <div className="md:col-span-4 md:pb-4">
            <p data-inc-fade className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              Master the math of <span className="text-cobalt">intelligence</span>.
            </p>
            <p data-inc-fade className="mt-3 text-lg text-graphite">
              A platform that teaches machine learning from zero, through code and interactive visualisations. I lead
              engineering on it.
            </p>
          </div>
        </div>

        <div data-playground className="mt-14 md:mt-20">
          <Playground />
        </div>
        <p data-inc-fade className="mt-4 max-w-prose text-graphite">
          That&apos;s a real neural network, training in your browser right now. Each square shows what one neuron has
          learned. This is the kind of thing Incognition lessons are made of.
        </p>

        <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-rule pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-graphite">{s.label}</dt>
              <dd
                className="font-display font-semibold leading-none tracking-[-0.04em]"
                style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
              >
                {s.prefix}
                <span data-stat={s.value}>{s.value.toLocaleString("en-IN")}</span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {built.map((b) => (
            <li key={b.title} data-inc-fade>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{b.title}</h3>
              <p className="mt-2 text-graphite">{b.text}</p>
            </li>
          ))}
        </ul>

        <div data-inc-fade className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-4">
          <a
            href={SITE}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Visit"
            className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-lg font-medium text-[#160F38] transition-transform duration-300 hover:-rotate-2"
          >
            Start learning on theincognition.com <span aria-hidden="true">↗</span>
          </a>
          <Link href="/projects/incognition" className="link text-lg">
            How I built it
          </Link>
        </div>
      </div>
    </section>
  );
}

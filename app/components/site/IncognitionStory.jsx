"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "./motion/gsap";
import { palettes, paletteVars } from "./palette";

/*
  Incognition, told as the route a learner takes: a winding road from
  "never written code" to "building AI", with the course tracks as stops.
  A "You" marker travels the road as you scroll, lighting up each stop.
*/

const SITE = "https://theincognition.com";

// Tracks and their courses, as listed on theincognition.com/learn.
const STOPS = [
  {
    track: "Programming",
    lessons: 237,
    courses: ["Programming Fundamentals", "Python Fundamentals", "Python for AI", "Data with Python"],
  },
  {
    track: "Mathematics",
    lessons: 216,
    courses: ["Statistics and Probability", "Linear Algebra", "Calculus & Optimization"],
  },
  {
    track: "Machine learning",
    lessons: 212,
    courses: ["ML Foundations", "Core ML", "Classical ML", "ML in Code", "Applied ML"],
  },
  {
    track: "Deep learning",
    lessons: 188,
    courses: ["Neural Networks", "Deep Learning for Images", "Sequences & Attention", "Generative models"],
  },
  {
    track: "Generative AI",
    soon: true,
    courses: ["How GenAI Works", "Large Language Models", "Building With LLMs", "RAG", "Agents"],
  },
];

/* Desktop road, in viewBox units (1000 x 1050). Three rows joined by U-turns. */
const VB = { w: 1000, h: 1050 };
const ROAD = "M 50 90 H 810 A 190 190 0 0 1 810 470 H 190 A 190 190 0 0 0 190 850 H 950";
const POINTS = {
  start: { x: 50, y: 90 },
  stops: [
    { x: 330, y: 90 },
    { x: 640, y: 90 },
    { x: 660, y: 470 },
    { x: 330, y: 470 },
    { x: 470, y: 850 },
  ],
  finish: { x: 950, y: 850 },
};
const pct = (p) => ({ left: `${(p.x / VB.w) * 100}%`, top: `${(p.y / VB.h) * 100}%` });

function StopCard({ stop, index, align = "center" }) {
  const shift = align === "left" ? "translate-x-0" : align === "right" ? "-translate-x-full" : "-translate-x-1/2";
  return (
    <div className={`absolute top-9 w-[17rem] ${shift}`}>
      <p className="text-sm tabular-nums text-graphite">
        {String(index + 1).padStart(2, "0")}
        {stop.soon ? " · coming soon" : ` · ${stop.lessons} lessons`}
      </p>
      <h3 className="mt-1 font-display text-3xl font-semibold tracking-tight">{stop.track}</h3>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {stop.courses.map((c) => (
          <li key={c} className="rounded-full border border-ink/25 px-2.5 py-1 text-xs">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Node({ big = false, children }) {
  return (
    <span
      data-node
      className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-paper transition-colors duration-300 data-[on=true]:bg-cobalt ${
        big ? "h-10 w-10" : "h-6 w-6"
      }`}
    >
      {children}
    </span>
  );
}

function RoadDesktop() {
  return (
    <div data-road className="relative mx-auto hidden lg:block" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {/* The road itself, with a dashed centre line */}
        <path d={ROAD} fill="none" className="stroke-ink/15" strokeWidth="34" strokeLinecap="round" />
        <path d={ROAD} fill="none" className="stroke-ink/40" strokeWidth="2" strokeDasharray="10 14" />
        {/* Distance travelled */}
        <path
          data-progress
          d={ROAD}
          fill="none"
          pathLength="1"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          className="stroke-cobalt"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Start */}
      <div className="absolute" style={pct(POINTS.start)}>
        <Node />
        <div className="absolute -top-16 left-0 w-max -translate-x-3">
          <p className="text-sm text-graphite">Start</p>
          <p className="font-display text-xl font-semibold">Never written code</p>
        </div>
      </div>

      {POINTS.stops.map((p, i) => (
        <div key={i} data-stop className="absolute" style={pct(p)}>
          <Node />
          <div data-card>
            <StopCard stop={STOPS[i]} index={i} />
          </div>
        </div>
      ))}

      {/* Finish */}
      <div data-stop className="absolute" style={pct(POINTS.finish)}>
        <Node big>
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-ink">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" />
          </svg>
        </Node>
        <div data-card className="absolute right-0 top-10 w-[17rem] text-right">
          <p className="text-sm text-graphite">Finish</p>
          <p className="font-display text-3xl font-semibold tracking-tight">Building AI</p>
        </div>
      </div>

      {/* The learner */}
      <div data-marker className="pointer-events-none absolute left-0 top-0 z-10">
        <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper">
          You
        </span>
      </div>
    </div>
  );
}

function RoadMobile() {
  const items = [
    { label: "Start", title: "Never written code" },
    ...STOPS.map((s, i) => ({ stop: s, i })),
    { label: "Finish", title: "Building AI" },
  ];
  return (
    <ol data-road-m className="relative lg:hidden">
      <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[6px] rounded-full bg-ink/15" />
      <span aria-hidden="true" data-rail-m className="absolute bottom-3 left-[11px] top-3 w-[6px] origin-top rounded-full bg-cobalt" />
      {items.map((it, k) => (
        <li key={k} data-stop-m className="relative pb-12 pl-12 last:pb-0">
          <span
            data-node
            className="absolute left-0 top-1 h-7 w-7 rounded-full border-[3px] border-ink bg-paper transition-colors duration-300 data-[on=true]:bg-cobalt"
          />
          {it.stop ? (
            <>
              <p className="text-sm text-graphite">
                {String(it.i + 1).padStart(2, "0")}
                {it.stop.soon ? " · coming soon" : ` · ${it.stop.lessons} lessons`}
              </p>
              <h3 className="mt-1 font-display text-3xl font-semibold tracking-tight">{it.stop.track}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {it.stop.courses.map((c) => (
                  <li key={c} className="rounded-full border border-ink/25 px-2.5 py-1 text-xs">
                    {c}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm text-graphite">{it.label}</p>
              <p className="font-display text-2xl font-semibold">{it.title}</p>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

const stats = [
  { value: 16, label: "courses" },
  { value: 850, suffix: "+", label: "lessons" },
  { value: 1400, suffix: "+", label: "practice problems" },
];

export default function IncognitionStory() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const reduce = prefersReducedMotion();
      const light = (nodes, on) => nodes.forEach((n) => (n.dataset.on = on ? "true" : "false"));

      if (reduce) {
        light(el.querySelectorAll("[data-node]"), true);
        gsap.set("[data-progress]", { attr: { "stroke-dashoffset": 0 } });
        return;
      }

      // Title letters rise in.
      gsap.from("[data-ltr]", {
        yPercent: 105,
        duration: 1,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      gsap.from("[data-inc-fade]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 65%" },
      });

      // Desktop: the marker drives along the road with the scroll.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const road = el.querySelector("[data-road]");
        const path = road.querySelector("[data-progress]");
        const marker = road.querySelector("[data-marker]");
        const stops = [...road.querySelectorAll("[data-stop]")];
        const nodes = stops.map((s) => s.querySelector("[data-node]"));
        const cards = stops.map((s) => s.querySelector("[data-card]"));
        const startNode = road.querySelector("[data-node]");
        const total = path.getTotalLength();

        // Where along the road each stop sits, found by sampling.
        const stopPts = [...POINTS.stops, POINTS.finish];
        const at = stopPts.map((p) => {
          let best = 0,
            bestD = Infinity;
          for (let i = 0; i <= 400; i++) {
            const q = path.getPointAtLength((i / 400) * total);
            const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
            if (d < bestD) (bestD = d), (best = i / 400);
          }
          return best;
        });

        gsap.set(cards, { opacity: 0.25, y: 16 });
        startNode.dataset.on = "true";
        const reached = at.map(() => false);

        const place = (p) => {
          const q = path.getPointAtLength(p * total);
          const box = road.getBoundingClientRect();
          gsap.set(marker, { x: (q.x / VB.w) * box.width, y: (q.y / VB.h) * box.height });
          path.setAttribute("stroke-dashoffset", String(1 - p));
          at.forEach((a, i) => {
            const on = p >= a - 0.005;
            if (on === reached[i]) return;
            reached[i] = on;
            nodes[i].dataset.on = on ? "true" : "false";
            gsap.to(cards[i], { opacity: on ? 1 : 0.25, y: on ? 0 : 16, duration: 0.6, ease: "expo.out", overwrite: true });
          });
        };
        place(0);
        const st = ScrollTrigger.create({
          trigger: road,
          start: "top 65%",
          end: "bottom 75%",
          scrub: 0.6,
          onUpdate: (self) => place(self.progress),
          onRefresh: (self) => place(self.progress),
        });
        return () => st.kill();
      });

      // Mobile: the rail fills and stops light up in turn.
      mm.add("(max-width: 1023px)", () => {
        const list = el.querySelector("[data-road-m]");
        gsap.fromTo(
          list.querySelector("[data-rail-m]"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 70%", scrub: true } }
        );
        list.querySelectorAll("[data-stop-m]").forEach((li) => {
          const node = li.querySelector("[data-node]");
          ScrollTrigger.create({
            trigger: li,
            start: "top 70%",
            onEnter: () => (node.dataset.on = "true"),
            onLeaveBack: () => (node.dataset.on = "false"),
          });
          gsap.from(li, { opacity: 0.3, x: 16, duration: 0.7, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 80%" } });
        });
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

      return () => mm.revert();
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
            className="font-display font-extrabold leading-[0.85] tracking-[-0.05em] md:col-span-7"
            style={{ fontSize: "clamp(4rem, 11vw, 10.5rem)", fontVariationSettings: "'wdth' 90, 'opsz' 96" }}
          >
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              {Array.from("Incognition").map((ch, i) => (
                <span key={i} data-ltr className="inline-block">
                  {ch}
                </span>
              ))}
            </span>
          </h2>
          <div className="md:col-span-5 md:pb-4">
            <p data-inc-fade className="font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              From never written a line of code to <span className="text-cobalt">building AI</span>.
            </p>
            <p data-inc-fade className="mt-3 text-lg text-graphite">
              A platform that teaches machine learning from zero, with lessons you can play with and Python that runs in
              your browser. I lead engineering on it.
            </p>
          </div>
        </div>

        <dl data-inc-fade className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="text-graphite">{s.label}</dt>
              <dd className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] md:text-6xl">
                <span data-stat={s.value}>{s.value.toLocaleString("en-IN")}</span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 md:mt-28">
          <RoadDesktop />
          <RoadMobile />
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-4 lg:-mt-8 lg:justify-end">
          <a
            href={SITE}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Visit"
            className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-lg font-medium text-[#160F38] transition-transform duration-300 hover:-rotate-2"
          >
            Start the route on theincognition.com <span aria-hidden="true">↗</span>
          </a>
          <Link href="/projects/incognition" className="link text-lg">
            How I built it
          </Link>
        </div>
      </div>
    </section>
  );
}

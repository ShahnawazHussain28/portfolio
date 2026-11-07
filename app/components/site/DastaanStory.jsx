"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";
import { palettes, paletteVars } from "./palette";
import peaks from "@/app/data/dastaan-peaks.json";

const stages = [
  { name: "Script", detail: "An LLM finds the cast, writes a voice description for each character, and attributes every line to a speaker." },
  { name: "Direct", detail: "A director pass sets emotion and pace for each line, adds dramatic pauses, and tags the mood of every scene." },
  { name: "Voice", detail: "Qwen3-TTS designs a voice from each description. IndexTTS-2 clones it for every line, with emotion." },
  { name: "Mix", detail: "Music matched to the mood ducks under speech, and whisper.cpp timings drive word-synced subtitles." },
];

// An original sample passage, written for this demo.
const PROSE =
  "The lamp had gone out by the time Meera reached the door. “Who’s there?” she whispered. From the dark, a voice she hadn’t heard in years answered: “Only me. Open up, it’s cold.”";

const LINES = [
  { speaker: "Narrator", color: "rgb(var(--graphite))", text: "The lamp had gone out by the time Meera reached the door.", tag: "low, unhurried", peaks: [0, 30] },
  { speaker: "Meera", color: "rgb(var(--cobalt))", text: "Who’s there?", tag: "afraid, whispered", pause: "0.8s pause", peaks: [30, 50] },
  { speaker: "Arjun", color: "#FF6B5E", text: "Only me. Open up, it’s cold.", tag: "tired, warm", peaks: [50, 90] },
];

// Music bed under the whole scene; it dips wherever someone speaks.
function bedPath(width = 600, height = 60) {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const speech = t > 0.05 && t < 0.95 ? 0.35 : 1; // ducked under dialogue
    const y = height / 2 - Math.sin(t * 38) * Math.sin(t * 7 + 1) * (height * 0.42) * speech;
    pts.push(`${(t * width).toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function Bars({ from, to }) {
  return (
    <span className="flex h-8 items-center gap-[3px]" aria-hidden="true">
      {peaks.slice(from, to).map((v, i) => (
        <span
          key={i}
          data-bar
          className="w-[3px] shrink-0 origin-center rounded-full bg-current"
          style={{ height: `${Math.max(8, v * 100)}%` }}
        />
      ))}
    </span>
  );
}

export default function DastaanStory() {
  const root = useRef(null);
  const pinned = useRef(null);
  const [stage, setStage] = useState(3);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        setStage(0);
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: pinned.current,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => setStage(Math.min(3, Math.floor(self.progress * 4.2))),
          },
        });

        // 1. Script: prose dissolves, attributed lines arrive.
        tl.fromTo(q("[data-prose]"), { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(8px)", duration: 0.6 }, 0.2)
          .from(q("[data-line]"), { opacity: 0, y: 30, stagger: 0.15, duration: 0.6 }, 0.4)
          // 2. Direct: emotion tags and pauses.
          .from(q("[data-tag]"), { opacity: 0, scale: 0.6, transformOrigin: "left center", stagger: 0.12, duration: 0.4, ease: "back.out(2)" }, 1.25)
          .from(q("[data-pause]"), { opacity: 0, scaleX: 0, transformOrigin: "left center", duration: 0.4 }, 1.4)
          // 3. Voice: each line's waveform grows.
          .from(q("[data-bar]"), { scaleY: 0, stagger: { each: 0.008, from: "start" }, duration: 0.3 }, 2.1)
          // 4. Mix: the music bed draws in underneath.
          .fromTo(q("[data-bed]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "none" }, 3.05)
          .to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      id="dastaan"
      ref={root}
      aria-labelledby="dastaan-title"
      style={paletteVars(palettes.dastaan)}
      className="relative bg-paper text-ink"
    >
      <div ref={pinned} className="lg:h-screen">
      <div className="mx-auto grid h-full max-w-page grid-cols-1 gap-12 px-5 py-24 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
        <div className="lg:col-span-5">
          <p className="text-sm text-graphite">Selected work, 2026</p>
          <h2
            id="dastaan-title"
            className="mt-2 font-display font-semibold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)", fontVariationSettings: "'wdth' 80, 'opsz' 96" }}
          >
            Dastaan
          </h2>
          <p className="mt-5 max-w-md text-xl">Upload a book and get back an audio drama, voiced and scored.</p>

          {/* Stage progress: a real sequence, so it's numbered. */}
          <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Pipeline stages">
            {stages.map((s, i) => (
              <li key={s.name}>
                <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= stage ? "bg-cobalt" : "bg-rule"}`} />
                <span className={`mt-2 block text-sm transition-colors duration-500 ${i === stage ? "text-ink" : "text-graphite"}`}>
                  {i + 1}. {s.name}
                </span>
              </li>
            ))}
          </ol>
          <p key={stage} className="fade-in mt-5 min-h-[4.5rem] max-w-md text-graphite" aria-live="polite">
            {stages[stage].detail}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#dastaan-output"
              className="group inline-flex items-center gap-3 rounded-full bg-cobalt py-2.5 pl-3 pr-5 font-medium text-paper"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-paper text-cobalt">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
              </span>
              Watch a chapter it made
            </a>
            <Link href="/projects/dastaan" className="link font-medium">
              How Dastaan works
            </Link>
          </div>
        </div>

        {/* The "screen": prose turns into a directed, voiced, scored scene. */}
        <div className="lg:col-span-7">
          <div className="relative rounded-[6px] bg-surface p-6 md:p-8">
            <p data-prose className="pointer-events-none absolute inset-6 hidden font-sans text-xl italic leading-relaxed md:inset-8 lg:block">
              {PROSE}
            </p>

            <ol className="space-y-5">
              {LINES.map((l) => (
                <li key={l.speaker}>
                  {l.pause && (
                    <span data-pause className="mb-4 flex items-center gap-3 text-xs text-graphite">
                      <span className="h-px w-10 bg-graphite" />
                      {l.pause}
                    </span>
                  )}
                  <div data-line>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-semibold" style={{ color: l.color }}>
                        {l.speaker}
                      </span>
                      <span data-tag className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-graphite">
                        {l.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-lg leading-snug md:text-xl">{l.text}</p>
                    <div className="mt-2" style={{ color: l.color }}>
                      <Bars from={l.peaks[0]} to={l.peaks[1]} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div data-bed className="mt-6 border-t border-rule pt-4">
              <span className="text-xs text-graphite">Music: tense, low strings. Ducks under speech.</span>
              <svg viewBox="0 0 600 60" className="mt-2 h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
                <path d={bedPath()} fill="none" stroke="rgb(var(--cobalt))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      </div>

      <ChapterOutput />
    </section>
  );
}

/* ---------- The real output: a chapter Dastaan made, on a phone ---------- */

function ChapterOutput() {
  const root = useRef(null);
  const video = useRef(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Plays (muted) only while on screen.
  useEffect(() => {
    const v = video.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    const onTime = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener("timeupdate", onTime);
    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The phone straightens and rises as it scrolls in.
      gsap.fromTo(
        "[data-phone]",
        { rotate: -8, yPercent: 12 },
        {
          rotate: 0,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
        }
      );
      gsap.from("[data-out-fade]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
    },
    { scope: root }
  );

  const sound = () => {
    const v = video.current;
    // Turning sound on restarts the chapter, so it's heard from the first line.
    if (muted) v.currentTime = 0;
    v.muted = !muted;
    setMuted(!muted);
    v.play().catch(() => {});
  };

  return (
    <div id="dastaan-output" ref={root} className="mx-auto max-w-page px-5 pb-24 pt-8 md:px-8 md:pb-36 lg:pt-24">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
        <div className="flex justify-center md:col-span-5 md:col-start-2">
          <div data-phone className="relative w-[min(78vw,320px)]">
            <div className="overflow-hidden rounded-[2.4rem] border-[10px] border-[#140406] bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
              <video
                ref={video}
                src="/video/dastaan-ch01.mp4"
                poster="/video/dastaan-ch01.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Chapter 1 of The Call That Knows, an audio drama made by Dastaan, with word-by-word subtitles"
                className="block aspect-[9/16] w-full object-cover"
              />
            </div>
            {/* Notch */}
            <span aria-hidden="true" className="absolute left-1/2 top-[18px] h-5 w-20 -translate-x-1/2 rounded-full bg-[#140406]" />
            {/* Progress */}
            <span aria-hidden="true" className="absolute inset-x-8 bottom-[22px] h-[3px] overflow-hidden rounded-full bg-white/20">
              <span className="block h-full origin-left bg-cobalt" style={{ transform: `scaleX(${progress})` }} />
            </span>
            <button
              type="button"
              onClick={sound}
              data-cursor={muted ? "Sound on" : "Mute"}
              aria-pressed={!muted}
              className="absolute -right-4 bottom-16 inline-flex items-center gap-2 rounded-full bg-cobalt px-4 py-2.5 text-sm font-semibold text-paper transition-transform duration-300 hover:-rotate-3 md:-right-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4z" fill="currentColor" />
                {muted ? <path d="m22 9-6 6m0-6 6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />}
              </svg>
              {muted ? "Turn sound on" : "Mute"}
            </button>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <p data-out-fade className="text-sm text-graphite">What comes out</p>
          <h3
            data-out-fade
            className="mt-2 font-display font-semibold leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            The Call That Knows, <span className="text-cobalt">chapter 1</span>
          </h3>
          <p data-out-fade className="mt-5 max-w-md text-lg text-graphite">
            Nobody recorded or drew any of this. Dastaan read the story, cast and directed it, voiced every line, painted
            the scenes, scored it, and timed the subtitles to each word.
          </p>
          <ul data-out-fade className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-ink">
            {["Designed voice", "Directed pacing", "Scene images", "Music under speech", "Word-synced subtitles", "Vertical video"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                {t}
              </li>
            ))}
          </ul>
          <p data-out-fade className="mt-6 text-sm text-graphite">Best with headphones. 1 minute.</p>
        </div>
      </div>
    </div>
  );
}
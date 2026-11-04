"use client";
import { useMemo, useState } from "react";

const stages = [
  {
    name: "Script",
    detail: "An LLM finds the cast, writes a voice description for each character, and attributes every line to a speaker.",
    // Sparse ticks: text being read and tagged.
    shape: (t, r) => (r > 0.55 ? 0.15 + r * 0.25 : 0.06),
  },
  {
    name: "Direct",
    detail: "A director pass sets emotion and pace for each line, adds dramatic pauses, and tags the mood of every scene.",
    shape: (t, r) => 0.12 + 0.35 * Math.abs(Math.sin(t * 9)) * r,
  },
  {
    name: "Voice",
    detail: "Qwen3-TTS designs a voice from each description. IndexTTS-2 clones it for every line, with emotion.",
    // Speech-like: syllable bursts with gaps between words.
    shape: (t, r) => (Math.sin(t * 40) > -0.2 ? 0.25 + 0.6 * r * Math.abs(Math.sin(t * 13)) : 0.05),
  },
  {
    name: "Mix",
    detail: "Music matched to the mood ducks under speech, and whisper.cpp timings drive word-synced subtitles.",
    // Dense: speech on top of a music bed.
    shape: (t, r) => 0.35 + 0.25 * Math.sin(t * 6) * Math.sin(t * 6) + 0.35 * r,
  },
];

const BARS_PER_STAGE = 28;

// Seeded random so the waveform is identical on server and client.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function DastaanPipeline() {
  const [active, setActive] = useState(null);

  const bars = useMemo(() => {
    const rand = seeded(42);
    return stages.flatMap((stage, si) =>
      Array.from({ length: BARS_PER_STAGE }, (_, i) => ({
        stage: si,
        h: Math.min(1, stage.shape(i / BARS_PER_STAGE, rand())),
      }))
    );
  }, []);

  const W = bars.length * 6;
  const H = 72;

  return (
    <div onMouseLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-16 w-full md:h-20" preserveAspectRatio="none" aria-hidden="true">
        {bars.map((b, i) => {
          const h = Math.max(2, b.h * H);
          const lit = active === null || active === b.stage;
          return (
            <rect
              key={i}
              x={i * 6 + 1}
              y={(H - h) / 2}
              width={3}
              height={h}
              rx={1.5}
              className={`transition-[fill,opacity] duration-300 ${active === b.stage ? "fill-cobalt" : "fill-ink"}`}
              opacity={lit ? (active === null ? 0.55 : 1) : 0.15}
            />
          );
        })}
      </svg>

      <ol className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[3px] border border-rule bg-rule sm:grid-cols-2">
        {stages.map((s, i) => (
          <li key={s.name} className="bg-paper">
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              aria-pressed={active === i}
              className="h-full w-full p-5 text-left transition-colors hover:bg-surface focus-visible:bg-surface"
            >
              <span className="flex items-baseline gap-3">
                <span className={`text-sm tabular-nums transition-colors ${active === i ? "text-cobalt" : "text-graphite"}`}>
                  {i + 1}
                </span>
                <span className="font-display text-xl font-semibold tracking-tight">{s.name}</span>
              </span>
              <span className="mt-2 block text-[0.95rem] leading-relaxed text-graphite">{s.detail}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

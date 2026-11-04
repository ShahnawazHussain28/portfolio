import Section from "./Section";
import { recognition, stack } from "@/app/data/profile";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-prose space-y-5 text-lg">
        <p>
          I started out building small browser games and simulators: a digital circuit simulator, a maze solver, a 3D
          solar system. That habit of building the whole thing myself stuck.
        </p>
        <p className="text-graphite">
          At work I&apos;ve built a config-driven multiplayer game engine that designers use without writing code, a
          remote testing system for IoT water purifiers, and the cloud backend that talks to those devices. On my own
          time I&apos;ve been going deep on LLM pipelines and speech models.
        </p>
      </div>

      <h3 className="mt-16 font-display text-xl font-semibold tracking-tight">Recognition</h3>
      <ul className="mt-4 border-t border-rule">
        {recognition.map((r) => (
          <li key={r.event} className="grid grid-cols-[6rem_1fr] gap-x-4 border-b border-rule py-4 md:grid-cols-[8rem_1fr_auto]">
            <span className="font-medium text-cobalt">{r.place}</span>
            <span>
              {r.event} <span className="text-graphite">{r.note}</span>
            </span>
            <span className="hidden text-sm tabular-nums text-graphite md:block">{r.year}</span>
          </li>
        ))}
      </ul>

      <h3 className="mt-16 font-display text-xl font-semibold tracking-tight">Tools I use</h3>
      <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {stack.map((g) => (
          <div key={g.area}>
            <dt className="text-sm text-graphite">{g.area}</dt>
            <dd className="mt-1.5 leading-relaxed">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

"use client";
import { useState } from "react";
import ProjectWall from "@/app/components/site/ProjectWall";
import { projects } from "@/app/data/projects";

const categories = ["All", ...new Set(projects.map((p) => p.category))];

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <main className="mx-auto max-w-page px-5 pb-28 pt-32 md:px-8 md:pt-40">
      <h1
        className="font-display font-semibold leading-[0.9] tracking-[-0.035em]"
        style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", fontVariationSettings: "'wdth' 82, 'opsz' 96" }}
      >
        Projects <span className="align-top text-xl font-normal tabular-nums text-graphite md:text-2xl">{projects.length}</span>
      </h1>
      <p className="mt-6 max-w-prose text-lg text-graphite">
        Everything from this year&apos;s AI audio work back to the browser games I made while learning to code.
      </p>

      <div role="group" aria-label="Filter by category" className="mt-12 flex flex-wrap gap-2">
        {categories.map((c) => {
          const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
          const on = active === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                on ? "border-ink bg-ink text-paper" : "border-rule text-graphite hover:border-ink hover:text-ink"
              }`}
            >
              {c} <span className={on ? "text-paper/60" : "text-graphite/70"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-16">
        <ProjectWall projects={shown} />
      </div>
    </main>
  );
}

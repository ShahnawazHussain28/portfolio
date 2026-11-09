"use client";
import { useRef } from "react";
import { experiences } from "@/app/data/experience";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "./motion/gsap";

// "September 2024 - February 2026" -> "Sep 2024 – Feb 2026" ("Present" stays as is)
const MONTH = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/;
const shortPeriod = (period) =>
  period
    .split(/\s*-\s*/)
    .map((part) => part.replace(MONTH, "$1"))
    .join(" – ");

export default function Experience() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // The timeline rail fills as you read down the section.
      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-jobs]", start: "top 70%", end: "bottom 60%", scrub: true },
        }
      );

      gsap.utils.toArray("[data-job]").forEach((job) => {
        const st = { trigger: job, start: "top 78%" };

        gsap.from(job.querySelector("[data-node]"), { scale: 0, duration: 0.6, ease: "back.out(3)", scrollTrigger: st });
        gsap.from(job.querySelector("[data-role]"), { yPercent: 100, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: st });

        // Body copy reveals line by line from behind a mask.
        job.querySelectorAll("[data-split]").forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.from(split.lines, {
            yPercent: 100,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // Before/after stats: strike through the old value, then bring in the new one.
        job.querySelectorAll("[data-change]").forEach((el) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top 85%" } })
            .from(el.querySelector("[data-strike]"), { scaleX: 0, duration: 0.5, ease: "power3.inOut", delay: 0.2 })
            .from(el.querySelector("[data-after]"), { opacity: 0, y: 24, duration: 0.7, ease: "expo.out" }, "-=0.1");
        });

        // Numbers count to their value.
        job.querySelectorAll("[data-count]").forEach((el) => {
          const from = Number(el.dataset.from);
          const to = Number(el.dataset.to);
          const obj = { v: from };
          el.textContent = from;
          gsap.to(obj, {
            v: to,
            duration: 1.6,
            ease: "power3.inOut",
            onUpdate: () => (el.textContent = Math.round(obj.v)),
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} aria-labelledby="experience-title" className="relative">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:pb-20 md:pt-36">
        <h2
          id="experience-title"
          className="t-display"
        >
          Experience
        </h2>

        <ol data-jobs className="relative mt-16 md:mt-24">
          {/* Rail */}
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-2 w-px bg-rule md:left-[calc(25%+5px)]" />
          <span
            aria-hidden="true"
            data-rail
            className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-cobalt md:left-[calc(25%+5px)]"
          />

          {experiences.map((job) => (
            <li key={job.company} data-job className="relative grid grid-cols-1 gap-4 pb-24 pl-10 last:pb-0 md:grid-cols-4 md:gap-0 md:pl-0">
              <span
                data-node
                aria-hidden="true"
                className="absolute left-0 top-2 h-[11px] w-[11px] rounded-full bg-cobalt md:left-[25%]"
              />
              <p className="text-sm tabular-nums text-graphite md:pr-10 md:pt-1 md:text-right">{shortPeriod(job.period)}</p>

              <div className="md:col-span-3 md:pl-12">
                <div className="overflow-hidden">
                  <h3 data-role className="t-title">
                    {job.position}, <span className="text-cobalt">{job.company}</span>
                  </h3>
                </div>
                {(job.org || job.link) && (
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-graphite">
                    {job.org && <span>{job.org}</span>}
                    {job.link && (
                      <a href={job.link.href} target="_blank" rel="noopener noreferrer" className="link text-ink">
                        {job.link.label} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </p>
                )}
                <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
                  <div>
                    <p data-split className="max-w-prose text-lg text-graphite">
                      {job.description}
                    </p>

                    <ul className="mt-6 max-w-prose space-y-3">
                      {job.achievements.map((a) => (
                        <li
                          key={a}
                          data-split
                          className="relative pl-5 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-2.5 before:bg-cobalt"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Numbers and stack sit beside the story, so the right side of the page is used. */}
                  <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
                    {job.stats && (
                      <dl className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-1">
                        {job.stats.map((s) => (
                          <div key={s.label} className="border-l-2 border-rule pl-5">
                            <dt className="sr-only">{s.label}</dt>
                            <dd>
                              {s.before !== undefined ? (
                                // Before/after: the old value sits small and gets crossed out; the new one is the big number.
                                <span data-change className="block">
                                  <span className="sr-only">
                                    From {s.before} {s.beforeUnit ?? s.unit} to {s.after} {s.unit}
                                  </span>
                                  <span aria-hidden="true" className="flex items-center gap-2 text-xl text-graphite">
                                    <span className="relative">
                                      {s.before} {s.beforeUnit ?? s.unit}
                                      <span
                                        data-strike
                                        className="absolute -inset-x-1 top-1/2 h-[2px] origin-left -translate-y-1/2 rounded-full bg-cobalt"
                                      />
                                    </span>
                                    <span>→</span>
                                  </span>
                                  <span
                                    aria-hidden="true"
                                    data-after
                                    className="t-figure mt-1 block"
                                    style={{ fontSize: "clamp(3rem, 4.5vw, 4.25rem)" }}
                                  >
                                    <span className="text-cobalt">{s.after}</span>
                                    <span className="ml-[0.15em] text-[0.4em] tracking-tight">{s.unit}</span>
                                  </span>
                                </span>
                              ) : (
                                <span
                                  className="t-figure block"
                                  style={{ fontSize: "clamp(3rem, 4.5vw, 4.25rem)" }}
                                >
                                  <span data-count data-from={s.from} data-to={s.to}>
                                    {s.to}
                                  </span>
                                  {s.suffix && <span className="text-[0.5em] tracking-tight">{s.suffix}</span>}
                                </span>
                              )}
                              <span aria-hidden="true" className="mt-3 block text-sm text-graphite">
                                {s.label}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                      {job.technologies.map((t) => (
                        <li key={t} className="rounded-full border border-rule px-3 py-1 text-sm text-graphite">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

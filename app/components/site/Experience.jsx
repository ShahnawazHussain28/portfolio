import Section from "./Section";
import { experiences } from "@/app/data/experience";

// "September 2024 - February 2026" -> "Sep 2024 – Feb 2026"
const shortPeriod = (period) =>
  period
    .split(/\s*-\s*/)
    .map((part) => part.replace(/^(\w{3})\w*/, "$1"))
    .join(" – ");

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-16">
        {experiences.map((job) => (
          <li key={job.company} className="grid grid-cols-1 gap-4 md:grid-cols-9 md:gap-8">
            <p className="text-sm tabular-nums text-graphite md:col-span-2 md:pt-1.5">{shortPeriod(job.period)}</p>
            <div className="md:col-span-7">
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {job.position}, <span className="text-graphite">{job.company}</span>
              </h3>
              <p className="mt-3 max-w-prose text-graphite">{job.description}</p>
              <ul className="mt-5 max-w-prose space-y-2.5">
                {job.achievements.map((a) => (
                  <li key={a} className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-graphite">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

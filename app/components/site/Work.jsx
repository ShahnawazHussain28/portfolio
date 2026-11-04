import Link from "next/link";
import Section from "./Section";
import DastaanPipeline from "./DastaanPipeline";
import ProjectList from "./ProjectList";
import { projects } from "@/app/data/projects";

export default function Work() {
  const dastaan = projects.find((p) => p.slug === "dastaan");
  const others = projects.filter((p) => p.featured && p.slug !== "dastaan");

  return (
    <Section id="work" title="Selected work">
      <article className="grid grid-cols-1 gap-10 lg:grid-cols-9 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="text-sm text-graphite">
            {dastaan.year}, {dastaan.category}
          </p>
          <h3
            className="mt-2 font-display text-5xl font-semibold leading-none tracking-[-0.03em] md:text-6xl"
            style={{ fontVariationSettings: "'wdth' 85, 'opsz' 72" }}
          >
            Dastaan
          </h3>
          <p className="mt-5 text-lg text-ink">Upload a book and get back an audio drama.</p>
          <p className="mt-3 text-graphite">
            Every character gets a voice of their own, every line is performed with the right emotion, and background
            music follows the mood of each scene. The web app shows each stage live and lets you edit any stage and
            re-run the pipeline from there.
          </p>
          <p className="mt-5 text-sm leading-relaxed text-graphite">{dastaan.technologies.join(", ")}</p>
          <Link href="/projects/dastaan" className="link mt-6 inline-block font-medium">
            How Dastaan works
          </Link>
        </div>
        <div className="lg:col-span-5">
          <DastaanPipeline />
        </div>
      </article>

      <div className="mt-20">
        <ProjectList projects={others} />
        <Link href="/projects" className="link mt-8 inline-block font-medium">
          See all {projects.length} projects
        </Link>
      </div>
    </Section>
  );
}

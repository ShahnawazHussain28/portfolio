"use client";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/app/data/projects";

// Descriptions use **bold** for key terms.
function withBold(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

function Gallery({ images, title }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt={`${title}, screenshot ${index + 1}`} className="w-full rounded-[3px] bg-surface object-contain" />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-pressed={i === index}
              className={`shrink-0 overflow-hidden rounded-[3px] border-2 transition-colors ${
                i === index ? "border-cobalt" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Video({ project }) {
  const src = project.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${project.youtubeId}?rel=0`
    : project.driveVideoId
    ? `https://drive.google.com/file/d/${project.driveVideoId}/preview`
    : null;
  if (!src) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-[3px] bg-surface">
      <iframe
        src={src}
        title={`${project.title} demo video`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export default function ProjectContent({ slug }) {
  const i = projects.findIndex((p) => p.slug === slug);
  const project = projects[i];

  if (!project) {
    return (
      <main className="mx-auto max-w-page px-5 pb-28 pt-40 md:px-8">
        <h1 className="font-display text-5xl font-semibold tracking-tight">No project at this address</h1>
        <Link href="/projects" className="link mt-6 inline-block">
          See all projects
        </Link>
      </main>
    );
  }

  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const images = project.images?.length ? project.images : project.image ? [project.image] : [];
  const hasVideo = project.youtubeId || project.driveVideoId;

  return (
    <main className="mx-auto max-w-page px-5 pb-24 pt-28 md:px-8 md:pt-36">
      <Link href="/projects" className="link text-sm text-graphite hover:text-ink">
        All projects
      </Link>

      <header className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="text-sm text-graphite">
            {project.year}, {project.category}
          </p>
          <h1
            className="mt-2 font-display font-semibold leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)", fontVariationSettings: "'wdth' 82, 'opsz' 96" }}
          >
            {project.title}
          </h1>
          <p className="mt-6 max-w-prose text-xl text-graphite">{project.shortDescription}</p>
        </div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 md:col-span-4 md:justify-end">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-5 py-2.5 text-paper transition-colors hover:bg-cobalt"
            >
              Open the live project
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="link py-2.5">
              Source on GitHub
            </a>
          )}
        </div>
      </header>

      {(hasVideo || images.length > 0) && (
        <div className="mt-14 space-y-10">
          <Video project={project} />
          <Gallery images={images} title={project.title} />
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-rule pt-12 md:grid-cols-12">
        <div className="max-w-prose space-y-5 text-[1.075rem] leading-[1.7] text-graphite md:col-span-7">
          {project.description.split("\n\n").map((para, k) => (
            <p key={k}>{withBold(para)}</p>
          ))}
        </div>

        <aside className="space-y-10 md:col-span-4 md:col-start-9">
          {project.features?.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">What it does</h2>
              <ul className="mt-3 space-y-2">
                {project.features.map((f) => (
                  <li key={f} className="relative pl-5 text-[0.95rem] before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-graphite">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {project.technologies?.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">Built with</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{project.technologies.join(", ")}</p>
            </div>
          )}
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-24 grid grid-cols-2 border-t border-rule">
        <Link href={`/projects/${prev.slug}`} className="group py-6 pr-4">
          <span className="text-sm text-graphite">Previous</span>
          <span className="mt-1 block font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-cobalt md:text-2xl">
            {prev.title}
          </span>
        </Link>
        <Link href={`/projects/${next.slug}`} className="group border-l border-rule py-6 pl-4 text-right md:pl-8">
          <span className="text-sm text-graphite">Next</span>
          <span className="mt-1 block font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-cobalt md:text-2xl">
            {next.title}
          </span>
        </Link>
      </nav>
    </main>
  );
}

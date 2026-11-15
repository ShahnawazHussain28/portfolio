"use client";
import Link from "next/link";
import DistortImage from "./DistortImage";
import { expandTo } from "./motion/PageTransition";

/*
  The projects page body, in two registers:
  - Recent work as large editorial cards, two columns with the right one dropped
    so the grid reads as a staggered spread rather than a table.
  - Older experiments as a dense wall of small tiles. Their screenshots are
    small, so they are shown small.
  Projects without a picture get a typographic tile instead of an empty box.
*/

const cover = (p) => p.image || p.videoPoster || null;

function openWithExpand(e, p) {
  const src = cover(p);
  if (!src || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const media = e.currentTarget.querySelector("[data-media]");
  if (!media) return;
  e.preventDefault();
  expandTo({
    href: `/projects/${p.slug}`,
    rect: media.getBoundingClientRect(),
    image: src,
    bg: getComputedStyle(document.documentElement).backgroundColor,
  });
}

function TypeTile({ title, className = "" }) {
  return (
    <div className={`flex items-end bg-cobalt p-5 text-paper md:p-7 ${className}`}>
      <span className="t-display" style={{ fontSize: "clamp(2rem, 4vw, 3.75rem)" }}>
        {title}
      </span>
    </div>
  );
}

function FeatureCard({ p, index, total }) {
  const src = cover(p);
  return (
    <article>
      <Link href={`/projects/${p.slug}`} onClick={(e) => openWithExpand(e, p)} data-cursor="View" className="group block">
        <div data-media className="overflow-hidden rounded-[4px] bg-surface">
          {src ? (
            <DistortImage src={src} alt={`${p.title} screenshot`} className="aspect-[16/10] w-full" />
          ) : (
            <TypeTile title={p.title} className="aspect-[16/10] w-full" />
          )}
        </div>
        <p className="mt-5 flex gap-4 text-sm tabular-nums text-graphite">
          <span>
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
          <span>{p.year}</span>
          <span>{p.category}</span>
        </p>
        <h3 className="t-title mt-2 transition-colors group-hover:text-cobalt">{p.title}</h3>
        <p className="mt-2 max-w-xl text-graphite">{p.shortDescription}</p>
        {p.technologies?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.technologies.slice(0, 4).map((t) => (
              <li key={t} className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-graphite">
                {t}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}

function WallTile({ p }) {
  const src = cover(p);
  return (
    <li>
      <Link href={`/projects/${p.slug}`} data-cursor="View" className="group block">
        <div className="overflow-hidden rounded-[3px] bg-surface">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${p.title} screenshot`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-end bg-cobalt p-4 text-paper">
              <span className="font-display text-2xl font-semibold leading-none tracking-tight">{p.title}</span>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-cobalt">
            {p.title}
          </h3>
          <span className="shrink-0 text-xs text-graphite">{p.category}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-graphite">{p.shortDescription}</p>
      </Link>
    </li>
  );
}

function SectionHead({ title, note, count }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-rule pt-6">
      <h2 className="t-headline">
        {title} <span className="align-top text-base font-normal tabular-nums text-graphite">{count}</span>
      </h2>
      <p className="max-w-sm text-graphite">{note}</p>
    </div>
  );
}

export default function ProjectWall({ projects, splitYear = 2022 }) {
  const recent = projects.filter((p) => Number(p.year) >= splitYear);
  const early = projects.filter((p) => Number(p.year) < splitYear);

  return (
    <div className="space-y-28">
      {recent.length > 0 && (
        <section aria-label="Recent work">
          <SectionHead
            title="Recent work"
            count={recent.length}
            note="Products, research tools and hackathon builds, newest first."
          />
          <div className="mt-12 grid gap-x-10 gap-y-20 md:grid-cols-2 md:[&>*:nth-child(even)]:mt-32">
            {recent.map((p, i) => (
              <FeatureCard key={p.slug} p={p} index={i} total={recent.length} />
            ))}
          </div>
        </section>
      )}

      {early.length > 0 && (
        <section aria-label="Early experiments">
          <SectionHead
            title="Learning by building"
            count={early.length}
            note="Games, simulations and browser toys from the year I taught myself to code. Most still run."
          />
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {early.map((p) => (
              <WallTile key={p.slug} p={p} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "./motion/gsap";
import { expandTo } from "./motion/PageTransition";
import DistortImage from "./DistortImage";

/*
  Featured projects on a horizontal track. On desktop the section pins and
  vertical scrolling moves the track sideways. On small screens it's a plain
  stack. The section stays on the page background so the screenshots carry
  the colour.
*/
export default function Gallery({ projects, total }) {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = root.current;
        const cards = gsap.utils.toArray("[data-card]", section);
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const scrollTween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Titles slide a little against the track for depth.
        cards.forEach((c) => {
          gsap.fromTo(
            c.querySelector("[data-title]"),
            { x: 60 },
            {
              x: -60,
              ease: "none",
              scrollTrigger: {
                trigger: c,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const open = (e, p) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const img = e.currentTarget.querySelector("[data-media]");
    expandTo({
      href: `/projects/${p.slug}`,
      rect: img.getBoundingClientRect(),
      image: p.image,
      bg: getComputedStyle(document.documentElement).backgroundColor,
    });
  };

  return (
    <section
      ref={root}
      aria-labelledby="more-work-title"
      className="relative bg-paper text-ink lg:h-screen lg:overflow-hidden"
    >
      <div
        ref={track}
        className="flex flex-col gap-0 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[5vw] lg:px-[6vw]"
      >
        <div className="px-5 py-20 md:px-8 lg:w-[34vw] lg:shrink-0 lg:px-0 lg:py-0">
          <h2
            id="more-work-title"
            className="t-display"
          >
            More work
          </h2>
          <p className="mt-6 max-w-sm text-lg text-graphite">
            A safety wearable, a hackathon winner, a few things that run in your browser. Keep scrolling.
          </p>
        </div>

        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-card
            className="px-5 py-16 md:px-8 lg:w-[min(64vw,62rem)] lg:shrink-0 lg:px-0 lg:py-0"
          >
            <Link href={`/projects/${p.slug}`} onClick={(e) => open(e, p)} data-cursor="View" className="group block">
              <div data-media className="overflow-hidden rounded-[4px]">
                <DistortImage src={p.image} alt={`${p.title} screenshot`} className="aspect-[16/10] w-full lg:aspect-auto lg:h-[56vh]" />
              </div>
              <div className="mt-6">
                <p className="flex gap-4 text-sm tabular-nums text-graphite">
                  <span>
                    {String(i + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
                  </span>
                  <span>{p.year}</span>
                  <span>{p.category}</span>
                </p>
                <h3
                  data-title
                  className="t-display mt-3"
                  style={{ fontSize: "clamp(2.25rem, 4.6vw, 4.5rem)" }}
                >
                  {p.title}
                </h3>
                <p className="mt-3 max-w-xl text-lg text-graphite">{p.shortDescription}</p>
              </div>
            </Link>
          </article>
        ))}

        <div className="px-5 py-20 md:px-8 lg:w-[30vw] lg:shrink-0 lg:px-0 lg:py-0">
          <Link
            href="/projects"
            className="t-display group block"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            <span className="link">See all {total} projects</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

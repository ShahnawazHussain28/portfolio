import Link from "next/link";
import Portrait from "./Portrait";
import { profile } from "@/app/data/profile";

export default function Hero() {
  return (
    <section className="mx-auto max-w-page px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
      <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <h1
            className="font-display font-semibold leading-[0.86] tracking-[-0.035em]"
            style={{ fontSize: "clamp(3.6rem, 10vw, 9.25rem)", fontVariationSettings: "'wdth' 82, 'opsz' 96" }}
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={{ animationDelay: "80ms" }}>
                Shahnawaz
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={{ animationDelay: "180ms" }}>
                Hussain
              </span>
            </span>
          </h1>

          <div className="fade-in mt-10 max-w-prose space-y-5 text-lg text-graphite md:text-xl" style={{ animationDelay: "500ms" }}>
            <p className="text-ink">
              I build products end to end, from the interface to the server to the device, and lately the AI systems
              inside them.
            </p>
            <p>
              My latest is{" "}
              <Link href="/projects/dastaan" className="link-static text-ink">
                Dastaan
              </Link>
              , a pipeline that turns any book into a fully voiced audio drama. Before that I was a software engineer at
              VTAKU and a full-stack developer at Gauge RO. I&apos;m open to full-stack and AI/ML roles.
            </p>
          </div>

          <ul className="fade-in mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[1.05rem]" style={{ animationDelay: "650ms" }}>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-paper transition-colors hover:bg-cobalt"
              >
                Email me
              </a>
            </li>
            {profile.links.slice(0, 2).map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <figure className="md:col-span-4 md:col-start-9">
          <Portrait src="/portrait.jpg" alt="Shahnawaz Hussain, wearing glasses and a light blue shirt" />
          <figcaption className="mt-3 text-sm text-graphite">
            Move your cursor and I&apos;ll turn. Hover the photo to see its depth map.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

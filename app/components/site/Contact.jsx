"use client";
import { profile } from "@/app/data/profile";

export default function Contact() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      window.dispatchEvent(new CustomEvent("toast", { detail: "Email address copied" }));
    } catch {}
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-rule">
      <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-36">
        <h2 id="contact-title" className="text-lg text-graphite">
          Hiring, or building something? Write to me.
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-4 block break-all font-display font-semibold leading-[0.95] tracking-[-0.035em] transition-colors hover:text-cobalt sm:break-normal"
          style={{ fontSize: "clamp(1.9rem, 5.6vw, 5rem)", fontVariationSettings: "'wdth' 80, 'opsz' 96" }}
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <button type="button" onClick={copy} className="link font-medium">
            Copy address
          </button>
          {profile.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link text-graphite hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

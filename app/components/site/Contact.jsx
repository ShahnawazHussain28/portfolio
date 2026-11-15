"use client";
import { useEffect, useRef } from "react";
import { profile } from "@/app/data/profile";
import { palettes, paletteVars } from "./palette";
import { gsap, useGSAP, prefersReducedMotion } from "./motion/gsap";
import SocialIcons from "./SocialIcons";

/*
  The email address, huge. Letters lean away from the cursor and spring back;
  clicking copies the address and sends a wave through the letters.
*/
export default function Contact() {
  const root = useRef(null);
  const word = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-contact-line]", {
        yPercent: 100,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        // Unclip once revealed so letters can lean outside their line.
        onComplete: () => gsap.set(root.current.querySelectorAll("[data-clip]"), { overflow: "visible" }),
      });
    },
    { scope: root }
  );

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover)").matches) return;
    const letters = Array.from(word.current.querySelectorAll("[data-ch]"));
    const movers = letters.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" }),
      r: gsap.quickTo(el, "rotate", { duration: 0.5, ease: "power3.out" }),
    }));
    const RADIUS = 160;
    const onMove = (e) => {
      letters.forEach((el, i) => {
        const b = el.getBoundingClientRect();
        const dx = b.left + b.width / 2 - e.clientX;
        const dy = b.top + b.height / 2 - e.clientY;
        const d = Math.hypot(dx, dy);
        const f = d < RADIUS ? Math.pow(1 - d / RADIUS, 2) * 46 : 0;
        movers[i].x(d ? (dx / d) * f : 0);
        movers[i].y(d ? (dy / d) * f : 0);
        movers[i].r(d ? (dx / d) * f * 0.4 : 0);
      });
    };
    const onLeave = () => movers.forEach((m) => (m.x(0), m.y(0), m.r(0)));
    const host = root.current;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const copy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(profile.email);
      window.dispatchEvent(new CustomEvent("toast", { detail: "Email address copied" }));
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          word.current.querySelectorAll("[data-ch-inner]"),
          { yPercent: 0 },
          { yPercent: -35, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.018 }
        );
      }
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      ref={root}
      aria-labelledby="contact-title"
      style={paletteVars(palettes.contact)}
      className="relative overflow-hidden bg-paper text-ink"
    >
      <div className="mx-auto max-w-page px-5 pb-24 pt-28 md:px-8 md:pb-32 md:pt-40">
        <h2 id="contact-title" className="overflow-hidden text-xl md:text-2xl">
          <span data-contact-line className="block text-balance">
            Hiring, or building something? Write to me.
          </span>
        </h2>

        <div data-clip className="mt-6 overflow-hidden pb-4">
          <a
            ref={word}
            href={`mailto:${profile.email}`}
            onClick={copy}
            data-cursor="Copy"
            data-contact-line
            aria-label={`Copy ${profile.email}`}
            className="block font-display font-semibold leading-[1] tracking-[-0.04em]"
            style={{ fontSize: "clamp(1.6rem, 5.4vw, 5.6rem)", fontVariationSettings: "'wdth' 78, 'opsz' 96" }}
          >
            {Array.from(profile.email).map((ch, i) => (
              <span key={i} data-ch aria-hidden="true" className="inline-block will-change-transform">
                <span data-ch-inner className="inline-block">
                  {ch}
                </span>
              </span>
            ))}
          </a>
        </div>

        {/* Phone: the button gets its own full-width row, the icons sit centred under it. */}
        <div className="mt-10 flex flex-col gap-6 text-lg sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-ink px-6 py-3 text-center text-paper transition-transform duration-300 hover:-rotate-2"
          >
            Open in your email app
          </a>
          <SocialIcons links={profile.links} className="justify-center sm:justify-start" />
        </div>
      </div>
    </section>
  );
}

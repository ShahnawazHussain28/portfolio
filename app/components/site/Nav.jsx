"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "./motion/gsap";
import ScrambleText from "./ScrambleText";
import ThemeToggle from "./ThemeToggle";

export const sections = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function openPalette() {
  window.dispatchEvent(new Event("palette:open"));
}

export default function Nav() {
  const [isMac, setIsMac] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  // Take the text colour of whatever section is under the nav. Coloured
  // sections redefine --ink, so reading it there gives a colour that is
  // designed to contrast with that section's background.
  useEffect(() => {
    const header = ref.current;
    let last = "";
    let frame = 0;
    const update = () => {
      if (++frame % 3) return;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 32)
        .find((el) => !header.contains(el) && el.id !== "intro" && !el.closest("#intro"));
      if (!under) return;
      const style = getComputedStyle(under);
      const ink = style.getPropertyValue("--ink").trim();
      const paper = style.getPropertyValue("--paper").trim();
      const key = `${ink}|${paper}|${window.scrollY > 40}`;
      if (ink && key !== last) {
        last = key;
        header.style.setProperty("--nav", ink);
        header.style.setProperty("--nav-bg", paper);
        // A soft backdrop once scrolled, so photos passing underneath can't swallow the text.
        header.dataset.solid = window.scrollY > 40 ? "true" : "false";
      }
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <header
      ref={ref}
      data-solid="false"
      className="fixed inset-x-0 top-0 z-50 text-[rgb(var(--nav,var(--ink)))] transition-[color,background-color] duration-300 data-[solid=true]:bg-[rgb(var(--nav-bg,var(--paper))/0.82)] data-[solid=true]:backdrop-blur-md"
    >
      <nav className="mx-auto flex h-16 max-w-page items-center gap-6 px-5 md:px-8" aria-label="Main">
        <Link href="/" className="font-display text-[1.05rem] font-semibold tracking-tight">
          Shahnawaz Hussain
        </Link>

        <ul className="ml-auto hidden items-center gap-7 text-[0.95rem] md:flex">
          {sections.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="opacity-70 transition-opacity hover:opacity-100">
                <ScrambleText>{s.label}</ScrambleText>
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle className="border-[rgb(var(--nav,var(--ink))/0.35)] hover:border-[rgb(var(--nav,var(--ink)))]" />
          <button
            type="button"
            onClick={openPalette}
            className="flex h-9 items-center gap-2 rounded-full border border-[rgb(var(--nav,var(--ink))/0.35)] px-3 text-sm transition-colors hover:border-[rgb(var(--nav,var(--ink)))]"
            aria-label="Open command menu"
          >
            <span className="md:hidden">Menu</span>
            <kbd className="hidden font-sans md:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
        </div>
      </nav>
    </header>
  );
}

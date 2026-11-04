"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  return (
    // Difference blending keeps the nav readable over every section colour.
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <nav className="mx-auto flex h-16 max-w-page items-center gap-6 px-5 md:px-8" aria-label="Main">
        <Link href="/" className="font-display text-[1.05rem] font-semibold tracking-tight">
          Shahnawaz Hussain
        </Link>

        <ul className="ml-auto hidden items-center gap-7 text-[0.95rem] md:flex">
          {sections.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="text-white/70 transition-colors hover:text-white">
                <ScrambleText>{s.label}</ScrambleText>
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle className="border-white/40 text-white/80 hover:border-white hover:text-white" />
          <button
            type="button"
            onClick={openPalette}
            className="flex h-9 items-center gap-2 rounded-full border border-white/40 px-3 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
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

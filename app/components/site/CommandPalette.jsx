"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/app/data/projects";
import { profile } from "@/app/data/profile";
import { sections } from "./Nav";
import { followLocalTime, setTheme, useTheme } from "./theme";

export default function CommandPalette() {
  const router = useRouter();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const lastFocus = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  const commands = useMemo(() => {
    const go = (href) => () => router.push(href);
    const external = (href) => () => window.open(href, "_blank", "noopener");
    return [
      ...sections.map((s) => ({ group: "Go to", label: s.label, run: go(s.href) })),
      { group: "Go to", label: "All projects", run: go("/projects") },
      ...projects
        .filter((p) => p.featured)
        .map((p) => ({ group: "Projects", label: p.title, hint: p.year, run: go(`/projects/${p.slug}`) })),
      {
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setToast("Email address copied");
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      {
        group: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
      { group: "Actions", label: "Let the theme follow my local time", run: followLocalTime },
      ...profile.links.map((l) => ({ group: "Elsewhere", label: l.label, run: external(l.href) })),
    ];
  }, [router, theme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    const onToast = (e) => setToast(e.detail);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    window.addEventListener("toast", onToast);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
      window.removeEventListener("toast", onToast);
    };
  }, []);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      window.__lenis?.stop();
    } else {
      window.__lenis?.start();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runAt = (i) => {
    const cmd = results[i];
    if (!cmd) return;
    setOpen(false);
    cmd.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  let lastGroup = null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/25 px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              className="w-full max-w-lg overflow-hidden rounded-xl border border-rule bg-surface shadow-[0_24px_60px_-20px_rgb(var(--ink)/0.35)]"
              initial={{ y: 8, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section, project or action"
                className="w-full border-b border-rule bg-transparent px-5 py-4 text-base text-ink placeholder:text-graphite focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={`palette-item-${active}`}
              />
              <ul id="palette-list" ref={listRef} role="listbox" data-lenis-prevent className="max-h-[50vh] overflow-y-auto py-2">
                {results.length === 0 && (
                  <li className="px-5 py-6 text-sm text-graphite">Nothing matches “{query}”. Try a project name.</li>
                )}
                {results.map((cmd, i) => {
                  const header = cmd.group !== lastGroup ? cmd.group : null;
                  lastGroup = cmd.group;
                  return (
                    <li key={`${cmd.group}-${cmd.label}`} role="presentation">
                      {header && <div className="px-5 pb-1 pt-3 text-xs text-graphite">{header}</div>}
                      <div
                        id={`palette-item-${i}`}
                        data-index={i}
                        role="option"
                        aria-selected={i === active}
                        onMouseMove={() => setActive(i)}
                        onClick={() => runAt(i)}
                        className={`mx-2 flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 text-[0.95rem] ${
                          i === active ? "bg-ink text-paper" : "text-ink"
                        }`}
                      >
                        <span>{cmd.label}</span>
                        {cmd.hint && (
                          <span className={`truncate text-xs ${i === active ? "text-paper/70" : "text-graphite"}`}>
                            {cmd.hint}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[95] -translate-x-1/2">
        <AnimatePresence>
          {toast && (
            <motion.div
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

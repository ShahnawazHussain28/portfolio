"use client";
import { useEffect, useState } from "react";

const EVENT = "themechange";

function timeTheme() {
  const h = new Date().getHours();
  return h >= 7 && h < 19 ? "light" : "dark";
}

function apply(theme, source) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themeSource = source;
  window.dispatchEvent(new Event(EVENT));
}

export function setTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  apply(theme, "manual");
}

export function followLocalTime() {
  try {
    localStorage.removeItem("theme");
  } catch {}
  apply(timeTheme(), "auto");
}

export function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

// Current theme + whether it was picked by the visitor or by the clock.
export function useTheme() {
  const [state, setState] = useState({ theme: "light", source: "auto" });

  useEffect(() => {
    const read = () =>
      setState({
        theme: document.documentElement.dataset.theme || "light",
        source: document.documentElement.dataset.themeSource || "auto",
      });
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  return state;
}

"use client";
import { toggleTheme, useTheme } from "./theme";

export default function ThemeToggle({ className = "border-rule text-graphite hover:border-ink hover:text-ink" }) {
  const { theme, source } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const title =
    source === "auto"
      ? `Theme follows your local time. Switch to ${next}.`
      : `Switch to ${next} theme`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      className={`group relative grid h-9 w-9 place-items-center rounded-full border transition-colors ${className}`}
    >
      {/* A disc whose shadow slides across: full in light, crescent in dark. */}
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <defs>
          <mask id="crescent">
            <rect width="18" height="18" fill="white" />
            <circle
              cx={theme === "dark" ? 12.5 : 22}
              cy={theme === "dark" ? 5.5 : -4}
              r="6"
              fill="black"
              style={{ transition: "cx 0.5s cubic-bezier(0.22,1,0.36,1), cy 0.5s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </mask>
        </defs>
        <circle cx="9" cy="9" r="6.5" fill="currentColor" mask="url(#crescent)" />
      </svg>
    </button>
  );
}

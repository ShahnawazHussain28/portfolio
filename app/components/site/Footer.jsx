"use client";
import { useEffect, useState } from "react";
import { followLocalTime, useTheme } from "./theme";

export default function Footer() {
  const { source } = useTheme();
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative z-10 border-t border-rule bg-paper">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-8 text-sm text-graphite md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Shahnawaz Hussain. It&apos;s {time || "…"} for me in India.</p>
        <p>
          {source === "auto" ? (
            "The theme follows your local time."
          ) : (
            <button type="button" onClick={followLocalTime} className="link">
              Let the theme follow your local time
            </button>
          )}
        </p>
      </div>
    </footer>
  );
}

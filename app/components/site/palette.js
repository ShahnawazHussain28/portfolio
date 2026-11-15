// The whole site uses four colours: stone, ink, cobalt, and a yellow highlight.
// Only a few sections get a full-colour background (Incognition, Dastaan, Contact);
// everything else follows the light/dark theme. A section using a palette below
// re-defines the theme tokens (--paper, --ink, ...) locally, so every Tailwind
// colour inside it follows.

export const colors = {
  stone: "#E8EAE6",
  ink: "#15181C",
  cobalt: "#2440F0",
  cobaltLight: "#94A3FF",
  signal: "#FFD84D",
  white: "#F2F4FF",
};

const C = colors;

export const palettes = {
  incognition: { bg: C.cobalt, fg: C.white, accent: C.signal },
  dastaan: { bg: C.ink, fg: C.stone, accent: C.signal },
  contact: { bg: C.cobalt, fg: C.white, accent: C.signal },
  "about-place": { bg: C.ink, fg: C.stone, accent: C.signal },
  "about-study": { bg: C.signal, fg: C.ink, accent: C.ink },
  "about-youtube": { bg: C.cobalt, fg: C.white, accent: C.signal },
  "about-skate": { bg: "#D3D7CF", fg: C.ink, accent: C.cobalt },
  "award-first": { bg: C.signal, fg: C.ink, accent: C.cobalt },
  "award-top": { bg: C.cobalt, fg: C.white, accent: C.signal },
};

// Stack areas get colours too (used by the tool blocks).
export const areaColors = {
  "Web and backend": { bg: C.cobalt, fg: C.white },
  "AI and audio": { bg: C.signal, fg: C.ink },
  "Mobile and 3D": { bg: C.cobaltLight, fg: C.ink },
  Systems: { bg: "#C8CCC6", fg: C.ink },
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
const triplet = (rgb) => rgb.join(" ");

export function paletteVars(p) {
  if (!p) return undefined;
  const bg = hexToRgb(p.bg);
  const fg = hexToRgb(p.fg);
  return {
    "--paper": triplet(bg),
    "--surface": triplet(mix(bg, fg, 0.08)),
    "--ink": triplet(fg),
    "--graphite": triplet(mix(fg, bg, 0.3)),
    "--rule": triplet(mix(fg, bg, 0.75)),
    "--cobalt": triplet(hexToRgb(p.accent)),
  };
}

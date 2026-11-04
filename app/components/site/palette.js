// Bold colour sets. A section using one of these re-defines the theme tokens
// (--paper, --ink, ...) locally, so every Tailwind colour inside it follows.

export const palettes = {
  dastaan: { bg: "#3A0C12", fg: "#F7E9D7", accent: "#FF9F1C" },
  "nirvay-netra": { bg: "#E8462B", fg: "#1C0906", accent: "#FFF1E8" },
  snugshopper: { bg: "#1F3BD1", fg: "#EEF0FF", accent: "#FFD84D" },
  "web-steganography": { bg: "#C8F169", fg: "#14210A", accent: "#2E4A00" },
  "circuit-simulator": { bg: "#F4D03F", fg: "#1B1A12", accent: "#A83200" },
  "squid-game": { bg: "#E0347A", fg: "#1A0712", accent: "#0B5E51" },
  contact: { bg: "#2440F0", fg: "#F2F4FF", accent: "#FFD84D" },
};

// Stack areas get colours too (used by the tool blocks).
export const areaColors = {
  "Web and backend": { bg: "#2440F0", fg: "#F2F4FF" },
  "AI and audio": { bg: "#FF9F1C", fg: "#2A1600" },
  "Games and 3D": { bg: "#E0347A", fg: "#1A0712" },
  Systems: { bg: "#C8F169", fg: "#14210A" },
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

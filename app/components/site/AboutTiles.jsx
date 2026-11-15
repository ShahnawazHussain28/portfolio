"use client";
import { useEffect, useRef } from "react";
import { projects } from "@/app/data/projects";
import { palettes, paletteVars } from "./palette";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "./motion/gsap";

/*
  Four facts about me, each on its own coloured tile with its own bit of motion:
  a globe lit by where the sun is right now, a graduation year that counts up, a YouTube
  filmstrip, and a skate whose wheels turn as far as it rolls.
*/

const tile = "relative overflow-hidden rounded-[1.75rem] bg-paper text-ink";
const label = "text-sm text-graphite";

export default function AboutTiles() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-tile]", {
        clipPath: "inset(100% 0% 0% 0% round 1.75rem)",
        y: 60,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
      <PlaceTile />
      <div className="grid gap-4 md:col-span-5">
        <StudyTile />
        <YouTubeTile />
      </div>
      <SkateTile />
    </div>
  );
}

/* ---------- Kolkata: a real globe, lit by where the sun is right now ---------- */

const HOME = { name: "Kolkata", lat: 22.57, lon: 88.36 };
const rad = (d) => (d * Math.PI) / 180;
const toVec = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];

// Where the sun is overhead right now (close enough for a picture).
function sunVec(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = (date - start) / 864e5;
  const decl = -23.44 * Math.cos(((2 * Math.PI) / 365) * (day + 10));
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60;
  return toVec(decl, (12 - hours) * 15);
}

// Time of day in Kolkata, in words.
function partOfDay(date) {
  const h = +new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(date);
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

const VERT = `
attribute vec2 p;
varying vec2 uv;
void main() { uv = p; gl_Position = vec4(p, 0.0, 1.0); }
`;

// Ray-casts a sphere per pixel: daylight texture on the sunny side, city lights
// on the dark side, a warm band at dusk, and a thin atmosphere around the edge.
const FRAG = `
precision highp float;
varying vec2 uv;
uniform sampler2D dayTex;
uniform sampler2D nightTex;
uniform mat3 toWorld;
uniform vec3 sun;      // world space
uniform vec3 sunView;  // view space
uniform float scale;   // uv units per globe radius
uniform float px;      // one pixel in globe radii
const float PI = 3.14159265;

void main() {
  vec2 q = uv * scale;
  float r = length(q);
  vec3 halo = vec3(0.36, 0.56, 1.0);

  if (r > 1.0) {
    float facing = clamp(dot(normalize(vec3(q, 0.0)), sunView) * 0.8 + 0.35, 0.0, 1.0);
    float a = exp(-(r - 1.0) * 30.0) * 0.55 * facing;
    gl_FragColor = vec4(halo * a, a);
    return;
  }

  vec3 n = vec3(q, sqrt(1.0 - r * r));
  vec3 w = toWorld * n;
  float lat = asin(clamp(w.y, -1.0, 1.0));
  float lon = atan(w.x, w.z);
  vec2 t = vec2(lon / (2.0 * PI) + 0.5, 0.5 - lat / PI);

  vec3 day = texture2D(dayTex, t).rgb;
  vec3 night = texture2D(nightTex, t).rgb;

  float sl = dot(w, sun);
  float lit = smoothstep(-0.1, 0.15, sl);
  vec3 dayCol = day * (0.5 + 0.7 * clamp(sl, 0.0, 1.0));
  // Moonlit land stays faint; the warm city lights are pulled out and boosted.
  float warm = clamp((night.r - night.b) * 10.0, 0.0, 1.0);
  vec3 nightCol = night * 0.6 + vec3(1.0, 0.75, 0.4) * warm * 2.2;
  vec3 col = mix(nightCol, dayCol, lit);
  col += vec3(1.0, 0.55, 0.25) * exp(-sl * sl / 0.0025) * 0.12 * (0.3 + day);

  // Atmosphere: bluish rim on the sunny side.
  float rim = pow(1.0 - n.z, 3.0);
  col = mix(col, halo, rim * 0.6 * smoothstep(-0.2, 0.3, sl));

  float edge = smoothstep(1.0, 1.0 - 1.5 * px, r);
  gl_FragColor = vec4(col * edge, edge);
}
`;

function PlaceTile() {
  const canvas = useRef(null);
  const pin = useRef(null);
  const time = useRef(null);
  const daypart = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    const reduce = prefersReducedMotion();
    const gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });

    // Kolkata faces us, and the globe sways gently either side of it.
    const baseRot = -rad(HOME.lon);
    const tilt = rad(HOME.lat) - 0.25;
    const home = toVec(HOME.lat, HOME.lon);
    let sun = sunVec(new Date());

    // World -> view rotation as a row-major 3x3.
    const viewMat = (rot) => {
      const cr = Math.cos(rot),
        sr = Math.sin(rot),
        ct = Math.cos(tilt),
        st = Math.sin(tilt);
      return [
        [cr, 0, sr],
        [sr * st, ct, -cr * st],
        [-sr * ct, st, cr * ct],
      ];
    };
    const apply = (m, v) => m.map((row) => row[0] * v[0] + row[1] * v[1] + row[2] * v[2]);

    // Globe size and place inside the tile.
    let R = 0,
      cx = 0,
      cy = 0;
    const MARGIN = 1.12; // room for the atmosphere glow
    const layout = () => {
      const box = c.parentElement.getBoundingClientRect();
      const w = box.width,
        h = box.height;
      const wide = w > 560;
      R = wide ? Math.min(w * 0.3, h * 0.33) : Math.min(w * 0.38, h * 0.28);
      cx = wide ? w - R - w * 0.1 : w * 0.5;
      cy = wide ? h * 0.57 : h * 0.5;
      const side = R * 2 * MARGIN;
      Object.assign(c.style, { width: `${side}px`, height: `${side}px`, left: `${cx - side / 2}px`, top: `${cy - side / 2}px` });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.height = Math.round(side * dpr);
      if (gl) gl.viewport(0, 0, c.width, c.height);
    };

    let ready = false;
    let program = null;
    let u = {};
    const setup = () => {
      const shader = (type, src) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      program = gl.createProgram();
      gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
      gl.useProgram(program);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const k of ["dayTex", "nightTex", "toWorld", "sun", "sunView", "scale", "px"]) u[k] = gl.getUniformLocation(program, k);
      gl.uniform1i(u.dayTex, 0);
      gl.uniform1i(u.nightTex, 1);
      return true;
    };

    const loadTex = (src, unit) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });

    const draw = (now) => {
      const rot = baseRot + (reduce ? 0 : Math.sin(now / 1000 / 5) * 0.6);
      const m = viewMat(rot);

      // Pin follows Kolkata on the turning globe.
      const [hx, hy, hz] = apply(m, home);
      if (pin.current) {
        pin.current.style.transform = `translate(${cx + hx * R}px, ${cy - hy * R}px)`;
        pin.current.style.opacity = hz > 0.1 ? "1" : "0";
      }
      if (!ready) return;

      // Inverse of a rotation is its transpose; GLSL wants column-major,
      // so passing the rows of m as columns gives exactly that.
      gl.uniformMatrix3fv(u.toWorld, false, new Float32Array(m.flat()));
      gl.uniform3fv(u.sun, sun);
      gl.uniform3fv(u.sunView, apply(m, sun));
      gl.uniform1f(u.scale, MARGIN);
      gl.uniform1f(u.px, 1 / (R * Math.min(window.devicePixelRatio || 1, 2)));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0,
      visible = false,
      started = false;
    const loop = (now) => {
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (started || !gl) return;
      started = true;
      if (!setup()) return;
      Promise.all([loadTex("/globe/earth-day.jpg", 0), loadTex("/globe/earth-night.jpg", 1)])
        .then(() => {
          ready = true;
          c.style.opacity = "1";
          draw(performance.now());
        })
        .catch(() => {});
    };

    // Load the textures a little before the tile scrolls in.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        if (visible && !raf) raf = requestAnimationFrame(loop);
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(c.parentElement);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(c.parentElement);

    // Local time in Kolkata, and the sun moves with it.
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
    const tick = () => {
      const now = new Date();
      sun = sunVec(now);
      if (time.current) time.current.textContent = fmt.format(now);
      if (daypart.current) daypart.current.textContent = `It's ${partOfDay(now)} here right now.`;
      if (reduce) draw(performance.now());
    };
    tick();
    const clock = setInterval(tick, 30000);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearInterval(clock);
    };
  }, []);

  return (
    <div data-tile className={`${tile} min-h-[30rem] md:col-span-7`} style={paletteVars(palettes["about-place"])}>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute opacity-0 transition-opacity duration-700"
      />
      <div ref={pin} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 transition-opacity duration-300">
        <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full border-2 border-[#101422] bg-cobalt" />
        <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] animate-ping rounded-full bg-cobalt/60" />
        <span className="absolute left-3 top-[-1.6rem] whitespace-nowrap rounded-full bg-[#101422]/85 px-2.5 py-0.5 text-[0.8rem] font-medium text-ink">
          {HOME.name}
        </span>
      </div>
      <div className="pointer-events-none relative flex h-full flex-col justify-between p-7 md:p-9">
        <div>
          <p className={label}>Based in</p>
          <p className="t-title mt-2 md:text-5xl">Kolkata, India</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p className="text-lg">
            Open to relocating.
            <span ref={daypart} className="block text-sm text-graphite">
              Day and night, live.
            </span>
          </p>
          <p className="text-right text-sm text-graphite">
            <span ref={time} className="t-figure block text-3xl text-ink">
              --:--
            </span>
            IST, 22.57° N 88.36° E
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Study: the year counts through the degree ---------- */

function StudyTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      const year = root.current.querySelector("[data-year]");
      const bars = root.current.querySelectorAll("[data-sem]");
      if (prefersReducedMotion()) return;
      const st = { v: 2021, w: 250 };
      year.textContent = "’21";
      gsap.set(bars, { scaleX: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 80%" } })
        .to(st, {
          v: 2025,
          w: 700,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            year.textContent = "’" + String(Math.floor(st.v)).slice(2);
            year.style.fontVariationSettings = `'wght' ${st.w}, 'wdth' 90, 'opsz' 96`;
          },
        })
        .to(bars, { scaleX: 1, duration: 0.22, ease: "power2.out", stagger: 0.22 }, 0);
    },
    { scope: root }
  );

  return (
    <div ref={root} data-tile className={`${tile} p-7 md:p-9`} style={paletteVars(palettes["about-study"])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={label}>Studied</p>
          <p className="mt-2 text-xl leading-snug">BTech, Computer Science and Engineering</p>
          <a
            href="https://gcetts.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-ink/40 px-4 py-1.5 text-base transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            GCETTS <span aria-hidden="true">↗</span>
          </a>
        </div>
        <span
          data-year
          aria-label="Class of 2025"
          className="t-figure leading-[0.8]"
          style={{ fontSize: "clamp(4.5rem, 8vw, 7rem)", fontWeight: 700 }}
        >
          ’25
        </span>
      </div>
      {/* Eight semesters */}
      <div aria-hidden="true" className="mt-7 grid grid-cols-8 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="h-2 overflow-hidden rounded-full bg-ink/15">
            <span data-sem className="block h-full origin-left rounded-full bg-cobalt" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- YouTube: a filmstrip of project thumbnails with a playhead ---------- */

const thumbs = projects.filter((p) => p.image).map((p) => p.image);

function YouTubeTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const strip = root.current.querySelector("[data-strip]");
      const loop = gsap.to(strip, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      const el = root.current;
      const fast = () => gsap.to(loop, { timeScale: 5, duration: 0.6, ease: "power2.out" });
      const slow = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.out" });
      el.addEventListener("pointerenter", fast);
      el.addEventListener("pointerleave", slow);
      return () => {
        el.removeEventListener("pointerenter", fast);
        el.removeEventListener("pointerleave", slow);
      };
    },
    { scope: root }
  );

  return (
    <a
      ref={root}
      data-tile
      data-cursor="Watch"
      href="https://www.youtube.com/@codeuniverse9015"
      target="_blank"
      rel="noopener noreferrer"
      className={`${tile} group block`}
      style={paletteVars(palettes["about-youtube"])}
    >
      <div aria-hidden="true" className="relative overflow-hidden pt-6">
        <div data-strip className="flex w-max gap-2 pl-2">
          {[...thumbs, ...thumbs].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" loading="lazy" className="h-20 w-32 rounded-lg object-cover" />
          ))}
        </div>
        {/* Playhead */}
        <span className="absolute bottom-0 left-1/2 top-3 w-0.5 bg-cobalt" />
        <span className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-[40%] rounded-full bg-cobalt" />
      </div>
      <div className="flex items-end justify-between gap-4 p-7 pt-6 md:p-9 md:pt-6">
        <div>
          <p className={label}>On YouTube</p>
          <p className="t-title mt-2">
            Code Universe <span aria-hidden="true">↗</span>
          </p>
          <p className="mt-1 text-graphite">Project demos, and technical things explained simply.</p>
        </div>
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-cobalt text-paper transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </span>
      </div>
    </a>
  );
}

/* ---------- Skating: the skate rolls with the scroll, wheels turn to match ---------- */

// Three big wheels, like a 3x110 frame.
const WHEELS = [60, 115, 170];
const WHEEL_R = 23;
const WHEEL_Y = 134;

function SkateTile() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const skate = el.querySelector("[data-skate]");
      const wheels = el.querySelectorAll("[data-wheel]");
      const trail = el.querySelector("[data-trail]");
      if (prefersReducedMotion()) {
        gsap.set(skate, { x: el.clientWidth * 0.55 });
        return;
      }
      const setX = gsap.quickSetter(skate, "x", "px");
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const width = el.clientWidth;
          const sw = skate.getBoundingClientRect().width;
          const x = -sw + self.progress * (width + sw);
          setX(x);
          // Wheels turn by exactly the distance travelled.
          const r = WHEEL_R * (sw / 230);
          const deg = (x / r) * (180 / Math.PI);
          wheels.forEach((w) => (w.style.transform = `rotate(${deg}deg)`));
          gsap.to(trail, { opacity: Math.min(1, Math.abs(self.getVelocity()) / 1500), duration: 0.2, overwrite: true });
        },
      });

      // Hop on hover.
      const hop = () =>
        gsap
          .timeline()
          .to(skate.firstElementChild, { y: -46, rotate: -10, duration: 0.28, ease: "power2.out" })
          .to(skate.firstElementChild, { y: 0, rotate: 0, duration: 0.5, ease: "bounce.out" });
      el.addEventListener("pointerenter", hop);
      return () => el.removeEventListener("pointerenter", hop);
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      data-tile
      className={`${tile} min-h-[17rem] md:col-span-12`}
      style={paletteVars(palettes["about-skate"])}
    >
      <div className="relative p-7 md:p-9">
        <p className={label}>Off screen</p>
        <p
          className="t-display mt-2"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
        >
          Rollerblading
        </p>
      </div>

      {/* Ground */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-8 h-px bg-ink/30" />

      <div data-skate aria-hidden="true" className="absolute bottom-8 left-0 w-[150px] md:w-[230px]">
        <div className="relative origin-bottom-right">
          <div data-trail className="absolute -left-16 bottom-6 space-y-2 opacity-0">
            <span className="block h-0.5 w-12 rounded-full bg-ink/60" />
            <span className="ml-4 block h-0.5 w-10 rounded-full bg-ink/40" />
            <span className="block h-0.5 w-14 rounded-full bg-ink/60" />
          </div>
          <svg viewBox="0 0 230 160" className="block w-full">
            {/* Boot */}
            <path
              d="M58 8h56c8 0 12 4 13 11l7 55c34 4 58 14 70 28 7 8 6 18-3 18H40c-7 0-10-5-9-11l13-89c1-8 6-12 14-12z"
              className="fill-ink"
            />
            <path d="M58 8h56c8 0 12 4 13 11l2 14H50l3-21c1-3 3-4 5-4z" className="fill-cobalt" />
            {/* Laces */}
            {[56, 72, 88].map((y) => (
              <path key={y} d={`M${92 + (y - 56) * 0.3} ${y}l28 4`} className="stroke-paper" strokeWidth="4" strokeLinecap="round" />
            ))}
            {/* Frame */}
            <rect x="30" y="112" width="170" height="10" rx="5" className="fill-ink" />
            {/* Wheels */}
            {WHEELS.map((cx) => (
              <g key={cx} data-wheel style={{ transformOrigin: `${cx}px ${WHEEL_Y}px`, transformBox: "view-box" }}>
                <circle cx={cx} cy={WHEEL_Y} r={WHEEL_R} className="fill-cobalt stroke-ink" strokeWidth="4" />
                <path
                  d={`M${cx - 15} ${WHEEL_Y}h30M${cx} ${WHEEL_Y - 15}v30`}
                  className="stroke-ink"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx={cx} cy={WHEEL_Y} r="4" className="fill-ink" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

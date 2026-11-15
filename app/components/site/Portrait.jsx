"use client";
import { useEffect, useRef, useState } from "react";
import { whenIntroDone } from "./motion/gsap";

/*
  A photo that turns toward the cursor.

  Each pixel is shifted by how close it is to the camera (a depth map), so near
  parts (nose, face) move more than far parts (shoulders, curtain). That parallax
  reads as the head turning.

  `depthSrc` is a greyscale image, white = near, cropped to match the photo.
  Without one we draw a rough head-and-shoulders depth shape on a canvas
  (see drawApproxDepth).
*/

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uPointer;   // -1..1, smoothed
uniform float uReveal;   // 0..1, load-in scan from top to bottom
uniform vec3 uAccent;
uniform vec3 uPaper;

void main() {
  // Zoom in slightly so shifted pixels never pull in the image edge.
  vec2 base = (vUv - 0.5) / 1.08 + 0.5;
  vec2 shift = uPointer * vec2(0.05, 0.032);

  // Parallax: re-sample depth at the displaced position a few times so near
  // regions settle over far ones instead of smearing.
  vec2 uv = base;
  float d = texture2D(uDepth, uv).r;
  for (int i = 0; i < 4; i++) {
    uv = base - shift * (d - 0.4);
    d = texture2D(uDepth, uv).r;
  }

  vec3 photo = texture2D(uImage, uv).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));
  // Grade toward the site palette: ink-cobalt shadows, stone highlights.
  vec3 duo = mix(vec3(0.05, 0.07, 0.24), vec3(0.95, 0.955, 0.93), smoothstep(0.04, 0.92, lum));
  photo = mix(mix(photo, vec3(lum), 0.25), duo, 0.42);

  // Depth drawn as contour lines, like a topographic map of the face.
  float bands = d * 22.0;
  float line = 1.0 - smoothstep(0.0, 0.09, abs(fract(bands) - 0.5) * 2.0 - 0.82);
  vec3 contour = mix(uPaper, uAccent, line * (0.35 + 0.65 * d));

  // Load-in: contour map first, photo scans in from the top behind a thin line.
  float scanY = 1.0 - uReveal * 1.08;
  float shown = smoothstep(scanY - 0.004, scanY + 0.004, vUv.y);
  vec3 col = mix(contour, photo, shown);
  float edge = 1.0 - smoothstep(0.0, 0.006, abs(vUv.y - scanY));
  col = mix(col, uAccent, edge * step(uReveal, 0.999));

  gl_FragColor = vec4(col, 1.0);
}`;

// Fallback depth when no depthSrc is given: a generic head, neck and torso (4:5).
function drawApproxDepth(w = 480, h = 600) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#0d0d0d";
  g.fillRect(0, 0, w, h);
  g.filter = "blur(18px)";

  const blob = (x, y, rx, ry, inner, outer) => {
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    g.save();
    g.translate(x * w, y * h);
    g.scale(rx * w, ry * h);
    g.fillStyle = grad;
    g.beginPath();
    g.arc(0, 0, 1, 0, Math.PI * 2);
    g.fill();
    g.restore();
  };

  blob(0.48, 0.86, 0.56, 0.42, "#8a8a8a", "#5a5a5a"); // torso
  blob(0.47, 0.47, 0.12, 0.1, "#9a9a9a", "#707070");  // neck
  blob(0.48, 0.25, 0.19, 0.22, "#e2e2e2", "#8c8c8c"); // head
  blob(0.44, 0.32, 0.05, 0.07, "#ffffff", "#d8d8d8"); // nose
  return c;
}

function cssColor(name) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim().split(/\s+/);
  return v.map((n) => Number(n) / 255);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function Portrait({ src, depthSrc, alt }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      setFallback(true); // plain <img> instead
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let disposed = false;
    let visible = true;

    const compile = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {};
    ["uImage", "uDepth", "uPointer", "uReveal", "uAccent", "uPaper"].forEach(
      (n) => (u[n] = gl.getUniformLocation(prog, n))
    );

    const texture = (unit, source) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Pointer state, all in the same -1..1 space.
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let lastMove = 0;

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)));
      target.y = Math.max(-1, Math.min(1, -(e.clientY - cy) / (window.innerHeight / 2)));
      lastMove = performance.now();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const setColors = () => {
      gl.uniform3fv(u.uAccent, cssColor("cobalt"));
      gl.uniform3fv(u.uPaper, cssColor("paper"));
    };

    // The load-in scan waits for the intro overlay to lift.
    let start = Infinity;
    whenIntroDone().then(() => (start = performance.now()));
    const frame = (now) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Drift gently when the visitor stops moving, so the portrait feels alive.
      if (!reduce && now - lastMove > 2500) {
        const t = now / 1000;
        target.x = Math.sin(t * 0.45) * 0.4;
        target.y = Math.sin(t * 0.31) * 0.17;
      }
      const k = reduce ? 1 : 0.07;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;

      const reveal = reduce ? 1 : Math.min(Math.max((now - start - 250) / 1500, 0), 1);
      const eased = 1 - Math.pow(1 - reveal, 3);

      gl.uniform2f(u.uPointer, current.x, current.y);
      gl.uniform1f(u.uReveal, eased);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    const ro = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(setColors);

    Promise.all([loadImage(src), depthSrc ? loadImage(depthSrc) : Promise.resolve(drawApproxDepth())])
      .then(([image, depth]) => {
        if (disposed) return;
        texture(0, image);
        texture(1, depth);
        gl.uniform1i(u.uImage, 0);
        gl.uniform1i(u.uDepth, 1);
        resize();
        setColors();
        io.observe(canvas);
        ro.observe(wrap);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        window.addEventListener("pointermove", onMove, { passive: true });
        raf = requestAnimationFrame(frame);
      })
      .catch(() => setFallback(true));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [src, depthSrc]);

  return (
    <div ref={wrapRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-[3px] bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${fallback ? "opacity-100" : "opacity-0"}`}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
}

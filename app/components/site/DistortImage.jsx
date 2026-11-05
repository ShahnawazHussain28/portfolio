"use client";
import { useEffect, useRef, useState } from "react";

/*
  An image drawn with WebGL so it can react: hovering sends a ripple out from
  the cursor, and fast scrolling bends it sideways with a brief colour split.
  Falls back to a plain <img> without WebGL.
*/
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uCover;     // uv scale for object-fit: cover
uniform vec2 uMouse;
uniform float uHover;
uniform float uVelocity;
uniform float uTime;
uniform float uAspect;

void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;

  // Scroll bend: the middle of the image lags behind its edges.
  float bend = sin(vUv.y * 3.14159) * uVelocity * 0.06;
  uv.x += bend;

  // Hover ripple from the cursor.
  vec2 d = (vUv - uMouse) * vec2(uAspect, 1.0);
  float dist = length(d);
  float wave = sin(dist * 38.0 - uTime * 6.0) * exp(-dist * 5.0);
  uv += normalize(d + 1e-5) * wave * 0.012 * uHover;

  // Gentle zoom on hover.
  uv = (uv - 0.5) * (1.0 - 0.05 * uHover) + 0.5;

  // Colour split only while scrolling fast; at rest or on hover the image stays sharp.
  float speed = abs(uVelocity);
  float split = smoothstep(0.2, 0.8, speed) * 0.007;
  float r = texture2D(uTex, uv + vec2(split, 0.0)).r;
  float g = texture2D(uTex, uv).g;
  float b = texture2D(uTex, uv - vec2(split, 0.0)).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}`;

export default function DistortImage({ src, alt, className = "" }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    const host = wrap.current;
    let disposed = false;
    const gl = c.getContext("webgl", { antialias: false });
    if (!gl) return setFallback(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (type, code) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, code);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    const U = { cover: u("uCover"), mouse: u("uMouse"), hover: u("uHover"), vel: u("uVelocity"), time: u("uTime"), aspect: u("uAspect") };

    let imgAspect = 1;
    let visible = false;
    let raf = 0;
    let hover = 0,
      hoverTarget = 0,
      vel = 0;
    const mouse = { x: 0.5, y: 0.5 };

    const resize = () => {
      if (disposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      c.width = Math.max(1, Math.round(width * dpr));
      c.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, c.width, c.height);
      const a = width / height;
      gl.uniform1f(U.aspect, a);
      // cover: shrink the uv range on the axis that overflows
      gl.uniform2f(U.cover, a > imgAspect ? 1 : a / imgAspect, a > imgAspect ? imgAspect / a : 1);
      draw(performance.now());
    };

    const draw = (now) => {
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform1f(U.hover, hover);
      gl.uniform1f(U.vel, vel);
      gl.uniform1f(U.time, now / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const frame = (now) => {
      raf = 0;
      const target = reduce ? 0 : Math.max(-1, Math.min(1, (window.__scrollVelocity || 0) / 40));
      vel += (target - vel) * 0.1;
      hover += (hoverTarget - hover) * 0.08;
      draw(now);
      const active = hover > 0.001 || hoverTarget > 0 || Math.abs(vel) > 0.001 || Math.abs(target) > 0.001;
      if (visible && active) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      if (reduce) return;
      hoverTarget = 1;
      kick();
    };
    const onLeave = () => {
      hoverTarget = 0;
      kick();
    };
    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
    };
    const onScroll = () => kick();

    const img = new Image();
    // The image can finish loading after this component has unmounted
    // (e.g. right after clicking into a project), so check before touching anything.
    img.onload = () => {
      if (disposed) return;
      imgAspect = img.width / img.height;
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resize();
    };
    img.onerror = () => !disposed && setFallback(true);
    img.src = src;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(c);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      img.onload = img.onerror = null;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src]);

  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <canvas ref={canvas} role="img" aria-label={alt} className="block h-full w-full" />
      )}
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { areaColors } from "./palette";

/*
  The tools I use, as physical blocks. They drop into the box when it scrolls
  into view; with a mouse you can grab and throw them. On touch screens a tap
  flicks a block instead, since dragging would fight scrolling. "Shake the box"
  works everywhere. The box grows to fit the blocks, so narrow screens get a
  taller box rather than an overflowing one.
*/

// Share of the box the blocks may cover; the rest is air so they can tumble.
const FILL = 0.62;

function fitHeight(container) {
  const els = container.querySelectorAll("[data-tool]");
  let area = 0;
  els.forEach((el) => (area += el.offsetWidth * el.offsetHeight));
  const needed = Math.ceil(area / (container.clientWidth * FILL));
  container.style.height = "";
  if (needed > container.clientHeight) container.style.height = `${needed}px`;
}
export default function ToolBox({ stack }) {
  const box = useRef(null);
  const api = useRef({ shake: () => {} });

  useEffect(() => {
    const container = box.current;
    let engine, raf, Matter;
    let started = false;
    let disposed = false;
    fitHeight(container);
    // Chip widths change once the display font loads; re-fit while still static.
    document.fonts?.ready.then(() => !started && !disposed && fitHeight(container));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // blocks stay in their static, wrapped layout

    const cleanups = [];

    const start = async () => {
      started = true;
      Matter = (await import("matter-js")).default;
      if (disposed) return;
      const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint, Query, Sleeping } = Matter;

      const W = container.clientWidth;
      const H = container.clientHeight;
      const els = Array.from(container.querySelectorAll("[data-tool]"));
      container.dataset.live = "true"; // switch blocks to absolute positioning

      // Sleeping lets settled blocks stop being solved, so a resting pile stays put.
      // Extra iterations keep a tall stack from creeping and twitching.
      engine = Engine.create({ gravity: { y: 1.1 }, enableSleeping: true, positionIterations: 10, velocityIterations: 8 });
      const wall = { isStatic: true, render: { visible: false } };
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + 50, W * 2, 100, wall),
        Bodies.rectangle(-50, H / 2, 100, H * 4, wall),
        Bodies.rectangle(W + 50, H / 2, 100, H * 4, wall),
      ]);

      const bodies = els.map((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const body = Bodies.rectangle(
          40 + Math.random() * (W - 80),
          -60 - i * 38,
          w,
          h,
          {
            chamfer: { radius: h / 2 },
            restitution: 0.12,
            friction: 0.6,
            frictionStatic: 1,
            frictionAir: 0.02,
            sleepThreshold: 40,
            angle: (Math.random() - 0.5) * 0.8,
          }
        );
        return { el, body, w, h };
      });
      Composite.add(engine.world, bodies.map((b) => b.body));

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const mouse = Mouse.create(container);
        // Let the page keep scrolling while the cursor is over the box.
        mouse.element.removeEventListener("wheel", mouse.mousewheel);
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
        Composite.add(engine.world, mc);
      } else {
        // Touch: a tap flicks the block under the finger up and sideways.
        const onTap = (e) => {
          const r = container.getBoundingClientRect();
          const point = { x: e.clientX - r.left, y: e.clientY - r.top };
          const [hit] = Query.point(bodies.map((b) => b.body), point);
          if (!hit) return;
          const side = point.x < hit.position.x ? 1 : -1;
          Sleeping.set(hit, false);
          Body.setVelocity(hit, { x: side * (4 + Math.random() * 6), y: -14 - Math.random() * 6 });
          Body.setAngularVelocity(hit, side * 0.15);
        };
        container.addEventListener("click", onTap);
        cleanups.push(() => container.removeEventListener("click", onTap));
      }

      api.current.shake = () => {
        bodies.forEach(({ body }) => {
          Sleeping.set(body, false);
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 22, y: -12 - Math.random() * 14 });
        });
      };

      // Fixed 60 Hz steps: Matter.js jitters when the step size varies with frame timing.
      const STEP = 1000 / 60;
      let last = performance.now();
      let acc = 0;
      const loop = (now) => {
        acc += Math.min(now - last, 100);
        last = now;
        while (acc >= STEP) {
          Engine.update(engine, STEP);
          acc -= STEP;
        }
        for (const { el, body, w, h } of bodies) {
          if (body.isSleeping) continue;
          el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) start();
      },
      { threshold: 0.35 }
    );
    io.observe(container);
    cleanups.push(() => io.disconnect());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
      if (engine && Matter) Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <div>
      <div
        ref={box}
        data-cursor="Drag"
        className="group/box relative h-[26rem] overflow-hidden rounded-[6px] border border-rule bg-surface md:h-[30rem]"
      >
        <ul className="flex flex-wrap content-end gap-2 p-4 group-data-[live=true]/box:block group-data-[live=true]/box:p-0" aria-label="Tools I use">
          {stack.flatMap((g) =>
            g.items.map((item) => {
              const c = areaColors[g.area];
              return (
                <li
                  key={item}
                  data-tool
                  className="inline-block select-none whitespace-nowrap rounded-full px-3.5 py-1.5 font-display text-base font-semibold tracking-tight group-data-[live=true]/box:absolute group-data-[live=true]/box:left-0 group-data-[live=true]/box:top-0 md:px-5 md:py-2.5 md:text-xl"
                  style={{ background: c.bg, color: c.fg, fontVariationSettings: "'wdth' 85" }}
                >
                  {item}
                </li>
              );
            })
          )}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-graphite">
          {stack.map((g) => (
            <li key={g.area} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: areaColors[g.area].bg }} aria-hidden="true" />
              {g.area}
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => api.current.shake()} className="link text-sm font-medium">
          Shake the box
        </button>
      </div>
    </div>
  );
}

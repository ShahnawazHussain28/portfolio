"use client";
import { useEffect, useRef } from "react";
import { areaColors } from "./palette";

/*
  The tools I use, as physical blocks. They drop into the box when it scrolls
  into view; with a mouse you can grab and throw them. "Shake the box" works
  everywhere, including touch screens where dragging would fight scrolling.
*/
export default function ToolBox({ stack }) {
  const box = useRef(null);
  const api = useRef({ shake: () => {} });

  useEffect(() => {
    const container = box.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // blocks stay in their static, wrapped layout

    let engine, runner, raf, Matter;
    let started = false;
    let disposed = false;
    const cleanups = [];

    const start = async () => {
      started = true;
      Matter = (await import("matter-js")).default;
      if (disposed) return;
      const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint } = Matter;

      const W = container.clientWidth;
      const H = container.clientHeight;
      const els = Array.from(container.querySelectorAll("[data-tool]"));
      container.dataset.live = "true"; // switch blocks to absolute positioning

      engine = Engine.create({ gravity: { y: 1.1 } });
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
          { chamfer: { radius: h / 2 }, restitution: 0.35, friction: 0.25, frictionAir: 0.012, angle: (Math.random() - 0.5) * 0.8 }
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
      }

      api.current.shake = () => {
        bodies.forEach(({ body }) =>
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 22, y: -12 - Math.random() * 14 })
        );
      };

      let last = performance.now();
      const loop = (now) => {
        const dt = Math.min(now - last, 32);
        last = now;
        Engine.update(engine, dt);
        for (const { el, body, w, h } of bodies) {
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
                  className="inline-block select-none whitespace-nowrap rounded-full px-5 py-2.5 font-display text-lg font-semibold tracking-tight group-data-[live=true]/box:absolute group-data-[live=true]/box:left-0 group-data-[live=true]/box:top-0 md:text-xl"
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

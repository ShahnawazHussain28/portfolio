"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, prefersReducedMotion } from "./gsap";

/*
  Project cards call expandTo(): the card's image grows from its spot on the
  page to fill the screen, then we navigate. When the new page mounts, the
  cover slides away.
*/
export function expandTo({ href, rect, image, bg }) {
  window.dispatchEvent(new CustomEvent("transition:expand", { detail: { href, rect, image, bg } }));
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const coverRef = useRef(null);
  const pending = useRef(null);

  useEffect(() => {
    const onExpand = (e) => {
      const { href, rect, image, bg } = e.detail;
      if (prefersReducedMotion()) return router.push(href);
      const el = coverRef.current;
      pending.current = href;
      gsap.killTweensOf(el);
      gsap.set(el, {
        display: "block",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 3,
        backgroundColor: bg,
        backgroundImage: image ? `url(${image})` : "none",
        yPercent: 0,
        opacity: 1,
      });
      gsap.to(el, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: 0.75,
        ease: "expo.inOut",
        onComplete: () => router.push(href),
      });
    };
    window.addEventListener("transition:expand", onExpand);
    return () => window.removeEventListener("transition:expand", onExpand);
  }, [router]);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    const el = coverRef.current;
    gsap.to(el, {
      yPercent: -100,
      duration: 0.8,
      delay: 0.15,
      ease: "expo.inOut",
      onComplete: () => gsap.set(el, { display: "none", yPercent: 0 }),
    });
  }, [pathname]);

  return (
    <div
      ref={coverRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[150] hidden bg-cover bg-center"
    />
  );
}

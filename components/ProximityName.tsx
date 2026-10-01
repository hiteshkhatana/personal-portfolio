"use client";

import { useEffect, useRef } from "react";

/** The name gets heavier where the pointer is: Unbounded's weight axis, driven by distance. */
export default function ProximityName({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>(".pl"));
    const MIN = 260, MAX = 900, RADIUS = 260;
    let centers: { x: number; y: number }[] = [];
    const cur = letters.map(() => MIN);
    let mx = -1e4, my = -1e4, raf = 0, running = false;

    const measure = () => {
      centers = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
      });
    };
    const loop = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const c = centers[i];
        const d = Math.hypot(c.x - mx, c.y - my);
        const f = Math.max(0, 1 - d / RADIUS);
        const target = MIN + (MAX - MIN) * f * f;
        const next = cur[i] + (target - cur[i]) * 0.14;
        if (Math.abs(next - cur[i]) > 0.4) moving = true;
        cur[i] = next;
        l.style.fontVariationSettings = `"wght" ${next.toFixed(0)}`;
      });
      if (moving) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const onMove = (e: PointerEvent) => {
      mx = e.pageX; my = e.pageY;
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
    };
    const t = setTimeout(measure, 300);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <span ref={ref} className="pname" aria-hidden="true">
      {lines.map((line, li) => (
        <span className="pname-line" key={li}>
          {line.split("").map((ch, i) => (
            <span className="pl" key={i} style={{ ["--i" as string]: li * 8 + i }}>{ch}</span>
          ))}
        </span>
      ))}
    </span>
  );
}

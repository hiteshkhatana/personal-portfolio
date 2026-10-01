"use client";

import { useEffect, useRef } from "react";

/** A trailing ring that grows over things you can act on and names the action. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ring.current!;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      el.dataset.on = "1";
      const t = (e.target as HTMLElement).closest<HTMLElement>("a,button,[data-cursor],input,textarea");
      el.dataset.hover = t ? "1" : "0";
      const txt = t?.dataset.cursor || "";
      if (label.current && label.current.textContent !== txt) label.current.textContent = txt;
      el.dataset.label = txt ? "1" : "0";
    };
    const onLeave = () => { el.dataset.on = "0"; };
    const loop = () => {
      const k = reduce ? 1 : 0.2;
      rx += (x - rx) * k; ry += (y - ry) * k;
      el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <div className="cursor-ring" />
      <span ref={label} className="cursor-label" />
    </div>
  );
}

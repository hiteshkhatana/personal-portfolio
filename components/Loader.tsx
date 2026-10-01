"use client";

import { useEffect, useState } from "react";

/** The one orchestrated moment: the index builds, then the page opens. */
export default function Loader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("hk-indexed")) {
      document.documentElement.classList.add("is-ready");
      setGone(true);
      return;
    }
    const total = 2400, dur = 1100, start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(total * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        document.documentElement.classList.add("is-ready");
        try { sessionStorage.setItem("hk-indexed", "1"); } catch {}
        setTimeout(() => setGone(true), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  return (
    <div className={`loader ${done ? "is-done" : ""}`} aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-mark">HK</span>
        <span className="loader-count">Indexing {n.toLocaleString("en-IN")} vectors</span>
        <span className="loader-bar"><i style={{ transform: `scaleX(${n / 2400})` }} /></span>
      </div>
    </div>
  );
}

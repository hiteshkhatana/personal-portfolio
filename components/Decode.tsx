"use client";

import { createElement, useEffect, useRef, useState } from "react";

const GLYPHS = "▖▗▘▙▚▛▜▝▞▟░▒▓<>/\\{}[]=+*#01";

/** Heading that decodes from vector noise the first time it scrolls into view. */
export default function Decode({
  text,
  as = "h2",
  className,
  id,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 650 + text.length * 14;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const settled = Math.floor(p * text.length);
          let s = "";
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (i < settled || ch === " ") s += ch;
            else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          setOut(s);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [text]);

  return createElement(
    as,
    { ref, className, id, "aria-label": text },
    <span aria-hidden="true">{out}</span>
  );
}

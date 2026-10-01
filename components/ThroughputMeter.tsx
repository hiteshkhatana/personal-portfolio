"use client";

import { useEffect, useRef, useState } from "react";

/** A simulated event stream running at Sensfrx's production rates. */
export default function ThroughputMeter() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [rate, setRate] = useState(21800);
  const [lat, setLat] = useState(184);
  const [flagged, setFlagged] = useState(0);
  const spike = useRef(0);
  const state = useRef({ rate: 21800 });

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now(), acc = 0, numT = 0;
    const history: number[] = Array.from({ length: 80 }, () => 21000 + Math.random() * 1500);
    type P = { x: number; y: number; v: number; risky: boolean; s: number };
    const ps: P[] = [];
    let flaggedCount = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const r = c.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); loop(last); } });
    io.observe(c);

    const css = getComputedStyle(document.documentElement);
    const cViolet = css.getPropertyValue("--violet").trim() || "#3E5C8A";
    const cAmber = css.getPropertyValue("--amber").trim() || "#B4471F";
    const cCyan = css.getPropertyValue("--cyan").trim() || "#1F5D50";
    const cLine = "rgba(29,28,25,0.16)";

    const step = (dt: number) => {
      // random walk inside the real production band, with optional spikes
      const s = state.current;
      const base = 20800 + Math.sin(performance.now() / 2400) * 900 + (Math.random() - 0.5) * 500;
      spike.current *= Math.pow(0.35, dt);
      s.rate = Math.max(20000, Math.min(25000, base + spike.current * 4200));

      const gate = w * 0.62;
      const spawn = (s.rate / 25000) * 120 * dt; // visual particles, not 1:1 with events
      acc += spawn;
      while (acc > 1) {
        acc -= 1;
        ps.push({ x: -4, y: 14 + Math.random() * (h * 0.58 - 20), v: 90 + Math.random() * 120 + spike.current * 80, risky: Math.random() < 0.04, s: 1 + Math.random() * 1.6 });
      }
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        const before = p.x;
        p.x += p.v * dt;
        if (before < gate && p.x >= gate && p.risky) flaggedCount++;
        if (p.x > w + 6) ps.splice(i, 1);
      }

      numT += dt;
      if (numT > 0.25) {
        numT = 0;
        history.push(s.rate); history.shift();
        const l = 150 + ((s.rate - 20000) / 5000) * 70 + Math.random() * 30;
        setRate(Math.round(s.rate));
        setLat(Math.round(Math.min(250, l)));
        setFlagged(flaggedCount);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const gate = w * 0.62, streamH = h * 0.58;
      // gate
      ctx.strokeStyle = cCyan; ctx.globalAlpha = 0.5; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(gate, 6); ctx.lineTo(gate, streamH); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = cCyan; ctx.font = "500 11px 'IBM Plex Sans', sans-serif";
      ctx.fillText("score", gate + 6, 16);
      // particles
      for (const p of ps) {
        const scored = p.x >= gate;
        ctx.fillStyle = p.risky && scored ? cAmber : cViolet;
        ctx.globalAlpha = scored ? (p.risky ? 1 : 0.35) : 0.75;
        const len = scored ? 2 : 6 + p.v * 0.03;
        ctx.fillRect(p.x - len, p.y, len, p.s);
        if (p.risky && scored) { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      // sparkline
      const top = streamH + 18, bh = h - top - 8;
      ctx.strokeStyle = cLine;
      ctx.beginPath(); ctx.moveTo(0, top + bh); ctx.lineTo(w, top + bh); ctx.stroke();
      ctx.beginPath();
      history.forEach((v, i) => {
        const x = (i / (history.length - 1)) * w;
        const y = top + bh - ((v - 19500) / 6000) * bh;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = cCyan; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
      ctx.lineTo(w, top + bh); ctx.lineTo(0, top + bh); ctx.closePath();
      ctx.fillStyle = "rgba(31,93,80,0.08)"; ctx.fill();
    };

    const loop = (now: number) => {
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      if (!reduce) raf = requestAnimationFrame(loop);
      else raf = window.setTimeout(() => loop(performance.now()), 500) as unknown as number;
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); clearTimeout(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div className="viz meter">
      <div className="viz-top">
        <p className="viz-title">The scoring path, simulated at production rates</p>
        <div className="viz-actions">
          <button className="chip" onClick={() => { spike.current = 1; }} data-cursor="Spike">Send a traffic spike</button>
        </div>
      </div>
      <div className="meter-stats">
        <div><strong>{rate.toLocaleString("en-IN")}</strong><span>events per second</span></div>
        <div><strong>{lat} ms</strong><span>end-to-end latency</span></div>
        <div><strong className="amber">{flagged}</strong><span>risky events flagged</span></div>
      </div>
      <canvas ref={canvas} className="meter-canvas" aria-label="Animated stream of user events passing a scoring gate" role="img" />
      <p className="viz-note">Rates and latency follow the real 20k–25k events/s and 150–250 ms band. The particles are a visual sample, not one per event.</p>
    </div>
  );
}

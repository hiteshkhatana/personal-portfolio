"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { title: "Source PDF", body: "Parsed page by page, keeping page and paragraph numbers." },
  { title: "Chunked by document structure", body: "", chips: ["Facts", "Issues", "Reasoning", "Final order"] },
  { title: "Top-K retrieval", body: "Embeddings in ChromaDB find the closest passages." },
  { title: "Support check", body: "Does the retrieved text actually answer the question?" },
];

const RUNS = {
  yes: { q: "What was held on the limitation issue?", out: "Answer, cited to p. 14, ¶ 22", ok: true },
  no: { q: "Who is the best cricketer?", out: "NOT FOUND", ok: false },
};

export default function GroundingFlow() {
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState<keyof typeof RUNS>("yes");
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = (which: keyof typeof RUNS) => {
    timer.current.forEach(clearTimeout);
    setRun(which);
    setStep(0);
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (let i = 1; i <= STAGES.length; i++) {
      timer.current.push(setTimeout(() => setStep(i), fast ? 0 : i * 520));
    }
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { start("yes"); io.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); timer.current.forEach(clearTimeout); };
  }, []);

  const r = RUNS[run];
  const finished = step >= STAGES.length;

  return (
    <div className="viz flow" ref={ref}>
      <div className="viz-top">
        <p className="viz-title">How an answer earns its citation</p>
        <div className="viz-actions">
          <button className={`chip ${run === "yes" ? "is-on" : ""}`} onClick={() => start("yes")}>Run a supported question</button>
          <button className={`chip ${run === "no" ? "is-on" : ""}`} onClick={() => start("no")}>Run an unsupported one</button>
        </div>
      </div>
      <p className="flow-q">“{r.q}”</p>
      <ol className="flow-stages" style={{ ["--p" as string]: Math.max(0, Math.min(step, STAGES.length)) / STAGES.length }}>
        {STAGES.map((s, i) => (
          <li key={s.title} className={step > i ? "is-done" : step === i ? "is-run" : ""}>
            <i aria-hidden="true" />
            <div>
              <strong>{s.title}</strong>
              {s.body && <span>{s.body}</span>}
              {s.chips && (
                <span className="flow-chips">
                  {s.chips.map((c, ci) => (
                    <em key={c} style={{ ["--ci" as string]: ci }}>{c}</em>
                  ))}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className={`flow-out ${finished ? "is-in" : ""} ${r.ok ? "is-ok" : "is-no"}`} aria-live="polite">
        {finished ? r.out : " "}
      </div>
      <p className="viz-note">Illustration of the pipeline. Questions and outputs are examples, not real data.</p>
    </div>
  );
}

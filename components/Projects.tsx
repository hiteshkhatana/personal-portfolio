"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { profile } from "@/data/profile";
import Decode from "./Decode";

function TiltCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    const el = ref.current!;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return (
    <button ref={ref} className={`card accent-${p.accent}`} onPointerMove={move} onPointerLeave={leave} onClick={onOpen} data-cursor="Open">
      <span className="card-glare" aria-hidden="true" />
      <span className="card-kind">{p.kind}, {p.year}</span>
      <span className="card-title">{p.title}</span>
      <span className="card-tagline">{p.tagline}</span>
      {p.metrics && (
        <span className="card-metrics">
          {p.metrics.slice(0, 2).map((m) => (
            <span key={m.label}><strong>{m.value}</strong><small>{m.label}</small></span>
          ))}
        </span>
      )}
      <span className="card-stack">{p.stack.slice(0, 5).join(" · ")}</span>
      <span className="card-open">Read the case study</span>
    </button>
  );
}

function Detail({ p, onClose }: { p: Project; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.article
        className={`modal accent-${p.accent}`} role="dialog" aria-modal="true" aria-labelledby={`m-${p.slug}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0, rotateX: 8 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <button ref={close} className="modal-close" onClick={onClose} aria-label="Close case study">Close</button>
        <p className="card-kind">{p.kind}, {p.year}</p>
        <h3 id={`m-${p.slug}`} className="modal-title">{p.title}</h3>
        <p className="modal-tagline">{p.tagline}</p>

        {p.metrics && (
          <div className="modal-metrics">
            {p.metrics.map((m) => <div key={m.label}><strong>{m.value}</strong><span>{m.label}</span></div>)}
          </div>
        )}

        <h4>The problem</h4>
        <p>{p.problem}</p>
        <h4>What I built</h4>
        <ul className="modal-list">{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
        {p.next && (<><h4>Next</h4><ul className="modal-list">{p.next.map((b) => <li key={b}>{b}</li>)}</ul></>)}
        <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <div className="modal-foot">
          {p.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">{l.label}</a>
          ))}
          {p.note && <p className="modal-note">{p.note}</p>}
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<string | null>(null);
  const current = projects.find((p) => p.slug === open);

  useEffect(() => {
    const on = (e: Event) => setOpen((e as CustomEvent<string>).detail);
    window.addEventListener("hk:project", on);
    return () => window.removeEventListener("hk:project", on);
  }, []);

  return (
    <section id="projects" className="section projects">
      <div className="section-head">
        <Decode text="Selected projects" />
        <p className="section-lede">Three systems, from a customer-facing SaaS to a production LLM pipeline. Open a card for the problem, what I built and the stack.</p>
      </div>

      <div className="cards">
        {projects.map((p) => (
          <TiltCard key={p.slug} p={p} onOpen={() => setOpen(p.slug)} />
        ))}
      </div>
      <p className="projects-more">
        More on <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>.
      </p>

      <AnimatePresence>{current && <Detail p={current} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

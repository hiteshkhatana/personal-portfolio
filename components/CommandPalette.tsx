"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { sections } from "./Nav";

type Item = { label: string; hint: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const items: Item[] = useMemo(
    () => [
      ...sections.map((s) => ({ label: s.label, hint: "Section", run: go(s.id) })),
      ...projects.map((p) => ({
        label: p.title,
        hint: "Project",
        run: () => {
          go("projects")();
          setTimeout(() => window.dispatchEvent(new CustomEvent("hk:project", { detail: p.slug })), 500);
        },
      })),
      {
        label: "Copy email address",
        hint: profile.email,
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          setToast("Email copied");
          setTimeout(() => setToast(""), 1800);
        },
      },
      { label: "Download résumé", hint: "PDF", run: () => window.open(profile.resume, "_blank") },
      { label: "Open GitHub", hint: "github.com/hiteshkhatana", run: () => window.open(profile.github, "_blank") },
      { label: "Open LinkedIn", hint: "LinkedIn", run: () => window.open(profile.linkedin, "_blank") },
    ],
    []
  );

  const shown = items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hk:palette", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("hk:palette", onOpen); };
  }, []);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => input.current?.focus(), 30); }
  }, [open]);

  const choose = (i: Item) => { setOpen(false); i.run(); };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="palette-backdrop" onClick={() => setOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="palette" role="dialog" aria-modal="true" aria-label="Jump to"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              <input
                ref={input} value={q} placeholder="Jump to a section, project or action"
                aria-label="Search sections, projects and actions"
                onChange={(e) => { setQ(e.target.value); setSel(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                  if (e.key === "Enter" && shown[sel]) choose(shown[sel]);
                }}
              />
              <ul role="listbox">
                {shown.map((i, n) => (
                  <li key={i.label} role="option" aria-selected={n === sel}>
                    <button className={n === sel ? "is-sel" : ""} onMouseEnter={() => setSel(n)} onClick={() => choose(i)}>
                      <span>{i.label}</span><small>{i.hint}</small>
                    </button>
                  </li>
                ))}
                {!shown.length && <li className="palette-empty">Nothing matches “{q}”. Try a section name like “Projects”.</li>}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { corpus, expandQuery, extractiveAnswer, presets, retrieve, SUPPORT_THRESHOLD, type Hit } from "@/data/corpus";
import Decode from "./Decode";

type Phase = "idle" | "retrieving" | "checking" | "answering" | "done" | "notfound";
type Sentence = { text: string; cite: string };

const STEPS: { key: Phase; label: string }[] = [
  { key: "retrieving", label: "Retrieve top 4" },
  { key: "checking", label: "Check support" },
  { key: "answering", label: "Answer with citations" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function highlight(text: string, terms: string[]) {
  if (!terms.length) return text;
  const parts = text.split(/(\s+)/);
  return parts.map((w, i) => {
    const t = w.toLowerCase().replace(/[^a-z0-9@+]/g, "");
    const hit = terms.some((term) => term.length > 2 && t.startsWith(term));
    return hit ? <mark key={i}>{w}</mark> : w;
  });
}

export default function AskResume() {
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [hits, setHits] = useState<Hit[]>([]);
  const [answer, setAnswer] = useState<Sentence[]>([]);
  const [typed, setTyped] = useState(0);
  const [hoverCite, setHoverCite] = useState<string | null>(null);
  const run = useRef(0);

  const total = answer.reduce((a, s) => a + s.text.length, 0);

  const ask = async (question: string) => {
    const query = question.trim();
    if (!query) return;
    const id = ++run.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAsked(query);
    setAnswer([]);
    setTyped(0);
    setHits([]);
    setPhase("retrieving");

    const preset = presets.find((p) => p.q === query);
    let found = retrieve(query, 4);
    let ans: Sentence[] = preset ? preset.answer : extractiveAnswer(query, found);

    // Make sure every cited passage is in the retrieved list
    if (ans.length) {
      const cited = Array.from(new Set(ans.map((a) => a.cite)));
      const { expanded } = expandQuery(query);
      cited.forEach((cid) => {
        if (!found.some((h) => h.chunk.id === cid)) {
          const chunk = corpus.find((c) => c.id === cid)!;
          found = [...found.slice(0, 3), { chunk, score: SUPPORT_THRESHOLD + 0.4, terms: expanded }];
        }
      });
      found.sort((a, b) => b.score - a.score);
    }

    await wait(reduce ? 0 : 450);
    if (id !== run.current) return;
    setHits(found);
    setPhase("checking");
    await wait(reduce ? 0 : 650);
    if (id !== run.current) return;

    if (!ans.length) { setPhase("notfound"); return; }
    setAnswer(ans);
    setPhase("answering");
    if (reduce) { setTyped(Infinity); setPhase("done"); }
  };

  // Stream the answer in, character by character
  useEffect(() => {
    if (phase !== "answering") return;
    if (typed >= total) { setPhase("done"); return; }
    const t = setTimeout(() => setTyped((n) => n + 4), 16);
    return () => clearTimeout(t);
  }, [phase, typed, total]);

  const citeNum = (cid: string) => hits.findIndex((h) => h.chunk.id === cid) + 1;
  const citedIds = new Set(answer.map((a) => a.cite));
  const maxScore = Math.max(...hits.map((h) => h.score), SUPPORT_THRESHOLD * 2);
  const stepIndex = STEPS.findIndex((s) => s.key === phase);

  let shown = typed;
  return (
    <section id="ask" className="section ask">
      <div className="section-head">
        <Decode text="Try a RAG demo: ask my résumé" />
        <p className="section-lede">
          A small, working example of the LLM work I do. It retrieves passages from my résumé, answers only from them,
          and cites every sentence. Ask it something the résumé can&apos;t support and it says NOT FOUND instead of guessing.
        </p>
      </div>

      <div className="ask-grid">
        <div className="console">
          <form
            className="console-input"
            onSubmit={(e) => { e.preventDefault(); ask(q); }}
          >
            <label htmlFor="ask-q" className="sr-only">Your question</label>
            <input
              id="ask-q" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Ask about my work or stack" autoComplete="off" maxLength={140}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={!q.trim()}>Ask</button>
          </form>

          <div className="chips" aria-label="Suggested questions">
            {presets.map((p) => (
              <button key={p.q} className="chip" onClick={() => { setQ(p.q); ask(p.q); }}>
                {p.q}
              </button>
            ))}
          </div>

          <ol className="pipeline" aria-label="Pipeline status">
            {STEPS.map((s, i) => {
              const state =
                phase === "idle" ? "" :
                phase === "notfound" ? (i < 2 ? (i === 1 ? "is-fail" : "is-done") : "") :
                phase === "done" ? "is-done" :
                i < stepIndex ? "is-done" : i === stepIndex ? "is-run" : "";
              return <li key={s.key} className={state}><i />{s.label}</li>;
            })}
          </ol>

          <div className="answer" aria-live="polite">
            {phase === "idle" && (
              <p className="answer-empty">Pick a question above or type your own. Try one it can&apos;t answer, too.</p>
            )}
            {asked && phase !== "idle" && <p className="answer-q">{asked}</p>}
            {(phase === "retrieving" || phase === "checking") && (
              <p className="answer-wait">{phase === "retrieving" ? `Searching ${corpus.length} passages…` : "Checking the passages support an answer…"}</p>
            )}
            {(phase === "answering" || phase === "done") && (
              <p className="answer-text">
                {answer.map((s, i) => {
                  const take = Math.max(0, Math.min(s.text.length, shown));
                  shown -= s.text.length;
                  if (take <= 0) return null;
                  const n = citeNum(s.cite);
                  return (
                    <span key={i}>
                      {s.text.slice(0, take)}
                      {take === s.text.length && (
                        <button
                          className="cite" aria-label={`Source ${n}`}
                          onMouseEnter={() => setHoverCite(s.cite)} onMouseLeave={() => setHoverCite(null)}
                          onFocus={() => setHoverCite(s.cite)} onBlur={() => setHoverCite(null)}
                          onClick={() => document.getElementById(`src-${s.cite}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
                        >
                          {n}
                        </button>
                      )}{" "}
                    </span>
                  );
                })}
              </p>
            )}
            {phase === "notfound" && (
              <motion.div className="notfound" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <strong>NOT FOUND</strong>
                <span>Nothing in my résumé supports an answer to that, so it won&apos;t make one up. My production RAG systems follow the same rule.</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="sources">
          <p className="sources-title">Retrieved passages</p>
          {!hits.length && (
            <p className="sources-empty">
              {phase === "notfound" ? "No passage scored high enough." : "Passages appear here, ranked by relevance score."}
            </p>
          )}
          <ul>
            <AnimatePresence initial={false}>
              {hits.map((h, i) => {
                const cited = citedIds.has(h.chunk.id);
                return (
                  <motion.li
                    key={asked + h.chunk.id} id={`src-${h.chunk.id}`}
                    className={`source ${cited ? "is-cited" : ""} ${hoverCite === h.chunk.id ? "is-hover" : ""}`}
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="source-head">
                      <span className="source-n">{i + 1}</span>
                      <span className="source-ref">{h.chunk.ref}</span>
                      <span className="source-score">{h.score.toFixed(2)}</span>
                    </div>
                    <span className="source-bar">
                      <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: Math.min(1, h.score / maxScore) }} transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }} />
                    </span>
                    <p>{highlight(h.chunk.text, h.terms)}</p>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
          <p className="sources-note">
            Runs in your browser with BM25 keyword scoring over {corpus.length} résumé passages. My production systems use embeddings and an LLM; the grounding rule is the same.
          </p>
        </div>
      </div>
    </section>
  );
}

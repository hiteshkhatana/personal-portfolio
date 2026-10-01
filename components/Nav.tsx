"use client";

import { useEffect, useState } from "react";

export const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "work", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "ask", label: "RAG demo" },
  { id: "contact", label: "Contact" },
];

export const openPalette = () => window.dispatchEvent(new Event("hk:palette"));

export default function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    const top = document.getElementById("top");
    if (top) io.observe(top);
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#top" className="nav-mark" aria-label="Hitesh Khatana, back to top">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="7" cy="9" r="2.4" fill="var(--violet)" />
          <circle cx="24" cy="7" r="2" fill="var(--violet)" />
          <circle cx="26" cy="24" r="2.4" fill="var(--amber)" />
          <circle cx="9" cy="25" r="2" fill="var(--violet)" />
          <circle cx="16" cy="16" r="3" fill="var(--cyan)" />
          <path d="M16 16 7 9M16 16l10 8M16 16 9 25" stroke="var(--cyan)" strokeWidth="1" opacity=".7" />
        </svg>
        <span>Hitesh Khatana</span>
      </a>
      <nav aria-label="Sections">
        <ul className="nav-links">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? "is-active" : ""} aria-current={active === s.id ? "true" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button className="nav-search" onClick={openPalette} data-cursor="Jump">
        <span className="nav-search-label">Jump to</span>
        <span className="nav-search-menu">Menu</span>
        <kbd>{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>
    </header>
  );
}

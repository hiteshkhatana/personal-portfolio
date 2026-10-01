"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import Decode from "./Decode";
import Magnetic from "./Magnetic";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="section contact">
      <Decode text="Let's build something." className="contact-title" />
      <p className="contact-lede">
        I&apos;m open to full-stack and GenAI engineering roles and can start now. Email is the best way to reach me.
      </p>

      <div className="contact-email">
        <a href={`mailto:${profile.email}`} className="email-link" data-cursor="Write">{profile.email}</a>
        <Magnetic>
          <button className={`btn btn-primary ${copied ? "is-copied" : ""}`} onClick={copy}>
            {copied ? "Copied" : "Copy email"}
          </button>
        </Magnetic>
      </div>

      <ul className="contact-links">
        <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
        <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href={profile.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a></li>
        <li><a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}>{profile.phone}</a></li>
      </ul>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name}. {profile.location}.</p>
        <p>Built with Next.js and three.js.<span className="kbd-hint"> Press Ctrl K or ⌘ K to jump anywhere.</span></p>
      </footer>
    </section>
  );
}

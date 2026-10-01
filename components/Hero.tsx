"use client";

import dynamic from "next/dynamic";
import { profile, proof } from "@/data/profile";
import ProximityName from "./ProximityName";
import Magnetic from "./Magnetic";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  return (
    <section id="top" className="hero">
      <HeroScene />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-status reveal" style={{ ["--d" as string]: "0ms" }}>
          <span className="pulse-dot" aria-hidden="true" />
          {profile.status}
        </p>
        <h1 className="hero-name" aria-label={profile.name}>
          <ProximityName lines={[profile.firstName, profile.lastName]} />
        </h1>
        <p className="hero-headline reveal" style={{ ["--d" as string]: "380ms" }}>{profile.headline}</p>
        <p className="hero-intro reveal" style={{ ["--d" as string]: "480ms" }}>{profile.intro}</p>
        <div className="hero-actions reveal" style={{ ["--d" as string]: "580ms" }}>
          <Magnetic>
            <a href="#projects" className="btn btn-primary">See my work</a>
          </Magnetic>
          <Magnetic>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">Download résumé</a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost">Get in touch</a>
          </Magnetic>
        </div>
        <ul className="hero-proof reveal" style={{ ["--d" as string]: "700ms" }} aria-label="At a glance">
          {proof.map((p) => (
            <li key={p.label}><strong>{p.value}</strong><span>{p.label}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

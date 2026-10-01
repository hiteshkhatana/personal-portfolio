import Image from "next/image";
import { about, capabilities } from "@/data/profile";
import Decode from "./Decode";

export default function Capabilities() {
  return (
    <section id="about" className="section about">
      <div className="about-intro">
        <Image
          src={about.photo}
          alt={about.photoAlt}
          width={953}
          height={1244}
          sizes="(max-width: 760px) 70vw, 320px"
          className="about-photo"
        />
        <div>
          <div className="section-head">
            <Decode text="What I do" />
          </div>
          {about.text.map((t) => <p key={t} className="about-text">{t}</p>)}
          <p className="about-text about-lede">
            I build the whole product, and I know how to add LLM features to it without making it unreliable.
          </p>
        </div>
      </div>
      <ul className="caps">
        {capabilities.map((c, i) => (
          <li key={c.title} className="cap">
            <span className="cap-n">0{i + 1}</span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <small>Seen in: {c.proof}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { skillGroups, skills } from "@/data/skills";
import Decode from "./Decode";

/** Plain, scannable skill groups. Recruiters skim; make skimming work. */
export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="section-head">
        <Decode text="Skills" />
        <p className="section-lede">What I use day to day, grouped by where it sits in a product.</p>
      </div>
      <div className="skill-groups">
        {skillGroups.map((g) => (
          <div key={g.id} className="skill-group-card" style={{ ["--c" as string]: g.color }}>
            <h3><i aria-hidden="true" />{g.label}</h3>
            <ul>
              {skills.filter((s) => s.group === g.id).map((s) => <li key={s.name}>{s.name}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

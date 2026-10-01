import { awards, education, roles } from "@/data/profile";
import Decode from "./Decode";
import GroundingFlow from "./GroundingFlow";
import ThroughputMeter from "./ThroughputMeter";

export default function Experience() {
  return (
    <section id="work" className="section work">
      <div className="section-head">
        <Decode text="Experience" />
        <p className="section-lede">
          A real-time SaaS where events had to be fast, then a GenAI platform where answers had to be right.
        </p>
      </div>

      <ol className="timeline">
        {roles.map((r) => (
          <li key={r.id} className="role">
            <div className="role-meta">
              <span className="role-period">{r.period}</span>
              <h3 className="role-org">{r.org}</h3>
              <p className="role-title">{r.title}</p>
              <p className="role-place">{r.place}</p>
            </div>
            <div className="role-body">
              <p className="role-context">{r.context}</p>
              <ul className="role-points">
                {r.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <ul className="tags" aria-label="Stack">
                {r.stack.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="role-viz">
              {r.visual === "grounding" ? <GroundingFlow /> : <ThroughputMeter />}
            </div>
          </li>
        ))}
      </ol>

      <div className="extras">
        <div className="extra">
          <h3>Recognition</h3>
          <ul>
            {awards.map((a) => (
              <li key={a.title}><strong>{a.title}</strong><span>{a.org}, {a.year}</span></li>
            ))}
          </ul>
        </div>
        <div className="extra">
          <h3>Education</h3>
          <ul>
            <li><strong>{education.degree}</strong><span>{education.school}, {education.period}</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

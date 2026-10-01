// ──────────────────────────────────────────────────────────────
//  Everything personal lives here. Edit this file, not the components.
// ──────────────────────────────────────────────────────────────

export const profile = {
  name: "Hitesh Khatana",
  firstName: "Hitesh",
  lastName: "Khatana",
  role: "Full-stack engineer who ships LLM features to production",
  location: "New Delhi, India",
  email: "hiteshkhatana1454@gmail.com",
  phone: "+91-96674-53353",
  github: "https://github.com/hiteshkhatana",
  linkedin: "https://linkedin.com/in/hitesh-khatana-133074141",
  resume: "/HiteshKhatana_Resume.pdf",
  site: "https://hiteshkhatana.com",
  status: "Open to full-stack and GenAI engineering roles",
  headline: "Full-stack engineer who ships LLM-powered products to production.",
  intro:
    "4+ years building complete products: React and Next.js frontends, Node.js, Django and FastAPI backends, real-time pipelines at 25k events a second, and RAG systems that give grounded, cited answers instead of guesses.",
};

export const about = {
  photo: "/hitesh.jpg",
  photoAlt: "Portrait of Hitesh Khatana",
  text: [
    "Hi, I'm Hitesh, a full-stack engineer based in New Delhi.",
    "For four years I've built products end to end: the customer-facing dashboard, the backend behind it, and most recently the LLM layer on top. I like work where the answer has to be right and the system has to stay up.",
  ],
};

/** Numbers shown under the hero. Keep to facts you can defend in an interview. */
export const proof = [
  { value: "4+ yrs", label: "building production systems" },
  { value: "25k/s", label: "events scored in real time" },
  { value: "250+", label: "customer sites on my backend" },
  { value: "RAG", label: "shipped with citations and guardrails" },
];

/** The three things a recruiter should walk away knowing. */
export const capabilities = [
  {
    title: "Full-stack product engineering",
    body: "React and Next.js frontends, Node.js, Django and FastAPI backends, REST APIs, auth, and multi-tenant SaaS. I take a feature from database schema to the screen the customer uses.",
    proof: "EduLead AI, Sensfrx dashboard",
  },
  {
    title: "LLM and RAG integration",
    body: "Retrieval, embeddings, prompt design and guardrails, so an LLM feature answers from your data, cites its source and says “not found” instead of making things up. Hosted or self-hosted models.",
    proof: "Offline RAG platform, EduLead AI",
  },
  {
    title: "Systems that hold up in production",
    body: "Kafka, Redis, Cassandra and Elasticsearch pipelines scoring 20–25k events per second at 150–250 ms. Docker, CI, automated tests and monitoring so it stays up.",
    proof: "Sensfrx fraud platform",
  },
];

export type Role = {
  id: string;
  title: string;
  org: string;
  place: string;
  period: string;
  context: string;
  points: string[];
  stack: string[];
  visual: "grounding" | "throughput";
};

export const roles: Role[] = [
  {
    id: "dhc",
    title: "Full-Stack Engineer (Assistant Programmer)",
    org: "Delhi High Court",
    place: "New Delhi",
    period: "Jan 2026 – Sep 2026",
    context:
      "Built a self-hosted GenAI platform under strict data-residency rules: no cloud AI APIs, everything on in-house hardware. I owned it end to end.",
    points: [
      "Built an offline RAG system that answers questions across thousands of legal PDFs and cites the exact page and paragraph.",
      "Owned the whole pipeline: PDF parsing, chunking, embeddings, vector retrieval, prompting, and the REST APIs that plug it into existing workflows.",
      "Chunked documents by their structure (facts, issues, reasoning, final order) so the reasoning on one issue stays intact instead of being cut at a fixed length.",
      "Cut hallucinations: the system answers NOT FOUND unless the source text supports it, and every case name and page reference is checked against the source before it is shown.",
      "Added a question regression suite that logs the sources behind every answer, so any response can be audited later.",
    ],
    stack: ["Node.js", "React", "ChromaDB", "Ollama", "gemma3:12b"],
    visual: "grounding",
  },
  {
    id: "sensfrx",
    title: "Associate Product Software Engineer",
    org: "SecureLayer7 / Sensfrx",
    place: "Pune",
    period: "May 2022 – Nov 2025",
    context:
      "A real-time fraud detection SaaS protecting 250+ customer websites. I worked across ML, DevOps and QA teams.",
    points: [
      "Built and maintained the backend in Django and Node.js.",
      "Owned the real-time scoring path: 20k–25k user activity events per second at 150–250 ms end-to-end latency.",
      "Kept it fast with Kafka and Redis between services, Elasticsearch and Kibana for monitoring, MySQL and Cassandra for activity storage.",
      "Built the JavaScript tracking pixel on client websites and the dashboard customers used to read fraud events and risk scores, owning the flow from browser to backend to UI.",
    ],
    stack: ["Django", "Node.js", "Kafka", "Redis", "Elasticsearch", "Cassandra"],
    visual: "throughput",
  },
];

export const awards = [
  { title: "Hall of Fame Award", org: "SecureLayer7 / Sensfrx", year: "2024" },
  { title: "Star Performer Award", org: "SecureLayer7 / Sensfrx", year: "2023" },
];

export const education = {
  school: "Maharshi Dayanand University, Rohtak",
  degree: "B.Tech in Computer Science & Engineering",
  period: "2016 – 2020",
};

// The "Ask my résumé" demo retrieves from these passages only.
// It runs entirely in the browser: no API, no model, no network.
// Add a chunk here whenever you add something to your résumé.

export type Chunk = { id: string; ref: string; text: string };

export const corpus: Chunk[] = [
  { id: "sum", ref: "Summary", text: "Full-stack engineer with 4+ years building production systems end to end, from real-time backends at 20k–25k events per second and customer-facing dashboards to self-hosted generative AI platforms. Owns products across the stack: API design, data pipelines, frontend, LLM integration, testing and containerized deployment." },
  { id: "av", ref: "Availability", text: "Left the Delhi High Court in September 2026 and is open to full-stack and GenAI engineering roles in the private sector. Available to start now." },
  { id: "dhc1", ref: "Offline RAG ¶1", text: "Owned an offline GenAI platform end to end at the Delhi High Court from January to September 2026, where data-residency rules prohibit cloud AI APIs. Built an offline RAG system that answers questions across thousands of legal PDFs with the exact page and paragraph cited, using Node.js, React, ChromaDB, Ollama and gemma3:12b." },
  { id: "dhc2", ref: "Offline RAG ¶2", text: "Owned the full pipeline: PDF parsing, semantic chunking, embeddings, vector retrieval, prompting, and the REST APIs that plug the system into existing workflows." },
  { id: "dhc3", ref: "Offline RAG ¶3", text: "Improved retrieval relevance with structure-aware chunking by facts, issues, reasoning and final order, so the reasoning on one issue stays intact instead of being cut at a fixed length." },
  { id: "dhc4", ref: "Offline RAG ¶4", text: "Cut hallucinations by enforcing grounding: the system returns NOT FOUND unless the source text supports the answer, and every case name and page reference is verified against the source before display." },
  { id: "dhc5", ref: "Offline RAG ¶5", text: "Ran a question regression suite across different query types, logging sources per query so any answer can be audited later." },
  { id: "sfx1", ref: "Sensfrx ¶1", text: "Built and maintained the backend of a real-time fraud detection SaaS serving 250+ customer websites using Django and Node.js, from May 2022 to November 2025 at SecureLayer7 in Pune." },
  { id: "sfx2", ref: "Sensfrx ¶2", text: "Owned the real-time scoring path, handling 20k–25k user activity events per second at 150–250 ms end-to-end latency." },
  { id: "sfx3", ref: "Sensfrx ¶3", text: "Kept the pipeline fast at high volume using Kafka and Redis between services, Elasticsearch and Kibana for monitoring, and MySQL and Cassandra for activity storage." },
  { id: "sfx4", ref: "Sensfrx ¶4", text: "Built the customer-facing dashboard for fraud events and risk scores, and the JavaScript tracking pixel that collects user activity from client websites, owning the flow from browser to backend to UI." },
  { id: "edu1", ref: "EduLead AI ¶1", text: "EduLead AI is a full-stack multi-tenant B2B SaaS platform where coaching institutes deploy an LLM chatbot grounded in their own documents. It uses a tenant-isolated RAG pipeline on PostgreSQL and pgvector with all-MiniLM-L6-v2 embeddings and local Qwen3 inference via Hugging Face Transformers." },
  { id: "edu2", ref: "EduLead AI ¶2", text: "Designed a ContextBuilder for prompt construction and JWT and RBAC auth enforcing tenant-scoped retrieval end to end." },
  { id: "edu3", ref: "EduLead AI ¶3", text: "Shipped a Next.js admin dashboard for knowledge-base management and a pytest suite covering auth, tenant isolation and RAG retrieval with a mocked AI service. Built with Next.js, FastAPI, PostgreSQL, pgvector and Qwen3." },
  { id: "edu4", ref: "EduLead AI ¶4", text: "Roadmap: RAG evaluation with Recall@K and groundedness, agentic lead-scoring workflows, and AWS plus Terraform deployment." },
  { id: "sk1", ref: "Skills: GenAI", text: "GenAI and LLM systems: RAG, prompt engineering, embeddings, semantic and vector search, chunking strategy, top-K retrieval, hallucination mitigation, citation-grounded generation, Hugging Face Transformers, PyTorch, sentence-transformers, Ollama, Qwen3, Gemma 3, Llama 3.2, on-premise offline LLM deployment, RAG evaluation." },
  { id: "sk2", ref: "Skills: Backend", text: "Backend and APIs: Python, JavaScript, SQL, Django, FastAPI, Node.js, REST APIs, microservices, multi-tenant SaaS, JWT auth, RBAC, Kafka, real-time event processing. Frontend: Next.js, React, TypeScript, admin and analytics dashboards, client-side tracking pixels." },
  { id: "sk3", ref: "Skills: Data & Infra", text: "Data, search and infrastructure: PostgreSQL, pgvector, ChromaDB, MySQL, Cassandra, SQLite, SQLAlchemy, Alembic, Redis, Elasticsearch, Kibana, Docker, Docker Compose, AWS EC2 RDS S3 SQS CloudWatch, GitHub Actions CI/CD, Git, Linux, pytest, pdfplumber." },
  { id: "ed", ref: "Education", text: "B.Tech in Computer Science and Engineering from Maharshi Dayanand University, Rohtak, 2016 to 2020." },
  { id: "aw", ref: "Awards", text: "Received the Hall of Fame Award in 2024 and the Star Performer Award in 2023 at SecureLayer7 Sensfrx." },
  { id: "ct", ref: "Contact", text: "Based in New Delhi, India. Reach Hitesh by email at hiteshkhatana1454@gmail.com or phone +91-96674-53353." },
];

export type Preset = { q: string; answer: { text: string; cite: string }[] };

// Hand-written answers for the suggested questions. Every sentence cites a chunk.
export const presets: Preset[] = [
  {
    q: "Have you built LLM and RAG systems?",
    answer: [
      { text: "Yes. I built an offline RAG system that answers questions across thousands of PDFs and cites the exact page and paragraph.", cite: "dhc1" },
      { text: "It ran only on in-house hardware because cloud AI APIs weren't allowed.", cite: "dhc1" },
      { text: "I owned all of it: PDF parsing, chunking, embeddings, retrieval, prompting and the REST APIs.", cite: "dhc2" },
    ],
  },
  {
    q: "Are you available to join?",
    answer: [
      { text: "Yes. I left the Delhi High Court in September 2026 and I'm open to full-stack and GenAI engineering roles.", cite: "av" },
    ],
  },
  {
    q: "How do you stop an LLM from hallucinating?",
    answer: [
      { text: "It answers NOT FOUND unless the source text supports the answer.", cite: "dhc4" },
      { text: "Every case name and page reference is checked against the source before it is shown.", cite: "dhc4" },
      { text: "Chunks follow document structure, so the reasoning on an issue isn't split mid-argument.", cite: "dhc3" },
    ],
  },
  {
    q: "What's the biggest scale you've worked at?",
    answer: [
      { text: "20k–25k user activity events per second, scored at 150–250 ms end to end.", cite: "sfx2" },
      { text: "That was the real-time path of a fraud SaaS serving 250+ websites.", cite: "sfx1" },
      { text: "Kafka and Redis sat between services to keep it fast at that volume.", cite: "sfx3" },
    ],
  },
  {
    q: "Have you built multi-tenant SaaS?",
    answer: [
      { text: "Yes. EduLead AI lets each coaching institute run a chatbot grounded in its own documents.", cite: "edu1" },
      { text: "JWT and RBAC auth scope retrieval to the tenant end to end.", cite: "edu2" },
      { text: "A pytest suite checks tenant isolation along with auth and retrieval.", cite: "edu3" },
    ],
  },
  { q: "What's your favourite pizza topping?", answer: [] },
];

// ── Retrieval ────────────────────────────────────────────────

const STOP = new Set(
  "a an the and or of to in on for with by at from is are was were be been do does did you your yours i me my we our it its this that these those what which who whom how why when where have has had can could would should will just about into than then so as not no any all also very more most".split(" ")
);

const SYN: Record<string, string[]> = {
  ai: ["genai", "llm", "rag"],
  hallucinate: ["grounding", "verified", "found"],
  hallucination: ["grounding", "verified", "found"],
  hallucinat: ["grounding", "verified", "found"],
  court: ["judgment", "legal"],
  legal: ["judgment", "court"],
  scale: ["second", "events", "latency"],
  fast: ["latency", "second"],
  speed: ["latency"],
  tenant: ["multitenant", "isolation"],
  saas: ["multitenant", "tenant"],
  study: ["university", "btech"],
  degree: ["university", "btech"],
  college: ["university"],
  education: ["university", "btech"],
  award: ["fame", "performer"],
  contact: ["email", "phone"],
  reach: ["email", "phone"],
  live: ["delhi", "based"],
  located: ["delhi", "based"],
  available: ["open", "roles", "start"],
  availability: ["open", "roles", "start"],
  join: ["open", "roles", "start"],
  hire: ["open", "roles", "start"],
  notice: ["open", "start"],
  rag: ["retrieval", "embeddings", "grounding"],
  fraud: ["sensfrx", "risk"],
  database: ["postgresql", "cassandra", "mysql", "chromadb"],
  frontend: ["react", "nextjs", "dashboard"],
  test: ["pytest", "regression", "suite"],
  testing: ["pytest", "regression", "suite"],
  vector: ["embeddings", "pgvector", "chromadb"],
  llm: ["ollama", "gemma", "qwen3"],
  model: ["ollama", "gemma", "qwen3", "llm"],
  experience: ["years", "production"],
};

function stem(w: string) {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/next\.js/g, "nextjs")
    .replace(/node\.js/g, "nodejs")
    .replace(/multi-tenant/g, "multitenant")
    .replace(/b\.tech/g, "btech")
    .replace(/[^a-z0-9@+]+/g, " ")
    .split(" ")
    .filter((w) => w && !STOP.has(w))
    .map(stem);
}

const docs = corpus.map((c) => ({ ...c, toks: tokenize(c.text + " " + c.ref) }));
const avgLen = docs.reduce((a, d) => a + d.toks.length, 0) / docs.length;
const df = new Map<string, number>();
docs.forEach((d) => new Set(d.toks).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
const idf = (t: string) => {
  const n = df.get(t) || 0;
  return Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
};

export type Hit = { chunk: Chunk; score: number; terms: string[] };

export function expandQuery(q: string): { core: string[]; expanded: string[] } {
  const core = Array.from(new Set(tokenize(q)));
  const extra = core.flatMap((t) => (SYN[t] || []).map(stem));
  return { core, expanded: Array.from(new Set([...core, ...extra])) };
}

export function retrieve(q: string, k = 4): Hit[] {
  const { core, expanded } = expandQuery(q);
  const k1 = 1.2, b = 0.75;
  return docs
    .map((d) => {
      let score = 0;
      const terms: string[] = [];
      for (const t of expanded) {
        const tf = d.toks.filter((x) => x === t).length;
        if (!tf) continue;
        const w = core.includes(t) ? 1 : 0.55; // synonyms count a bit less
        score += w * idf(t) * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * d.toks.length) / avgLen)));
        terms.push(t);
      }
      return { chunk: { id: d.id, ref: d.ref, text: d.text }, score, terms };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/** Below this, the demo refuses to answer — same rule as the production RAG system. */
export const SUPPORT_THRESHOLD = 1.2;

/** Builds an extractive, cited answer for free-typed questions. */
export function extractiveAnswer(q: string, hits: Hit[]) {
  if (!hits.length || hits[0].score < SUPPORT_THRESHOLD) return [];
  const { expanded } = expandQuery(q);
  const keep = hits.filter((h) => h.score >= hits[0].score * 0.6).slice(0, 2);
  return keep.map((h) => {
    const sentences = h.chunk.text.match(/[^.!?]+[.!?]+/g) || [h.chunk.text];
    let best = sentences[0], bestScore = -1;
    for (const s of sentences) {
      const toks = tokenize(s);
      const sc = expanded.reduce((a, t) => a + (toks.includes(t) ? idf(t) : 0), 0);
      if (sc > bestScore) { bestScore = sc; best = s; }
    }
    return { text: best.trim(), cite: h.chunk.id };
  });
}

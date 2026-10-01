// ──────────────────────────────────────────────────────────────
//  PROJECTS
//  To add a project: copy one object below, change the fields,
//  and save. The cards, detail panel and command palette
//  all pick it up automatically. Strongest first.
// ──────────────────────────────────────────────────────────────

export type Project = {
  slug: string;
  title: string;
  /** One line shown on the card. */
  tagline: string;
  /** e.g. "Side project", "Production SaaS" */
  kind: string;
  year: string;
  /** The problem, in plain words. */
  problem: string;
  /** What you built. Short, concrete sentences. */
  built: string[];
  /** Optional numbers worth showing big. */
  metrics?: { value: string; label: string }[];
  stack: string[];
  links?: { label: string; href: string }[];
  /** Shown when there is nothing public to link to. */
  note?: string;
  /** Card colour: cyan = LLM / retrieval, amber = evidence, violet = systems. */
  accent: "cyan" | "amber" | "violet";
  /** Future work, optional. */
  next?: string[];
};

export const projects: Project[] = [
  {
    slug: "edulead-ai",
    title: "EduLead AI",
    tagline: "Multi-tenant SaaS where each business runs an AI chatbot grounded in its own documents.",
    kind: "Full-stack + LLM, side project",
    year: "2025",
    problem:
      "Businesses want an AI assistant that knows their courses, prices and policies, without one customer's data ever leaking into another's answers.",
    built: [
      "Tenant-isolated RAG on PostgreSQL + pgvector with all-MiniLM-L6-v2 embeddings.",
      "Local Qwen3 inference through Hugging Face Transformers.",
      "A ContextBuilder that assembles prompts from retrieved chunks, and JWT + RBAC auth that scopes retrieval to the tenant end to end.",
      "A Next.js admin dashboard for managing each tenant's knowledge base.",
      "A pytest suite covering auth, tenant isolation and retrieval, with the AI service mocked.",
    ],
    metrics: [
      { value: "1 DB", label: "many isolated tenants" },
      { value: "RAG", label: "per-tenant retrieval" },
    ],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "Qwen3", "pytest"],
    links: [{ label: "View on GitHub", href: "https://github.com/hiteshkhatana" }],
    next: [
      "RAG evaluation with Recall@K and groundedness scores",
      "Agentic lead-scoring workflows",
      "AWS deployment with Terraform",
    ],
    accent: "cyan",
  },
  {
    slug: "sensfrx-scoring",
    title: "Real-time fraud scoring platform",
    tagline: "The path every user event takes, from a tracking pixel to a fraud score in under 250 ms.",
    kind: "Production SaaS, Sensfrx",
    year: "2022 – 2025",
    problem:
      "250+ websites send a constant stream of user activity. Each event has to be scored for fraud fast enough to act on.",
    built: [
      "A JavaScript tracking pixel that collects activity on customer websites.",
      "A Django and Node.js backend with Kafka and Redis between services.",
      "MySQL and Cassandra for activity storage; Elasticsearch and Kibana for monitoring.",
      "The customer dashboard for fraud events and risk scores.",
    ],
    metrics: [
      { value: "25k/s", label: "peak events" },
      { value: "150–250 ms", label: "end to end" },
      { value: "250+", label: "customer sites" },
    ],
    stack: ["Django", "Node.js", "Kafka", "Redis", "Cassandra", "Elasticsearch", "Kibana"],
    note: "Commercial product. Code is not public.",
    accent: "violet",
  },
  {
    slug: "offline-rag",
    title: "Offline document Q&A (RAG)",
    tagline: "A self-hosted LLM that answers from thousands of PDFs and cites the page and paragraph.",
    kind: "Production LLM system",
    year: "2026",
    problem:
      "Staff needed answers from years of legal documents, but the data could not leave in-house hardware and a wrong citation is worse than no answer.",
    built: [
      "Parses PDFs and splits them along document structure: facts, issues, reasoning, final order.",
      "Embeds chunks into ChromaDB and retrieves top-K passages for each question.",
      "Runs gemma3:12b locally through Ollama; prompts force answers to come only from retrieved text.",
      "Returns NOT FOUND when the source doesn't support an answer, and verifies every case name and page number before display.",
      "Logs sources for every query in a regression suite so answers can be audited.",
    ],
    metrics: [
      { value: "0", label: "cloud API calls" },
      { value: "Page + ¶", label: "on every citation" },
    ],
    stack: ["Node.js", "React", "ChromaDB", "Ollama", "gemma3:12b", "PDF parsing"],
    note: "Built for a government client. Code and data are not public.",
    accent: "amber",
  },
];

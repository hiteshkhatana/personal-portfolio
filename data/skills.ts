export type SkillGroup = "GenAI" | "Backend" | "Frontend" | "Data" | "Infra";

export type Skill = {
  name: string;
  group: SkillGroup;
  /** Where it was used. Shown when the skill is selected. */
  usedIn: string[];
};

const DHC = "Offline RAG platform";
const SFX = "Sensfrx";
const EDU = "EduLead AI";

export const skillGroups: { id: SkillGroup; label: string; color: string }[] = [
  { id: "Frontend", label: "Frontend", color: "var(--vellum)" },
  { id: "Backend", label: "Backend & APIs", color: "var(--violet)" },
  { id: "GenAI", label: "LLM & GenAI", color: "var(--cyan)" },
  { id: "Data", label: "Data & search", color: "var(--amber)" },
  { id: "Infra", label: "Infra & delivery", color: "var(--rose)" },
];

export const skills: Skill[] = [
  { name: "RAG", group: "GenAI", usedIn: [DHC, EDU] },
  { name: "Embeddings", group: "GenAI", usedIn: [DHC, EDU] },
  { name: "Vector search", group: "GenAI", usedIn: [DHC, EDU] },
  { name: "Chunking strategy", group: "GenAI", usedIn: [DHC] },
  { name: "Citation grounding", group: "GenAI", usedIn: [DHC] },
  { name: "Prompt engineering", group: "GenAI", usedIn: [DHC, EDU] },
  { name: "Ollama", group: "GenAI", usedIn: [DHC] },
  { name: "Gemma 3", group: "GenAI", usedIn: [DHC] },
  { name: "Qwen3", group: "GenAI", usedIn: [EDU] },
  { name: "Llama 3.2", group: "GenAI", usedIn: ["Experiments"] },
  { name: "Transformers", group: "GenAI", usedIn: [EDU] },
  { name: "PyTorch", group: "GenAI", usedIn: [EDU] },
  { name: "RAG evaluation", group: "GenAI", usedIn: [DHC] },

  { name: "Python", group: "Backend", usedIn: [SFX, EDU] },
  { name: "Django", group: "Backend", usedIn: [SFX] },
  { name: "FastAPI", group: "Backend", usedIn: [EDU] },
  { name: "Node.js", group: "Backend", usedIn: [DHC, SFX] },
  { name: "REST APIs", group: "Backend", usedIn: [DHC, SFX, EDU] },
  { name: "Kafka", group: "Backend", usedIn: [SFX] },
  { name: "Microservices", group: "Backend", usedIn: [SFX] },
  { name: "Multi-tenant SaaS", group: "Backend", usedIn: [EDU, SFX] },
  { name: "JWT + RBAC", group: "Backend", usedIn: [EDU] },

  { name: "Next.js", group: "Frontend", usedIn: [EDU] },
  { name: "React", group: "Frontend", usedIn: [DHC, SFX] },
  { name: "TypeScript", group: "Frontend", usedIn: [EDU] },
  { name: "Dashboards", group: "Frontend", usedIn: [SFX, EDU] },
  { name: "Tracking pixels", group: "Frontend", usedIn: [SFX] },

  { name: "PostgreSQL", group: "Data", usedIn: [EDU] },
  { name: "pgvector", group: "Data", usedIn: [EDU] },
  { name: "ChromaDB", group: "Data", usedIn: [DHC] },
  { name: "Redis", group: "Data", usedIn: [SFX] },
  { name: "Cassandra", group: "Data", usedIn: [SFX] },
  { name: "MySQL", group: "Data", usedIn: [SFX] },
  { name: "Elasticsearch", group: "Data", usedIn: [SFX] },
  { name: "SQLAlchemy", group: "Data", usedIn: [EDU] },

  { name: "Docker", group: "Infra", usedIn: [DHC, EDU] },
  { name: "AWS", group: "Infra", usedIn: [SFX] },
  { name: "GitHub Actions", group: "Infra", usedIn: [EDU] },
  { name: "Linux", group: "Infra", usedIn: [DHC, SFX] },
  { name: "pytest", group: "Infra", usedIn: [EDU] },
  { name: "Kibana", group: "Infra", usedIn: [SFX] },
];

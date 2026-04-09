export const personalInfo = {
  name: "Oussema Aouini",
  title: "Engineering Student — AI & Web Development",
  email: "oussema.aouini2003@gmail.com",
  location: "Tunis, Tunisia",
  github: "https://github.com/oussema-aouini",
  linkedin: "https://www.linkedin.com/in/oussema-aouini-",
  status: "Open to internship opportunities",
} as const;

export const about = {
  label: "// ABOUT ME",
  headingLead: "Engineering at the intersection of",
  headingHighlight: "AI & Web",
  bio: "Engineering student at Manouba School of Engineering (MSE), passionate about building things that matter. I specialize in AI systems — RAG pipelines, NLP, semantic search — and full-stack web development with Next.js and React. Currently working on projects that bridge intelligent backends with polished user interfaces.",
  techRows: {
    ai: ["Python", "LangChain", "RAG", "FAISS", "HuggingFace"],
    web: ["Next.js", "React", "Tailwind", "REST APIs"],
  },
} as const;

export const aboutStats = [
  {
    value: 3,
    displaySuffix: "",
    label: "Internships completed",
    icon: "internships" as const,
  },
  {
    value: 10,
    displaySuffix: "+",
    label: "Projects built",
    icon: "projects" as const,
  },
  {
    value: 80,
    displaySuffix: "%+",
    label: "QA accuracy on Nomos",
    icon: "accuracy" as const,
  },
] as const;

export const experience = [
  {
    company: "Arabsoft",
    role: "Intern",
    period: "Jan–Feb 2024",
    location: "Tunis",
    bullets: [
      "Designed interactive UI for work management app using Angular",
      "Applied UX best practices to improve task flow for business users",
    ],
    stack: ["Angular", "TypeScript", "UX Design"],
  },
  {
    company: "MajestEye",
    role: "Intern",
    period: "Jun–Aug 2024",
    location: "Tunisia",
    bullets: [
      "Built chess bot with Minimax + Alpha-Beta pruning — ELO ~1200",
      "Benchmarked against Stockfish, presented results to team",
      "Built vehicle detection pipeline with YOLOv3 + TensorFlow",
    ],
    stack: ["Python", "Minimax", "YOLOv3", "TensorFlow", "Pygame"],
  },
  {
    company: "MajestEye",
    role: "Intern",
    period: "Feb–Jun 2025",
    location: "Tunis",
    bullets: [
      "Built Nomos — bilingual RAG legal chatbot for Tunisian law",
      "Designed FAISS vector search pipeline with SentenceTransformers",
      "Developed Next.js frontend with chat history and file uploads",
      "Achieved 80%+ answer accuracy in legal QA evaluation",
    ],
    stack: [
      "Python",
      "LangChain",
      "FAISS",
      "HuggingFace",
      "Next.js",
    ],
  },
] as const;

export const projects = [
  {
    name: "Nomos – AI Legal Chatbot",
    subtitle: "Intelligent Tunisian Legal Chatbot",
    description:
      "Bilingual RAG-based chatbot for answering legal questions from the Tunisian Constitution and Personal Status Code. Achieved over 80% answer accuracy in legal QA evaluation.",
    stack: [
      "Python",
      "LangChain",
      "HuggingFace",
      "FAISS",
      "SentenceTransformers",
      "Next.js",
    ],
    tags: [
      { label: "AI", tone: "blue" as const },
      { label: "NLP", tone: "cyan" as const },
      { label: "RAG", tone: "purple" as const },
      { label: "Full-Stack", tone: "blue" as const },
    ],
    period: "Feb 2025 – Jun 2025",
    href: "#",
  },
  {
    name: "Wadden Sea Coastal Change Dashboard",
    subtitle: "Analytical Dashboard",
    description:
      "Analytical dashboard modeling erosion, accretion, anthropogenic factors, and Land Surface Temperature (LST) for the Wadden Sea region.",
    stack: ["Python", "GIS", "Data Analysis"],
    tags: [
      { label: "Data Science", tone: "blue" as const },
      { label: "GIS", tone: "cyan" as const },
      { label: "Dashboard", tone: "purple" as const },
    ],
    period: "Oct 2025 – May 2026",
    href: "#",
  },
  {
    name: "AI Chess Bot",
    subtitle: "Python Chess Engine",
    description:
      "Python-based chess bot using Minimax with Alpha-Beta pruning, achieving an initial ELO rating of ~1200. Benchmarked against Stockfish and other established chess engines.",
    stack: ["Python", "Minimax", "Alpha-Beta Pruning", "Pygame"],
    tags: [
      { label: "AI", tone: "blue" as const },
      { label: "Python", tone: "cyan" as const },
      { label: "Game Dev", tone: "purple" as const },
    ],
    period: "Jun 2024 – Aug 2024",
    href: "#",
  },
] as const;

/** Tab `id` matches `skillCatalog[].category`; `all` shows everything. */
export const skillTabs = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & NLP" },
  { id: "web", label: "Web Dev" },
  { id: "languages", label: "Languages" },
  { id: "frameworks", label: "Frameworks" },
  { id: "tools", label: "Tools" },
] as const;

export type SkillTabId = (typeof skillTabs)[number]["id"];
export type SkillCategory = Exclude<SkillTabId, "all">;

export const skillCategoryColors: Record<
  SkillCategory,
  { border: string; glow: string; label: string }
> = {
  ai: {
    border: "#4F8EF7",
    glow: "rgba(79, 142, 247, 0.45)",
    label: "AI & NLP",
  },
  web: {
    border: "#63B3ED",
    glow: "rgba(99, 179, 237, 0.45)",
    label: "Web Dev",
  },
  languages: {
    border: "#805AD5",
    glow: "rgba(128, 90, 213, 0.45)",
    label: "Languages",
  },
  frameworks: {
    border: "#48BB78",
    glow: "rgba(72, 187, 120, 0.45)",
    label: "Frameworks",
  },
  tools: {
    border: "#ED8936",
    glow: "rgba(237, 137, 54, 0.45)",
    label: "Tools",
  },
};

export const skillCatalog: {
  name: string;
  category: SkillCategory;
  icon: string;
}[] = [
  // AI & NLP
  { name: "Python", category: "ai", icon: "🐍" },
  { name: "LangChain", category: "ai", icon: "⛓️" },
  { name: "RAG", category: "ai", icon: "🔍" },
  { name: "FAISS", category: "ai", icon: "🔷" },
  { name: "HuggingFace", category: "ai", icon: "🤗" },
  { name: "SentenceTransformers", category: "ai", icon: "🔡" },
  { name: "TensorFlow", category: "ai", icon: "🧠" },
  { name: "Keras", category: "ai", icon: "🔶" },
  { name: "Scikit-learn", category: "ai", icon: "📐" },
  { name: "NLP", category: "ai", icon: "💬" },
  { name: "LLM APIs", category: "ai", icon: "⚡" },
  { name: "Transformers", category: "ai", icon: "🔀" },
  { name: "YOLOv3", category: "ai", icon: "🎯" },
  { name: "Minimax", category: "ai", icon: "♟️" },
  { name: "NLTK", category: "ai", icon: "📚" },
  { name: "SpaCy", category: "ai", icon: "🌀" },
  { name: "Semantic Search", category: "ai", icon: "🔎" },
  { name: "NumPy", category: "ai", icon: "🔢" },
  { name: "Pandas", category: "ai", icon: "🐼" },
  { name: "OpenCV", category: "ai", icon: "👁️" },
  { name: "PyTorch", category: "ai", icon: "🔥" }
  ,


  // Web Development
  { name: "Next.js", category: "web", icon: "▲" },
  { name: "React", category: "web", icon: "⚛️" },
  { name: "Angular", category: "web", icon: "🅰️" },
  { name: "Tailwind CSS", category: "web", icon: "💨" },
  { name: "REST APIs", category: "web", icon: "🔗" },
  { name: "HTML", category: "web", icon: "📄" },
  { name: "CSS", category: "web", icon: "🎨" },
  { name: "TypeScript", category: "web", icon: "📘" },
  { name: "Node.js", category: "web", icon: "🟢" },

  // Programming Languages
  { name: "JavaScript", category: "languages", icon: "📜" },
  { name: "Java", category: "languages", icon: "☕" },
  { name: "Bash/Shell", category: "languages", icon: "💻" },
  { name: "SQL", category: "languages", icon: "🗃️" },
  { name: "Python", category: "languages", icon: "🐍" },



  // Frameworks & Libraries
  { name: "Pygame", category: "frameworks", icon: "🎮" },
  { name: "OpenCV", category: "frameworks", icon: "👁️" },
  { name: "FastAPI", category: "frameworks", icon: "⚡" },
  { name: "Node.js", category: "frameworks", icon: "🟢" },


  // Tools
  { name: "Git & GitHub", category: "tools", icon: "📌" },
  { name: "Docker", category: "tools", icon: "🐳" },
  { name: "GIS", category: "tools", icon: "🗺️" },
  { name: "Google Earth Engine", category: "tools", icon: "🌍" },
  { name: "Linux", category: "tools", icon: "🐧" },
  { name: "VS Code", category: "tools", icon: "🖥️" },
  { name: "Jupyter Notebook", category: "tools", icon: "📓" },
  { name: "Google Colab", category: "tools", icon: "☁️" },
];


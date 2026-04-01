"use client";

import {
  experience,
  personalInfo,
  skillCatalog,
  skillCategoryColors,
  type SkillCategory,
} from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type TerminalOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_LINES = 200;

type HistLine = { id: string; node: ReactNode };

const CATEGORY_ORDER: SkillCategory[] = [
  "ai",
  "web",
  "languages",
  "frameworks",
  "tools",
];

const styles = {
  echo: "text-[#4F8EF7]",
  body: "text-white/95",
  muted: "text-[var(--text-muted)]",
  header: "font-bold text-[#63B3ED]",
  err: "text-[#FC8181]",
  ok: "text-[#68D391]",
} as const;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function trimHistory(lines: HistLine[]): HistLine[] {
  if (lines.length <= MAX_LINES) return lines;
  return lines.slice(lines.length - MAX_LINES);
}

function welcomeLines(): HistLine[] {
  return [
    {
      id: uid(),
      node: (
        <p className={`${styles.muted} italic`}>
          Welcome to AOUINI.DEV terminal v1.0
        </p>
      ),
    },
    {
      id: uid(),
      node: (
        <p className={`${styles.muted} mb-2 italic`}>
          Type &apos;help&apos; to see available commands.
        </p>
      ),
    },
  ];
}

function runCommand(raw: string): { echo: string; output: ReactNode } {
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  const a0 = parts[0]?.toLowerCase() ?? "";
  const a1 = parts[1]?.toLowerCase() ?? "";
  if (!parts.length) {
    return { echo: "", output: null };
  }

  const echo = raw.trim();

  if (a0 === "whoami") {
    return {
      echo,
      output: (
        <div className={`space-y-1 ${styles.body}`}>
          <p>Oussema Aouini</p>
          <p>Engineering Student | AI &amp; Web Development</p>
          <p>Manouba School of Engineering (MSE)</p>
          <p>
            Tunis, Tunisia 🌍
          </p>
          <p>
            Status: Open to internship opportunities{" "}
            <span className={styles.ok}>✓</span>
          </p>
        </div>
      ),
    };
  }

  if (a0 === "ls" && a1 === "projects") {
    return {
      echo,
      output: (
        <div className={`space-y-1 ${styles.body} font-mono text-sm`}>
          <p>[1] Nomos – AI Legal Chatbot          (Feb–Jun 2025)</p>
          <p>[2] Wadden Sea Dashboard               (Oct 2025–May 2026)</p>
          <p>[3] AI Chess Bot                       (Jun–Aug 2024)</p>
          <p className={`${styles.muted} mt-2`}>
            Type &apos;cat &lt;project-name&gt;&apos; for details.
          </p>
        </div>
      ),
    };
  }

  if (a0 === "cat") {
    const target = a1;
    if (target === "nomos") {
      return {
        echo,
        output: (
          <div className={`space-y-2 ${styles.body} text-sm leading-relaxed`}>
            <p className={styles.header}>Nomos — AI Legal Chatbot</p>
            <p>
              Bilingual RAG legal assistant for Tunisian law. Combines
              LangChain orchestration, FAISS vector search, and
              SentenceTransformers embeddings for grounded answers from legal
              corpora.
            </p>
            <ul className="list-inside list-disc space-y-1 text-white/90">
              <li>Built FAISS retrieval pipeline with bilingual support</li>
              <li>Next.js frontend: chat history, uploads, polished UX</li>
              <li>
                <span className={styles.ok}>80%+</span> answer accuracy on legal
                QA evaluation
              </li>
            </ul>
            <p className={styles.muted}>
              Stack: Python · LangChain · FAISS · HuggingFace · Next.js
            </p>
          </div>
        ),
      };
    }
    if (target === "chess") {
      return {
        echo,
        output: (
          <div className={`space-y-2 ${styles.body} text-sm leading-relaxed`}>
            <p className={styles.header}>AI Chess Bot</p>
            <p>
              Engine built with Minimax and alpha-beta pruning; evaluated
              against Stockfish with team-readable benchmarks.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Approximate strength:{" "}
                <span className={styles.ok}>ELO ~1200</span> in self-play /
                test conditions
              </li>
              <li>Pygame UI for interactive games and demos</li>
            </ul>
            <p className={styles.muted}>
              Stack: Python · Minimax · Alpha-Beta · Pygame
            </p>
          </div>
        ),
      };
    }
    if (target === "wadden") {
      return {
        echo,
        output: (
          <div className={`space-y-2 ${styles.body} text-sm leading-relaxed`}>
            <p className={styles.header}>Wadden Sea Dashboard</p>
            <p>
              GIS-focused analytics dashboard for environmental / coastal
              datasets: Python data processing, map layers, and interactive
              visualizations for exploration and reporting.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>ETL and aggregation pipelines for spatial tabular data</li>
              <li>Configurable charts and map-centric UI</li>
            </ul>
            <p className={styles.muted}>
              Stack: Python · GIS tooling · Web dashboard
            </p>
          </div>
        ),
      };
    }
    return {
      echo,
      output: (
        <p className={styles.err}>
          Unknown file: {a1 || "(none)"}. Try nomos, chess, or wadden.
        </p>
      ),
    };
  }

  if (a0 === "skills") {
    const byCat = new Map<SkillCategory, typeof skillCatalog>();
    for (const c of CATEGORY_ORDER) byCat.set(c, []);
    for (const s of skillCatalog) {
      byCat.get(s.category)?.push(s);
    }
    return {
      echo,
      output: (
        <div className={`space-y-3 text-sm ${styles.body}`}>
          {CATEGORY_ORDER.map((cat) => {
            const items = byCat.get(cat) ?? [];
            const label = skillCategoryColors[cat].label;
            return (
              <div key={cat}>
                <p className={styles.header}>{label}</p>
                <p className="font-mono text-white/90">
                  {items.map((x) => x.name).join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      ),
    };
  }

  if (a0 === "experience") {
    return {
      echo,
      output: (
        <div className={`space-y-4 text-sm ${styles.body}`}>
          {experience.map((exp) => (
            <div key={`${exp.company}-${exp.period}`}>
              <p className={styles.header}>
                {exp.company} — {exp.role}
              </p>
              <p className={styles.muted}>
                {exp.period} · {exp.location}
              </p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-white/90">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    };
  }

  if (a0 === "education") {
    return {
      echo,
      output: (
        <div className={`space-y-3 text-sm ${styles.body}`}>
          <div>
            <p className={styles.header}>Manouba School of Engineering (MSE)</p>
            <p>Cycle Ingénieur — 2025 to 2028</p>
          </div>
          <div>
            <p className={styles.header}>ISET</p>
            <p>Bachelor in Information Technology — 2022 to 2025</p>
          </div>
        </div>
      ),
    };
  }

  if (a0 === "contact") {
    return {
      echo,
      output: (
        <div
          className={`space-y-1 font-mono text-sm ${styles.body} whitespace-pre-wrap`}
        >
          <p>Email:    {personalInfo.email}</p>
          <p>GitHub:   github.com/oussema-aouini </p>
          <p>LinkedIn: linkedin.com/in/oussema-aouini</p>
        </div>
      ),
    };
  }

  if (a0 === "help" || a0 === "command" || a0 === "commands") {
    return {
      echo,
      output: (
        <pre
          className={`overflow-x-auto font-mono text-xs leading-relaxed sm:text-sm ${styles.body}`}
        >
          {`AVAILABLE CMD     DESCRIPTION
whoami            Profile snapshot
ls projects       List featured builds
cat <name>        Details: nomos | chess | wadden
skills            Skills grouped by category
experience        Internship summaries
education         MSE & ISET timeline
contact           Email & social
help              This table
clear             Clear terminal output
exit              Close overlay`}
        </pre>
      ),
    };
  }

  if (a0 === "clear") {
    return { echo: "", output: "__CLEAR__" };
  }

  if (a0 === "exit") {
    return { echo, output: "__EXIT__" };
  }

  return {
    echo,
    output: (
      <p className={styles.err}>
        Command not found: {echo}. Type &apos;help&apos; for available
        commands.
      </p>
    ),
  };
}

export function TerminalOverlay({ isOpen, onClose }: TerminalOverlayProps) {
  const [lines, setLines] = useState<HistLine[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cmdHistoryRef = useRef<string[]>([]);
  const histNavRef = useRef(-1);

  useEffect(() => {
    if (!isOpen) return;
    setLines(welcomeLines());
    setInput("");
    histNavRef.current = -1;
    window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const submit = useCallback(() => {
    const raw = input.trim();
    if (!raw) return;

    cmdHistoryRef.current = [...cmdHistoryRef.current, raw].slice(-500);
    histNavRef.current = -1;

    const { echo, output } = runCommand(raw);

    setInput("");

    if (output === "__CLEAR__") {
      setLines([]);
      return;
    }

    if (output === "__EXIT__") {
      setLines((prev) =>
        trimHistory([
          ...prev,
          ...(echo
            ? [
                {
                  id: uid(),
                  node: <p className={styles.echo}>&gt; {echo}</p>,
                },
              ]
            : []),
          {
            id: uid(),
            node: <p className={styles.muted}>Closing terminal...</p>,
          },
        ]),
      );
      window.setTimeout(() => onClose(), 450);
      return;
    }

    setLines((prev) => {
      const next: HistLine[] = [...prev];
      if (echo) {
        next.push({
          id: uid(),
          node: <p className={styles.echo}>&gt; {echo}</p>,
        });
      }
      if (output) {
        next.push({ id: uid(), node: <div className="mb-3">{output}</div> });
      }
      return trimHistory(next);
    });
  }, [input, onClose]);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    const hist = cmdHistoryRef.current;
    if (e.key === "ArrowUp" && hist.length > 0) {
      e.preventDefault();
      histNavRef.current = Math.min(
        histNavRef.current + 1,
        hist.length - 1,
      );
      const idx = hist.length - 1 - histNavRef.current;
      setInput(hist[idx] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histNavRef.current < 0) return;
      histNavRef.current -= 1;
      if (histNavRef.current < 0) {
        histNavRef.current = -1;
        setInput("");
      } else {
        const idx = hist.length - 1 - histNavRef.current;
        setInput(hist[idx] ?? "");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="AOUINI.DEV terminal"
          className="fixed inset-0 z-[90] flex h-[100dvh] max-h-[100dvh] w-full flex-col bg-[rgba(10,15,30,0.97)] backdrop-blur-md max-md:text-[13px]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <header className="flex shrink-0 items-center justify-between border-b border-accent-blue/40 px-4 py-3 md:px-5">
            <span className="text-xs text-text-muted md:text-sm">
              AOUINI.DEV — Terminal
            </span>
            <span className="text-xs text-text-muted md:text-sm">
              ESC to close
            </span>
          </header>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] md:px-5 md:py-4 md:text-sm"
          >
            {lines.map((l) => (
              <div key={l.id}>{l.node}</div>
            ))}
          </div>

          <div className="shrink-0 border-t border-glass-border px-4 py-3 md:px-5">
            <div className="flex items-center gap-1 font-mono text-[13px] md:text-sm">
              <span className="shrink-0 text-[#4F8EF7]">&gt; </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  histNavRef.current = -1;
                  setInput(e.target.value);
                }}
                onKeyDown={onInputKeyDown}
                className="min-w-0 flex-1 border-none bg-transparent text-white outline-none"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="boot-cursor shrink-0 text-[var(--accent-cyan)]">
                ▋
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

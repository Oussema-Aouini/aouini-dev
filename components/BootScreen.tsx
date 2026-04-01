"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SESSION_KEY = "aouini-boot-shown";
const TYPE_MS = 40;
const AUTO_CONTINUE_MS = 1800;

const LINES: { text: string; pauseAfter: number }[] = [
  { text: "> Initializing AOUINI.DEV...", pauseAfter: 600 },
  { text: "> Loading profile: Oussema Aouini", pauseAfter: 300 },
  {
    text: "> Role: Engineering Student | AI & Web Development",
    pauseAfter: 300,
  },
  { text: "> Location: Tunis, Tunisia", pauseAfter: 300 },
  {
    text: "> Status: Open to internship opportunities",
    pauseAfter: 300,
  },
  { text: "", pauseAfter: 200 },
  {
    text: "> Modules loaded: Three.js ✓ LangChain ✓ FAISS ✓ Next.js ✓",
    pauseAfter: 300,
  },
  { text: "> All systems ready.", pauseAfter: 800 },
  { text: "", pauseAfter: 300 },
  { text: "> Press ENTER or click anywhere to explore...", pauseAfter: 0 },
];

const GLITCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function glitchString(s: string): string {
  if (!s) return s;
  const chars = s.split("");
  const n = Math.max(1, Math.floor(chars.length * 0.35));
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    const ch = chars[idx];
    if (ch === " " || ch === "\n") continue;
    chars[idx] =
      GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? ch;
  }
  return chars.join("");
}

function renderColoredLine(text: string, isGlitch: boolean, glitchKey: number) {
  if (!text) {
    return null;
  }

  const display = isGlitch ? glitchString(text) : text;

  if (!display.startsWith(">")) {
    return <span className="text-[var(--text-primary)]">{display}</span>;
  }

  const parts = display.split("✓");
  if (parts.length === 1) {
    return (
      <span className="text-[var(--accent-blue)]">{display}</span>
    );
  }

  return (
    <span key={glitchKey} className="inline">
      {parts.map((part, i) => (
        <span key={`${i}-${glitchKey}`}>
          <span className="text-[var(--accent-blue)]">{part}</span>
          {i < parts.length - 1 && (
            <span className="text-[#68D391]">✓</span>
          )}
        </span>
      ))}
    </span>
  );
}

type Mode = "loading" | "skip" | "show";

type ExitPhase = "idle" | "glitch" | "wipe";

export type BootScreenProps = {
  onComplete: () => void;
};

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [mode, setMode] = useState<Mode>("loading");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [exitPhase, setExitPhase] = useState<ExitPhase>("idle");
  const [glitchTick, setGlitchTick] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const wipeDoneRef = useRef(false);
  const exitPhaseRef = useRef(exitPhase);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    exitPhaseRef.current = exitPhase;
  }, [exitPhase]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let id: number | undefined;
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      onCompleteRef.current();
      id = window.setTimeout(() => setMode("skip"), 0);
      return () => {
        if (id != null) window.clearTimeout(id);
      };
    }
    id = window.setTimeout(() => setMode("show"), 0);
    return () => {
      if (id != null) window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const awaitingInput =
    mode === "show" &&
    exitPhase === "idle" &&
    lineIndex >= LINES.length;

  const finishBoot = useCallback(() => {
    if (exitPhase !== "idle" || !awaitingInput) return;
    setExitPhase("glitch");
  }, [awaitingInput, exitPhase]);

  useEffect(() => {
    if (!awaitingInput) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishBoot();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [awaitingInput, finishBoot]);

  useEffect(() => {
    if (!awaitingInput) return;
    const id = window.setTimeout(() => {
      finishBoot();
    }, AUTO_CONTINUE_MS);
    return () => window.clearTimeout(id);
  }, [awaitingInput, finishBoot]);

  useEffect(() => {
    if (exitPhase !== "glitch") return;

    const start = performance.now();
    let frame = 0;

    const run = () => {
      const t = performance.now();
      if (t - start < 400) {
        setGlitchTick((k) => k + 1);
        frame = requestAnimationFrame(run);
      } else {
        setExitPhase("wipe");
      }
    };

    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [exitPhase]);

  const handleWipeComplete = useCallback(() => {
    if (wipeDoneRef.current) return;
    wipeDoneRef.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    if (mode !== "show") return;
    if (lineIndex >= LINES.length) return;

    const line = LINES[lineIndex];
    if (!line) return;

    if (line.text === "") {
      const t = setTimeout(() => {
        setCompletedLines((prev) => [...prev, ""]);
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, line.pauseAfter);
      return () => clearTimeout(t);
    }

    if (charIndex < line.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setCompletedLines((prev) => [...prev, line.text]);
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, line.pauseAfter);

    return () => clearTimeout(t);
  }, [mode, lineIndex, charIndex]);

  const currentPartial = useMemo(() => {
    if (mode !== "show" || lineIndex >= LINES.length) return "";
    const line = LINES[lineIndex];
    if (!line || line.text === "") return "";
    return line.text.slice(0, charIndex);
  }, [mode, lineIndex, charIndex]);

  const timeLabel = useMemo(() => {
    try {
      return now.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return now.toISOString();
    }
  }, [now]);

  if (mode === "loading" || mode === "skip") {
    return null;
  }

  const showGlitch = exitPhase === "glitch";

  return (
    <motion.div
      role="presentation"
      className="fixed inset-0 z-[100] cursor-default overflow-hidden font-mono text-sm sm:text-base"
      style={{ background: "#0a0f1e" }}
      initial={{ y: 0 }}
      animate={exitPhase === "wipe" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (exitPhaseRef.current === "wipe") {
          handleWipeComplete();
        }
      }}
      onClick={() => {
        if (awaitingInput) finishBoot();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
        aria-hidden
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)",
        }}
      />
      <div
        className="boot-scanline pointer-events-none absolute left-0 right-0 z-10 h-px bg-white/20 shadow-[0_0_12px_rgba(99,179,237,0.35)]"
        aria-hidden
      />

      <div className="absolute left-4 top-4 z-20 text-xs tracking-wide text-[var(--accent-blue)] sm:left-6 sm:top-6 sm:text-sm">
        AOUINI.DEV v1.0.0
      </div>
      <div className="absolute right-4 top-4 z-20 max-w-[min(100%,14rem)] text-right text-xs text-[var(--text-muted)] tabular-nums sm:right-6 sm:top-6 sm:max-w-none sm:text-sm">
        {timeLabel}
      </div>

      <div className="relative z-20 flex min-h-full items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl space-y-1 text-left leading-relaxed">
          {completedLines.map((line, i) => (
            <div key={`done-${i}-${line.slice(0, 16)}`} className="min-h-[1.25em]">
              {line === "" ? (
                <span aria-hidden>&nbsp;</span>
              ) : (
                renderColoredLine(line, showGlitch, glitchTick + i * 997)
              )}
            </div>
          ))}

          {lineIndex < LINES.length && currentPartial !== "" && (
            <div className="min-h-[1.25em]">
              {renderColoredLine(currentPartial, showGlitch, glitchTick + 404)}
              {!showGlitch && (
                <span
                  className="boot-cursor inline-block w-[0.55em] text-[var(--accent-cyan)] select-none"
                  aria-hidden
                >
                  ▋
                </span>
              )}
            </div>
          )}

          {lineIndex < LINES.length &&
            LINES[lineIndex]?.text === "" &&
            charIndex === 0 && (
              <div className="min-h-[1.25em]" aria-hidden>
                &nbsp;
              </div>
            )}
        </div>
      </div>

    </motion.div>
  );
}

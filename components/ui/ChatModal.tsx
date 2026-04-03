"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBrain, FaPaperPlane, FaTimes } from "react-icons/fa";

import { cn } from "@/lib/utils";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  role: MessageRole;
  content: string;
  timestamp: Date;
};

const SUGGESTION_CHIPS = [
  "What projects has he built?",
  "Tell me about Nomos",
  "What's his tech stack?",
  "Is he open to internships?",
  "What's his experience with NLP?",
  "How can I contact him?",
] as const;

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Oussema's AI assistant. Ask me anything about his projects, skills, experience, or availability. I'm here to help!",
  timestamp: new Date(),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4Z" />
    </svg>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** `mid`: dock beside a vertically centered FAB. `bottom`: above a bottom-right FAB. */
  fabPlacement?: "mid" | "bottom";
};

export function ChatModal({
  isOpen,
  onClose,
  fabPlacement = "bottom",
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  const showSuggestions = useMemo(() => {
    return messages.length === 1 && messages[0]?.role === "assistant";
  }, [messages]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const nextText = (text ?? input).trim();
    if (!nextText || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: nextText,
      timestamp: new Date(),
    };

    const placeholderAssistant: ChatMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, placeholderAssistant]);
    setInput("");
    setIsLoading(true);

    try {
      const nextMessages = [...messages, userMessage];
      const payload = nextMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      if (!response.ok) {
        let errorText = "Failed to get response. Please try again.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) errorText = data.error;
        } catch {
          /* keep default */
        }
        throw new Error(errorText);
      }

      if (!response.body) {
        throw new Error("No response body returned from server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";
      let buffered = "";

      const applyText = (value: string) => {
        setMessages((prev) => {
          const updated = [...prev];
          const index = updated.length - 1;
          if (index >= 0 && updated[index]?.role === "assistant") {
            updated[index] = {
              ...updated[index],
              content: value,
            };
          }
          return updated;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffered += decoder.decode(value, { stream: true });
        const tokens = buffered.split(/(\s+)/);
        buffered = tokens.pop() ?? "";

        for (const token of tokens) {
          botResponse += token;
          applyText(botResponse);
          if (token.trim().length > 0) {
            await wait(20);
          }
        }
      }

      buffered += decoder.decode();
      if (buffered) {
        const tokens = buffered.split(/(\s+)/);
        for (const token of tokens) {
          botResponse += token;
          applyText(botResponse);
          if (token.trim().length > 0) {
            await wait(20);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx]?.role === "assistant") {
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: errorMessage,
          };
        }
        return updated;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div
            className="absolute inset-0 bg-[#030712]/55 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            className={cn(
              "pointer-events-auto chat-modal-shell fixed z-[101] flex max-h-[min(78vh,38rem)] w-[min(94vw,26rem)] flex-col overflow-hidden rounded-3xl",
              "top-auto translate-y-0 right-5 bottom-24 sm:right-6 sm:bottom-28",
            )}
            initial={{ scale: 0.88, opacity: 0, y: 28, x: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 28, x: 8 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 flex-col rounded-[inherit] border border-accent-cyan/30 bg-gradient-to-b from-[rgba(12,18,38,0.97)] via-[rgba(8,12,26,0.98)] to-[rgba(6,10,22,0.99)] shadow-[0_28px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(99,179,237,0.12),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
              {/* Header */}
              <div className="relative flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-5 sm:py-4">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-cyan/[0.07] to-transparent"
                  aria-hidden
                />
                <div className="relative flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent-cyan/35 bg-gradient-to-br from-accent-cyan/20 via-accent-blue/15 to-transparent text-accent-cyan shadow-[0_0_24px_rgba(99,179,237,0.2)]">
                    <FaBrain className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold tracking-tight text-white sm:text-base">
                        Oussema AI Assistant
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/95">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                          aria-hidden
                        />
                        Online
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-snug text-text-muted sm:text-xs">
                      Ask about projects, skills, or how to get in touch.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-text-muted transition-colors hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:text-accent-cyan"
                  aria-label="Close chat"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={messagesScrollRef}
                className="chat-modal-messages flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto scroll-smooth px-4 py-4 sm:px-5"
              >
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/10 text-[10px] font-bold tracking-wide text-accent-cyan"
                        aria-hidden
                      >
                        AI
                      </div>
                    )}
                    <div
                      className={`chat-modal-bubble max-w-[min(100%,18.5rem)] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed sm:max-w-xs sm:text-[13px] ${
                        msg.role === "user"
                          ? "chat-modal-bubble--user rounded-br-md border border-white/10 bg-gradient-to-br from-accent-cyan to-[#4a9fd4] text-[#071018] shadow-[0_8px_24px_rgba(99,179,237,0.22)]"
                          : "chat-modal-bubble--assistant rounded-bl-md border border-white/[0.08] bg-[rgba(99,179,237,0.07)] text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      }`}
                    >
                      {msg.content ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        msg.role === "assistant" &&
                        idx === messages.length - 1 &&
                        isLoading && (
                          <span className="inline-flex gap-1 pt-0.5">
                            <span className="chat-modal-stream-dot" />
                            <span className="chat-modal-stream-dot chat-modal-stream-dot--d1" />
                            <span className="chat-modal-stream-dot chat-modal-stream-dot--d2" />
                          </span>
                        )
                      )}
                      <span
                        className={`mt-1.5 block text-[10px] ${
                          msg.role === "user"
                            ? "text-[#0a0f1e]/55"
                            : "text-text-muted/75"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    {msg.role === "user" && (
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent-blue/30 bg-accent-blue/15 text-accent-blue">
                        <UserIcon />
                      </div>
                    )}
                  </motion.div>
                ))}

              </div>

              {/* Suggestions */}
              {showSuggestions && (
                <div className="shrink-0 border-t border-white/[0.06] bg-[rgba(0,0,0,0.12)] px-4 py-3 sm:px-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Quick prompts
                  </p>
                  <div className="flex max-h-[5.5rem] flex-wrap gap-2 overflow-y-auto pr-0.5 sm:max-h-none">
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => sendMessage(chip)}
                        className="rounded-full border border-accent-cyan/30 bg-white/[0.03] px-3 py-1.5 text-left text-[11px] leading-snug text-accent-cyan/95 transition-colors hover:border-accent-cyan/55 hover:bg-accent-cyan/10 sm:text-xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="shrink-0 border-t border-white/[0.07] bg-[rgba(4,8,18,0.65)] px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-center gap-2 rounded-2xl border border-accent-cyan/25 bg-[rgba(99,179,237,0.06)] p-1 pl-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-accent-cyan/45 focus-within:bg-[rgba(99,179,237,0.09)]">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message the assistant…"
                    disabled={isLoading}
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-text-primary placeholder:text-text-muted/45 focus:outline-none disabled:opacity-50 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan to-[#4a9fd4] text-[#051018] shadow-[0_6px_20px_rgba(99,179,237,0.35)] transition-[transform,opacity] hover:brightness-110 disabled:pointer-events-none disabled:opacity-35"
                    aria-label="Send message"
                  >
                    <FaPaperPlane className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

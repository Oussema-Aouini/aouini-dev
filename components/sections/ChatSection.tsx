"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  role: MessageRole;
  content: string;
  timestamp: Date;
};

const SUGGESTION_CHIPS = [
  "What projects has he built? 🚀",
  "Tell me about Nomos 🤖",
  "What's his tech stack? 💻",
  "Is he open to internships? 📬",
  "What's his experience with NLP? 🧠",
  "How can I contact him? ✉️",
] as const;

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Oussema's AI assistant. Ask me anything about his projects, skills, experience, or availability. I'm here to help! ✦",
  timestamp: new Date(),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4Z" />
    </svg>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  const showSuggestions = useMemo(() => {
    return messages.length === 1 && messages[0]?.role === "assistant";
  }, [messages]);

  /** Scroll only the chat transcript — never use scrollIntoView (it scrolls the whole page). */
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
          const payload = (await response.json()) as { error?: string };
          if (payload.error) errorText = payload.error;
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
            await wait(14);
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
            await wait(14);
          }
        }
      }
    } catch (error) {
      const errorText =
        error instanceof Error
          ? error.message
          : "Sorry, something went wrong while contacting Gemini. Please try again.";
      setMessages((prev) => {
        const updated = [...prev];
        const index = updated.length - 1;
        if (index >= 0 && updated[index]?.role === "assistant") {
          updated[index] = {
            ...updated[index],
            content: errorText,
          };
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <SectionWrapper id="chat" className="bg-[#0a0f1e]">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto w-full max-w-[700px]"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#4F8EF7]">
          {"// AI ASSISTANT"}
        </p>

        <h2 className="mt-3 text-[34px] font-bold leading-tight text-white sm:text-[42px] md:text-[48px]">
          Ask me{" "}
          <span className="bg-[linear-gradient(135deg,#4F8EF7,#63B3ED)] bg-clip-text text-transparent">
            anything
          </span>
        </h2>

        <p className="mt-4 text-[14px] text-[#9aa6bd] sm:text-[15px]">
          Ask about my projects, skills, or availability. I&apos;m here to help!
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className="mt-7 w-full rounded-2xl border border-[rgba(79,142,247,0.2)] bg-[rgba(255,255,255,0.04)] p-3 backdrop-blur-md sm:p-5"
        >
          <div
            ref={messagesScrollRef}
            className="max-h-[420px] space-y-4 overflow-y-auto pr-1"
          >
            {messages.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 text-center">
                <span className="text-2xl text-[#4F8EF7]">✦</span>
                <p className="text-sm italic text-[#8c9ab4]">
                  Start a conversation - ask me anything about Oussema.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={`${message.role}-${index}-${message.timestamp.getTime()}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[90%] gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                          isUser
                            ? "bg-[#13203a] text-white"
                            : "bg-[#4F8EF7] text-white"
                        }`}
                      >
                        {isUser ? <UserIcon /> : "✦"}
                      </div>

                      <div>
                        <div
                          className={`px-4 py-3 text-[14px] leading-[1.7] text-white ${
                            isUser
                              ? "rounded-[12px_0_12px_12px] bg-[linear-gradient(135deg,#4F8EF7,#2C5282)]"
                              : "rounded-[0_12px_12px_12px] border-l-[3px] border-l-[#4F8EF7] bg-[rgba(255,255,255,0.05)]"
                          }`}
                        >
                          {isLoading && !isUser && message.content === "" && index === messages.length - 1 ? (
                            <div className="typing-dots" aria-label="Assistant is typing">
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          )}
                        </div>

                        {!isUser && (
                          <p className="mt-1 pl-1 text-[11px] text-[#8793ab]">
                            {formatTime(message.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {showSuggestions && (
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <motion.button
                  key={chip}
                  type="button"
                  onClick={() => void sendMessage(chip)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: idx * 0.05 }}
                  className="rounded-full border border-[rgba(79,142,247,0.3)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[13px] text-white transition-colors hover:border-[#4F8EF7] hover:bg-[rgba(79,142,247,0.1)]"
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-[rgba(79,142,247,0.18)] pt-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Ask something about Oussema..."
                className="min-h-[46px] max-h-[130px] flex-1 resize-none rounded-lg border border-transparent bg-transparent px-2 py-2 font-mono text-[14px] text-white outline-none placeholder:text-[#7f8ca6]"
                rows={2}
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-[linear-gradient(135deg,#4F8EF7,#2C5282)] px-5 py-2.5 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <span className="text-lg leading-none">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .typing-dots {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 20px;
          padding: 2px 0;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #b8d6ff;
          animation: dot-bounce 1s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes dot-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }
          40% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </SectionWrapper>
  );
}

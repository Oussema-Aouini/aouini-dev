"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

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
};

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
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
          <div className="absolute inset-0 bg-[#02040a]/45 backdrop-blur-[1px]" aria-hidden />
          <motion.div
            className="pointer-events-auto fixed bottom-20 right-4 flex max-h-[70vh] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-accent-cyan/30 bg-gradient-to-b from-[rgba(10,15,30,0.96)] to-[rgba(10,15,30,0.99)] shadow-2xl backdrop-blur-xl sm:bottom-24 sm:right-6 sm:max-h-[78vh] sm:w-[24rem]"
            initial={{ scale: 0.85, opacity: 0, y: 24, x: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 24, x: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-accent-cyan/20 px-4 py-3 sm:px-4 sm:py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
                <h3 className="text-sm font-semibold text-accent-cyan">
                  AI Assistant
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-accent-cyan/10 transition-colors"
                aria-label="Close chat"
              >
                <FaTimes size={15} className="text-text-muted hover:text-accent-cyan" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={messagesScrollRef}
              className="flex-1 overflow-y-auto space-y-3 px-4 py-4 sm:px-4 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-6 w-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[10px] font-semibold tracking-wide text-accent-cyan">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-lg px-3 py-2 text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent-cyan text-[#0a0f1e] rounded-br-none"
                        : "bg-accent-cyan/10 text-text-primary rounded-bl-none"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-[10px] opacity-60 mt-1 block">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-6 w-6 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <UserIcon />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="h-6 w-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[10px] font-semibold tracking-wide text-accent-cyan">AI</span>
                  </div>
                  <div className="bg-accent-cyan/10 text-text-primary rounded-lg rounded-bl-none px-3 py-2 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="border-t border-accent-cyan/20 px-4 py-3 sm:px-5">
                <p className="text-xs text-text-muted mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-xs px-2.5 py-1.5 rounded-full border border-accent-cyan/40 hover:border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-accent-cyan/20 px-4 py-3 sm:px-5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-accent-cyan/5 border border-accent-cyan/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-cyan/50 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="h-9 px-3 rounded-lg bg-accent-cyan text-[#0a0f1e] font-semibold text-xs sm:text-sm hover:bg-accent-cyan/90 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                Send
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

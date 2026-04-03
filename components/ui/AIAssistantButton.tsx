"use client";

import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

export type AIAssistantButtonProps = {
  onOpen: () => void;
};

export function AIAssistantButton({ onOpen }: AIAssistantButtonProps) {
  return (
    <motion.button
      type="button"
      title="Open AI Assistant"
      aria-label="Open AI Assistant"
      onClick={onOpen}
      className="ai-assistant-fab group fixed bottom-5 right-5 z-[85] flex h-[3.75rem] w-[3.75rem] cursor-pointer items-center justify-center overflow-visible rounded-2xl border border-accent-cyan/50 bg-gradient-to-br from-[rgba(16,24,48,0.92)] via-[rgba(10,15,30,0.95)] to-[rgba(79,142,247,0.18)] font-mono text-lg font-semibold tracking-tight text-accent-cyan shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.35 }}
      whileHover={{
        scale: 1.06,
        borderColor: "rgba(99, 179, 237, 0.85)",
        boxShadow:
          "0 0 0 1px rgba(99, 179, 237, 0.35), 0 12px 40px rgba(79, 142, 247, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      whileTap={{ scale: 0.94 }}
    >
      <span
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-accent-cyan/25 via-transparent to-accent-blue/30 opacity-70 blur-md transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="relative z-[1] flex items-center justify-center drop-shadow-[0_0_12px_rgba(99,179,237,0.45)]"
      >
        <FaBrain size={22} className="sm:h-6 sm:w-6" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl border border-accent-cyan/60"
        animate={{ scale: [1, 1.18], opacity: [0.55, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-[3px] rounded-[0.85rem] bg-accent-cyan/15 blur-lg"
        animate={{ opacity: [0.25, 0.08] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        aria-hidden
      />
    </motion.button>
  );
}

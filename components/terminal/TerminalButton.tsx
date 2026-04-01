"use client";

import { motion } from "framer-motion";

export type TerminalButtonProps = {
  onOpen: () => void;
};

export function TerminalButton({ onOpen }: TerminalButtonProps) {
  return (
    <motion.button
      type="button"
      title="Open terminal"
      aria-label="Open terminal"
      onClick={onOpen}
      className="terminal-fab-glow fixed bottom-6 right-6 z-[85] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-accent-blue bg-glass-bg/90 font-mono text-sm font-semibold tracking-tight text-accent-blue shadow-lg backdrop-blur-md"
      initial={false}
      whileHover={{
        scale: 1.1,
        backgroundColor: "var(--accent-blue)",
        color: "#ffffff",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      &gt;_
    </motion.button>
  );
}

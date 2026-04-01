"use client";

import { motion } from "framer-motion";

export type TerminalButtonProps = {
  onOpen: () => void;
};

export function TerminalButton({ onOpen }: TerminalButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[85] flex items-center gap-2">
      <motion.button
        type="button"
        onClick={onOpen}
        className="terminal-fab-callout hidden rounded-full border border-accent-cyan/45 bg-[rgba(10,15,30,0.86)] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-accent-cyan sm:inline-flex"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
      >
        Explore more here
      </motion.button>

      <motion.button
        type="button"
        title="Open terminal"
        aria-label="Open terminal"
        onClick={onOpen}
        className="terminal-fab-glow flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-accent-blue bg-glass-bg/90 font-mono text-sm font-semibold tracking-tight text-accent-blue shadow-lg backdrop-blur-md"
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
    </div>
  );
}

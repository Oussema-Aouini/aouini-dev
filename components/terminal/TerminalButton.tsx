"use client";

import { motion } from "framer-motion";

export type TerminalButtonProps = {
  onOpen: () => void;
};

/** Sits mid-right, above the AI assistant FAB — same edge alignment, vertically offset. */
export function TerminalButton({ onOpen }: TerminalButtonProps) {
  return (
    <div className="pointer-events-none fixed top-[calc(50%-2.75rem)] right-[max(1rem,env(safe-area-inset-right))] z-[85] flex -translate-y-1/2 items-center gap-2 sm:top-[calc(50%-3.25rem)] sm:right-[max(1.25rem,env(safe-area-inset-right))]">
      <motion.button
        type="button"
        onClick={onOpen}
        className="terminal-fab-callout pointer-events-auto hidden rounded-full border border-accent-cyan/45 bg-[rgba(10,15,30,0.88)] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-accent-cyan sm:inline-flex"
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
        aria-label="Open terminal easter egg"
        onClick={onOpen}
        className="terminal-fab-glow terminal-fab-standalone pointer-events-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-accent-blue/55 bg-glass-bg/95 font-mono text-sm font-semibold tracking-tight text-accent-blue shadow-lg backdrop-blur-md sm:h-14 sm:w-14"
        initial={{ scale: 0, opacity: 0, x: 18 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 24,
          delay: 0.12,
        }}
        whileHover={{
          scale: 1.06,
          backgroundColor: "var(--accent-blue)",
          color: "#ffffff",
        }}
        whileTap={{ scale: 0.96 }}
      >
        &gt;_
      </motion.button>
    </div>
  );
}

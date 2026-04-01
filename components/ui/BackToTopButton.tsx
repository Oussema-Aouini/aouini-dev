"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          title="Back to top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="terminal-fab-glow fixed bottom-6 left-6 z-[85] flex h-11 min-w-[2.75rem] items-center justify-center rounded-full border border-accent-blue bg-glass-bg/90 px-3 font-mono text-xs font-semibold text-accent-blue shadow-lg backdrop-blur-md md:bottom-8 md:left-8"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}

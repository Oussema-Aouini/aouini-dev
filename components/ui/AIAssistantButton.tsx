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
      className="ai-assistant-fab fixed bottom-6 right-6 z-[85] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-accent-cyan bg-gradient-to-br from-[rgba(99,179,237,0.15)] to-[rgba(79,142,247,0.25)] font-mono text-lg font-semibold tracking-tight text-accent-cyan shadow-lg backdrop-blur-md hover:border-accent-cyan"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      whileHover={{
        scale: 1.12,
        boxShadow: "0 0 32px rgba(99, 179, 237, 0.6), inset 0 0 16px rgba(99, 179, 237, 0.2)",
      }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="flex items-center justify-center"
      >
        <FaBrain size={24} />
      </motion.div>
      
      {/* Pulsing ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-accent-cyan"
        animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        aria-hidden
      />
      
      {/* Glow */}
      <motion.div
        className="absolute inset-2 rounded-full bg-accent-cyan blur-md opacity-0"
        animate={{ opacity: [0.2, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        aria-hidden
      />
    </motion.button>
  );
}

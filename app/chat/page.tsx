"use client";

import { SceneHost } from "@/components/three/SceneHost";
import { AIAssistantButton } from "@/components/ui/AIAssistantButton";
import { ChatModal } from "@/components/ui/ChatModal";
import Link from "next/link";
import { useState } from "react";

export default function ChatPage() {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <>
      <SceneHost />
      <main className="relative z-10 flex min-h-screen flex-col bg-transparent font-body text-text-primary">
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs font-semibold text-text-muted transition-colors hover:border-accent-cyan/35 hover:text-accent-cyan sm:text-sm"
          >
            ← Back to site
          </Link>
          <p className="hidden text-right text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted sm:block sm:text-xs">
            Dedicated assistant view
          </p>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-6 sm:pb-40">
          <p className="max-w-md text-center font-body text-sm leading-relaxed text-text-muted sm:text-base">
            The assistant is docked in the{" "}
            <span className="text-accent-cyan">bottom-right</span> — use the
            brain button to open or close the chat panel.
          </p>
        </div>
      </main>
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        fabPlacement="bottom"
      />
      <AIAssistantButton onOpen={() => setChatOpen(true)} placement="bottom" />
    </>
  );
}

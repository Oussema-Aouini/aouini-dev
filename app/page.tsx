"use client";

import BootScreen from "@/components/BootScreen";
import { HeroSection } from "@/components/sections/HeroSection";
import { SceneHost } from "@/components/three/SceneHost";
import { AIAssistantButton } from "@/components/ui/AIAssistantButton";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { DocumentTitleSync } from "@/components/ui/DocumentTitleSync";
import { SectionTransitionFx } from "@/components/ui/SectionTransitionFx";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { TerminalOverlay } from "@/components/terminal/TerminalOverlay";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy load all sections except HeroSection for faster LCP
const AboutSection = dynamic(
  () => import("@/components/sections/AboutSection").then(m => ({ default: m.AboutSection })),
  { loading: () => <div className="min-h-[32vh]" aria-hidden /> },
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection").then(m => ({ default: m.ExperienceSection })),
  { loading: () => <div className="min-h-[48vh]" aria-hidden /> },
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then(m => ({ default: m.ProjectsSection })),
  { loading: () => <div className="min-h-[56vh]" aria-hidden /> },
);

const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection").then(m => ({ default: m.SkillsSection })),
  { loading: () => <div className="min-h-[48vh]" aria-hidden /> },
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then(m => ({ default: m.ContactSection })),
  { loading: () => <div className="min-h-[28vh]" aria-hidden /> },
);

const ChatSection = dynamic(
  () => import("@/components/sections/ChatSection"),
  { loading: () => <div className="min-h-[24vh]" aria-hidden /> },
);

function scrollToChat() {
  document
    .getElementById("chat")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <>
      <SceneHost />
      <ScrollProgress />
      {showPortfolio && <SectionTransitionFx />}
      <DocumentTitleSync active={showPortfolio} />
      <AnimatePresence>
        {!showPortfolio && (
          <BootScreen key="boot" onComplete={() => setShowPortfolio(true)} />
        )}
      </AnimatePresence>
      <TerminalOverlay
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
      <TerminalButton onOpen={() => setTerminalOpen(true)} />
      <AIAssistantButton onOpen={scrollToChat} />
      <BackToTopButton />
      <main className="relative z-10 min-h-screen flex-1 bg-transparent font-body text-text-primary">
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <ProjectsSection />
            <SkillsSection />
            <ChatSection />
            <ContactSection />
          </motion.div>
        )}
      </main>
    </>
  );
}

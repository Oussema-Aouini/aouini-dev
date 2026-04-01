"use client";

import BootScreen from "@/components/BootScreen";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { SceneHost } from "@/components/three/SceneHost";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import { DocumentTitleSync } from "@/components/ui/DocumentTitleSync";
import { SectionTransitionFx } from "@/components/ui/SectionTransitionFx";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { TerminalOverlay } from "@/components/terminal/TerminalOverlay";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";

const ChatSection = dynamic(
  () => import("@/components/sections/ChatSection"),
  { loading: () => <div className="min-h-[24vh]" aria-hidden /> },
);

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

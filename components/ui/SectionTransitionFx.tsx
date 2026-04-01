"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SECTION_IDS = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "chat",
  "contact",
] as const;

const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
  hero: "Hero",
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  chat: "AI Chat",
  contact: "Contact",
};

export function SectionTransitionFx() {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTION_IDS)[number]>("hero");
  const [transitionKey, setTransitionKey] = useState(0);
  const [nextLabel, setNextLabel] = useState("Hero");
  const previousRef = useRef<(typeof SECTION_IDS)[number] | null>(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    let raf = 0;

    const updateActiveSection = () => {
      const vhCenter = window.innerHeight * 0.5;
      let bestId: (typeof SECTION_IDS)[number] = activeSection;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!isVisible) continue;
        const center = rect.top + rect.height * 0.5;
        const distance = Math.abs(center - vhCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestId = section.id as (typeof SECTION_IDS)[number];
        }
      }

      setActiveSection((current) => (current === bestId ? current : bestId));
      raf = 0;
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeSection]);

  useEffect(() => {
    if (previousRef.current === null) {
      previousRef.current = activeSection;
      return;
    }
    if (previousRef.current === activeSection) return;

    setNextLabel(SECTION_LABELS[activeSection]);
    setTransitionKey((k) => k + 1);
    previousRef.current = activeSection;
  }, [activeSection]);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {transitionKey > 0 && (
          <motion.div
            key={transitionKey}
            className="section-room-transition absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <motion.div
              className="section-room-vignette"
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1.16, opacity: [0, 0.56, 0] }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            />
            <motion.div
              className="section-room-grid"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: [0, 0.42, 0], y: -24 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            />
            <motion.div
              className="section-room-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0.85, 0], y: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
            >
              Entering {nextLabel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


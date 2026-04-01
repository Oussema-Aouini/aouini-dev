"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  skillCatalog,
  skillCategoryColors,
  skillTabs,
  type SkillTabId,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export function SkillsSection() {
  const [tab, setTab] = useState<SkillTabId>("all");

  const filtered = useMemo(
    () =>
      skillCatalog.filter(
        (s) => tab === "all" || s.category === tab,
      ),
    [tab],
  );

  return (
    <SectionWrapper id="skills">
      <p className="font-mono text-sm font-medium tracking-wide text-accent-blue">
        {"// SKILLS"}
      </p>
      <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
        My technical stack
      </h2>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-glass-border pb-6">
        {skillTabs.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              tab === t.id
                ? "bg-accent-blue text-white shadow-[0_0_20px_rgba(79,142,247,0.35)]"
                : "border border-white/15 bg-transparent text-text-muted hover:border-accent-blue/40 hover:text-text-primary",
            )}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((skill, i) => {
            const meta = skillCategoryColors[skill.category];
            return (
              <motion.div
                key={`${skill.category}-${skill.name}`}
                layout
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{
                  duration: 0.22,
                  delay: Math.min(i, 16) * 0.025,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 22px ${meta.glow}`,
                }}
                className={cn(
                  "flex items-center gap-2 rounded-full border bg-glass-bg/90 px-3 py-2",
                  "text-sm font-medium text-text-primary backdrop-blur-md",
                )}
                style={{ borderColor: `${meta.border}99` }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-primary/50 text-base"
                  aria-hidden
                >
                  {skill.icon}
                </span>
                <span>{skill.name}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
}

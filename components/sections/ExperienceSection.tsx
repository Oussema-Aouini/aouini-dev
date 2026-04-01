"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { experience } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useIsLg() {
  const [lg, setLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return lg;
}

export function ExperienceSection() {
  const isLg = useIsLg();

  return (
    <SectionWrapper id="experience">
      <div className="mx-auto max-w-[800px] text-left">
        <p className="text-center font-mono text-sm font-medium tracking-wide text-accent-blue lg:text-left">
          {"// EXPERIENCE"}
        </p>
        <h2 className="mt-3 text-center font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-left">
          Where I&apos;ve worked
        </h2>

        <div className="relative mt-14 lg:mt-16">
          <div
            className="pointer-events-none absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-accent-blue/55 via-accent-cyan/25 to-transparent lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden
          />

          <ul className="relative space-y-12 lg:space-y-16">
            {experience.map((exp, i) => {
              const fromX = isLg ? (i % 2 === 0 ? -40 : 40) : -28;
              return (
                <li
                  key={`${exp.company}-${exp.period}`}
                  className="relative pl-10 lg:pl-0"
                >
                  <div
                    className={cn(
                      "absolute left-[11px] top-7 z-10 h-3 w-3 -translate-x-1/2 rounded-full",
                      "border-2 border-accent-blue bg-bg-primary shadow-[0_0_12px_rgba(79,142,247,0.5)]",
                      "lg:left-1/2 lg:top-8",
                    )}
                    aria-hidden
                  />

                  <motion.article
                    className={cn(
                      "rounded-2xl border border-glass-border bg-glass-bg/90 p-6 backdrop-blur-md",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                      "lg:max-w-[calc(50%-1.75rem)]",
                      i % 2 === 0
                        ? "lg:mr-auto lg:translate-x-0 lg:pr-4"
                        : "lg:ml-auto lg:translate-x-0 lg:pl-4",
                    )}
                    initial={{ opacity: 0, x: fromX }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="text-lg font-bold text-white">
                      {exp.company}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent-blue">
                      {exp.role}
                    </p>
                    <p className="mt-1 text-[13px] text-text-muted">
                      {exp.period} · {exp.location}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-[1.7] text-text-muted">
                      {exp.bullets.map((b) => (
                        <li key={b} className="relative pl-4">
                          <span
                            className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-accent-blue/80"
                            aria-hidden
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {exp.stack.map((t) => (
                        <span
                          key={t}
                          className={cn(
                            "rounded-md border border-accent-blue/35 bg-glass-bg px-2 py-0.5",
                            "text-[11px] font-medium text-accent-blue/95 backdrop-blur-sm",
                          )}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}

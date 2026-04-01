"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { projects } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const tagToneClass: Record<
  (typeof projects)[number]["tags"][number]["tone"],
  string
> = {
  blue: "border-accent-blue/45 bg-accent-blue/10 text-accent-blue",
  cyan: "border-accent-cyan/45 bg-accent-cyan/10 text-accent-cyan",
  purple:
    "border-purple-400/40 bg-purple-500/12 text-purple-200",
};

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotateY.set(Math.max(-10, Math.min(10, px * -20)));
    rotateX.set(Math.max(-10, Math.min(10, py * 20)));
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      className="h-full [perspective:1000px]"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: index * 0.15,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl",
          "border border-[rgba(79,142,247,0.2)] bg-glass-bg/85 backdrop-blur-md",
          "transition-[box-shadow,transform] duration-300 ease-out",
          "hover:shadow-[0_0_32px_rgba(79,142,247,0.2),0_0_60px_rgba(99,179,237,0.08),inset_0_0_0_1px_rgba(99,179,237,0.15)]",
        )}
      >
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#4F8EF7] to-[#63B3ED]" />

        <div className="relative flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading text-xl font-bold tracking-tight text-white">
                {project.name}
              </h3>
              <p className="mt-1 text-[13px] italic text-accent-blue">
                {project.subtitle}
              </p>
            </div>
            <span className="shrink-0 text-right text-xs text-text-muted">
              {project.period}
            </span>
          </div>

          <p className="mt-4 flex-1 text-sm leading-[1.7] text-text-muted">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((t) => (
              <span
                key={t}
                className={cn(
                  "rounded-md border border-accent-blue/35 bg-glass-bg px-2 py-0.5",
                  "text-[10px] font-medium text-text-primary/90 backdrop-blur-sm",
                )}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  tagToneClass[tag.tone],
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <Link
            href={project.href}
            className={cn(
              "mt-6 inline-flex w-fit items-center gap-1 rounded-lg border border-accent-blue/40",
              "px-4 py-2 text-sm font-semibold text-accent-blue transition-colors",
              "hover:border-accent-blue hover:bg-accent-blue/10",
            )}
          >
            View Project →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <SectionWrapper id="projects">
      <p className="font-mono text-sm font-medium tracking-wide text-accent-blue">
        {"// PROJECTS"}
      </p>
      <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
        Things I&apos;ve built
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}

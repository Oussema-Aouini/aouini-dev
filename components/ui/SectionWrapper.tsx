"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

export type SectionWrapperProps = {
  id: string;
  children: ReactNode;
  className?: string;
  overlap?: boolean;
};

const SECTION_Z_INDEX: Record<string, number> = {
  about: 60,
  experience: 50,
  projects: 40,
  skills: 30,
  chat: 20,
  contact: 10,
};

export function SectionWrapper({
  id,
  children,
  className,
  overlap = true,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const zIndex = SECTION_Z_INDEX[id] ?? 10;
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Spring smoothing prevents micro-jitter while keeping responsive motion.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.45,
  });

  const y = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [48, 0, -48] : [170, 0, -170],
  );
  const depth = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [-80, 0, -80] : [-420, 0, -420],
  );
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [4, 0, -4] : [24, 0, -24],
  );
  const scale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [0.97, 1, 0.97] : [0.84, 1, 0.84],
  );
  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.5, 0.8, 1],
    prefersReducedMotion
      ? [0.55, 0.9, 1, 0.9, 0.55]
      : [0.1, 0.62, 1, 0.62, 0.1],
  );

  const transform3d = useMotionTemplate`translate3d(0px, ${y}px, ${depth}px) rotateX(${rotateX}deg) scale(${scale})`;

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{ zIndex }}
      className={cn(
        "relative isolate flex min-h-screen items-center justify-center overflow-hidden px-[40px] [perspective:1150px]",
        overlap
          ? "-mt-16 pt-[116px] pb-[80px] sm:-mt-20 sm:pt-[128px] md:-mt-24 md:pt-[140px]"
          : "py-[80px]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0f1e] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,142,247,0.12),transparent_45%),radial-gradient(circle_at_bottom,rgba(99,179,237,0.08),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/25 to-transparent" />
      </div>
      <div className="mx-auto w-full max-w-[1200px]">
        <motion.div
          style={{
            transformOrigin: "center top",
            transform: transform3d,
            opacity,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

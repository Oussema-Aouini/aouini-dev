"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  FaGithub,
  FaJava,
  FaPython,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";
import { SiNextdotjs, SiHuggingface } from "react-icons/si";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

const techNodes = [
  { key: "github", label: "GitHub", Icon: FaGithub, color: "#E5E7EB" },
  { key: "nextjs", label: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF" },
  { key: "huggingface", label: "Hugging Face", Icon: SiHuggingface, color: "#FFD21E" },
  { key: "java", label: "Java", Icon: FaJava, color: "#F89820" },
  { key: "python", label: "Python", Icon: FaPython, color: "#3776AB" },
  { key: "react", label: "React", Icon: FaReact, color: "#61DAFB" },
  { key: "node", label: "Node.js", Icon: FaNodeJs, color: "#68A063" },
];

const HERO_TERMINAL_ROLES = [
  "Engineering student",
  "AI enthusiast",
  "Nerdy developer",
];

const TYPE_MS = 70;
const DELETE_MS = 38;
const HOLD_MS = 1150;

function scrollToProjects() {
  document
    .getElementById("projects")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ScrollMouseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="40"
      viewBox="0 0 28 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="26"
        height="38"
        rx="13"
        stroke="currentColor"
        strokeWidth="2"
        opacity={0.45}
      />
      <g className="hero-scroll-wheel text-text-muted">
        <rect x="12" y="10" width="4" height="8" rx="2" fill="currentColor" />
      </g>
    </svg>
  );
}

export function HeroSection() {
  const [pastHeroScroll, setPastHeroScroll] = useState(false);
  const [revealScrollHint, setRevealScrollHint] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");
  const [deletingRole, setDeletingRole] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHeroScroll(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setRevealScrollHint(true), 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const currentRole = HERO_TERMINAL_ROLES[roleIndex] ?? "";

    if (!deletingRole && typedRole.length < currentRole.length) {
      const id = window.setTimeout(() => {
        setTypedRole(currentRole.slice(0, typedRole.length + 1));
      }, TYPE_MS);
      return () => window.clearTimeout(id);
    }

    if (!deletingRole && typedRole.length === currentRole.length) {
      const id = window.setTimeout(() => {
        setDeletingRole(true);
      }, HOLD_MS);
      return () => window.clearTimeout(id);
    }

    if (deletingRole && typedRole.length > 0) {
      const id = window.setTimeout(() => {
        setTypedRole(currentRole.slice(0, typedRole.length - 1));
      }, DELETE_MS);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      setDeletingRole(false);
      setRoleIndex((prev) => (prev + 1) % HERO_TERMINAL_ROLES.length);
    }, 120);
    return () => window.clearTimeout(id);
  }, [deletingRole, roleIndex, typedRole]);

  const scrollHintVisible = revealScrollHint && !pastHeroScroll;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col bg-transparent px-5 pb-10 pt-24 sm:px-10 sm:pb-16 sm:pt-[80px]"
    >
      <div className="flex w-full flex-1 flex-col justify-center">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <div className="w-full max-w-[600px] justify-self-center lg:justify-self-start">
            <motion.div
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent-blue bg-glass-bg px-4 py-2 text-xs font-medium text-text-primary shadow-[0_0_24px_rgba(79,142,247,0.12)] backdrop-blur-md sm:text-sm"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="hero-badge-dot" aria-hidden />
              <span className="tracking-wide">✦ Available for internships</span>
            </motion.div>

            <h1 className="font-heading font-bold leading-[0.95] tracking-tight">
              <motion.span
                className="block text-[48px] text-white md:text-[64px] lg:text-[80px]"
                style={{
                  textShadow:
                    "0 0 40px rgba(79, 142, 247, 0.25), 0 0 80px rgba(99, 179, 237, 0.12)",
                }}
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{
                  duration: 0.65,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Oussema
              </motion.span>
              <motion.span
                className="block bg-gradient-to-br from-[#4F8EF7] to-[#63B3ED] bg-clip-text text-[48px] text-transparent md:text-[64px] lg:text-[80px]"
                style={{
                  filter: "drop-shadow(0 0 24px rgba(79, 142, 247, 0.35))",
                }}
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{
                  duration: 0.65,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Aouini
              </motion.span>
            </h1>

            <motion.p
              className="mt-5 font-mono text-base tracking-[0.04em] text-text-muted md:text-[20px]"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-accent-blue">&gt; </span>
              {typedRole}
              <span
                className="boot-cursor ml-1 inline-block text-[var(--accent-cyan)]"
                aria-hidden
              >
                ▋
              </span>
            </motion.p>

            <motion.p
              className="mt-4 max-w-[480px] font-body text-sm leading-[1.7] text-text-muted md:text-base"
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{
                duration: 0.65,
                delay: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Building intelligent systems and modern web experiences. From
              AI chatbots to immersive frontends.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
              style={{ gap: "16px" }}
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{
                duration: 0.6,
                delay: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.button
                type="button"
                onClick={scrollToProjects}
                className="rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#63B3ED] px-8 py-3.5 text-center font-body text-sm font-bold text-white shadow-lg shadow-accent-blue/20 md:text-base"
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                Explore My Work
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="inline-flex rounded-lg"
              >
                <Link
                  href="/cv/Oussema_Aouini_CV.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-accent-blue bg-transparent px-8 py-3.5 text-center font-body text-sm font-semibold text-accent-blue transition-colors hover:bg-[rgba(79,142,247,0.1)] md:text-base"
                >
                  Download CV
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="relative hidden min-h-[min(50vh,420px)] w-full lg:block"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <div className="ml-auto mt-1 flex w-fit flex-col items-end">
              <div className="hero-profile-shell relative h-[260px] w-[260px]">
                <motion.span
                  className="hero-profile-orbit hero-profile-orbit-a"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                />
                <motion.span
                  className="hero-profile-orbit hero-profile-orbit-b"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="hero-profile-core"
                  animate={{
                    boxShadow: [
                      "0 0 28px rgba(79, 142, 247, 0.22), inset 0 0 20px rgba(99, 179, 237, 0.14)",
                      "0 0 52px rgba(79, 142, 247, 0.4), inset 0 0 34px rgba(99, 179, 237, 0.25)",
                      "0 0 28px rgba(79, 142, 247, 0.22), inset 0 0 20px rgba(99, 179, 237, 0.14)",
                    ],
                  }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="hero-profile-placeholder">
                    <Image
                      src="/profile%20picture.jpg"
                      alt="Oussema Aouini profile picture"
                      fill
                      sizes="260px"
                      className="hero-profile-image"
                      priority
                    />
                  </div>
                </motion.div>
                <motion.div
                  className="hero-tech-orbit hero-tech-orbit-outer"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                >
                  {techNodes.slice(0, 4).map(({ key, label, Icon, color }, index) => (
                    <span
                      key={key}
                      className={`hero-tech-node hero-tech-node-${index + 1}`}
                      aria-label={label}
                      style={{ "--tech-color": color } as CSSProperties}
                    >
                      <Icon />
                    </span>
                  ))}
                </motion.div>
                <motion.div
                  className="hero-tech-orbit hero-tech-orbit-inner"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  {techNodes.slice(4).map(({ key, label, Icon, color }, index) => (
                    <span
                      key={key}
                      className={`hero-tech-node hero-tech-node-inner-${index + 1}`}
                      aria-label={label}
                      style={{ "--tech-color": color } as CSSProperties}
                    >
                      <Icon />
                    </span>
                  ))}
                </motion.div>
              </div>
              <span className="mt-4 font-body text-xs tracking-[0.28em] text-text-muted">
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none mx-auto mt-8 flex flex-col items-center gap-2 pb-4 text-text-muted sm:mt-12"
        initial={false}
        animate={{
          opacity: scrollHintVisible ? 1 : 0,
          y: scrollHintVisible ? 0 : 10,
        }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        aria-hidden
      >
        <ScrollMouseIcon className="text-text-muted" />
        <span className="font-body text-xs tracking-widest text-text-muted sm:text-sm">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  );
}

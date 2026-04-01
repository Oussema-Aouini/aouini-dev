"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { personalInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <SectionWrapper id="contact">
      <div className="mx-auto max-w-[1000px] text-center">
        <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          Let&apos;s build{" "}
          <span className="bg-gradient-to-br from-[#4F8EF7] to-[#63B3ED] bg-clip-text text-transparent">
            something
          </span>
          .
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted">
          I&apos;m currently open to internship opportunities. Feel free to
          reach out — I respond within 24 hours.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.article
            className={cn(
              "flex flex-col rounded-2xl border border-glass-border bg-glass-bg/90 p-6 text-left backdrop-blur-md",
            )}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 0 28px rgba(79, 142, 247, 0.22), inset 0 0 0 1px rgba(99, 179, 237, 0.12)",
            }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <span className="text-2xl" aria-hidden>
              ✉
            </span>
            <p className="mt-3 break-all text-sm font-medium text-text-primary">
              {personalInfo.email}
            </p>
            <motion.button
              type="button"
              onClick={copyEmail}
              className="mt-4 w-full rounded-lg border border-accent-blue/50 px-4 py-2.5 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
              whileTap={{ scale: 0.98 }}
            >
              {copied ? "Copied! ✓" : "Copy email"}
            </motion.button>
          </motion.article>

          <motion.article
            className={cn(
              "flex flex-col rounded-2xl border border-glass-border bg-glass-bg/90 p-6 text-left backdrop-blur-md",
            )}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 0 28px rgba(79, 142, 247, 0.22), inset 0 0 0 1px rgba(99, 179, 237, 0.12)",
            }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <span className="text-2xl" aria-hidden>
              ⌥
            </span>
            <p className="mt-3 text-sm font-medium text-text-primary">
              github.com/oussema-aouini
            </p>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-accent-blue/50 px-4 py-2.5 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
            >
              View Profile →
            </a>
          </motion.article>

          <motion.article
            className={cn(
              "flex flex-col rounded-2xl border border-glass-border bg-glass-bg/90 p-6 text-left backdrop-blur-md",
            )}
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 0 28px rgba(79, 142, 247, 0.22), inset 0 0 0 1px rgba(99, 179, 237, 0.12)",
            }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
          >
            <span className="text-xl font-bold tracking-tight text-accent-blue">
              in
            </span>
            <p className="mt-3 text-sm font-medium text-text-primary">
              Oussema Aouini
            </p>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-accent-blue/50 px-4 py-2.5 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
            >
              Connect →
            </a>
          </motion.article>
        </div>

        <p className="mt-16 text-center text-xs text-text-muted">
          Built with Next.js, Three.js, and a sprinkle of magic
        </p>
      </div>
    </SectionWrapper>
  );
}

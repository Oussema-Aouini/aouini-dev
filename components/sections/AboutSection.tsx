"use client";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { about, aboutStats } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCountUpOnView } from "@/hooks/useCountUpOnView";

function StatIcon({ type }: { type: (typeof aboutStats)[number]["icon"] }) {
  const className = "h-6 w-6 shrink-0 text-accent-blue";
  switch (type) {
    case "internships":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      );
    case "projects":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "accuracy":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 19V5M4 19h16M8 15l3-3 3 3 4-6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function StatCard({
  value,
  displaySuffix,
  label,
  icon,
}: (typeof aboutStats)[number]) {
  const { ref, display } = useCountUpOnView(value, { durationMs: 1700 });

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-glass-border",
        "bg-glass-bg/90 px-5 py-5 backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "border border-accent-blue/30 bg-bg-primary/60",
        )}
      >
        <StatIcon type={icon} />
      </div>
      <div className="min-w-0">
        <p className="font-heading text-4xl font-bold tracking-tight text-accent-blue sm:text-[2.75rem]">
          {display}
          {displaySuffix}
        </p>
        <p className="mt-1 text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <SectionWrapper id="about" overlap={false}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <div>
          <p className="font-mono text-sm font-medium tracking-wide text-accent-blue">
            {about.label}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[48px]">
            {about.headingLead}{" "}
            <span className="bg-gradient-to-br from-[#4F8EF7] to-[#63B3ED] bg-clip-text text-transparent">
              {about.headingHighlight}
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-text-muted">
            {about.bio}
          </p>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              AI
            </p>
            <div className="flex flex-wrap gap-2">
              {about.techRows.ai.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-full border border-accent-blue/50 bg-glass-bg px-3 py-1",
                    "text-xs font-medium text-text-primary backdrop-blur-sm",
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Web
            </p>
            <div className="flex flex-wrap gap-2">
              {about.techRows.web.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-full border border-accent-blue/50 bg-glass-bg px-3 py-1",
                    "text-xs font-medium text-text-primary backdrop-blur-sm",
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:pt-10">
          {aboutStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

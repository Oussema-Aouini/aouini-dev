"use client";

import { useEffect, useRef } from "react";

const BASE_TITLE = "Oussema Aouini — AI & Web Developer";

const SECTION_TITLES: Record<string, string> = {
  hero: "Home",
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  chat: "Chat",
  contact: "Contact",
};

export function DocumentTitleSync({ active }: { active: boolean }) {
  const activeRef = useRef<string>("hero");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!active) {
      document.title = BASE_TITLE;
      activeRef.current = "hero";
      return;
    }

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      const ids = Object.keys(SECTION_TITLES);
      const sections = ids
        .map((sid) => document.getElementById(sid))
        .filter(Boolean) as HTMLElement[];

      if (sections.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting && e.intersectionRatio > 0.08)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          const top = visible[0]?.target.id;
          if (!top || top === activeRef.current) return;
          activeRef.current = top;
          const label = SECTION_TITLES[top];
          if (label) {
            document.title =
              label === "Home" ? BASE_TITLE : `${label} · ${BASE_TITLE}`;
          }
        },
        {
          root: null,
          threshold: [0.08, 0.15, 0.25, 0.4, 0.55],
          rootMargin: "-64px 0px -48% 0px",
        },
      );

      observerRef.current = observer;
      sections.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [active]);

  return null;
}

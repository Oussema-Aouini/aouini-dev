"use client";

import { type RefObject, useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type Options = {
  durationMs?: number;
  threshold?: number;
  rootMargin?: string;
};

export function useCountUpOnView(
  endValue: number,
  options: Options = {},
): { ref: RefObject<HTMLDivElement | null>; display: number } {
  const { durationMs = 1600, threshold = 0.35, rootMargin = "0px" } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1);
          setDisplay(Math.round(endValue * easeOutCubic(t)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold, rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [durationMs, endValue, rootMargin, threshold]);

  return { ref, display };
}

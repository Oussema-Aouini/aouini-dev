import { useEffect, useRef, useState } from "react";

function computeScrollProgress(): number {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;
  const p = window.scrollY / maxScroll;
  return Math.min(1, Math.max(0, p));
}

export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const flush = () => {
      rafRef.current = null;
      setScrollProgress(computeScrollProgress());
    };

    const scheduleFlush = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(flush);
      }
    };

    flush();

    window.addEventListener("scroll", scheduleFlush, { passive: true });
    window.addEventListener("resize", scheduleFlush);

    return () => {
      window.removeEventListener("scroll", scheduleFlush);
      window.removeEventListener("resize", scheduleFlush);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scrollProgress;
}

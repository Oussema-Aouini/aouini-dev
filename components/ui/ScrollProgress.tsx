"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const scrollProgress = useScrollProgress();
  const widthPct = `${scrollProgress * 100}%`;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[50] h-[2px] w-full"
      aria-hidden
    >
      <div
        className="h-[2px] rounded-none"
        style={{
          width: widthPct,
          background: "linear-gradient(90deg, #4F8EF7, #63B3ED)",
          boxShadow:
            "0 0 10px rgba(79, 142, 247, 0.7), 0 0 24px rgba(79, 142, 247, 0.35)",
        }}
      />
    </div>
  );
}

"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { createContext, useContext } from "react";

interface ScrollContextValue {
  progress: number;
  velocity: number;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const progress = useScrollProgress();

  return (
    <ScrollContext.Provider value={{ progress, velocity: 0 }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
}

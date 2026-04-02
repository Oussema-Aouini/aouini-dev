"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

/**
 * Defers analytics mounting until after hydration completes.
 * This prevents blocking the initial render and LCP.
 */
export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Suspense, useLayoutEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <SceneCanvasFallback />,
});

function SceneCanvasFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-[#0a0f1e]"
      aria-hidden
    />
  );
}

export function SceneHost() {
  const [desktop3d, setDesktop3d] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop3d(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showCanvas = desktop3d === true;
  const showMobileBg = desktop3d !== true;

  return (
    <>
      {showMobileBg && (
        <div
          className="mobile-gradient-bg pointer-events-none fixed inset-0 z-0"
          aria-hidden
        />
      )}
      {showCanvas && (
        <Suspense fallback={<SceneCanvasFallback />}>
          <Scene />
        </Suspense>
      )}
    </>
  );
}

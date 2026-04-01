"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function PostProcessing() {
  const { gl } = useThree();
  const initializedRef = useRef(false);

  useFrame(() => {
    // Set tone mapping exposure once for enhanced glow effect
    if (gl && !initializedRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/immutability
      (gl as any).toneMappingExposure = 1.2;
      initializedRef.current = true;
    }
  });

  return null;
}

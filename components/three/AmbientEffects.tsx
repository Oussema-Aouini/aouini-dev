"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function AmbientEffects() {
  const light1Ref = useRef<THREE.Light>(null);
  const light2Ref = useRef<THREE.Light>(null);
  const progress = useScrollProgress();

  useFrame(() => {
    if (light1Ref.current) {
      // Pulse intensity with scroll: oscillate between 0.6 and 1.2
      const baseIntensity = 0.9;
      const pulse = Math.sin(progress * Math.PI * 4) * 0.3;
      (light1Ref.current as THREE.Light).intensity = baseIntensity + pulse;
    }

    if (light2Ref.current) {
      // Inverse pulse for secondary light
      const baseIntensity = 0.6;
      const pulse = Math.cos(progress * Math.PI * 4) * 0.25;
      (light2Ref.current as THREE.Light).intensity = baseIntensity + pulse;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#0a0f1e", 12, 40]} />
      <ambientLight intensity={0.25} />
      <pointLight
        ref={light1Ref}
        position={[5, 5, 5]}
        color="#4F8EF7"
        intensity={0.9}
      />
      <pointLight
        ref={light2Ref}
        position={[-5, -5, 3]}
        color="#63B3ED"
        intensity={0.6}
      />
      {/* Accent light that moves with scroll */}
      <pointLight
        position={[
          Math.cos(progress * Math.PI * 2) * 8,
          Math.sin(progress * Math.PI * 2) * 3,
          5,
        ]}
        color="#805AD5"
        intensity={0.4}
      />
    </>
  );
}

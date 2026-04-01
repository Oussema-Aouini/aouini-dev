"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { AmbientEffects } from "./AmbientEffects";
import { FloatingGeometry } from "./FloatingGeometry";
import { ParticleField } from "./ParticleField";
import { ScrollCamera } from "./ScrollCamera";
import { Suspense } from "react";
import PostProcessing from "./PostProcessing";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows={false}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{
        fov: 75,
        position: [0, 0, 5],
        near: 0.1,
        far: 200,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        zIndex: 0,
      }}
    >
      <color attach="background" args={["#0a0f1e"]} />
      <AmbientEffects />
      <ParticleField />
      <FloatingGeometry
        position={[2.5, 0.5, 0]}
        type="icosahedron"
        color="#4F8EF7"
        speed={0.003}
        scale={0.8}
      />
      <FloatingGeometry
        position={[-3, -1, -2]}
        type="torus"
        color="#63B3ED"
        speed={0.002}
        scale={0.6}
      />
      <FloatingGeometry
        position={[0, 2, -3]}
        type="octahedron"
        color="#805AD5"
        speed={0.004}
        scale={0.5}
      />
      <ScrollCamera />
      <Suspense fallback={null}>
        <PostProcessing />
      </Suspense>
    </Canvas>
  );
}

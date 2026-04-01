"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 1800;
const SPHERE_R = 20;

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function randomInSphere(
  out: THREE.Vector3,
  radius: number,
  u: number,
  v: number,
  w: number,
) {
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(w) * radius;
  out.set(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  );
  return out;
}

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const targetParallax = useRef({ x: 0, y: 0 });
  const parallax = useRef({ x: 0, y: 0 });
  const progress = useScrollProgress();

  const geometry = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const cBlue = new THREE.Color("#4F8EF7");
    const cCyan = new THREE.Color("#63B3ED");
    const tmp = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      const u = pseudoRandom(i + 1);
      const v = pseudoRandom((i + 1) * 1.37);
      const w = pseudoRandom((i + 1) * 2.11);
      randomInSphere(
        tmp,
        SPHERE_R,
        u,
        v,
        w,
      );
      positions[i * 3] = tmp.x;
      positions[i * 3 + 1] = tmp.y;
      positions[i * 3 + 2] = tmp.z;

      const mix = pseudoRandom((i + 1) * 3.73);
      const col = cBlue.clone().lerp(cCyan, mix);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      // Enhanced parallax with smoother interaction
      targetParallax.current = { x: nx * 0.4, y: ny * 0.4 };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const mesh = pointsRef.current;
    if (!mesh) return;

    // Base rotation with scroll influence
    const scrollInfluence = Math.sin(progress * Math.PI * 2) * 0.0001;
    mesh.rotation.y += 0.00015 + scrollInfluence;
    mesh.rotation.x += 0.0001 + Math.cos(progress * Math.PI) * 0.00005;

    // Enhanced parallax with easing
    parallax.current.x +=
      (targetParallax.current.x - parallax.current.x) * 0.06;
    parallax.current.y +=
      (targetParallax.current.y - parallax.current.y) * 0.06;

    mesh.position.x = parallax.current.x;
    mesh.position.y = parallax.current.y;

    // Scroll-based vertical drift
    mesh.position.z = Math.sin(progress * Math.PI * 2) * 0.5;

    // Scale particles based on scroll progress for depth effect
    const materialScale = 0.015 + Math.sin(progress * Math.PI) * 0.005;
    const material = mesh.material as THREE.PointsMaterial;
    if (material) {
      material.size = materialScale;
      // Subtle opacity variation
      material.opacity = 0.85 + Math.sin(progress * Math.PI) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        vertexColors
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

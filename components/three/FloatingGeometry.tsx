"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type FloatingGeometryProps = {
  position: [number, number, number];
  type: "icosahedron" | "torus" | "octahedron";
  color: string;
  speed: number;
  scale: number;
};

function makeGeometry(type: FloatingGeometryProps["type"]): THREE.BufferGeometry {
  switch (type) {
    case "icosahedron":
      return new THREE.IcosahedronGeometry(1, 0);
    case "torus":
      return new THREE.TorusGeometry(0.9, 0.35, 16, 48);
    case "octahedron":
      return new THREE.OctahedronGeometry(1, 0);
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

const AnimatedMesh = animated("mesh");

export function FloatingGeometry({
  position,
  type,
  color,
  speed,
  scale: scaleProp,
}: FloatingGeometryProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const [x, y, z] = position;
  const progress = useScrollProgress();

  const geometry = useMemo(() => makeGeometry(type), [type]);

  const { scale } = useSpring({
    scale: hovered ? scaleProp * 1.15 : scaleProp,
    config: { mass: 1, tension: 280, friction: 22 },
  });

  useFrame((_, delta) => {
    t.current += delta;
    const m = meshRef.current;
    if (!m) return;

    // Rotation influenced by scroll
    const scrollInfluence = Math.sin(progress * Math.PI) * 0.0005;
    m.rotation.x += speed * delta + scrollInfluence;
    m.rotation.y += speed * 0.7 * delta + scrollInfluence;
    m.rotation.z += speed * 0.5 * delta + scrollInfluence;

    // Vertical bobbing with scroll-based enhancement
    const bobAmplitude = 0.15 + Math.abs(Math.sin(progress * Math.PI)) * 0.1;
    m.position.set(x, y + Math.sin(t.current * 1.1) * bobAmplitude, z);
  });

  return (
    <AnimatedMesh
      ref={meshRef}
      geometry={geometry}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3 + Math.sin(progress * Math.PI * 2) * 0.15}
        wireframe={false}
        metalness={0.8}
        roughness={0.2}
      />
    </AnimatedMesh>
  );
}

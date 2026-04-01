"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easing, lerp } from "@/lib/easing";

const KEYFRAMES = [
  { scroll: 0, position: [0, 0, 8], lookAt: [0, 0, 0] },
  { scroll: 0.15, position: [-3, 1, 5], lookAt: [0, 0, 0] },
  { scroll: 0.3, position: [3, -1, 4], lookAt: [0, 0, 0] },
  { scroll: 0.45, position: [0, 2, 6], lookAt: [0, 0, 0] },
  { scroll: 0.6, position: [-2, -2, 5], lookAt: [0, 0, 0] },
  { scroll: 0.75, position: [2, 0, 4], lookAt: [0, 0, 0] },
  { scroll: 0.9, position: [0, -1, 6], lookAt: [0, 0, 0] },
] as const;

function sampleCamera(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
) {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  while (i < KEYFRAMES.length - 1 && KEYFRAMES[i + 1]!.scroll <= p) {
    i += 1;
  }

  if (i >= KEYFRAMES.length - 1) {
    const last = KEYFRAMES[KEYFRAMES.length - 1]!;
    outPos.set(last.position[0], last.position[1], last.position[2]);
    outLook.set(last.lookAt[0], last.lookAt[1], last.lookAt[2]);
    return;
  }

  const a = KEYFRAMES[i]!;
  const b = KEYFRAMES[i + 1]!;
  const span = b.scroll - a.scroll;
  const rawT = span <= 0 ? 0 : (p - a.scroll) / span;
  // Use easing for smooth interpolation between keyframes
  const t = easing.easeInOutCubic(rawT);

  outPos.set(
    lerp(a.position[0], b.position[0], t),
    lerp(a.position[1], b.position[1], t),
    lerp(a.position[2], b.position[2], t),
  );
  outLook.set(
    lerp(a.lookAt[0], b.lookAt[0], t),
    lerp(a.lookAt[1], b.lookAt[1], t),
    lerp(a.lookAt[2], b.lookAt[2], t),
  );
}

export function ScrollCamera() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  const progress = useScrollProgress();

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const smoothLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useFrame(() => {
    const cam = cameraRef.current as THREE.PerspectiveCamera;
    sampleCamera(progress, targetPos.current, targetLook.current);
    // Smooth camera position with exponential lerp for fluid motion
    cam.position.lerp(targetPos.current, 0.12);
    // Smooth lookAt point
    smoothLook.current.lerp(targetLook.current, 0.12);
    cam.lookAt(smoothLook.current);
  });

  return null;
}

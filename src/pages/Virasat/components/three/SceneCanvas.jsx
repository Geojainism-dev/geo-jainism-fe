import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";

/**
 * Shared <Canvas> with conservative defaults: capped DPR that steps down
 * when the frame rate drops, ACES tone mapping and no antialias cost on
 * high-DPR screens.
 */
export default function SceneCanvas({ children, frameloop = "always", camera, className, onCreated }) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.75));

  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      dpr={dpr}
      camera={{ fov: 42, near: 0.1, far: 80, position: [0, 1.7, 14], ...camera }}
      gl={{
        antialias: (window.devicePixelRatio || 1) < 1.5,
        powerPreference: "high-performance",
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={onCreated}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.5))}
        onIncline={() => setDpr((d) => Math.min(window.devicePixelRatio || 1, 1.75, d + 0.25))}
      />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}

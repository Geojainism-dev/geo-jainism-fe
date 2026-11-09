import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import HeritageModel, { PORTAL_Z, BAY } from "./HeritageModel";
import ParticleField from "./ParticleField";

const BG = "#0E0B0B";

/**
 * Camera rig:
 *  - entrance: glides in from deep outside the hall on mount
 *  - pointer: gentle parallax towards the cursor
 *  - scroll:  `progress` (0→1 while the hero scrolls away) walks the camera
 *             down the hall towards the portal
 */
function CameraRig({ progress }) {
  const { camera, pointer } = useThree();
  const intro = useRef({ t: 0 });
  const look = useRef(new THREE.Vector3(0.4, 2.4, PORTAL_Z));
  const pos = useRef(new THREE.Vector3());

  useEffect(() => {
    const tween = gsap.to(intro.current, { t: 1, duration: 3.6, ease: "power3.out", delay: 0.2 });
    return () => tween.kill();
  }, []);

  useFrame((_, delta) => {
    const t = intro.current.t;
    const p = progress.current ?? 0;
    const startZ = 16;
    const restZ = 7.5;
    const z = THREE.MathUtils.lerp(startZ, restZ, t) - p * BAY * 2.6;
    pos.current.set(0.35 + pointer.x * 0.55, 1.55 + pointer.y * 0.22 + (1 - t) * 0.6, z);
    camera.position.lerp(pos.current, 1 - Math.pow(0.0015, delta));
    look.current.set(-2.4 + pointer.x * 0.3, 2.35 + pointer.y * 0.12, PORTAL_Z);
    camera.lookAt(look.current);
  });
  return null;
}

/** Warm lights that breathe like flames. */
function FlameLight({ position, intensity = 6, color = "#ff9a4a", distance = 9, seed = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + seed;
    ref.current.intensity = intensity * (0.86 + Math.sin(t * 6.3) * 0.06 + Math.sin(t * 11.7) * 0.05);
  });
  return <pointLight ref={ref} position={position} intensity={intensity} color={color} distance={distance} decay={1.6} />;
}

export default function HeroScene({ progress, videoSrc, quality = "high" }) {
  const high = quality === "high";
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, 46]} />

      <ambientLight intensity={0.32} color="#ffd7b0" />
      <hemisphereLight args={["#3a2a4a", "#1a0c08", 0.35]} />
      {/* moonlight rim from above-left */}
      <directionalLight position={[-6, 10, 4]} intensity={0.55} color="#9fb1d6" />

      {/* the portal throws warm light back down the hall */}
      <pointLight position={[0, 3.2, PORTAL_Z + 2]} intensity={90} color="#ffb267" distance={44} decay={1.4} />
      {/* warm key from just behind the viewer, so the near pillars read */}
      <pointLight position={[0, 4.5, 9]} intensity={14} color="#ffcf9a" distance={22} decay={1.5} />
      <FlameLight position={[-1.9, 0.5, 2.2]} seed={0} />
      <FlameLight position={[1.9, 0.5, -6.2]} seed={2.3} />
      {high && <FlameLight position={[-1.9, 0.5, -14.6]} seed={4.1} intensity={5} />}

      <HeritageModel videoSrc={videoSrc} reflections={high} />
      <ParticleField count={high ? 1600 : 700} />
      <CameraRig progress={progress} />
    </>
  );
}

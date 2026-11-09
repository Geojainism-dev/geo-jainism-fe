import { useEffect, useState } from "react";

const query = (q) => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q) : null);

/** Live `prefers-reduced-motion: reduce` flag. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => query("(prefers-reduced-motion: reduce)")?.matches ?? false);
  useEffect(() => {
    const mq = query("(prefers-reduced-motion: reduce)");
    if (!mq) return undefined;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Live media-query match. */
export function useMediaQuery(q) {
  const [matches, setMatches] = useState(() => query(q)?.matches ?? false);
  useEffect(() => {
    const mq = query(q);
    if (!mq) return undefined;
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [q]);
  return matches;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Whether the hero should render the real-time 3D scene.
 * Falls back to the cinematic video/photo hero on: reduced motion, no WebGL,
 * data-saver, small touch devices and low-core machines.
 */
export function useCanRender3D() {
  const reduced = usePrefersReducedMotion();
  const smallTouch = useMediaQuery("(max-width: 767px) and (pointer: coarse)");
  const [capable] = useState(() => {
    if (typeof window === "undefined") return false;
    const saveData = navigator.connection?.saveData === true;
    const lowCores = (navigator.hardwareConcurrency ?? 8) < 4;
    const lowMemory = (navigator.deviceMemory ?? 8) < 4;
    return hasWebGL() && !saveData && !lowCores && !lowMemory;
  });
  return capable && !reduced && !smallTouch;
}

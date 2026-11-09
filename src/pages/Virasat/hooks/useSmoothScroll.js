import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Height of the shared site #navbar (src/styles/navbar.css). */
export const NAV_OFFSET = 70;

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis
 * read the same scroll position on the same frame. Disabled entirely under
 * reduced motion (native scrolling, instant jumps).
 */
export function useSmoothScroll(reducedMotion) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  /** Scroll to a section id (or 0 for top). */
  const scrollTo = useCallback(
    (target) => {
      const el = typeof target === "string" ? document.getElementById(target) : null;
      const top = target === 0 || target === "home" ? 0 : el ? el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET : null;
      if (top === null) return;
      if (lenisRef.current) lenisRef.current.scrollTo(top, { duration: 1.4 });
      else window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  return { scrollTo, lenisRef };
}

export const VirasatContext = createContext({
  scrollTo: () => {},
  openBooking: () => {},
  reducedMotion: false,
  lenisRef: { current: null },
});

export const useVirasat = () => useContext(VirasatContext);

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2.0,
      normalizeWheel: true,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
    });

    let raf;

    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    /* Pause when tab is hidden, resume when visible — prevents drift */
    const onVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        cancelAnimationFrame(raf);
      } else {
        lenis.start();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const handleAnchor = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: -40, duration: 1.4 });
        }
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      document.removeEventListener("click", handleAnchor);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
};

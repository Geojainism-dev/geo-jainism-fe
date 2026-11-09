import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const EASE = "expo.out";

/**
 * Runs `setup(ctx)` inside a scoped gsap.context bound to `scopeRef`, and
 * reverts every tween/ScrollTrigger it created on unmount. Under reduced
 * motion `setup` is skipped and content stays in its final, visible state.
 */
export function useGsap(scopeRef, setup, deps = [], { reducedMotion = false } = {}) {
  useLayoutEffect(() => {
    if (!scopeRef.current || reducedMotion) return undefined;
    const ctx = gsap.context(() => setup(scopeRef.current), scopeRef.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);
}

/** Words (from <SplitWords>) rise out of their masks as the heading enters. */
export function revealWords(root, selector = "[data-split]", opts = {}) {
  root.querySelectorAll(selector).forEach((el) => {
    gsap.from(el.querySelectorAll("[data-word]"), {
      yPercent: 115,
      rotate: 4,
      duration: 1.25,
      ease: EASE,
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      ...opts,
    });
  });
}

/** Fade-and-lift for any element marked data-reveal (optional data-delay). */
export function revealUp(root, selector = "[data-reveal]") {
  root.querySelectorAll(selector).forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1.1,
      delay: Number(el.dataset.delay || 0),
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    });
  });
}

/** Image unveils from a clip-path curtain while its inner image settles from a zoom. */
export function revealImages(root, selector = "[data-clip]") {
  root.querySelectorAll(selector).forEach((el) => {
    const inner = el.querySelector("img, video");
    const dir = el.dataset.clip || "up";
    const from = {
      up: "inset(100% 0% 0% 0%)",
      down: "inset(0% 0% 100% 0%)",
      left: "inset(0% 100% 0% 0%)",
      right: "inset(0% 0% 0% 100%)",
    }[dir];
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
    tl.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
    if (inner) tl.from(inner, { scale: 1.35, duration: 2, ease: EASE }, 0);
  });
}

/** Scrubbed vertical parallax. data-speed: positive drifts up, negative down. */
export function parallax(root, selector = "[data-speed]") {
  root.querySelectorAll(selector).forEach((el) => {
    const speed = Number(el.dataset.speed || 0.2);
    gsap.fromTo(
      el,
      { yPercent: speed * 50 },
      {
        yPercent: -speed * 50,
        ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  });
}

export { gsap, ScrollTrigger };

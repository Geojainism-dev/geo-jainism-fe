import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const ANIMATION_DURATION = 1100; // ms — match Lenis duration
const WHEEL_THRESHOLD    = 40;   // min deltaY to count as intentional scroll
const WHEEL_COOLDOWN     = 80;   // ms to debounce fast trackpad events
const TOUCH_THRESHOLD    = 50;   // px swipe to trigger

export const useSnapScroll = () => {
  useEffect(() => {
    /* ── Lenis used only as a smooth-scroll engine for programmatic scrollTo ── */
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: false,   // we handle wheel ourselves
      syncTouch: false,
    });

    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    /* ── Section helpers ── */
    const getSections = () => Array.from(document.querySelectorAll("section[id]"));

    const getCurrentIndex = () => {
      const mid = window.innerHeight / 2;
      const sects = getSections();
      let idx = 0;
      for (let i = 0; i < sects.length; i++) {
        if (sects[i].getBoundingClientRect().top <= mid) idx = i;
      }
      return idx;
    };

    /* ── Snap to section ── */
    let isAnimating = false;

    const snapTo = (index) => {
      const sects = getSections();
      if (index < 0 || index >= sects.length || isAnimating) return;
      isAnimating = true;
      lenis.scrollTo(sects[index], { offset: 0, duration: 1.1 });
      setTimeout(() => { isAnimating = false; }, ANIMATION_DURATION);
    };

    /* ── Wheel (mouse + trackpad) ── */
    let wheelAccum = 0;
    let wheelTimer  = null;

    const onWheel = (e) => {
      e.preventDefault();
      if (isAnimating) return;

      wheelAccum += e.deltaY;
      clearTimeout(wheelTimer);

      wheelTimer = setTimeout(() => {
        if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) { wheelAccum = 0; return; }
        const dir = wheelAccum > 0 ? 1 : -1;
        snapTo(getCurrentIndex() + dir);
        wheelAccum = 0;
      }, WHEEL_COOLDOWN);
    };

    /* ── Touch / swipe ── */
    let touchStartY = 0;

    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };

    const onTouchEnd = (e) => {
      if (isAnimating) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < TOUCH_THRESHOLD) return;
      snapTo(getCurrentIndex() + (diff > 0 ? 1 : -1));
    };

    /* ── Keyboard ── */
    const onKeyDown = (e) => {
      if (isAnimating) return;
      const current = getCurrentIndex();
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault(); snapTo(current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault(); snapTo(current - 1);
      }
    };

    /* ── Anchor links ── */
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const el = document.querySelector(a.getAttribute("href"));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0, duration: 1.1 }); }
    };

    /* ── Tab visibility — pause when hidden ── */
    const onVisibility = () => {
      if (document.hidden) { lenis.stop(); cancelAnimationFrame(raf); }
      else { lenis.start(); raf = requestAnimationFrame(loop); }
    };

    window.addEventListener("wheel",        onWheel,       { passive: false });
    window.addEventListener("touchstart",   onTouchStart,  { passive: true  });
    window.addEventListener("touchend",     onTouchEnd,    { passive: true  });
    window.addEventListener("keydown",      onKeyDown);
    document.addEventListener("click",      onAnchorClick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("wheel",       onWheel);
      window.removeEventListener("touchstart",  onTouchStart);
      window.removeEventListener("touchend",    onTouchEnd);
      window.removeEventListener("keydown",     onKeyDown);
      document.removeEventListener("click",     onAnchorClick);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(wheelTimer);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
};

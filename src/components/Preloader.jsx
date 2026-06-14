import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../styles/preloader.css";

export default function Preloader({ startAnimation, onComplete }) {
  const leftRef   = useRef(null);
  const rightRef  = useRef(null);
  const centerRef = useRef(null);
  const wrapRef   = useRef(null);

  useEffect(() => {
    if (!startAnimation) {
      console.log("❌ Preloader: startAnimation is false");
      return;
    }

    console.log("✅ Preloader: Starting animation...");
    window.scrollTo({ top: 0, behavior: "instant" });
    const tl = gsap.timeline();

    /* 1. Reveal center content */
    tl.to(centerRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })

    /* 2. Draw outer circle */
      .fromTo(".preloader-circle",
        { strokeDashoffset: 314 },
        { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, "<")

    /* 3. Draw inner circle with slight delay */
      .fromTo(".preloader-circle-inner",
        { strokeDashoffset: 176 },
        { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, "<0.25")

    /* 4. Fade in Om + text */
      .to(".preloader-om",   { opacity: 1, duration: 0.6, ease: "power2.out" }, "<0.5")
      .to(".preloader-text", { opacity: 1, duration: 0.5, ease: "power2.out" }, "<0.1")
      .to(".preloader-line", { scaleX: 1,  duration: 0.7, ease: "power2.out", transformOrigin: "left center" }, "<0.15")

    /* 5. Brief hold */
      .to({}, { duration: 0.5 })

    /* 6. Curtains split open */
      .to(leftRef.current,   { x: "-100%", duration: 1.15, ease: "expo.inOut" })
      .to(rightRef.current,  { x: "100%",  duration: 1.15, ease: "expo.inOut" }, "<")
      .to(centerRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<")

    /* 7. Fade out wrapper, call onComplete */
      .to(wrapRef.current, {
        opacity: 0,
        duration: 0.18,
        onComplete: () => {
          console.log("✅ Preloader: Animation complete, calling onComplete");
          if (wrapRef.current) wrapRef.current.style.display = "none";
          onComplete?.();
        },
      }, "-=0.05");
  }, [startAnimation]);

  return (
    <div ref={wrapRef} className="preloader-wrap" aria-hidden="true">
      <div ref={leftRef}  className="preloader-curtain preloader-left"  />
      <div ref={rightRef} className="preloader-curtain preloader-right" />

      {/* Center: hidden until startAnimation — GSAP reveals it */}
      <div ref={centerRef} className="preloader-center" style={{ opacity: 0 }}>
        <svg
          className="preloader-symbol"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="52"
            stroke="#F4A535" strokeWidth="1.2"
            strokeDasharray="314" strokeDashoffset="314"
            className="preloader-circle" />
          <circle cx="60" cy="60" r="30"
            stroke="#F7D580" strokeWidth="0.7"
            strokeDasharray="176" strokeDashoffset="176"
            className="preloader-circle-inner" />
          <image href="/logo.png" x="18" y="18" width="84" height="84" preserveAspectRatio="xMidYMid meet" className="preloader-om" />
        </svg>

        <p className="preloader-text">GEO Jainism</p>
        <div className="preloader-line" />
      </div>
    </div>
  );
}

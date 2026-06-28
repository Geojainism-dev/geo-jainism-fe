import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export default function TJCinematicHero() {
  const containerRef = useRef(null);
  const reduced      = useReducedMotion();
  const [m, setM]    = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cam = useSpring(scrollYProgress, {
    stiffness: 90,
    damping:   30,
    mass:      0.9,
    restDelta: 0.001,
  });

  // Temple rises from below — fastest layer
  const yTemple = useTransform(cam, (p) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const maxRise = w <= 768 ? 85 : w <= 1024 ? 100 : 160;
    return `${-Math.min(p, 1) * maxRise}vh`;
  });
  const scaleTemple = useTransform(cam, [0, 0.85, 1], [1, 1.06, 1.06]);

  // Mid layers — different speeds create depth
  const yShafts = useTransform(cam, [0, 1], ["0vh",  "-22vh"]);
  const yBirds  = useTransform(cam, [0, 1], ["0vh",  "-14vh"]);
  const scaleBg = useTransform(cam, [0, 1], [1,       1.08]);   // sky subtle zoom

  // Text fades out first 22% of scroll
  const textOpacity = useTransform(cam, [0, 0.22], [1, 0]);
  const textY       = useTransform(cam, [0, 0.22], ["0vh", "-5vh"]);
  const hintOpacity = useTransform(cam, [0, 0.12], [1, 0]);

  // Pan sky image downward to reveal its golden sunset portion as hero ends
  const skyPositionY = useTransform(cam, [0, 1], ["5%", "95%"]);

  const handleMouse = useCallback((e) => {
    if (reduced) return;
    setM({
      x: (e.clientX / window.innerWidth  - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="tj-scroll-root"
      onMouseMove={handleMouse}
      style={{ height: "370vh" }}
    >
      {/* Sky — pans down to reveal evening tones as hero ends */}
      <motion.div className="tj-sky-full" style={{ scale: scaleBg, backgroundPositionY: skyPositionY }} />

      <div className="tj-stage">

        {/* Light shafts — mid-distance */}
        <motion.div className="tj-l3-shafts" style={{ y: yShafts }} />

        {/* Birds — mid-foreground */}
        {!reduced && (
          <motion.div className="tj-birds-layer" style={{ y: yBirds }}>
            <img className="tj-bird-left"  src="/tamiljain/birds-new.png" alt="" aria-hidden="true" />
            <img className="tj-bird-right" src="/tamiljain/birds-new.png" alt="" aria-hidden="true" />
          </motion.div>
        )}

        {/* Temple — fastest layer, rises from below = strongest parallax */}
        <div className="tj-monument-anchor">
          <motion.div
            className="tj-monument"
            style={{
              y:       yTemple,
              scale:   scaleTemple,
              rotateX: m.y * 0.3,
              rotateY: m.x * 0.45,
            }}
          >
            <img
              src="/tamiljain/temple.png"
              className="tj-temple"
              alt="Majestic Tamil Jain Temple"
              loading="eager"
              fetchpriority="high"
            />
          </motion.div>
        </div>

        {/* Hero text */}
        <motion.div
          className="tj-hero-overlay"
          style={{ opacity: textOpacity, y: textY }}
        >
          <span className="tj-hero-eyebrow">Heritage of South India</span>
          <h1 className="tj-hero-title">
            Jainism In<br />
            <span className="tj-title-row2">
              <img className="tj-mob-bird-l" src="/tamiljain/birds-new.png" aria-hidden="true" alt="" />
              <em>Tamil Nadu</em>
              <img className="tj-mob-bird-r" src="/tamiljain/birds-new.png" aria-hidden="true" alt="" />
            </span>
          </h1>
          <p className="tj-hero-sub">2300+ Years · Living Tradition</p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="tj-scroll-hint" style={{ opacity: hintOpacity }}>
          <div className="tj-scroll-track">
            <motion.div
              className="tj-scroll-dot"
              animate={{ y: [0, 26, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="tj-scroll-text">
            <span>S</span><em>·</em><span>C</span><em>·</em><span>R</span><em>·</em>
            <span>O</span><em>·</em><span>L</span><em>·</em><span>L</span>
          </span>
        </motion.div>

        {/* Film grain */}
        <div className="tj-grain" />

      </div>
    </div>
  );
}

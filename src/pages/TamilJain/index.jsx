import React, { useRef, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import "@/styles/tamil-jain.css";
import { useTheme } from "@/hooks/useTheme";
import { useLenis } from "@/hooks/useLenis";
import mandalaImg from "@/assets/images/landing/mandala.png";

import { lazy, Suspense } from "react";

import TJCinematicHero from "./sections/TJCinematicHero";
const TJCenturyWall  = lazy(() => import("./sections/TJCenturyWall"));
const TJThingalur     = lazy(() => import("./sections/TJThingalur"));
const TJInscriptions  = lazy(() => import("./sections/TJInscriptions"));
const TJJainBeds      = lazy(() => import("./sections/TJJainBeds"));
const TJRani          = lazy(() => import("./sections/TJRani"));
const TJTemples       = lazy(() => import("./sections/TJTemples"));
const TJSilence       = lazy(() => import("./sections/TJSilence"));
const TJInfinityFilm  = lazy(() => import("./sections/TJInfinityFilm"));
const TJNotify        = lazy(() => import("./sections/TJNotify"));
import Navbar          from "@/components/layout/Navbar";
import Footer          from "@/components/layout/Footer";
const Shooting        = lazy(() => import("../Landing/sections/Shooting"));

export default function TamilJainPage() {
  const { theme, toggleTheme } = useTheme();
  useLenis();

  // Scroll progress bar
  const barRef = useRef(null);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const p = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="tj-page-wrapper" data-theme={theme} style={{ position: "relative", overflowX: "hidden" }}>

      <Navbar />

      {/* Fixed rotating mandala — shown across all sections in dark mode */}
      <img src={mandalaImg} className="tj-page-mandala" alt="" aria-hidden="true" />

      {/* Theme toggle */}
      <button
        className="tj-theme-toggle"
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div
        ref={barRef}
        style={{
          position: "fixed", top: 0, left: 0, height: "3px",
          background: "linear-gradient(90deg, #F4A535, #F7D580)",
          zIndex: 9999, width: "100%", transformOrigin: "left", transform: "scaleX(0)", transition: "transform 0.1s",
        }}
      />

      <main style={{ position: "relative", zIndex: 1, isolation: "isolate" }}>
        {/* ── SKY ZONE (transparent — backdrop shows through) ── */}
        <TJCinematicHero />   {/* 100vh, transparent */}

        <Suspense fallback={null}>
          <TJCenturyWall />     {/* cream bg — interactive timeline slider */}
          {/* <TJTimeline />     */}
              {/* cream bg — sky partially visible in transition */}

          {/* ── SOLID SECTIONS (cover the fixed sky) ── */}
          <TJThingalur />
          <TJInscriptions />
          <TJJainBeds />
          <TJRani />
          <TJTemples />
          <TJSilence />
          <Shooting />
          <TJInfinityFilm />
          <TJNotify />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}


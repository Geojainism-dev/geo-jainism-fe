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
import { ThemeToggle } from "@/components/common";
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
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

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

          <TJThingalur />
          <TJInscriptions />
          <TJJainBeds />
         {/* <TJRani /> */}
          {/*<TJTemples /> */}
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


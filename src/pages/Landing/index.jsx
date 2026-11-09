import React, { useState, useEffect, useRef } from "react";
import "@/styles/landing.css";

// Hooks
import { useLenis, useTheme, useScrollReveal } from "@/hooks";

// Components
import { ErrorBoundary, ScreeningPopup, UpcomingEventsPopup, ThemeToggle } from "@/components/common";
import { BackgroundScene } from "@/components/visuals";
import { Navbar, Footer } from "@/components/layout";

import { lazy, Suspense } from "react";

import Hero from "./sections/Hero";
import ScreeningAnnouncement from "./sections/ScreeningAnnouncement";
import Story from "./sections/Story";
import Stats from "./sections/Stats";
import Heritage from "./sections/Heritage";

// Below-the-fold sections (lazy loaded)
const Challenges = lazy(() => import("./sections/Challenges"));
const Courses = lazy(() => import("./sections/Courses"));
const PostProduction = lazy(() => import("./sections/PostProduction"));
const Pakistan = lazy(() => import("./sections/Pakistan"));
const JourneyCarousel = lazy(() => import("./sections/JourneyCarousel"));
const Support = lazy(() => import("./sections/Support"));

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  useLenis();
  useScrollReveal();

  const [heroReady, setHeroReady] = useState(true);
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false);

  /* ── Custom cursor ── */
  useEffect(() => {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let tx = 0, ty = 0, rx = 0, ry = 0, rafId;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };

    const tick = () => {
      rx += (tx - rx) * 0.11;
      ry += (ty - ry) * 0.11;
      dot.style.transform  = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const addHover = () => ring.classList.add("is-hover");
    const rmHover  = () => ring.classList.remove("is-hover");

    const attachHover = () => {
      document.querySelectorAll("a, button, .badge-item").forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", rmHover);
      });
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);

    /* Attach after a tick so React has rendered all interactive elements */
    const t = setTimeout(attachHover, 300);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      clearTimeout(t);
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="landing-root" data-theme={theme}>
        {/* Custom cursor elements */}
        <div id="cursor-dot"  aria-hidden="true" />
        <div id="cursor-ring" aria-hidden="true" />

        <ScrollProgress />
        <GlobalParticles />
        <BackgroundScene />

        <ScreeningPopup onDismiss={() => setShowUpcomingEvents(true)} />
        {showUpcomingEvents && (
          <UpcomingEventsPopup onDismiss={() => setShowUpcomingEvents(false)} />
        )}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <Navbar />

        <main>
          <Hero heroReady={heroReady} />
          <ScreeningAnnouncement />

          <Story />
          <Stats />
          <Heritage />
          
          <Suspense fallback={null}>
            <Challenges />
            <Courses />
            <PostProduction />
            <Pakistan />
            <JourneyCarousel />
            <Support />
          </Suspense>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

/* ── Local helper components ── */

const ScrollProgress = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY    = window.scrollY;
          const maxScroll  = document.body.scrollHeight - window.innerHeight;
          const progress   = scrollY / Math.max(maxScroll, 1);
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${progress})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="progress-bar" ref={progressRef} style={{ width: "100%", transformOrigin: "left", transform: "scaleX(0)", transition: "transform 0.1s" }} />;
};

const PARTICLES = Array.from({ length: 72 }, (_, i) => ({
  left:     `${(i * 1.42) % 100}%`,
  size:     2 + (i % 5),
  delay:    `${(i * 0.38) % 18}s`,
  duration: `${9 + (i % 8) * 1.4}s`,
}));

const GlobalParticles = () => (
  <div className="global-particles" aria-hidden="true">
    {PARTICLES.map((p, i) => (
      <span
        key={i}
        className="gp"
        style={{
          left:            p.left,
          width:           p.size + "px",
          height:          p.size + "px",
          animationDelay:  p.delay,
          animationDuration: p.duration,
        }}
      />
    ))}
  </div>
);


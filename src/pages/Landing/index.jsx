import React from "react";
import "@/styles/landing.css";

// Hooks
import { useLenis, useTheme, useScrollReveal } from "@/hooks";

// Components
import { ErrorBoundary, ScreeningPopup } from "@/components/common";
import { BackgroundScene } from "@/components/visuals";
import { Navbar, Footer } from "@/components/layout";

// Sections
import {
  Hero, ScreeningAnnouncement, Story, Stats, Heritage, Challenges, Shooting,
  Courses, PostProduction, JourneyCarousel, Trailer,
  Support, Release, Blogs, About,
} from "./sections";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  useLenis();
  useScrollReveal();

  return (
    <ErrorBoundary>
      <div className="landing-root" data-theme={theme}>
        <ScrollProgress />
        <GlobalParticles />
        <BackgroundScene />

        <ScreeningPopup />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <Navbar />

        <main>
          <Hero />
          <ScreeningAnnouncement />
          <Story />
          <Stats />
          <Heritage />
          <Challenges />
          <Shooting />
        <Courses />
          <PostProduction />
          
          <JourneyCarousel />
          <Trailer />
          {/* <Release /> */}
          {/* <Blogs /> */}
          <Support />
          {/* <About /> */}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

// Local helper components for LandingPage
const ScrollProgress = () => {
  const progressRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / Math.max(maxScroll, 1);
      if (progressRef.current) {
        progressRef.current.style.width = progress * 100 + "%";
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="progress-bar" ref={progressRef}></div>;
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
          left: p.left,
          width: p.size + "px",
          height: p.size + "px",
          animationDelay: p.delay,
          animationDuration: p.duration,
        }}
      />
    ))}
  </div>
);

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    className="theme-toggle"
    data-testid="theme-toggle"
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
);

import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./styles/virasat.css";
import "./styles/animations.css";
import { VirasatContext, useSmoothScroll } from "./hooks/useSmoothScroll";
import { usePrefersReducedMotion } from "./hooks/useMotionPrefs";
import { ScrollTrigger } from "./animations/gsapAnimations";
import { HERO_MEDIA } from "./data/site";
import { Navbar } from "@/components/layout";
import Footer from "./components/layout/Footer";
import Preloader from "./components/common/Preloader";
import BookingModal from "./components/common/BookingModal";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import UpcomingShows from "./sections/UpcomingShows";
import Gallery from "./sections/Gallery";
import Partners from "./sections/Partners";
import Contact from "./sections/Contact";

const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Tiro+Devanagari+Hindi&display=swap";

/** Resolves once web fonts and the hero poster are ready (or after a cap). */
function useAssetsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const poster = new Promise((res) => {
      const im = new Image();
      im.onload = im.onerror = res;
      im.src = HERO_MEDIA.poster;
    });
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([Promise.all([poster, fonts]), new Promise((r) => setTimeout(r, 2200))]).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

export default function VirasatPage() {
  const reducedMotion = usePrefersReducedMotion();
  const { scrollTo, lenisRef } = useSmoothScroll(reducedMotion);
  const ready = useAssetsReady();
  const [introDone, setIntroDone] = useState(reducedMotion);
  const [booking, setBooking] = useState({ open: false, eventId: null });

  const openBooking = useCallback((eventId = null) => setBooking({ open: true, eventId }), []);
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), []);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  // fonts/images change layout — re-measure every ScrollTrigger once settled
  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    window.addEventListener("load", ScrollTrigger.refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", ScrollTrigger.refresh);
    };
  }, [ready]);

  const ctx = useMemo(() => ({ scrollTo, openBooking, reducedMotion, lenisRef }), [scrollTo, openBooking, reducedMotion, lenisRef]);

  return (
    <VirasatContext.Provider value={ctx}>
      <Helmet>
        <link rel="stylesheet" href={FONTS} />
        <meta name="theme-color" content="#4A101D" />
      </Helmet>
      {/* Virasat is always dark: data-theme drives the shared navbar's dark styling, as on Landing/About */}
      <div className="vr-root" data-theme="dark">
        <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1100] focus:bg-vr-gold focus:px-4 focus:py-2 focus:text-vr-ink">
          Skip to content
        </a>
        <Preloader ready={ready} reducedMotion={reducedMotion} onDone={onIntroDone} />
        <Navbar />
        <main>
          <Hero introDone={introDone} />
          <About />
          <Experience />
          <UpcomingShows />
          <Gallery />
          <Partners />
          <Contact />
        </main>
        <Footer />
        <BookingModal open={booking.open} initialEventId={booking.eventId} onClose={closeBooking} />
      </div>
    </VirasatContext.Provider>
  );
}

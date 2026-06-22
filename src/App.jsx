import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import SEO from "@/components/common/SEO";
import "@/styles/app.css";
import "@/styles/navbar.css";
import "./firebase";
import { loadLanding, loadTamilJain, loadAbout } from "@/lib/routePreloader";

const LandingPage = lazy(loadLanding);
const TamilJainPage = lazy(loadTamilJain);
const AboutPage = lazy(loadAbout);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Basic scroll reset, ensure it doesn't conflict too much with Lenis if we can help it.
    // Ideally lenis.scrollTo(0) but we don't have the instance here unless we use a context.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const PageLoader = () => (
  <div className="premium-loader-container" aria-hidden="true">
    <div className="premium-loader-bar" />
    <img src="/logo.png" className="premium-loader-logo" alt="Loading" />
    <p className="premium-loader-text">GEO JAINISM</p>
  </div>
);

function RouteSeo() {
  const { pathname } = useLocation();
  return <SEO pathname={pathname} />;
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <RouteSeo />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tamil-jain" element={<TamilJainPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;


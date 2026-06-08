import "@/styles/app.css";
import "@/styles/navbar.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LandingPage   from "./pages/Landing";
import TamilJainPage from "./pages/TamilJain";
import AboutPage     from "./pages/About";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/tamil-jain" element={<TamilJainPage />} />
        <Route path="/about"      element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

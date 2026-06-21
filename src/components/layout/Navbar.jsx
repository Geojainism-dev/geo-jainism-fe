import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Youtube, Twitter, MessageCircle } from "lucide-react";
import { preloadRoute } from "@/lib/routePreloader";

const Navbar = () => {
  const navbarRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isTJPage = location.pathname === "/tamil-jain";

  useEffect(() => {
    const onScroll = () => {
      if (navbarRef.current) {
        navbarRef.current.classList.toggle("scrolled", window.scrollY > 60);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <nav
      id="navbar"
      ref={navbarRef}
      className={`${isMobileMenuOpen ? "mobile-menu-open" : ""} ${isTJPage ? "is-tj-page" : ""}`}
    >
      <div className="nav-logo">GEO JAINISM</div>

      {/* Mobile Menu Toggle */}
      <button className="mobile-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? (
          <div className="mobile-close-mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16.5" stroke="#F4A535" strokeWidth="0.8" opacity="0.55" />
              <circle cx="18" cy="18" r="13" stroke="#F4A535" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.30" />
              <line x1="12" y1="12" x2="24" y2="24" stroke="#F4A535" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="24" y1="12" x2="12" y2="24" stroke="#F4A535" strokeWidth="1.1" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.2" fill="#F4A535" opacity="0.6" />
              <circle cx="24" cy="12" r="1.2" fill="#F4A535" opacity="0.6" />
              <circle cx="12" cy="24" r="1.2" fill="#F4A535" opacity="0.6" />
              <circle cx="24" cy="24" r="1.2" fill="#F4A535" opacity="0.6" />
            </svg>
            <span className="mobile-close-label">CLOSE</span>
          </div>
        ) : (
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>

        {/* Mobile-only: header + particles — conditional so animations re-fire every open */}
        {isMobileMenuOpen && <>
          <div className="drawer-particles" aria-hidden="true">
            {[...Array(8)].map((_, i) => <span key={i} className={`drawer-particle dp-${i + 1}`} />)}
          </div>
          <div className="mobile-drawer-header">
            <img src="/logo.png" alt="Geo Jainism" className="mobile-drawer-logo" />
            <div className="mobile-drawer-salutation">जय जिनेन्द्र</div>
            <p className="mobile-drawer-tagline">
              Where ancient stone speaks —<br />
              and a forgotten legacy finds its light.
            </p>
            <div className="mobile-drawer-rule">
              <span className="mobile-drawer-dot" />
              <span className="mobile-drawer-ornament">✦</span>
              <span className="mobile-drawer-dot" />
            </div>
          </div>
        </>}

        {/* Always rendered — visible on desktop, animated inside drawer on mobile */}
        <div className="mobile-drawer-links">
          <strong><Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)} onMouseEnter={() => preloadRoute("/")} onTouchStart={() => preloadRoute("/")}>Home</Link></strong>
          <strong><Link to="/tamil-jain" className={location.pathname === "/tamil-jain" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)} onMouseEnter={() => preloadRoute("/tamil-jain")} onTouchStart={() => preloadRoute("/tamil-jain")}>Tamil Jain</Link></strong>
          {/* <strong><a href="#heritage" onClick={() => setIsMobileMenuOpen(false)}>Heritage</a></strong>
        <strong><a href="#journey" onClick={() => setIsMobileMenuOpen(false)}>Virasat</a></strong>
        <strong><a href="#courses" onClick={() => setIsMobileMenuOpen(false)}>Courses</a></strong>
        <strong><a href="#blogs" onClick={() => setIsMobileMenuOpen(false)}>Map</a></strong>
        <strong><a href="#support" onClick={() => setIsMobileMenuOpen(false)}>Blogs</a></strong> */}
          <strong><Link to="/about" className={location.pathname === "/about" ? "active" : ""} onClick={() => setIsMobileMenuOpen(false)} onMouseEnter={() => preloadRoute("/about")} onTouchStart={() => preloadRoute("/about")}>About us</Link></strong>
        </div>

        {/* Social icons — only visible inside the mobile drawer */}
        <div className="drawer-socials">
          <a href="https://instagram.com/geo_jainism" target="_blank" rel="noopener noreferrer" className="drawer-social-icon"><Instagram size={16} /></a>
          <a href="https://www.youtube.com/@geo_jainism" target="_blank" rel="noopener noreferrer" className="drawer-social-icon"><Youtube size={16} /></a>
          <a href="https://x.com/geo_jainism" target="_blank" rel="noopener noreferrer" className="drawer-social-icon"><Twitter size={16} /></a>
          <a href="https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j" target="_blank" rel="noopener noreferrer" className="drawer-social-icon"><MessageCircle size={16} /></a>
        </div>

      </div>

      <div className="nav-socials desktop-socials">
        <a href="https://instagram.com/geo_jainism" target="_blank" rel="noopener noreferrer" className="social-icon"><Instagram size={18} /></a>
        <a href="https://www.youtube.com/@geo_jainism" target="_blank" rel="noopener noreferrer" className="social-icon"><Youtube size={18} /></a>
        <a href="https://x.com/geo_jainism" target="_blank" rel="noopener noreferrer" className="social-icon"><Twitter size={18} /></a>
        <a href="https://chat.whatsapp.com/EnHCodUJre9AlzFO9LRx5j" target="_blank" rel="noopener noreferrer" className="social-icon"><MessageCircle size={18} /></a>
      </div>
    </nav>
  );
};

export default Navbar;


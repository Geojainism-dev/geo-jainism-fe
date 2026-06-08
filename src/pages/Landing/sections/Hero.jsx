import React from "react";
import HeroAura from "@/components/visuals/HeroAura";
import HeroSpheres from "@/components/visuals/HeroSpheres";
import mandalaImg from "@/assets/images/landing/mandala.png";

const Hero = () => {
  return (
    <section id="hero">
      <img src={mandalaImg} className="hero-center-mandala" alt="" aria-hidden="true" />
      {/* <HeroSpheres /> */}
      <div className="mandala-orbit-dot mo1"></div>
      <div className="mandala-orbit-dot mo2"></div>
      <div className="mandala-orbit-dot mo3"></div>
      <div className="mandala-orbit-dot mo4"></div>
      <div className="mandala-orbit-dot mo5"></div>
      <div className="mandala-orbit-dot mo6"></div>

      <div className="hero-left">
        <div className="hero-eyebrow">GEO Jainism — Presents</div>
        <h1 className="hero-title">Tamil <span>Jains</span></h1>
        <div className="hero-subtitle">Minority Within A Minority</div>
        <p className="hero-tagline">A cinematic documentary unearthing 2,000 years of hidden Jain heritage across Tamil Nadu — 111 ancient sites, 50+ hills, one mission.</p>
        <div className="hero-cta-row">
          <a href="#trailer" className="hero-btn-primary" data-testid="hero-watch-trailer">▶ Watch Trailer</a>
          <a href="#support" className="hero-btn-ghost" data-testid="hero-support-btn">Support the Film</a>
        </div>
        <div className="hero-badge">
          <div className="badge-item"><span className="badge-num">111</span><span className="badge-label">Ancient Sites</span></div>
          <div className="badge-item"><span className="badge-num">50+</span><span className="badge-label">Hills Climbed</span></div>
          <div className="badge-item"><span className="badge-num">4K</span><span className="badge-label">Documentation</span></div>
          <div className="badge-item"><span className="badge-num">10+</span><span className="badge-label">Converted Sites</span></div>
        </div>
      </div>

      <div className="hero-right">
        <div className="tirthankar-wrap">
          <HeroAura />
          <div className="aura-glow"></div>
          <div className="aura-ray a1"></div>
          <div className="aura-ray a2"></div>
          <div className="aura-ray a3"></div>
          <div className="aura-ray a4"></div>
          <div className="orbit-dot o1"></div>
          <div className="orbit-dot o2"></div>
          <div className="orbit-dot o3"></div>
          <div className="orbit-dot o4"></div>
          <img src="/mahavira.png" alt="Jain Tirthankar" className="tirthankar-img" />
        </div>
      </div>

      <div className="hero-particles" aria-hidden="true">
        {[...Array(52)].map((_, i) => (
          <span key={i} className="hero-particle" style={{
            left: `${2 + i * 2.7}%`,
            width: `${2 + (i % 4)}px`,
            height: `${2 + (i % 4)}px`,
            animationDelay: `${(i * 0.45) % 14}s`,
            animationDuration: `${7 + (i % 7) * 1.5}s`,
          }}></span>
        ))}
      </div>

      <div className="scroll-hint">
        <span className="scroll-text">Scroll to explore</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;

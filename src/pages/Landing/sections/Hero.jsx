import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import mandalaImg from "@/assets/images/landing/mandala.png";

const Hero = ({ heroReady }) => {
  const allCharsRef = useRef([]);

  /* ── Split title + hide all elements on mount ── */
  useEffect(() => {
    const title = document.querySelector(".hero-title");
    if (!title) return;

    const nodes = Array.from(title.childNodes);
    title.innerHTML = "";
    const chars = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach((ch) => {
          const s = document.createElement("span");
          s.textContent = ch;
          s.style.display = ch.trim() ? "inline-block" : "inline";
          title.appendChild(s);
          if (ch.trim()) chars.push(s);
        });
      } else {
        node.style.display = "inline-block";
        title.appendChild(node);
        chars.push(node);
      }
    });

    allCharsRef.current = chars;

    gsap.set(title, { opacity: 1 });
    gsap.set(chars, { opacity: 0, y: 72, skewY: 6 });

    const heroRight = document.querySelector(".hero-right");
    const eyebrow = document.querySelector(".hero-eyebrow");
    const subtitle = document.querySelector(".hero-subtitle");
    const tagline = document.querySelector(".hero-tagline");
    const ctaRow = document.querySelector(".hero-cta-row");
    const scrollHint = document.querySelector(".scroll-hint");

    console.log("🔍 Element check:", {
      heroRight: !!heroRight,
      eyebrow: !!eyebrow,
      subtitle: !!subtitle,
      tagline: !!tagline,
      ctaRow: !!ctaRow,
      scrollHint: !!scrollHint,
    });

    gsap.set(".hero-right", { opacity: 1 });
    gsap.set("#aura-canvas, .divine-rays", { opacity: 0 });
    gsap.set(".tirthankar-img", { opacity: 0, scale: 0.96 });
    gsap.set([
      ".hero-eyebrow", ".hero-subtitle", ".hero-tagline",
      ".hero-cta-row", ".scroll-hint",
    ], { opacity: 0, y: 28 });
    gsap.set(".badge-item", { opacity: 0, y: 24, scale: 0.92 });
  }, []);

  /* ── Master hero timeline — fires when popup is dismissed ── */
  useEffect(() => {
    if (!heroReady) {
      console.log("❌ Hero: heroReady is false");
      return;
    }
    const chars = allCharsRef.current;
    if (!chars.length) {
      console.log("❌ Hero: No chars found");
      return;
    }

    console.log("✅ Hero: Starting master timeline with", chars.length, "chars");
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to("#aura-canvas, .divine-rays",
        { opacity: 1, duration: 2.2, ease: "power1.out" })
      .to(".tirthankar-img",
        { opacity: 1, scale: 1, duration: 2.8, ease: "power1.inOut" }, "-=1.6")
      .to(".hero-eyebrow",
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=1.8")
      .to(chars,
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.055, ease: "expo.out" },
        "-=0.2")
      .to(".hero-subtitle",
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.35")
      .to(".hero-tagline",
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.3")
      .to(".hero-cta-row",
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.25")
      .to(".scroll-hint",
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "-=0.1")
      .to(".badge-item",
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(1.4)" });
  }, [heroReady]);

  /* ── Mouse parallax on idol — replaces floatIdol CSS animation ── */
  useEffect(() => {
    const hero = document.querySelector("#hero");
    const wrap = document.querySelector(".tirthankar-wrap");
    if (!hero || !wrap) return;

    wrap.style.animation = "none";
    wrap.style.transform  = "translateY(0px)";

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    const startTime = performance.now();
    let rafId;

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width  - 0.5) * 18;
      targetY = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    const tick = () => {
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      const elapsed = (performance.now() - startTime) / 1000;
      const floatY  = Math.sin((elapsed / 5.5) * Math.PI * 2) * 20;
      wrap.style.transform =
        `translateX(${curX}px) translateY(${floatY + curY}px)`;
      rafId = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="hero">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden="true">
        <img src={mandalaImg} className="hero-center-mandala" alt="" aria-hidden="true" />
      </div>

      <div className="hero-left">
        <div className="hero-eyebrow">GEO Jainism — Presents</div>
        <h1 className="hero-title">Tamil <span className="hero-jains">Jains</span></h1>
        <div className="hero-subtitle">Minority Within A Minority</div>
        <p className="hero-tagline">
          A cinematic documentary unearthing 2300+ years of hidden Jain heritage
          across Tamil Nadu — 111 ancient sites, 50+ hills, one mission.
        </p>
        <div className="hero-cta-row">
          <a href="#trailer" className="hero-btn-primary" data-testid="hero-watch-trailer">
            ▶ Watch Trailer
          </a>
          <a href="#support" className="hero-btn-ghost" data-testid="hero-support-btn">
            Support the Film
          </a>
        </div>

        <div className="hero-badge">
          <div className="badge-item">
            <span className="badge-num">111</span>
            <span className="badge-label">Ancient Sites</span>
          </div>
          <div className="badge-item">
            <span className="badge-num">50+</span>
            <span className="badge-label">Hills Climbed</span>
          </div>
          <div className="badge-item">
            <span className="badge-num">4K</span>
            <span className="badge-label">Documentation</span>
          </div>
          <div className="badge-item">
            <span className="badge-num">10+</span>
            <span className="badge-label">Converted Sites</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="tirthankar-wrap">
          <div className="divine-rays" aria-hidden="true">
            <div className="aura-ray a1"></div>
            <div className="aura-ray a2"></div>
            <div className="aura-ray a3"></div>
            <div className="aura-ray a4"></div>
            <div className="aura-ray a5"></div>
            <div className="aura-ray a6"></div>
            <div className="aura-ray a7"></div>
            <div className="aura-ray a8"></div>
          </div>
          <img
            src="/mahavira.png"
            alt="Jain Tirthankar"
            className="tirthankar-img"
          />
        </div>
      </div>

      <div className="hero-particles" aria-hidden="true">
        {[...Array(140)].map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${1 + i * 1.75}%`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              animationDelay: `${(i * 0.3) % 14}s`,
              animationDuration: `${7 + (i % 7) * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="scroll-hint">
        <span className="scroll-text">Scroll to explore</span>
        <div className="scroll-line">
          <div className="scroll-dot"></div>
        </div>
        <div className="scroll-chevron">&#8964;</div>
      </div>

      <div className="hero-grain" aria-hidden="true" />
    </section>
  );
};

export default Hero;

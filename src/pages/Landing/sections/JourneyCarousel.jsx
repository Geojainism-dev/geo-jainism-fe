import React, { useState, useEffect, useRef } from "react";
import { JOURNEY_SLIDES } from "@/constants/landingData";

const JourneyCarousel = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let interval;
    let paused = false;
    const start = () => {
      stop();
      interval = setInterval(() => {
        if (!paused) setSlideIdx((i) => (i + 1) % JOURNEY_SLIDES.length);
      }, 6000);
    };
    const stop = () => { if (interval) clearInterval(interval); };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section id="journey" className="journey-section" ref={carouselRef}>
      <div className="journey-header">
        <div className="section-sub">Special Topics</div>
        <h2 className="section-title">Jainism in Pakistan</h2>
        <p className="journey-sub-desc">
          Exploring the forgotten Jain heritage of Pakistan through abandoned temples, lost communities, ancient trade routes, and untold historical narratives.
        </p>
      </div>

      <div className="journey-carousel">
        <button
          className="journey-nav prev"
          data-testid="journey-prev"
          onClick={() => setSlideIdx((i) => (i - 1 + JOURNEY_SLIDES.length) % JOURNEY_SLIDES.length)}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className="journey-track-wrap">
          <div className="journey-track" style={{ transform: "translateX(-" + (slideIdx * 100) + "%)" }}>
            {JOURNEY_SLIDES.map((s, i) => (
              <div className={"journey-slide " + (i === slideIdx ? "active" : "")} key={s.img}>
                <img src={s.img} alt={s.title} loading={i === 0 ? "eager" : "lazy"} />
                <div className="journey-overlay">
                  <div className="journey-slide-num">{s.num}</div>
                  <h3 className="journey-slide-title"><em>{s.title}</em></h3>
                  <p className="journey-slide-caption">{s.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="journey-nav next"
          data-testid="journey-next"
          onClick={() => setSlideIdx((i) => (i + 1) % JOURNEY_SLIDES.length)}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="journey-indicators" data-testid="journey-indicators">
        {JOURNEY_SLIDES.map((_, i) => (
          <button
            key={i}
            className={"journey-dot " + (i === slideIdx ? "active" : "")}
            onClick={() => setSlideIdx(i)}
            aria-label={"Go to slide " + (i + 1)}
            data-testid={"journey-dot-" + i}
          />
        ))}
      </div>
      <div className="journey-counter">
        <strong>{String(slideIdx + 1).padStart(2, "0")}</strong> / {String(JOURNEY_SLIDES.length).padStart(2, "0")}
      </div>
    </section>
  );
};

export default JourneyCarousel;

// import React from "react";

// const Trailer = () => {
//   return (
//     <section id="trailer" className="trailer-section">
//       <div className="section-header reveal">
//         <div className="section-sub">Official Trailer</div>
//         <h2 className="section-title">A Glimpse<br/>of 2,000 Years</h2>
//       </div>
//       <div
//         className="trailer-wrap reveal"
//         onClick={() => window.open("https://www.youtube.com/@geo_jainism", "_blank", "noopener,noreferrer")}
//         data-testid="trailer-play"
//         role="button"
//         tabIndex={0}
//       >
//         <img src="/journey/09-temple.jpg" alt="Tamil Jain documentary trailer poster" className="trailer-poster" />
//         <div className="trailer-overlay">
//           <div className="play-btn" aria-label="Play trailer">
//             <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
//           </div>
//           <p className="trailer-caption">"Hear their story — the minority within a minority, finally seen."</p>
//         </div>
//       </div>
//       <div className="trailer-meta reveal">
//         <span className="trailer-meta-item"><strong>2:08</strong> Runtime</span>
//         <span className="trailer-meta-item"><strong>4K</strong> Cinematic</span>
//         <span className="trailer-meta-item"><strong>GEO Jainism</strong> Production</span>
//       </div>
//     </section>
//   );
// };

// export default Trailer;


import React, { useState, useEffect, useRef } from "react";
import { JOURNEY_SLIDES } from "@/constants/landingData";

const Trailer =() => {
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
        <div className="section-sub">Official Videos</div>
        <h2 className="section-title">Journey Through GEO Jainism</h2>
        <p className="journey-sub-desc">
          A visual journey through ancient literature, forgotten temples, field research, and the living legacy of Jain civilization.
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

export default Trailer
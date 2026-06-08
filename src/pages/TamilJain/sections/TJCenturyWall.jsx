import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SLIDES = [
  {
    century: "3RD CENTURY BCE",
    subtitle: "Tamil Brahmi Inscriptions",
    paragraphs: [
      "The earliest evidence of Jainism in Tamil Nadu comes from Tamil-Brahmi inscriptions found in natural caverns. These caves served as monsoon shelters for Jain monks and bear witness to a vibrant ascetic tradition on this soil.",
      "Scholars connect these engravings with the spread of Śramaṇa thought across ancient Tamilakam, tying together language, archaeology, and the enduring Jain presence across the peninsula.",
    ],
    imageSrc: "/journey/01-rock-sculpture.jpg",
    imageAlt: "Ancient Tamil Jain rock carving in a cavern",
  },
  {
    century: "9TH CENTURY CE",
    subtitle: "Rock-Cut Jain Sanctuaries",
    paragraphs: [
      "Across the Pudukottai plateau and Tiruchirappalli plains, Jain communities sponsored rock-cut shrines crowned with luminous plaster and painted ceilings that still whisper of manuscript schools.",
      "Pilgrim routes braided village tanks with hillside caverns, translating patronage carved in stone into the seasonal rhythms of monsoon retreats.",
    ],
    imageSrc: "/journey/05-rock-carvings.jpg",
    imageAlt: "Heritage rock-cut Jain sculptures",
  },
  {
    century: "16TH CENTURY CE",
    subtitle: "Pandya & Vijayanagara Patronage",
    paragraphs: [
      "Later dynasties protected Jain bankers, composers, and temple stewards whose copper-plate charters record irrigation gifts and lamp-endowments along the Tambraparni and Vaigai basins.",
      "The interplay of courtly Sanskrit and crystalline Tamil commentaries anchored a cosmopolitan Jain public sphere that still resonates in choral festivals.",
    ],
    imageSrc: "/journey/09-temple.jpg",
    imageAlt: "Tamil Jain golden temple façade detail",
  },
];

const MAX_IDX = SLIDES.length - 1;

export default function TJCenturyWall() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef        = useRef(null);
  const slideIdxRef     = useRef(0);
  const draggingRef     = useRef(false);
  const lastWheelRef    = useRef(0);
  const pointerRafRef   = useRef(0);
  const pendingYRef     = useRef(null);

  // Keep ref in sync for use inside non-passive event listeners
  useEffect(() => { slideIdxRef.current = slideIdx; }, [slideIdx]);

  const currentSlide = SLIDES[slideIdx];
  const handlePct    = MAX_IDX > 0 ? (slideIdx / MAX_IDX) * 100 : 0;
  const mobilePct    = MAX_IDX > 0 ? Math.max(8, (slideIdx / MAX_IDX) * 100) : 100;

  const slideUp   = useCallback(() => setSlideIdx(i => Math.max(0, i - 1)), []);
  const slideDown = useCallback(() => setSlideIdx(i => Math.min(MAX_IDX, i + 1)), []);

  const updateFromPointer = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    if (rect.height <= 0) return;
    const y   = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const idx = Math.round((y / rect.height) * MAX_IDX);
    setSlideIdx(Math.max(0, Math.min(MAX_IDX, idx)));
  }, []);

  // Non-passive wheel listener — must be attached via DOM API
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (ev) => {
      if (!(ev.target instanceof Node) || !track.contains(ev.target)) return;
      if (Math.abs(ev.deltaY) < 20) return;
      const dir = ev.deltaY > 0 ? 1 : -1;
      const i   = slideIdxRef.current;
      if ((dir > 0 && i >= MAX_IDX) || (dir < 0 && i <= 0)) return;
      const now = performance.now();
      if (now - lastWheelRef.current < 300) { ev.preventDefault(); return; }
      ev.preventDefault();
      lastWheelRef.current = now;
      setSlideIdx(prev => dir > 0 ? Math.min(MAX_IDX, prev + 1) : Math.max(0, prev - 1));
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => () => {
    if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
  }, []);

  const onKeyDown = useCallback((ev) => {
    if (ev.key === "ArrowUp"   || ev.key === "PageUp")   { ev.preventDefault(); slideUp();              return; }
    if (ev.key === "ArrowDown" || ev.key === "PageDown") { ev.preventDefault(); slideDown();            return; }
    if (ev.key === "Home")                               { ev.preventDefault(); setSlideIdx(0);         return; }
    if (ev.key === "End")                                { ev.preventDefault(); setSlideIdx(MAX_IDX);          }
  }, [slideUp, slideDown]);

  const onPointerDown = useCallback((ev) => {
    const el = ev.currentTarget;
    el.focus({ preventScroll: true });
    el.setPointerCapture(ev.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    updateFromPointer(ev.clientY);
  }, [updateFromPointer]);

  const onPointerMove = useCallback((ev) => {
    if (!draggingRef.current) return;
    ev.preventDefault();
    pendingYRef.current = ev.clientY;
    if (pointerRafRef.current !== 0) return;
    pointerRafRef.current = requestAnimationFrame(() => {
      pointerRafRef.current = 0;
      const y = pendingYRef.current;
      pendingYRef.current = null;
      if (y != null) updateFromPointer(y);
    });
  }, [updateFromPointer]);

  const onPointerEnd = useCallback((ev) => {
    draggingRef.current = false;
    setIsDragging(false);
    if (pointerRafRef.current !== 0) {
      cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = 0;
    }
    try { ev.currentTarget.releasePointerCapture(ev.pointerId); } catch { /* not captured */ }
  }, []);

  return (
    <section id="century-story" className="cw-section">
      <div className="cw-inner">

        {/* Header */}
        <div className="cw-header">
          <div className="tj-eyebrow-row" style={{ justifyContent: "center", marginBottom: "14px" }}>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to right, transparent, var(--saffron))" }} />
            <span className="tj-eyebrow-label">Historical Journey</span>
            <div className="tj-eyebrow-line" style={{ background: "linear-gradient(to left, transparent, var(--saffron))" }} />
          </div>
          <h2 className="cw-title">2,000 Years of Jain Presence in Tamil Nadu</h2>
        </div>

        {/* Timeline row: text | track | image */}
        <div className="cw-row">

          {/* Left: copy */}
          <div className="cw-left">
            <p className="cw-century">{currentSlide.century}</p>
            <p className="cw-subtitle">{currentSlide.subtitle}</p>
            {currentSlide.paragraphs.map((p, i) => (
              <p key={i} className="cw-p">{p}</p>
            ))}

            {/* Mobile progress indicator */}
            <div className="cw-mobile-timeline">
              <div className="cw-mobile-rail" aria-hidden="true">
                <span className="cw-mobile-dot" />
                <span className="cw-mobile-line" />
              </div>
              <div className="cw-mobile-progress" aria-hidden="true">
                <div className="cw-mobile-bar" style={{ width: `${mobilePct}%` }} />
              </div>
            </div>

            {/* Mobile step controls */}
            <div className="cw-mobile-controls" aria-label="Timeline controls">
              <button
                type="button"
                className="cw-step-btn"
                disabled={slideIdx === 0}
                onClick={slideUp}
                aria-label="Earlier period"
              >
                <svg className="cw-step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="cw-status">{slideIdx + 1} / {SLIDES.length}</span>
              <button
                type="button"
                className="cw-step-btn"
                disabled={slideIdx === MAX_IDX}
                onClick={slideDown}
                aria-label="Later period"
              >
                <svg className="cw-step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Center: drag/scroll track (desktop only) */}
          <div
            ref={trackRef}
            className="cw-track"
            tabIndex={0}
            role="slider"
            aria-valuenow={slideIdx + 1}
            aria-valuemin={1}
            aria-valuemax={SLIDES.length}
            aria-valuetext={currentSlide.century}
            aria-label="Scroll or drag to move through Jain history timelines"
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            <div className="cw-rail">
              <span className="cw-rail-line" aria-hidden="true" />
              <span
                className={`cw-handle${isDragging ? " cw-handle--drag" : ""}`}
                style={{
                  top: `${handlePct}%`,
                  transitionDuration: isDragging ? "0ms" : "340ms",
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Right: image */}
          <div className="cw-right">
            <figure className="cw-figure">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.imageSrc}
                  src={currentSlide.imageSrc}
                  alt={currentSlide.imageAlt}
                  className="cw-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDragging ? 0.9 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: isDragging ? 0.14 : 0.42 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

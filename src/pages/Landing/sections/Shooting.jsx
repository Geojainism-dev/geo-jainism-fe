import React from "react";

const Shooting = () => {
  return (
    <section className="section shooting-section">
      <div className="section-header reveal">
        <div className="section-sub">The Shooting Phase</div>
        <h2 className="section-title">23 Days.<br/>111 Sacred Sites.<br/>One Historic Mission.</h2>
        <p className="section-desc">From 17 December to 8 January, the GEO Jainism team trekked to remote locations across Tamil Nadu — from Madurai to distant Chithral and Kalugumalai — capturing what no camera had ever captured before.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card reveal">
          <span className="feature-icon">🏔️</span>
          <div className="feature-title">50+ Hills Climbed</div>
          <div className="feature-body">Scaling mountain ranges to document Jain cave shelters, hilltop shrines, and rock-cut Tirthankara figures that have silently watched centuries pass.</div>
        </div>
        <div className="feature-card reveal">
          <span className="feature-icon">🎙️</span>
          <div className="feature-title">50+ Interviews</div>
          <div className="feature-body">Tamil language interviews conducted and translated — with elders, priests, scholars, and community members sharing living memory of a fading tradition.</div>
        </div>
        <div className="feature-card reveal">
          <span className="feature-icon">🏛️</span>
          <div className="feature-title">10+ Converted Sites</div>
          <div className="feature-body">Documenting historic Jain sites that were transformed over time, uncovering their original identity, architecture, and forgotten legacy.</div>
        </div>
      </div>
    </section>
  );
};

export default Shooting;

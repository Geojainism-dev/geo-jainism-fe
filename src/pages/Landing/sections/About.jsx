import React from "react";

const About = () => {
  return (
    <section className="section about-section">
      <div className="reveal-left">
        <span className="about-tag">About GEO Jainism</span>
        <h2 className="story-heading">We Don't Just<br/><em>Study History —<br/>We Live It</em></h2>
        <p className="story-body">GEO Jainism is a research-based platform dedicated to the study and documentation of Jain culture, history, and heritage. We focus on authentic, field-based research and the unseen facets of Jainism.</p>
        <p className="story-body" style={{ marginTop: 16 }}>We travel to ancient sites, document hidden temples, and bring forgotten stories back to life — across Karnataka, Andhra Pradesh, Kerala, Telangana, Tamil Nadu, and Goa.</p>
        <div className="about-founder">
          <div className="founder-avatar">KJ</div>
          <div>
            <div className="founder-name">Kavi Sajal Jain</div>
            <div className="founder-role">Founder & Concept Director</div>
            <p style={{ fontSize: 12, color: "var(--ink)", opacity: 0.6, marginTop: 6, lineHeight: 1.6 }}>"To bring the eternal Jain heritage into the light — that is our foremost purpose."</p>
          </div>
        </div>
      </div>
      <div className="coverage-grid reveal-right">
        <div className="coverage-item"><span className="coverage-icon">🎬</span><div className="coverage-title">1.9M+ Views</div><div className="coverage-body">Pakistan's largest Jain temple — documentary making global waves</div></div>
        <div className="coverage-item"><span className="coverage-icon">📜</span><div className="coverage-title">Naldiyar</div><div className="coverage-body">First-ever video on the book written by 8,000 Jain monks · 24K views</div></div>
        <div className="coverage-item"><span className="coverage-icon">🗺️</span><div className="coverage-title">Multi-State Coverage</div><div className="coverage-body">Karnataka, AP, Kerala, Telangana, TN, Goa — Jain history documented</div></div>
        <div className="coverage-item"><span className="coverage-icon">📱</span><div className="coverage-title">@geo_jainism</div><div className="coverage-body">Follow on Instagram, YouTube & Twitter for latest updates</div></div>
        <div className="coverage-item"><span className="coverage-icon">🏛️</span><div className="coverage-title">Rare Literature</div><div className="coverage-body">Naldiyar, Silappadikaram, Ratnakara — rare Jain traditions studied</div></div>
        <div className="coverage-item"><span className="coverage-icon">⛰️</span><div className="coverage-title">Field Research</div><div className="coverage-body">Katariya, Lalitpur, Bihar — ancient Jain temples visited & documented</div></div>
      </div>
    </section>
  );
};

export default About;

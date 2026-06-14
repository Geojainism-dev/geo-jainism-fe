import React from "react";

const Story = () => {
  return (
    <>
      <div className="mandala-divider">
        <div className="mandala-line"></div>
        <div className="mandala-dot"></div>
        <div className="mandala-dot" style={{ width: 14, height: 14, background: "var(--marigold)" }}></div>
        <div className="mandala-dot"></div>
        <div className="mandala-line"></div>
      </div>

      <section id="story" className="section story-section">
        <div className="reveal-left">
          <div className="story-label">The Beginning</div>
          <h2 className="story-heading">Golden Era Of<br/><em>Jainism</em></h2>
          <p className="story-body">GEO Jainism is among the first dedicated initiatives creating in-depth, research-based documentary films on the vast and rich history of Jainism.</p>
          <p className="story-body">We don't just talk about history — we travel to ancient places, document hidden temples, and bring lost stories back to life.</p>
          <p className="story-body">Through authentic field research, on-site documentation, and long-format storytelling, we uncover forgotten Jain sites, ancient temples, rare traditions, literature, and untold historical narratives from across India. Our mission is not only to study Jain heritage but also to protect and preserve it for future generations.</p>
          <p className="story-body">With upcoming plans for pan-India site mapping, deeper archaeological exploration, and documentary filmmaking, GEO Jainism aims to make this hidden legacy accessible to people around the world.</p>
        </div>
        <div className="story-visual reveal-right">
          <div className="stone-card">
            <div className="stone-icon">🪨</div>
            <p className="stone-quote">"Our sole objective is to bring the neglected heritage of Jainism into the mainstream"</p>
            <span className="stone-attr">Documenting Jain India</span>
          </div>
          <div className="story-stats-grid">
            <div className="story-stat-card story-stat-green">
              <div className="story-stat-num" style={{ color: "var(--tulsi-deep)" }}>200+</div>
              <div className="story-stat-label">Jain Sites Covered</div>
            </div>
            <div className="story-stat-card story-stat-pink">
              <div className="story-stat-num" style={{ color: "var(--lotus-deep)" }}>100+</div>
              <div className="story-stat-label">Volunteers</div>
            </div>
          </div>
        </div>
        <div className="om-decoration">ॐ</div>
      </section>
    </>
  );
};

export default Story;

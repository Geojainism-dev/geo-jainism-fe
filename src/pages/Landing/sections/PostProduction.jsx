import React from "react";

const PostProduction = () => {
  return (
    <section className="section post-section">
      <div className="reveal-left">
        <div className="story-label">About Course</div>
        <h2 className="story-heading">History<br/><em>Brought to Life</em></h2>
        <p className="story-body">Step beyond books and explore the untold stories of Jain civilization through history, temples, literature, philosophy, and real-world heritage journeys.</p>
        <h4 className="story-body" style={{ marginTop: 16 }}>Who Is This Course For?</h4>
        <p className="story-body" style={{ marginTop: 16 }}>Students, researchers, creators, history enthusiasts, travelers, and anyone passionate about Jain culture and Indian heritage.</p>
        <div className="history-pills">
          {["4 Months", "Research", "Exploration", "Heritage", "Literature", "Legends", "Storytelling"].map((p) => (
            <span className="pill" key={p}>{p}</span>
          ))}
        </div>
      </div>
      <div className="post-visual reveal-right">
        <div className="epoch-card">
          <div className="epoch-era">Ancient · History</div>
          <div className="epoch-title">Forgotten History</div>
          <div className="epoch-body">Uncover lost kingdoms, hidden stories, vanished Jain communities, and forgotten chapters of history buried across centuries.</div>
        </div>
        <div className="epoch-card" style={{ borderLeftColor: "var(--lotus-deep)" }}>
          <div className="epoch-era" style={{ color: "var(--lotus-deep)" }}>Medieval · India</div>
          <div className="epoch-title">Stories of Kings, Queens & Monks</div>
          <div className="epoch-body">Discover the lives of powerful rulers, fearless monks, and visionary scholars who shaped Jain civilization across India.</div>
        </div>
        <div className="epoch-card" style={{ borderLeftColor: "var(--tulsi-deep)" }}>
          <div className="epoch-era" style={{ color: "var(--tulsi-deep)" }}>Literary · Jain Contribution</div>
          <div className="epoch-title">Jain Literature & Ancient Texts</div>
          <div className="epoch-body">Explore timeless Jain scriptures, epics, poetry, and philosophical works that preserved the wisdom, culture, and intellectual legacy of an ancient civilization.</div>
        </div>
      </div>
    </section>
  );
};

export default PostProduction;

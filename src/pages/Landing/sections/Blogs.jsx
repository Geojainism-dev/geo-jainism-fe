import React from "react";
import { BLOGS } from "@/constants/landingData";

const Blogs = () => {
  return (
    <section id="blogs" className="section blogs-section">
      <div className="section-header reveal">
        <div className="section-sub">From the Journal</div>
        <h2 className="section-title">Articles &amp; Essays</h2>
        <p className="section-desc">
          Long-form writings, field notes, and research essays from the GEO Jainism team — illuminating the people, places, and texts that carry this tradition forward.
        </p>
      </div>
      <div className="blogs-grid">
        {BLOGS.map((b, i) => (
          <a
            key={b.title}
            href="https://www.youtube.com/@geo_jainism"
            target="_blank"
            rel="noreferrer"
            className={"blog-card reveal " + (b.featured ? "featured" : "")}
            data-testid={"blog-card-" + i}
          >
            <div className="blog-img">
              <img src={b.img} alt={b.title} loading="lazy" />
              <span className="blog-cat">{b.cat}</span>
            </div>
            <div className="blog-body">
              <div className="blog-date">{b.date}</div>
              <h3 className="blog-title">{b.title}</h3>
              <p className="blog-excerpt">{b.excerpt}</p>
              <span className="blog-read">Read Article</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Blogs;

import React from "react";
import { COURSES } from "@/constants/landingData";

const Courses = () => {
  const course = COURSES[0];

  return (
    <section id="courses" className="section courses-section">
      <div className="courses-split">

        {/* Left — header */}
        <div className="courses-split-left reveal-left">
          <div className="section-sub">Learning Hub</div>
          <h2 className="courses-split-title">Explore Jain<br/>Heritage Courses</h2>
          <p className="courses-split-desc">
            Dive deeper into the rich, often-overlooked world of Jain history, literature, and culture — through structured, research-based series crafted by GEO Jainism.
          </p>
          <div className="courses-split-stats">
            <div className="courses-stat"><span className="courses-stat-num">10</span><span className="courses-stat-label">Episodes</span></div>
            <div className="courses-stat"><span className="courses-stat-num">4K</span><span className="courses-stat-label">Quality</span></div>
            <div className="courses-stat"><span className="courses-stat-num">2000+</span><span className="courses-stat-label">Years of History</span></div>
          </div>
        </div>

        {/* Right — featured card */}
        <div className="courses-split-right reveal-right">
          <article className="course-card course-card-featured">
            <div className="course-img-wrap">
              <img src={course.img} alt={course.title} loading="lazy" />
              <span className="course-img-tag">{course.tag}</span>
            </div>
            <div className="course-body">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">{course.desc}</p>
              <div className="course-meta"><span>{course.meta}</span></div>
              <a href="https://www.youtube.com/@geo_jainism" target="_blank" rel="noreferrer" className="course-cta">
                {course.cta} →
              </a>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
};

export default Courses;

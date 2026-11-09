import React from "react";
import { BLOGS } from "@/constants/landingData";
import { useTranslation } from "react-i18next";

const Blogs = () => {
  const { t } = useTranslation();
  return (
    <section id="blogs" className="section blogs-section">
      <div className="section-header reveal">
        <div className="section-sub">{t("blogs.sub")}</div>
        <h2 className="section-title">{t("blogs.title")}</h2>
        <p className="section-desc">
          {t("blogs.desc")}
        </p>
      </div>
      <div className="blogs-grid">
        {BLOGS.map((b, i) => {
          const title = t(`landingData.blogs.${i}.title`, b.title);
          const excerpt = t(`landingData.blogs.${i}.excerpt`, b.excerpt);
          return (
            <a
              key={b.title}
              href="https://www.youtube.com/@geo_jainism"
              target="_blank"
              rel="noreferrer"
              className={"blog-card reveal " + (b.featured ? "featured" : "")}
              data-testid={"blog-card-" + i}
            >
              <div className="blog-img">
                <img src={b.img} alt={title} loading="lazy" />
                <span className="blog-cat">{b.cat}</span>
              </div>
              <div className="blog-body">
                <div className="blog-date">{b.date}</div>
                <h3 className="blog-title">{title}</h3>
                <p className="blog-excerpt">{excerpt}</p>
                <span className="blog-read">{t("blogs.read")}</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default Blogs;


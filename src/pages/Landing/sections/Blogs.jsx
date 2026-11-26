import React from "react";
import { BLOGS } from "@/constants/landingData";
import { getImageProps, coverSize, buildSizes, WIDTH_LADDERS } from "@/lib/cloudinary";
import { useTranslation } from "react-i18next";

// (Not currently mounted.) .blog-img is 360px tall for the featured card, 220px otherwise; object-fit: cover.
// Section padding 60px (24px <=900, 20px <=768, 16px <=480); grid (max 1200px, gap 24px): 1.2fr/1fr/1fr above 1100px,
// two columns <=1100px (the featured card spans both), one column <=900px.
const blogSizes = (aspect, featured) => {
  const height = featured ? "360px" : "220px";
  return buildSizes(
    [
      ["(max-width: 480px)", coverSize("calc(100vw - 32px)", height, aspect)],
      ["(max-width: 768px)", coverSize("calc(100vw - 40px)", height, aspect)],
      ["(max-width: 900px)", coverSize("calc(100vw - 48px)", height, aspect)],
      ["(max-width: 1100px)", coverSize(featured ? "calc(100vw - 120px)" : "calc((100vw - 144px) / 2)", height, aspect)],
    ],
    coverSize(`calc((min(100vw - 120px, 1200px) - 48px) / 3.2 * ${featured ? 1.2 : 1})`, height, aspect),
  );
};

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
                <img {...getImageProps(b.asset, { widths: WIDTH_LADDERS.medium, sizes: (a) => blogSizes(a, b.featured) })} alt={title} loading="lazy" />
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


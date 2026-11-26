import React from "react";
import styles from "./Heritage.module.css";
import { TIMELINE_ITEMS } from "@/constants/landingData";
import { useTranslation } from "react-i18next";
import { getImageProps, coverSize, buildSizes, WIDTH_LADDERS } from "@/lib/cloudinary";

// Timeline image frame: 16:10 box (aspect-ratio), object-fit: cover, inside .imageBox (12px padding + 1px border).
// Section padding 60px (24px <=900, 20px <=600, 16px <=480); .mainTimeline max 1200px; rows are 1fr / 100px (60px <=1024) / 1fr
// where the 590px content card is fixed and the image box takes the remaining width (minus its 12px padding + 1px border on each
// side), capped at 540px; <=900px the row is one column with 60px (44px <=480) left padding for the line.
const heritageFrameSizes = (aspect) => {
  const cover = (w) => coverSize(w, `calc(${w} / 1.6)`, aspect);
  return buildSizes(
    [
      ["(max-width: 480px)", cover("calc(100vw - 102px)")],
      ["(max-width: 600px)", cover("calc(100vw - 126px)")],
      ["(max-width: 900px)", cover("calc(100vw - 134px)")],
      ["(max-width: 1024px)", cover("calc(100vw - 796px)")],
    ],
    cover("min(484px, calc(100vw - 836px))"),
  );
};

const Heritage = () => {
  const { t } = useTranslation();
  return (
    <section id="heritage" className={styles.heritageSection}>
      {/* HEADER */}
      <div className={`${styles.sectionHeader} reveal`}>
        <div className="section-sub">{t("landingHeritage.sub")}</div>
        <div className={styles.headerFrom}>{t("landingHeritage.from")}</div>
        <h2 className={styles.headerTitle}>{t("landingHeritage.title")}</h2>
        <p className={styles.headerDesc}>
          {t("landingHeritage.desc")}
        </p>
      </div>

      {/* TIMELINE CONTENT */}
      <div className={styles.mainTimeline}>
        <div className={styles.verticalLine}></div>

        {TIMELINE_ITEMS.map((item, index) => {
          const isEven = index % 2 === 0;
          const eyebrow = t(`landingData.timeline.${index}.eyebrow`, item.eyebrow);
          const title = t(`landingData.timeline.${index}.title`, item.title);
          const body = t(`landingData.timeline.${index}.body`, item.body);
          const caption = t(`landingData.timeline.${index}.caption`, item.caption);

          return (
            <div 
              className={`${styles.timelineRow} ${isEven ? styles.rowLeft : styles.rowRight} reveal`} 
              key={index}
            >
              {/* CONTENT CARD */}
              <div className={styles.contentCard}>
                <div className={styles.cardEyebrow}>{eyebrow}</div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </div>

              {/* DOT BOX */}
              <div className={styles.dotBox}>
                <div className={styles.centralDot}></div>
              </div>

              {/* IMAGE BOX */}
              <div className={styles.imageBox}>
                <div className={styles.imageFrame}>
                  <img {...getImageProps(item.asset, { widths: WIDTH_LADDERS.medium, sizes: heritageFrameSizes })} alt={item.alt} loading="lazy" />
                  <div className={styles.imageCaption}>{caption}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className={`${styles.footer} reveal`}>
        <div className={styles.knowMoreBtn}>
          {/* <span>Know More</span>s */}
          
        </div>
      </div>
    </section>
  );
};

export default Heritage;


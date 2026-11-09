import React from "react";
import styles from "./Heritage.module.css";
import { TIMELINE_ITEMS } from "@/constants/landingData";
import { useTranslation } from "react-i18next";

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
                  <img src={item.img} alt={item.alt} loading="lazy" />
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


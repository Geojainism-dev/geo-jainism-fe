import React from "react";
import styles from "./Heritage.module.css";
import { TIMELINE_ITEMS } from "@/constants/landingData";

const Heritage = () => {
  return (
    <section id="heritage" className={styles.heritageSection}>
      {/* HEADER */}
      <div className={`${styles.sectionHeader} reveal`}>
        <div className="section-sub">Historical Journal</div>
        <div className={styles.headerFrom}>From</div>
        <h2 className={styles.headerTitle}>Literature & Legacy</h2>
        <p className={styles.headerDesc}>
          Exploring ancient scriptures, timeless stories, and the cultural legacy <br />
          that shaped generations and civilizations.
        </p>
      </div>

      {/* TIMELINE CONTENT */}
      <div className={styles.mainTimeline}>
        <div className={styles.verticalLine}></div>

        {TIMELINE_ITEMS.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div 
              className={`${styles.timelineRow} ${isEven ? styles.rowLeft : styles.rowRight} reveal`} 
              key={index}
            >
              {/* CONTENT CARD */}
              <div className={styles.contentCard}>
                <div className={styles.cardEyebrow}>{item.eyebrow}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </div>

              {/* DOT BOX */}
              <div className={styles.dotBox}>
                <div className={styles.centralDot}></div>
              </div>

              {/* IMAGE BOX */}
              <div className={styles.imageBox}>
                <div className={styles.imageFrame}>
                  <img src={item.img} alt={item.alt} loading="lazy" />
                  <div className={styles.imageCaption}>{item.caption}</div>
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

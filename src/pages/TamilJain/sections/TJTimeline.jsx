import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ENTRIES = [
  {
    era: "3rd Century BCE",
    title: "Tamil Brahmi Inscriptions",
    body: "The oldest epigraphic heritage of Jainism in India — carved into cave walls across Tamil Nadu at Pugalur, Sittannavasal, and Mangulam. These inscriptions bear witness to a flourishing Jain civilisation that shaped Tamil language and culture.",
    img: "/journey/01-rock-sculpture.jpg",
    caption: "Rock shelter inscriptions, Pugalur",
    side: "right",
  },
  {
    era: "1st–3rd Century CE",
    title: "Sangam Literature",
    body: "Jain monks authored a significant portion of classical Sangam poetry. Works such as Naladiyar (400 moral verses) and Kural drew deeply on Jain philosophy of non-violence, truth, and compassionate living.",
    img: "/journey/07-stone-carving.jpg",
    caption: "Ancient Jain manuscript fragment",
    side: "left",
  },
  {
    era: "5th–8th Century CE",
    title: "Silappadikaram & the Golden Age",
    body: "One of the greatest Tamil epics narrating the story of Kannagi — authored in the Jain literary tradition. Jain temples and cave shrines flourished across Madurai, Kanchipuram, and the Kaveri delta during this period.",
    img: "/journey/05-rock-carvings.jpg",
    caption: "Cave temple carvings, Madurai region",
    side: "right",
  },
  {
    era: "10th–16th Century CE",
    title: "Temple Patronage & Decline",
    body: "Jain merchants and queens — including Rani Aaiyabba Devi — commissioned grand stone temples. Later centuries brought conversion pressure, yet many communities maintained their faith in remote hill towns and villages.",
    img: "/journey/09-temple.jpg",
    caption: "Samanakovil, Vijayamangalam",
    side: "left",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0 },
};

export default function TJTimeline() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="tj-section tj-timeline-section">
      <div className="tj-timeline-inner">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          transition={{ duration: 0.9 }}
        >
          <div className="tj-eyebrow-row">
            <div className="tj-eyebrow-line" />
            <span className="tj-eyebrow-label">Historical Record</span>
          </div>
          <p className="tj-timeline-subtitle">A Civilisation Carved in Stone</p>
          <h2 className="tj-timeline-heading">
            2300+ Years of Jain<br />Presence in Tamil Nadu
          </h2>
        </motion.div>

        {/* Timeline entries */}
        <div style={{ position: "relative" }}>
          {/* Spine line */}
          <div style={{
            position: "absolute",
            left: "239px",
            top: 0, bottom: 0,
            width: "1px",
            background: "linear-gradient(to bottom, var(--saffron), rgba(244,165,53,0.12))",
          }} />

          {ENTRIES.map((e, i) => (
            <motion.div
              key={i}
              className="tj-tl-row"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.16 }}
            >
              {/* Date column */}
              <div className="tj-tl-date-col">
                <span className="tj-tl-era">{e.era}</span>
              </div>

              {/* Spine + dot */}
              <div className="tj-tl-spine" style={{ minHeight: "100%" }}>
                <div className="tj-tl-spine-dot" />
              </div>

              {/* Content */}
              <div className="tj-tl-content-col">
                <div className="tj-tl-content-row">
                  <div>
                    <h3 className="tj-tl-title">{e.title}</h3>
                    <p className="tj-tl-body">{e.body}</p>
                  </div>
                  <div className="tj-tl-img-frame">
                    <img src={e.img} alt={e.caption} loading="lazy" />
                    <div className="tj-tl-caption">{e.caption}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

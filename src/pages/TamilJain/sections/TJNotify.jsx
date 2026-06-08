import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function TJNotify() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [sent,  setSent]  = useState(false);

  return (
    <section ref={ref} className="tj-section tj-notify-section" id="notify">
      <div className="tj-notify-glow" />

      <div className="tj-notify-inner">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <div className="tj-notify-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4A535" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>

          <p style={{
            fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "5px",
            textTransform: "uppercase", color: "var(--saffron)", marginBottom: "16px",
          }}>
            Coming Soon
          </p>

          <h2 className="tj-notify-heading">
            Get Notified On <em>Launch</em>
          </h2>

          <p className="tj-notify-desc">
            Be among the first to watch the full documentary. Join thousands of heritage
            enthusiasts waiting to uncover 2,000 years of Tamil Jain history.
          </p>

          {!sent ? (
            <form
              className="tj-notify-form"
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }}
            >
              <input
                className="tj-notify-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <button className="tj-notify-btn" type="submit">
                Notify Me →
              </button>
            </form>
          ) : (
            <motion.div
              className="tj-notify-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✓ You're on the list
            </motion.div>
          )}

          <p className="tj-notify-trust">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}

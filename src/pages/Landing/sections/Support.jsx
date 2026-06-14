import React from "react";

const Support = () => {
  return (
    <section id="support" className="donate-section">
      {/* <div className="section-sub reveal">Support the Mission</div> */}
      <h2 className="donate-title reveal">Support the Mission</h2>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontStyle: "italic", fontSize: "20px", lineHeight: "32px", letterSpacing: 0, color: "var(--saffron)", marginBottom: 16 }} className="reveal">Your support is essential</p>
      <p className="donate-body reveal">Be a part of this cultural yagna. Every contribution helps us explore ancient Jain sites, document hidden histories, preserve cultural heritage, and bring untold stories to life through research and documentation.</p>



      <div className="donate-cards reveal">
        <div className="donate-card">
          <span className="donate-card-icon">🏦</span>
          <div className="donate-card-title">Bank Transfer</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "17px", lineHeight: "27.2px", letterSpacing: 0, display: "block" }}>GEO JAINISM</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, display: "block" }}>SBI A/C: 43784639669</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, display: "block" }}>IFSC: SBIN0002895</span>
          </div>
        </div>
        <div className="donate-card">
          <span className="donate-card-icon">📱</span>
          <div className="donate-card-title">UPI Payment</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: "17px", lineHeight: "27.2px", letterSpacing: 0, color: "var(--saffron)", display: "block" }}>geojainism@sbi</span>
          </div>
        </div>
        <div className="donate-card">
          <span className="donate-card-icon">📧</span>
          <div className="donate-card-title">Contact Us</div>
          <div className="donate-card-val">
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, color: "var(--saffron)", display: "block" }}>goldeneraofjainism@gmail.com</span>
            <span style={{ fontFamily: "'Lato',sans-serif", fontWeight: 300, fontSize: "13px", lineHeight: "22.1px", letterSpacing: 0, color: "var(--deep-brown)", display: "block" }}>+91-6261820815</span>
          </div>
        </div>
      </div>
      {/* <a href="mailto:goldeneraofjainism@gmail.com" className="btn-primary reveal">Become a Supporter</a> */}
    </section>
  );
};

export default Support;

import React from "react";

const Stats = () => {
  return (
    <div className="stats-strip">
      <div className="stat-card reveal"><div className="stat-num">111</div><div className="stat-label">YOUTUBE REACH</div></div>
      <div className="stat-card reveal"><div className="stat-num">50<span className="stat-unit">+</span></div><div className="stat-label">INSTAGRAM REACH</div></div>
      <div className="stat-card reveal"><div className="stat-num">40<span className="stat-unit">+</span></div><div className="stat-label">YOUTUBE VIDEOS</div></div>
      <div className="stat-card reveal"><div className="stat-num">230<span className="stat-unit">+</span></div><div className="stat-label">FOLLOWERS</div></div>
    </div>
  );
};

export default Stats;

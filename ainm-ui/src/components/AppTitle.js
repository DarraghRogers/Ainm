import React from "react";
import baby from "../assets/baby.svg"; // adjust path if needed

export default function AppTitle({ className = "" }) {
  return (
    <div className={`app-title-row ${className}`}>
      <img src={baby} alt="Baby silhouette" className="baby-icon" />
      <span className="app-title">Ainm</span>
    </div>
  );
}
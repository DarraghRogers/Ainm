import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 1400); // Start fade out before loading ends
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen${fade ? " fade-out" : ""}`}>
      <div className="loading-message">
        <h2>Hello!</h2>
        <p>Welcome back to Ainm...</p>
      </div>
    </div>
  );
}
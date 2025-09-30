// src/components/SwipePage.js
import React, { useEffect, useState, useContext } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import "./SwipePage.css";

const SwipePage = () => {
  const [babyNames, setBabyNames] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const { user, loading } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!loading && user) {
      const token = localStorage.getItem('jwt');
      axios.get(`${apiUrl}/api/babyname`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setBabyNames(res.data);
        })
        .catch((err) => console.error("Error fetching baby names:", err));
    }
  }, [loading, user, apiUrl]);

  const [gone] = useState(() => new Set());
const [springs, api] = useSprings(babyNames.length, (index) => ({
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1, // All cards same size
  zIndex: babyNames.length - index, // Proper z-index stacking
  config: { tension: 400, friction: 25 },
}));

  const handleSwipe = async (direction, bn) => {
    const payload = { userId: user?.id, babyNameId: bn.id, direction };

    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.post(`${apiUrl}/api/swipe`, payload, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (res.data.matched) {
        // Fetch partner username
        if (user?.partnerId) {
          try {
            const token = localStorage.getItem('jwt');
            const partnerRes = await axios.get(
              `${apiUrl}/api/users/${user.partnerId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setMatchInfo({ name: bn.name, partner: partnerRes.data.user.Username });
          } catch {
            setMatchInfo({ name: bn.name, partner: "your partner" });
          }
        } else {
          setMatchInfo({ name: bn.name, partner: "your partner" });
        }

        setTimeout(() => setMatchInfo(null), 3500);
      }
    } catch (err) {
      console.error("Swipe failed:", err.response?.data || err.message);
    }
  };

const bind = useDrag(({ args: [index], down, movement: [mx], direction: [dx] }) => {
  api.start((i) => {
    if (i !== index) return; // only animate the current card

    const isGone = !down && Math.abs(mx) > 100;
    if (isGone) {
      gone.add(index);
      handleSwipe(mx > 0 ? "right" : "left", babyNames[i]);
    }

    return {
      x: isGone ? (mx > 0 ? 800 : -800) : down ? mx : 0, // Faster swipe
      rotate: mx / 100, // tilt effect
      scale: down ? 1.05 : 1, // All cards same size
      y: down ? -10 : 0, // Slight lift effect when dragging
    };
  });
});

  if (loading) return null;

  return (
    <div className="container swipepage-container mt-5">
      

      <div className="d-flex justify-content-center">
        <div className="swipe-card-stack">
          {springs.map(({ x, y, rotate, scale, zIndex }, i) => {
            const babyName = babyNames[i];
            if (!babyName) return null;
            
            // Show all cards but only display the top 3 for visual stacking
            const isVisible = true;
            
            return (
              <animated.div
                key={babyName.id || i}
                {...bind(i)}
                className={`swipe-card ${i === 0 ? 'top-card' : 'stacked-card'}`}
                style={{
                  zIndex: zIndex,
                  x: x,
                  y: y,
                  rotate: rotate,
                  scale: scale,
                  display: isVisible ? 'block' : 'none',
                }}
              >
                <div className="card-body">
                  <h3 className="card-title">{babyName.name}</h3>
                  <p className="card-text"><strong>Gender:</strong> {babyName.gender}</p>
                  <p className="card-text"><strong>Origin:</strong> {babyName.origin}</p>
                  <p className="card-text"><strong>Meaning:</strong> {babyName.meaning}</p>
                  <p className="card-text"><em>{babyName.description}</em></p>
                </div>
                
                {/* Swipe indicators */}
                {i === 0 && (
                  <>
                    <div className="swipe-indicator swipe-left">
                      <span>👎</span>
                    </div>
                    <div className="swipe-indicator swipe-right">
                      <span>👍</span>
                    </div>
                  </>
                )}
              </animated.div>
            );
          })}
        </div>
      </div>

      {matchInfo && (
        <div className="match-animation">
          <div className="match-popup">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>
              You and <strong>{matchInfo.partner}</strong> both liked <strong>{matchInfo.name}</strong>!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipePage;

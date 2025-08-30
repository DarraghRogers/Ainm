// src/components/SwipePage.js
import React, { useEffect, useState, useContext } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./SwipePage.css";

const SwipePage = () => {
  const [babyNames, setBabyNames] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!loading && user) {
      const token = localStorage.getItem('jwt');
      axios.get(`${apiUrl}/api/babyname`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setBabyNames(res.data))
        .catch((err) => console.error("Error fetching baby names:", err));
    }
  }, [loading, user, apiUrl]);

  const [gone] = useState(() => new Set());
  const [springs, api] = useSprings(babyNames.length, (i) => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: 0,
    config: { tension: 300, friction: 30 },
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

  const bind = useDrag(({ args: [index], down, movement: [mx] }) => {
    api.start((i) => {
      if (i !== index) return;
      const isGone = !down && Math.abs(mx) > 100;
      if (isGone) gone.add(index);

      if (isGone) handleSwipe(mx > 0 ? "right" : "left", babyNames[i]);

      return {
        x: isGone ? (mx > 0 ? 500 : -500) : down ? mx : 0,
        scale: down ? 1.1 : 1,
      };
    });
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <div className="container swipepage-container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1">Swipe Baby Names</h2>
        <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
          Logout
        </button>
        <button onClick={() => navigate("/invite")} className="btn btn-outline-primary ms-3">
          Invite Partner
        </button>
        <button onClick={() => navigate("/matches")} className="btn btn-outline-success ms-3">
          View Matches
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <div className="responsive-container">
          <div className="swipe-card-stack" style={{ position: "relative", width: "300px", height: "400px" }}>
            {springs.map((props, i) => (
              <animated.div
  key={babyNames[i]?.id || i}
  {...bind(i)}
  className="card swipe-card shadow-lg" // <- use your original CSS classes
  style={{
    position: "absolute",
    width: "100%",
    height: "100%",
    touchAction: "none",
    ...props, // includes x transform
  }}
>
  <div className="card-body">
    <h3 className="card-title">{babyNames[i]?.name}</h3>
    <p className="card-text"><strong>Gender:</strong> {babyNames[i]?.gender}</p>
    <p className="card-text"><strong>Origin:</strong> {babyNames[i]?.origin}</p>
    <p className="card-text"><strong>Meaning:</strong> {babyNames[i]?.meaning}</p>
    <p className="card-text"><em>{babyNames[i]?.description}</em></p>
  </div>
</animated.div>
            ))}
          </div>
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

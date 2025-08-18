import React, { useEffect, useState, useContext } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import './SwipePage.css';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const SwipePage = () => {
  const [babyNames, setBabyNames] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null); // For match animation
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!loading && user) {
      axios.get(`${apiUrl}/api/babyname`)
        .then(response => setBabyNames(response.data))
        .catch(error => console.error('Error fetching baby names:', error));
    }
  }, [loading, user]);

  const handleSwipe = async (direction, bn) => {
    const payload = {
      userId: user?.id,
      babyNameId: bn.id,
      direction
    };

    try {
      const res = await axios.post(`${apiUrl}/api/swipe`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.data.matched) {
        // Fetch partner username for the animation
        if (user && user.partnerId) {
          try {
            const partnerRes = await axios.get(`${apiUrl}/api/users/${user.partnerId}`, { withCredentials: true });
            setMatchInfo({
              name: bn.name,
              partner: partnerRes.data.user.Username
            });
          } catch (err) {
            console.error('Failed to fetch partner info:', err.response?.data || err.message);
            setMatchInfo({
              name: bn.name,
              partner: "your partner"
            });
          }
        } else {
          setMatchInfo({
            name: bn.name,
            partner: "your partner"
          });
        }
        setTimeout(() => setMatchInfo(null), 3500); // Hide after 3.5s
      }
    } catch (error) {
      console.error('Swipe failed:', error.response?.data || error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return null; // Don't render anything while loading

  return (
    <div className="container swipepage-container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1">Swipe Baby Names</h2>
        <button
          className="btn btn-outline-danger ms-3"
          onClick={handleLogout}>
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
        <div className="swipe-card-stack">
          {babyNames.map(bn => (
            <TinderCard
              key={bn.id}
              onSwipe={dir => handleSwipe(dir, bn)}
              className="swipe"
            >
              <div className="card swipe-card shadow-lg">
                <div className="card-body">
                  <h3 className="card-title">{bn.name}</h3>
                  <p className="card-text"><strong>Gender:</strong> {bn.gender}</p>
                  <p className="card-text"><strong>Origin:</strong> {bn.origin}</p>
                  <p className="card-text"><strong>Meaning:</strong> {bn.meaning}</p>
                  <p className="card-text"><em>{bn.description}</em></p>
                </div>
              </div>
            </TinderCard>
          ))}
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
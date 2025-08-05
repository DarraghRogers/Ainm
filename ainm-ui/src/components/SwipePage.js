import React, { useEffect, useState, useContext } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import './SwipePage.css';
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const SwipePage = () => {
  const [babyNames, setBabyNames] = useState([]);
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      axios.get('http://localhost:5233/api/babyname')
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
      await axios.post('http://localhost:5233/api/swipe', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Handle match logic here
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
    </div>
  );
};

export default SwipePage;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./MatchesPage.css";

export default function MatchesPage() {
  const { user, loading } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      axios.get(`http://localhost:5233/api/match/${user.id}`, { withCredentials: true })
        .then(res => setMatches(res.data))
        .catch(() => setMatches([]));
    }
  }, [loading, user]);

  const handleRemoveMatch = async (babyNameId) => {
    try {
      await axios.delete(`http://localhost:5233/api/match/${user.id}/${babyNameId}`, { withCredentials: true });
      setMatches(matches.filter(m => m.id !== babyNameId));
    } catch {
      // Optionally show error
    }
  };

  if (loading) return null;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Matches</h2>
      {matches.length === 0 ? (
        <p className="text-center">No matches yet. Keep swiping!</p>
      ) : (
        <div className="matches-grid">
          {matches.map(bn => (
            <div key={bn.id} className="card match-card shadow-sm">
              <div className="card-body p-3">
                <h5 className="card-title mb-2">{bn.name}</h5>
                <p className="card-text mb-1"><strong>Gender:</strong> {bn.gender}</p>
                <p className="card-text mb-1"><strong>Origin:</strong> {bn.origin}</p>
                <p className="card-text mb-1"><strong>Meaning:</strong> {bn.meaning}</p>
                <p className="card-text"><em>{bn.description}</em></p>
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => handleRemoveMatch(bn.id)}
                >
                  Remove Match
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <button className="btn btn-outline-primary mt-4" onClick={() => navigate("/swipepage")}>
          Back to Swipe
        </button>
      </div>
    </div>
  );
}
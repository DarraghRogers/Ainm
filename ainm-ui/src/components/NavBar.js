import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppTitle from "./AppTitle";
import { AuthContext } from "./AuthContext";
import "./NavBar.css";

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when navigating
  const handleNav = (cb) => {
    setMenuOpen(false);
    cb();
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-title">
        <AppTitle />
      </div>
      <button
        className="navbar-hamburger"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {/* Simple hamburger SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect y="7" width="32" height="4" rx="2" fill="#ff6f91" />
          <rect y="14" width="32" height="4" rx="2" fill="#ff6f91" />
          <rect y="21" width="32" height="4" rx="2" fill="#ff6f91" />
        </svg>
      </button>
      <div className={`navbar-links${menuOpen ? " open" : ""}`}>
        {user && (
          <>
            <button
              className="nav-btn"
              onClick={() =>
                handleNav(() => navigate("/swipepage"))
              }
            >
              Swipe
            </button>
            <button
              className="nav-btn"
              onClick={() => handleNav(() => navigate("/matches"))}
            >
              Matches
            </button>
            <button
              className="nav-btn"
              onClick={() => handleNav(() => navigate("/invite"))}
            >
              Invite Partner
            </button>
            <button
              className="nav-btn logout-btn"
              onClick={() => handleNav(logout)}
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <Link
              className="nav-btn"
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              className="nav-btn"
              to="/register"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
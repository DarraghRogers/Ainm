import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import AppTitle from "../components/AppTitle.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await axios.post(`${apiUrl}/api/users/forgot-password`, { email });
      setMsg("If that email exists, a reset link has been sent.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <AppTitle />
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="auth-title">Forgot Password</h3>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
          {msg && <div className="alert alert-success mt-3">{msg}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
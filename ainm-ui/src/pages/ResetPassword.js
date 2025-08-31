import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppTitle from "../components/AppTitle";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await axios.post(`${apiUrl}/api/users/reset-password`, {
        token,
        newPassword: password,
      });
      setMsg("Your password has been reset. You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Reset failed. The link may have expired or is invalid.");
    }
  };

  if (!token) return <div>Invalid or missing reset token.</div>;

  return (
    <div className="auth-container">
      <AppTitle />
      <div className="auth-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="auth-title">Reset Password</h3>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
          {msg && <div className="alert alert-success mt-3">{msg}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
      </div>
    </div>
  );
}
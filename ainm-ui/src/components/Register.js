import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Register.css";
import AppTitle from "./AppTitle";

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await axios.post(`${apiUrl}/api/users/register`, {
        username: form.username,
        email: form.email,
        password: form.password
      });

      // Log in after registration (should store JWT in localStorage)
      await login(form.email, form.password);

      // Check for inviteCode in query params
      const params = new URLSearchParams(location.search);
      const inviteCode = params.get("inviteCode");
      if (inviteCode) {
        // Get JWT from localStorage
        const token = localStorage.getItem("jwt");
        await axios.post(
          `${apiUrl}/api/partner/link`,
          { inviteCode },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      navigate("/swipepage");
    } catch (err) {
      const msg =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setMsg(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <AppTitle />
        <form onSubmit={handleRegister} className="w-100">
          <h3 className="auth-title">Register</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
          {msg && <div className="alert alert-danger mt-3">{msg}</div>}
          <div className="text-center mt-3">
            <Link to="/login" className="auth-link">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
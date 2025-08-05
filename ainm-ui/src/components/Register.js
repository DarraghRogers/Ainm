import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5233/api/users/register', {
        username: form.username,
        email: form.email,
        password: form.password
      }, { withCredentials: true });

      // Check for inviteCode in query params
      const params = new URLSearchParams(location.search);
      const inviteCode = params.get("inviteCode");
      if (inviteCode) {
        await axios.post("http://localhost:5233/api/partner/link", { inviteCode }, { withCredentials: true });
      }

      navigate("/swipepage");
    } catch (err) {
      setMsg(err.response?.data || err.message || "Error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form onSubmit={handleRegister} className="card p-4 shadow">
            <h3 className="mb-3 text-center">Register</h3>
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
              <Link to="/login" className="btn btn-link">Already have an account? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
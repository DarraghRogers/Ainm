import React, { useState, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/swipepage");
    } catch (err) {
      setMsg("Login failed, please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form onSubmit={handleLogin} className="card p-4 shadow">
            <h3 className="mb-3 text-center">Login</h3>
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
            <button type="submit" className="btn btn-primary w-100">Login</button>
            {msg && <div className="alert alert-danger mt-3">{msg}</div>}
            <div className="text-center mt-3">
              <Link to="/register" className="btn btn-link">Don't have an account? Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
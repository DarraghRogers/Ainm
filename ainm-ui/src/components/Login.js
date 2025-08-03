import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const login = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5233/api/users/login', form);
      setToken(res.data.token); // Save JWT token
      setMsg('Login successful!');
    } catch (err) {
      setMsg(err.response?.data || 'Error');
    }
  };
  return (
    <form onSubmit={login}>
      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
      <button type="submit">Login</button>
      <div>{msg}</div>
    </form>
  );
}
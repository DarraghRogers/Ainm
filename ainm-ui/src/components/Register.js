import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const register = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5233/api/users/register', form);
      setMsg('Registration successful!');
    } catch (err) {
      setMsg(err.response?.data || 'Error');
    }
  };
  return (
    <form onSubmit={register}>
      <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" required />
      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
      <button type="submit">Register</button>
      <div>{msg}</div>
    </form>
  );
}
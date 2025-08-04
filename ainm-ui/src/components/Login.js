import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
    const login = async e => {
    e.preventDefault();
    try {
      // Correct login URL!
      await axios.post('http://localhost:5233/api/users/login', {
        email: form.email,
        password: form.password
      }, {
        withCredentials: true
      });

      // Now, call the protected API.
      const res = await axios.get('http://localhost:5233/api/Test/19', {
        withCredentials: true
      });
      setMsg('Login successful! Protected API result: ' + JSON.stringify(res.data));
    } catch (err) {
      setMsg(err.response?.data || err.message || 'Error');
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
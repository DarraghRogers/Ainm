import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      setTimeout(() => setLoading(false), 1800);
      return;
    }
    axios.get(`${apiUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setTimeout(() => setLoading(false), 1800));
  }, []);

  const login = async (email, password) => {

    const res = await axios.post(`${apiUrl}/api/users/login`, { email, password });
    // Optionally fetch user info here if needed
    return res.data.token;
  };

  const logout = async () => {
    const token = localStorage.getItem('jwt');
    await axios.post(`${apiUrl}/api/users/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
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
    axios.get(`${apiUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setTimeout(() => setLoading(false), 1800)); // Show loading for ~2s
  }, []);

  const login = async (email, password) => {
    await axios.post(`${apiUrl}/api/users/login`, { email, password }, { withCredentials: true });
    // Re-fetch user info
    const res = await axios.get(`${apiUrl}/api/users/me`, { withCredentials: true });
    setUser(res.data);
  };

  const logout = async () => {
    await axios.post(`${apiUrl}/api/users/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
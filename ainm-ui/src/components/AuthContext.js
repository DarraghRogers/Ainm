import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    axios.get(`${apiUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // Only set loading to false after user is set
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${apiUrl}/api/users/login`, { email, password });
    const token = res.data.token;
    localStorage.setItem('jwt', token);

    // Fetch user info immediately after login
    const userRes = await axios.get(`${apiUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userRes.data);

    return token;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    // Optionally redirect to login
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
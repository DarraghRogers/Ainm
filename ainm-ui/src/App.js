import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import SwipePage from './pages/SwipePage';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import InvitePartner from "./pages/InvitePartner";
import AcceptInvite from "./pages/AcceptInvite";
import MatchesPage from './pages/MatchesPage';
import NavBar from "./components/NavBar";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from "./pages/ResetPassword";


function App() {
  const location = useLocation();
  const hideNav = ["/login", "/register"].includes(location.pathname);
  //const [loading, setLoading] = useState(true);

  //if (loading) return <LoadingScreen />;

  return (
    <AuthProvider>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invite" element={<InvitePartner />} />
        <Route path="/invite/:inviteCode" element={<AcceptInvite />} />
        <Route
          path="/swipepage"
          element={
            <ProtectedRoute>
              <SwipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
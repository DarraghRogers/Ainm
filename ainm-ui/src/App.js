import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import SwipePage from './components/SwipePage';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import InvitePartner from "./components/InvitePartner";
import AcceptInvite from "./pages/AcceptInvite";
import MatchesPage from './components/MatchesPage';
import NavBar from "./components/NavBar";

function App() {
  const location = useLocation();
  const hideNav = ["/login", "/register"].includes(location.pathname);

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext";
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import SwipePage from './components/SwipePage';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import InvitePartner from "./components/InvitePartner";
import AcceptInvite from "./pages/AcceptInvite";
function App() {
  return (
    <AuthProvider>
    <Router>
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

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
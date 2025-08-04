import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import SwipePage from './components/SwipePage';
import axios from 'axios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/swipepage" element={<SwipePage /> }
        />
      </Routes>
    </Router>
  );
}

export default App;
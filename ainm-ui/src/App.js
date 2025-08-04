import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import axios from 'axios';

function App() {
  return (
    <div>
      <Register />
      <Login />
    </div>
  );
}

export default App;
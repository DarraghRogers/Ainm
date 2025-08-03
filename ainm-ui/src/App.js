import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState('');

  return (
    <div>
      <Register />
      <Login setToken={setToken} />
      {token && <div>JWT Token: {token}</div>}
    </div>
  );
}

export default App;
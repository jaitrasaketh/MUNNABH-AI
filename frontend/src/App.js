// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StravaAuth from './pages/StravaAuth';
import StravaCallback from './pages/StravaCallback';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard accessToken={accessToken} />} />
        <Route path="/strava-auth" element={<StravaAuth />} />
        <Route path="/strava-callback" element={<StravaCallback setAccessToken={setAccessToken} />} />
      </Routes>
    </Router>
  );
}

export default App;

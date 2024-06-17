import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      navigate(`/dashboard?token=${token}`);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return null;
}

function App() {
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard accessToken={accessToken} />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/pages/StravaAuth.js
import React from 'react';

const StravaAuth = () => {
  const handleAuthorization = () => {
    window.location.href = 'http://localhost:5000/strava/authorize';
  };

  return (
    <div>
      <h1>Connect with Strava</h1>
      <button onClick={handleAuthorization}>Connect with Strava</button>
    </div>
  );
};

export default StravaAuth;

// src/pages/StravaCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const StravaCallback = ({ setAccessToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const { access_token } = queryString.parse(window.location.search);
    if (access_token) {
      setAccessToken(access_token);
      navigate('/dashboard');
    }
  }, [navigate, setAccessToken]);

  return <div>Processing authentication...</div>;
};

export default StravaCallback;

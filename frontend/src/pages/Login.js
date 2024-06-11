// src/pages/Login.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        // Simulate login and redirect to dashboard
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <div className="left-content">
                    <h1>MunnaBh-AI</h1>
                    <h2 className="welcome-text">
                        <ReactTyped
                            strings={["Welcome to MunnaBh-AI", "Your personal AI Healthcare Assistant"]}
                            typeSpeed={50}
                            backSpeed={50}
                            loop
                        />
                    </h2>
                </div>
            </div>
            <div className="right-section">
                <div className="right-content">
                    <h2>Get Started</h2>
                    <div className="button-container">
                        <button onClick={handleGoogleLogin}>Continue With Google</button>
                    </div>
                    <div className="button-container">
                        <button>Continue With Microsoft Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

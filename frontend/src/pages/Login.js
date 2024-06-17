import React from 'react';
import { ReactTyped } from 'react-typed';
import './Login.css';
import rightLogo from '../assets/rightlogologin.png'; // Correct the image path

const Login = () => {

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8000/auth/login?redirect_uri=http://localhost:3000/auth"; // Redirect to FastAPI OAuth login endpoint with redirect URI
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
                <div className="right-logo-container">
                    <img src={rightLogo} alt="MunnaBh-AI Logo" className="right-logo" />
                </div>
            </div>
        </div>
    );
};

export default Login;

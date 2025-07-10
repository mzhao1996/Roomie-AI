import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🏠</span>
              <span className="logo-text">Roomie AI</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Find your perfect roommate match</p>
          </div>

          <div className="auth-tabs">
            <button 
              className={`tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => setMode('signin')}
            >
              Sign In
            </button>
            <button 
              className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          <AuthForm mode={mode} onToggleMode={toggleMode} />

          <div className="login-footer">
            <a href="#" className="back-link">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 
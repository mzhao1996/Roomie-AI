import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome to Roomie AI</h1>
          <p>Find your perfect roommate match</p>
        </div>
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  );
};

export default AuthPage; 
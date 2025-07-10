import React, { useEffect } from 'react';
import OnboardingFlow from '../components/OnboardingFlow';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOnboardingData } from '../services/userService';

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isEdit = params.get('edit') === 'true';

    const checkOnboarding = async () => {
      if (user && !isEdit) {
        const { data } = await getOnboardingData(user.uid);
        if (data && data.completed) {
          localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(data));
          navigate('/dashboard');
        }
      }
    };
    checkOnboarding();
  }, [user, navigate, location.search]);

  return (
    <div className="onboarding-layout">
      {/* Progress Header */}
      <header className="onboarding-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Roomie AI</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="onboarding-main">
        <div className="form-container">
          <OnboardingFlow />
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage; 
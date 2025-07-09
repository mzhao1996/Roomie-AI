import React, { useEffect } from 'react';
import OnboardingFlow from '../components/OnboardingFlow';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOnboardingData } from '../services/userService';

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const { data, error } = await getOnboardingData(user.uid);
        if (data && data.completed) {
          // 如果数据库中已完成onboarding，保存到localStorage并跳转
          localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(data));
          navigate('/dashboard');
        }
      }
    };
    checkOnboarding();
  }, [user, navigate]);

  return (
    <div className="onboarding-page">
      <OnboardingFlow />
    </div>
  );
};

export default OnboardingPage; 
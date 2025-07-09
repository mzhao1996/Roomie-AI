import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import type { OnboardingData } from '../types/onboarding';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`onboarding_${user.uid}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setOnboardingData(parsedData);
        } catch (error) {
          console.error('Error loading onboarding data:', error);
        }
      }
      setLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Roomie AI Dashboard</h1>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome{onboardingData?.basicInfo?.firstName ? `, ${onboardingData.basicInfo.firstName}` : ', ' + user?.email}!</h2>
          <p>Ready to find your perfect roommate?</p>
        </div>

        {!onboardingData?.completed && (
          <div className="onboarding-prompt">
            <div className="prompt-card">
              <h3>🚀 Complete Your Profile</h3>
              <p>To get the best roommate matches, please complete your onboarding profile.</p>
              <button className="step-button" onClick={handleStartOnboarding}>
                {onboardingData ? 'Continue Onboarding' : 'Start Onboarding'}
              </button>
            </div>
          </div>
        )}

        {onboardingData?.completed ? (
          <div className="profile-summary">
            <div className="summary-card">
              <h3>Your Profile Summary</h3>
              <div className="profile-details">
                <div className="detail-item">
                  <span className="label">Schedule:</span>
                  <span className="value">{onboardingData.scheduleInfo.workSchedule.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Budget:</span>
                  <span className="value">${onboardingData.housingInfo.budget.min.toLocaleString()} - ${onboardingData.housingInfo.budget.max.toLocaleString()}/month</span>
                </div>
                <div className="detail-item">
                  <span className="label">Move-in Date:</span>
                  <span className="value">{new Date(onboardingData.housingInfo.moveInDate).toLocaleDateString()}</span>
                </div>
                {onboardingData.preferencesInfo.lgbtqInclusive && (
                  <div className="detail-item">
                    <span className="label">LGBTQ+ Inclusive:</span>
                    <span className="value">✅ Yes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="next-steps">
          <h3>Next Steps:</h3>
          <div className="step-card">
            <h4>1. Complete Your Profile</h4>
            <p>Tell us about your lifestyle, preferences, and needs</p>
            <button className="step-button" onClick={handleStartOnboarding}>
              {onboardingData?.completed ? 'Update Profile' : 'Start Onboarding'}
            </button>
          </div>
          
          <div className="step-card">
            <h4>2. Find Matches</h4>
            <p>Discover compatible roommates based on your preferences</p>
            <button className="step-button" disabled={!onboardingData?.completed}>
              Find Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
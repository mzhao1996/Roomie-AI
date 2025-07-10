import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import type { OnboardingData } from '../types/onboarding';
import { DEFAULT_ONBOARDING_DATA } from '../types/onboarding';

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
          setOnboardingData({ ...DEFAULT_ONBOARDING_DATA, ...parsedData });
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
    navigate('/onboarding?edit=true');
  };

  const handleFindMatches = () => {
    navigate('/matches');
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
    <div className="dashboard-layout">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Roomie AI</span>
          </div>
          
          <nav className="nav-menu">
            <a href="/dashboard" className="nav-link active">Dashboard</a>
            <a href="/matches" className="nav-link">Matches</a>
            <a href="/onboarding" className="nav-link">Profile</a>
          </nav>
          
          <div className="nav-user">
            <div className="notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>
            <button onClick={handleSignOut} className="user-avatar">
              <img src="https://via.placeholder.com/40x40/9c88ff/ffffff?text=U" alt="User Avatar" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back{onboardingData?.basicInfo?.firstName ? `, ${onboardingData.basicInfo.firstName}` : ''}! 👋
              </h1>
              <p className="welcome-subtitle">Let's find your perfect roommate match</p>
            </div>
            {!onboardingData?.completed && (
              <div className="profile-completion">
                <div className="completion-card">
                  <h3>Profile Completion</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                  <p>45% Complete</p>
                  <button onClick={handleStartOnboarding} className="btn btn-secondary btn-sm">
                    Complete Profile
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💜</div>
                <div className="stat-content">
                  <h3>12</h3>
                  <p>Total Matches</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-content">
                  <h3>5</h3>
                  <p>Active Chats</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>3</h3>
                  <p>Favorites</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-content">
                  <h3>28</h3>
                  <p>Profile Views</p>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Matches */}
          {onboardingData?.completed && (
            <section className="matches-section">
              <div className="section-header">
                <h2>Recent Matches</h2>
                <button onClick={handleFindMatches} className="view-all-link">View All</button>
              </div>
              
              <div className="matches-grid">
                <div className="match-card">
                  <div className="match-avatar">
                    <img src="https://via.placeholder.com/80x80/9c88ff/ffffff?text=S" alt="Sarah" />
                    <div className="match-score">95%</div>
                  </div>
                  <div className="match-info">
                    <h3>Sarah Johnson</h3>
                    <p className="match-age">24 • Graduate Student</p>
                    <p className="match-reason">Night shift schedule complements yours</p>
                    <div className="match-tags">
                      <span className="tag">LGBTQ+ Friendly</span>
                      <span className="tag">Pet Lover</span>
                    </div>
                  </div>
                  <div className="match-actions">
                    <button className="btn btn-primary btn-sm">Message</button>
                  </div>
                </div>
                
                <div className="match-card">
                  <div className="match-avatar">
                    <img src="https://via.placeholder.com/80x80/9c88ff/ffffff?text=M" alt="Mike" />
                    <div className="match-score">88%</div>
                  </div>
                  <div className="match-info">
                    <h3>Mike Chen</h3>
                    <p className="match-age">26 • Software Engineer</p>
                    <p className="match-reason">Similar budget and location preferences</p>
                    <div className="match-tags">
                      <span className="tag">Quiet</span>
                      <span className="tag">Tech Professional</span>
                    </div>
                  </div>
                  <div className="match-actions">
                    <button className="btn btn-primary btn-sm">Message</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Onboarding Prompt for Incomplete Profiles */}
          {!onboardingData?.completed && (
            <section className="onboarding-prompt">
              <div className="prompt-card">
                <div className="prompt-icon">🚀</div>
                <h3>Complete Your Profile</h3>
                <p>To get the best roommate matches, please complete your onboarding profile. It only takes a few minutes!</p>
                <button onClick={handleStartOnboarding} className="btn btn-primary">
                  {onboardingData ? 'Continue Onboarding' : 'Start Onboarding'} →
                </button>
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            
            <div className="actions-grid">
              <button onClick={handleStartOnboarding} className="action-card">
                <div className="action-icon">📝</div>
                <h3>Update Preferences</h3>
                <p>Refine your roommate search criteria</p>
              </button>
              
              <button onClick={handleFindMatches} className="action-card">
                <div className="action-icon">🔍</div>
                <h3>Browse Matches</h3>
                <p>Explore all potential roommates</p>
              </button>
              
              <button className="action-card">
                <div className="action-icon">💬</div>
                <h3>Messages</h3>
                <p>Continue conversations</p>
              </button>
              
              <button className="action-card">
                <div className="action-icon">🏠</div>
                <h3>Listings</h3>
                <p>Find available rooms</p>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
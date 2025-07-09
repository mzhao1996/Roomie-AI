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

  const handleFindMatches = () => {
    navigate('/matches');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Profile</h3>
          <p className="text-gray-600">Just a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-lg bg-opacity-95 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                🏠
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Roomie AI
                </h1>
                <p className="text-gray-600 text-sm">Your Smart Roommate Finder</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>👋</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="dashboard-main px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back{onboardingData?.basicInfo?.firstName ? `, ${onboardingData.basicInfo.firstName}` : ''}! 👋
          </h2>
          <p className="text-xl text-gray-600 mb-6">Ready to find your perfect roommate match?</p>
          
          {onboardingData?.completed && (
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
              <span className="mr-2">✅</span>
              Profile Complete - Ready to find matches!
            </div>
          )}
        </div>

        {/* Onboarding Prompt for Incomplete Profiles */}
        {!onboardingData?.completed && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl shadow-xl text-white text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Complete Your Profile</h3>
              <p className="text-lg mb-6 opacity-90">
                To get the best roommate matches, please complete your onboarding profile.
                It only takes a few minutes!
              </p>
              <button 
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleStartOnboarding}
              >
                {onboardingData ? 'Continue Onboarding' : 'Start Onboarding'} →
              </button>
            </div>
          </div>
        )}

        {/* Profile Summary for Completed Profiles */}
        {onboardingData?.completed && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">👤</span>
                Your Profile Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-blue-600 text-2xl mb-2">⏰</div>
                  <div className="text-sm text-gray-600 mb-1">Schedule</div>
                  <div className="font-semibold text-gray-800">
                    {onboardingData.scheduleInfo.workSchedule.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="text-green-600 text-2xl mb-2">💰</div>
                  <div className="text-sm text-gray-600 mb-1">Budget Range</div>
                  <div className="font-semibold text-gray-800">
                    ${onboardingData.housingInfo.budget.min.toLocaleString()} - ${onboardingData.housingInfo.budget.max.toLocaleString()}/month
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-purple-600 text-2xl mb-2">📅</div>
                  <div className="text-sm text-gray-600 mb-1">Move-in Date</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(onboardingData.housingInfo.moveInDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-orange-600 text-2xl mb-2">🏳️‍🌈</div>
                  <div className="text-sm text-gray-600 mb-1">LGBTQ+ Inclusive</div>
                  <div className="font-semibold text-gray-800">
                    {onboardingData.preferencesInfo.lgbtqInclusive ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Complete Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                📝
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                {onboardingData?.completed ? 'Update Profile' : 'Complete Profile'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {onboardingData?.completed 
                  ? 'Update your preferences, lifestyle, and requirements'
                  : 'Tell us about your lifestyle, preferences, and needs'
                }
              </p>
            </div>
            <button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={handleStartOnboarding}
            >
              {onboardingData?.completed ? '⚙️ Update Profile' : '🚀 Start Onboarding'}
            </button>
          </div>
          
          {/* Find Matches Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🔍
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Find Matches</h4>
              <p className="text-gray-600 leading-relaxed">
                Discover compatible roommates based on your preferences and lifestyle
              </p>
            </div>
            <button 
              className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg transform ${
                onboardingData?.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!onboardingData?.completed}
              onClick={handleFindMatches}
            >
              {onboardingData?.completed ? '🎯 Find My Matches' : '⏳ Complete Profile First'}
            </button>
            {!onboardingData?.completed && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Complete your profile to unlock matching
              </p>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">How Roomie AI Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                📋
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Complete Profile</h4>
              <p className="text-gray-600">Share your lifestyle, preferences, and housing needs</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                🤖
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">AI Matching</h4>
              <p className="text-gray-600">Our smart algorithm finds compatible roommates</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                💬
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Connect</h4>
              <p className="text-gray-600">Start conversations with your top matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
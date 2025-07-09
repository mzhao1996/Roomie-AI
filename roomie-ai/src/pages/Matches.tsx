import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { matchingEngine, type MatchResult } from '../services/matchingEngine';
import { MOCK_USERS, type MockUser } from '../data/mockUsers';

const Matches: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    findMatches();
  }, [user, useAI]);

  const findMatches = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedData = localStorage.getItem(`onboarding_${user.uid}`);
      if (!savedData) {
        navigate('/onboarding');
        return;
      }

      const onboardingData = JSON.parse(savedData);
      
      if (!onboardingData || !onboardingData.completed) {
        navigate('/onboarding');
        return;
      }

      // 过滤掉当前用户
      const candidateUsers = MOCK_USERS.filter(u => u.id !== user.uid);

      const matchResults = await matchingEngine.findMatches({
        currentUser: onboardingData,
        maxResults: 10,
        minScore: 60,
        useAI: useAI
      }, candidateUsers);

      setMatches(matchResults);
    } catch (err) {
      console.error('Failed to find matches:', err);
      setError('Unable to get match results, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityBg = (score: number): string => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatAge = (ageRange: string): string => {
    return ageRange.replace('+', '+ years');
  };

  const formatWorkSchedule = (schedule: string): string => {
    const scheduleMap: { [key: string]: string } = {
      'day-shift': 'Day Shift',
      'night-shift': 'Night Shift',
      'remote': 'Remote Work',
      'freelancer': 'Freelancer',
      'student': 'Student',
      'irregular': 'Irregular'
    };
    return scheduleMap[schedule] || schedule;
  };

  const handleSendMessage = (matchUser: MockUser) => {
    // Create a simple message prompt
    const message = prompt(
      `Send a message to ${matchUser.basicInfo?.firstName} ${matchUser.basicInfo?.lastName}:`,
      `Hi ${matchUser.basicInfo?.firstName}! I saw your profile and think we could be great roommates. Would you like to chat about finding a place together?`
    );
    
    if (message && message.trim()) {
      // For now, just show a success alert
      // In a real app, this would send the message to a backend service
      alert(`Message sent to ${matchUser.basicInfo?.firstName}!\n\nMessage: "${message}"\n\nThey will be notified and can respond through the app.`);
    }
  };

  const CompatibilityBreakdown: React.FC<{ analysis: MatchResult['compatibilityAnalysis'] }> = ({ analysis }) => (
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span> Compatibility Analysis
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">⏰ Schedule:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.schedule)}`}>{Math.round(analysis.schedule)}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">🏠 Lifestyle:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.lifestyle)}`}>{Math.round(analysis.lifestyle)}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">❤️ Preferences:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.preferences)}`}>{Math.round(analysis.preferences)}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">📍 Location:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.location)}`}>{Math.round(analysis.location)}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">💰 Budget:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.budget)}`}>{Math.round(analysis.budget)}%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
          <span className="font-medium">🤝 Services:</span>
          <span className={`font-bold ${getCompatibilityColor(analysis.services)}`}>{Math.round(analysis.services)}%</span>
        </div>
      </div>
    </div>
  );

  const MatchCard: React.FC<{ match: MatchResult; rank: number }> = ({ match, rank }) => {
    const [expanded, setExpanded] = useState(false);
    const { user: matchUser } = match;

    return (
      <div className={`bg-white rounded-xl shadow-xl border-2 ${rank <= 3 ? 'border-blue-300 shadow-blue-100' : 'border-gray-200'} overflow-hidden hover:shadow-2xl transition-all duration-300`}>
        {/* Ranking Badge */}
        {rank <= 3 && (
          <div className={`text-center py-3 text-white font-bold text-lg ${
            rank === 1 ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600' :
            rank === 2 ? 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600' :
            'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600'
          } shadow-inner`}>
            {rank === 1 ? '🥇 Best Match' : rank === 2 ? '🥈 Great Match' : '🥉 Good Match'}
          </div>
        )}

        <div className="p-8">
          {/* User Basic Information */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {matchUser.basicInfo?.firstName?.charAt(0)}{matchUser.basicInfo?.lastName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {matchUser.basicInfo?.firstName} {matchUser.basicInfo?.lastName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompatibilityBg(match.matchScore)} ${getCompatibilityColor(match.matchScore)} border-2`}>
                      {Math.round(match.matchScore)}% Match
                    </span>
                    {matchUser.verificationStatus === 'verified' && (
                      <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                        <span className="mr-1">✓</span> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>📍</span>
                  <span className="font-medium">{matchUser.basicInfo?.location}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>🎂</span>
                  <span className="font-medium">{formatAge(matchUser.basicInfo?.age || '')}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>💼</span>
                  <span className="font-medium">{formatWorkSchedule(matchUser.scheduleInfo?.workSchedule || '')}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>💰</span>
                  <span className="font-medium">${matchUser.housingInfo?.budget?.min}-${matchUser.housingInfo?.budget?.max}/month</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Bio */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-700 text-sm leading-relaxed italic">"{matchUser.bio}"</p>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎯</span> Why You Match
            </h4>
            <div className="space-y-2">
              {match.matchReasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span className="text-sm text-gray-700 font-medium">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>{expanded ? 'Hide Details' : 'View Details'}</span>
            <span className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Detailed Information */}
          {expanded && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fadeIn">
              {/* Compatibility Analysis */}
              <CompatibilityBreakdown analysis={match.compatibilityAnalysis} />

              {/* Service Exchange */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🤝</span> Service Exchange
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-3 font-semibold flex items-center">
                      <span className="mr-2">💡</span> Services Offered:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchUser.servicesInfo?.servicesOffered?.map(service => (
                        <span key={service} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-3 font-semibold flex items-center">
                      <span className="mr-2">🔍</span> Services Needed:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {matchUser.servicesInfo?.servicesNeeded?.map(service => (
                        <span key={service} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">⏰</span> Daily Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Wake up:</span>
                    <p className="text-lg font-bold text-blue-600">{matchUser.scheduleInfo?.wakeUpTime}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Bedtime:</span>
                    <p className="text-lg font-bold text-purple-600">{matchUser.scheduleInfo?.bedTime}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Work from home:</span>
                    <p className={`text-lg font-bold ${matchUser.scheduleInfo?.workFromHome ? 'text-green-600' : 'text-red-600'}`}>
                      {matchUser.scheduleInfo?.workFromHome ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Housing Preferences */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏠</span> Housing Preferences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Move-in Date:</span>
                      <p className="font-bold text-green-600">{matchUser.housingInfo?.moveInDate}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Preferred Area:</span>
                      <p className="font-bold text-blue-600">{matchUser.housingInfo?.preferredLocation}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Housing Type:</span>
                      <p className="font-bold text-purple-600">{matchUser.housingInfo?.housingType === 'apartment' ? 'Apartment' : 'House'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Pet Friendly:</span>
                      <p className={`font-bold ${matchUser.preferencesInfo?.petFriendly ? 'text-green-600' : 'text-red-600'}`}>
                        {matchUser.preferencesInfo?.petFriendly ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Noise Level:</span>
                      <p className="font-bold text-orange-600">{matchUser.preferencesInfo?.noiseLevel}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-gray-700">Cleanliness:</span>
                      <p className="font-bold text-teal-600">{matchUser.preferencesInfo?.cleanlinessLevel}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="pt-6">
                <button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
                  onClick={() => handleSendMessage(matchUser)}
                >
                  <span>💬</span>
                  <span>Send Message</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">Finding Your Perfect Roommates</h3>
          <p className="text-gray-600">Analyzing compatibility and preferences...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={findMatches}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            <span>🔄</span>
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-lg bg-opacity-95 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                🏠
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Roommate Matches
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  Found {matches.length} potential roommates for you ✨
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 text-sm bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-lg border border-purple-200">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="rounded-md border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-700">🤖 AI Enhanced Matching</span>
              </label>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Matches Found</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              We couldn't find any roommates that match your preferences right now. 
              Try adjusting your criteria or check back later!
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <span>⚙️</span>
              <span>Adjust Preferences</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {matches.length > 0 && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🎉 Great news! We found {matches.length} compatible roommate{matches.length > 1 ? 's' : ''} for you
                </h2>
                <p className="text-gray-600">Ranked by compatibility score and matching criteria</p>
              </div>
            )}
            {matches.map((match, index) => (
              <MatchCard key={match.user.id} match={match} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches; 
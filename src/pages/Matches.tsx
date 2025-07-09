import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { matchingEngine, type MatchResult } from '../services/matchingEngine';
import { fetchUsers } from '../services/userApi';
import type { DbUser } from '../types/onboarding';

const Matches: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<DbUser[]>([]);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (users.length === 0) return;
    const dbCurrentUser = users.find(u => u.id === user.uid);
    if (!dbCurrentUser) {
      setError('Current user not found in database.');
      setLoading(false);
      return;
    }
    const candidateUsers = users.filter(u => u.id !== user.uid);
    setLoading(true);
    setError(null);
    matchingEngine.findMatches({
      current_user: dbCurrentUser,
      max_results: 10,
      min_score: 30,
      use_ai: useAI
    }, candidateUsers)
      .then(setMatches)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, users, useAI, navigate]);

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

  const handleSendMessage = (matchUser: DbUser) => {
    const message = prompt(
      `Send a message to ${matchUser.basic_info?.first_name} ${matchUser.basic_info?.last_name}:`,
      `Hi ${matchUser.basic_info?.first_name}! I saw your profile and think we could be great roommates. Would you like to chat about finding a place together?`
    );
    if (message && message.trim()) {
      alert(`Message sent to ${matchUser.basic_info?.first_name}!
\nMessage: "${message}"
\nThey will be notified and can respond through the app.`);
    }
  };

  const CompatibilityBreakdown: React.FC<{ analysis: MatchResult['compatibility_analysis'] }> = ({ analysis }) => (
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
    const matchUser = match.user;
    return (
      <div className={`bg-white rounded-xl shadow-xl border-2 ${rank <= 3 ? 'border-blue-300 shadow-blue-100' : 'border-gray-200'} overflow-hidden hover:shadow-2xl transition-all duration-300`}>
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
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {matchUser.basic_info?.first_name?.charAt(0)}{matchUser.basic_info?.last_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {matchUser.basic_info?.first_name} {matchUser.basic_info?.last_name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCompatibilityBg(match.match_score)} ${getCompatibilityColor(match.match_score)} border-2`}>
                      {Math.round(match.match_score)}% Match
                    </span>
                    {matchUser.verification_status === 'verified' && (
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
                  <span className="font-medium">{matchUser.basic_info?.location}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>🎂</span>
                  <span className="font-medium">{formatAge(matchUser.basic_info?.age || '')}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>💼</span>
                  <span className="font-medium">{formatWorkSchedule(matchUser.schedule_info?.work_schedule || '')}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span>💰</span>
                  <span className="font-medium">${matchUser.housing_info?.budget?.min}-{matchUser.housing_info?.budget?.max}/month</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <blockquote className="italic text-gray-600 bg-blue-50 rounded p-4 border-l-4 border-blue-300">
              {matchUser.bio}
            </blockquote>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold text-purple-700 mb-2 flex items-center">
              <span className="mr-2">🌸</span> Why You Match
            </h4>
            {match.match_reasons.length > 0 ? (
              <ul className="list-disc pl-6">
                {match.match_reasons.map((reason, i) => (
                  <li key={i} className="mb-1 text-green-700 bg-green-50 rounded px-2 py-1">{reason}</li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No specific reasons found.</div>
            )}
          </div>
          <button
            className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Hide Details ▲' : 'View Details ▼'}
          </button>
          {expanded && <CompatibilityBreakdown analysis={match.compatibility_analysis} />}
          <button
            className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg shadow-md hover:from-green-600 hover:to-blue-700 transition-all"
            onClick={() => handleSendMessage(matchUser)}
          >
            Send Message
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="matches-page">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Roommate Matches</h1>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Found {matches.length} potential roommates for you ✨</span>
        <div>
          <label className="mr-2">
            <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} /> AI Enhanced Matching
          </label>
          <button onClick={() => navigate('/dashboard')} className="ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Back to Dashboard</button>
        </div>
      </div>
      <div className="space-y-8">
        {matches.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <h2 className="text-xl font-semibold mb-2">No Matches Found</h2>
            <p>We couldn't find any roommates that match your preferences right now. Try adjusting your criteria or check back later!</p>
          </div>
        ) : (
          matches.map((match, idx) => <MatchCard key={match.user.id} match={match} rank={idx + 1} />)
        )}
      </div>
    </div>
  );
};

export default Matches; 
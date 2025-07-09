import React, { useEffect, useState } from 'react';
import OnboardingFlow from '../components/OnboardingFlow';
import { fetchUsers } from '../services/userApi';

const OnboardingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="onboarding-page">
      <OnboardingFlow />
    </div>
  );
};

export default OnboardingPage; 
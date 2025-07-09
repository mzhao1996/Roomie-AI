import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DbUser, BasicInfo, ScheduleInfo, PreferencesInfo, ServicesInfo, HousingInfo } from '../types/onboarding';
import { useAuth } from '../AuthContext';
import StepIndicator from './onboarding/StepIndicator';
import BasicInfoStep from './onboarding/BasicInfoStep';
import ScheduleStep from './onboarding/ScheduleStep';
import PreferencesStep from './onboarding/PreferencesStep';
import ServicesStep from './onboarding/ServicesStep';
import HousingStep from './onboarding/HousingStep';
import { updateUser } from '../services/userApi';

const STEP_TITLES = [
  'Basic Info',
  'Schedule',
  'Preferences',
  'Services',
  'Housing'
];

const DEFAULT_BASIC_INFO: BasicInfo = {
  first_name: '',
  last_name: '',
  age: '',
  phone_number: '',
  location: ''
};
const DEFAULT_SCHEDULE_INFO: ScheduleInfo = {
  work_schedule: 'day-shift',
  wake_up_time: '',
  bed_time: '',
  work_from_home: false
};
const DEFAULT_PREFERENCES_INFO: PreferencesInfo = {
  lgbtq_inclusive: false,
  gender_preference: 'no-preference',
  pet_friendly: false,
  smoking_tolerance: 'no-smoking',
  noise_level: 'moderate',
  cleanliness_level: 'clean'
};
const DEFAULT_SERVICES_INFO: ServicesInfo = {
  services_offered: [],
  services_needed: []
};
const DEFAULT_HOUSING_INFO: HousingInfo = {
  move_in_date: '',
  budget: { min: 0, max: 0 },
  preferred_location: '',
  housing_type: 'apartment'
};

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [basic_info, setBasicInfo] = useState<BasicInfo>(DEFAULT_BASIC_INFO);
  const [schedule_info, setScheduleInfo] = useState<ScheduleInfo>(DEFAULT_SCHEDULE_INFO);
  const [preferences_info, setPreferencesInfo] = useState<PreferencesInfo>(DEFAULT_PREFERENCES_INFO);
  const [services_info, setServicesInfo] = useState<ServicesInfo>(DEFAULT_SERVICES_INFO);
  const [housing_info, setHousingInfo] = useState<HousingInfo>(DEFAULT_HOUSING_INFO);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`onboarding_${user.uid}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setBasicInfo(parsed.basic_info || DEFAULT_BASIC_INFO);
          setScheduleInfo(parsed.schedule_info || DEFAULT_SCHEDULE_INFO);
          setPreferencesInfo(parsed.preferences_info || DEFAULT_PREFERENCES_INFO);
          setServicesInfo(parsed.services_info || DEFAULT_SERVICES_INFO);
          setHousingInfo(parsed.housing_info || DEFAULT_HOUSING_INFO);
          setBio(parsed.bio || '');
          if (parsed.completed) navigate('/dashboard');
        } catch (e) { console.error(e); }
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify({
        basic_info, schedule_info, preferences_info, services_info, housing_info, bio
      }));
    }
  }, [basic_info, schedule_info, preferences_info, services_info, housing_info, bio, user]);

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(basic_info.first_name && basic_info.last_name && basic_info.age && basic_info.location);
      case 2:
        return !!schedule_info.work_schedule;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return !!housing_info.move_in_date;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < STEP_TITLES.length) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  const handleComplete = async () => {
    if (!canProceedToNext()) return;
    setIsSubmitting(true);
    try {
      if (user) {
        const dbData: Partial<DbUser> = {
          id: user.uid,
          bio: bio || '',
          verification_status: 'pending',
          joined_date: new Date().toISOString().slice(0, 10),
          basic_info,
          schedule_info,
          preferences_info,
          services_info,
          housing_info,
          completed: true,
          completed_at: new Date().toISOString()
        };
        localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(dbData));
        await updateUser(user.uid, dbData);
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={basic_info} onChange={setBasicInfo} bio={bio} onBioChange={setBio} />;
      case 2:
        return <ScheduleStep data={schedule_info} onChange={setScheduleInfo} />;
      case 3:
        return <PreferencesStep data={preferences_info} onChange={setPreferencesInfo} />;
      case 4:
        return <ServicesStep data={services_info} onChange={setServicesInfo} />;
      case 5:
        return <HousingStep data={housing_info} onChange={setHousingInfo} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEP_TITLES.length;

  return (
    <div className="onboarding-flow">
      <div className="onboarding-container">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEP_TITLES.length}
          stepTitles={STEP_TITLES}
        />
        <div className="onboarding-content">{renderCurrentStep()}</div>
        <div className="onboarding-navigation">
          <button type="button" onClick={handlePrevious} disabled={currentStep === 1} className="nav-button secondary">Previous</button>
          <button type="button" onClick={handleBackToHome} className="nav-button back-to-home">Back to Home</button>
          {isLastStep ? (
            <button type="button" onClick={handleComplete} disabled={!canProceedToNext() || isSubmitting} className="nav-button primary complete-button">
              {isSubmitting ? 'Completing...' : 'Complete Setup'}
            </button>
          ) : (
            <button type="button" onClick={handleNext} disabled={!canProceedToNext()} className="nav-button primary">Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OnboardingData } from '../types/onboarding';
import { DEFAULT_ONBOARDING_DATA } from '../types/onboarding';
import { useAuth } from '../AuthContext';
import { upsertOnboardingData } from '../services/userService';

// Step components
import StepIndicator from './onboarding/StepIndicator';
import BasicInfoStep from './onboarding/BasicInfoStep';
import ScheduleStep from './onboarding/ScheduleStep';
import PreferencesStep from './onboarding/PreferencesStep';
import ServicesStep from './onboarding/ServicesStep';
import HousingStep from './onboarding/HousingStep';

const STEP_TITLES = [
  'Basic Info',
  'Schedule',
  'Preferences',
  'Services',
  'Housing'
];

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`onboarding_${user.uid}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setOnboardingData(parsedData);
          
          // If already completed, redirect to dashboard
          if (parsedData.completed) {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error loading saved onboarding data:', error);
        }
      }
    }
  }, [user, navigate]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(onboardingData));
    }
  }, [onboardingData, user]);

  const updateStepData = (stepData: any) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(onboardingData.basicInfo.firstName && 
                 onboardingData.basicInfo.lastName && 
                 onboardingData.basicInfo.age && 
                 onboardingData.basicInfo.location &&
                 onboardingData.basicInfo.bio); // bio 也必填
      case 2:
        return !!onboardingData.scheduleInfo.workSchedule;
      case 3:
        return true; // Preferences are optional
      case 4:
        return true; // Services are optional
      case 5:
        return !!(onboardingData.housingInfo.moveInDate);
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
    console.log('Navigating back to dashboard');
    navigate('/dashboard');
  };

  const handleComplete = async () => {
    if (!canProceedToNext()) return;
    setIsSubmitting(true);
    try {
      // 构造下划线风格的字段，并去除驼峰字段
      const {
        basicInfo,
        scheduleInfo,
        preferencesInfo,
        servicesInfo,
        housingInfo,
        completedAt,
        ...rest
      } = onboardingData;
      const completedData = {
        ...rest,
        completed: true,
        completed_at: new Date().toISOString(),
        bio: basicInfo.bio === '' ? null : basicInfo.bio,
        verification_status: 'unverified',
        joined_date: new Date().toISOString(),
        basic_info: basicInfo,
        schedule_info: scheduleInfo,
        preferences_info: preferencesInfo,
        services_info: servicesInfo,
        housing_info: housingInfo,
      };
      // 只将 completedData 用于 Supabase 和 localStorage，state 仍用原结构
      setOnboardingData({
        ...onboardingData,
        completed: true,
        completedAt: new Date().toISOString(),
      });
      // Save to localStorage
      if (user) {
        localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(completedData));
        // 调试日志：输出 userId 和数据
        console.log('[Onboarding Debug] userId:', user.uid);
        console.log('[Onboarding Debug] completedData:', completedData);
        // 调用 Supabase upsert
        const error = await upsertOnboardingData(user.uid, completedData);
        if (error) {
          console.error('[Onboarding Debug] Supabase upsert error:', error.message, error);
        } else {
          console.log('[Onboarding Debug] Supabase upsert success');
        }
      }
      // Redirect to dashboard after a brief delay
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
        return (
          <BasicInfoStep
            data={onboardingData.basicInfo}
            onChange={(data) => updateStepData({ basicInfo: data })}
          />
        );
      case 2:
        return (
          <ScheduleStep
            data={onboardingData.scheduleInfo}
            onChange={(data) => updateStepData({ scheduleInfo: data })}
          />
        );
      case 3:
        return (
          <PreferencesStep
            data={onboardingData.preferencesInfo}
            onChange={(data) => updateStepData({ preferencesInfo: data })}
          />
        );
      case 4:
        return (
          <ServicesStep
            data={onboardingData.servicesInfo}
            onChange={(data) => updateStepData({ servicesInfo: data })}
          />
        );
      case 5:
        return (
          <HousingStep
            data={onboardingData.housingInfo}
            onChange={(data) => updateStepData({ housingInfo: data })}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEP_TITLES.length;

  return (
    <form className="onboarding-form">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={STEP_TITLES.length}
        stepTitles={STEP_TITLES}
      />
      
      {/* Form Step */}
      <div className="form-step active">
        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="form-navigation">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`btn ${currentStep === 1 ? 'btn-disabled' : 'btn-secondary'}`}
        >
          Previous
        </button>

        <button 
          type="button"
          onClick={handleBackToHome}
          className="back-link"
        >
          ← Back to Dashboard
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleComplete}
            disabled={!canProceedToNext() || isSubmitting}
            className={`btn ${!canProceedToNext() || isSubmitting ? 'btn-disabled' : 'btn-primary'}`}
          >
            {isSubmitting ? 'Completing...' : 'Complete Setup'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className={`btn ${!canProceedToNext() ? 'btn-disabled' : 'btn-primary'}`}
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

export default OnboardingFlow; 
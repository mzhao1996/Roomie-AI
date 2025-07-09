import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepTitles }) => {
  return (
    <div className="step-indicator">
      <div className="step-progress">
        <div 
          className="step-progress-bar" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="step-info">
        <span className="step-number">Step {currentStep} of {totalSteps}</span>
        <span className="step-title">{stepTitles[currentStep - 1]}</span>
      </div>
    </div>
  );
};

export default StepIndicator; 
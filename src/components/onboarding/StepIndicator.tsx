import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, stepTitles }) => {
  return (
    <div className="progress-indicator">
      <div className="progress-steps">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div 
                className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                {stepNumber}
              </div>
              {index < totalSteps - 1 && (
                <div 
                  className={`step-line ${isCompleted ? 'completed' : ''}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="progress-text">
        Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
      </p>
    </div>
  );
};

export default StepIndicator; 
import React from 'react';
import type { ServicesInfo } from '../../types/onboarding';

interface ServicesStepProps {
  data: ServicesInfo;
  onChange: (data: ServicesInfo) => void;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ServicesInfo, value: string[]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Services</h2>
        <p>What can you offer or need from a roommate?</p>
      </div>
      <div className="step-content">
        <div className="form-group">
          <label htmlFor="services_offered">Services Offered</label>
          <input
            type="text"
            id="services_offered"
            value={data.services_offered.join(', ')}
            onChange={e => handleChange('services_offered', e.target.value.split(',').map(s => s.trim()))}
            placeholder="e.g. Cooking, Tech Support"
          />
        </div>
        <div className="form-group">
          <label htmlFor="services_needed">Services Needed</label>
          <input
            type="text"
            id="services_needed"
            value={data.services_needed.join(', ')}
            onChange={e => handleChange('services_needed', e.target.value.split(',').map(s => s.trim()))}
            placeholder="e.g. House Cleaning, Pet Sitting"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesStep; 
import React from 'react';
import type { HousingInfo } from '../../types/onboarding';

interface HousingStepProps {
  data: HousingInfo;
  onChange: (data: HousingInfo) => void;
}

const HousingStep: React.FC<HousingStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof HousingInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };
  const handleBudgetChange = (key: 'min' | 'max', value: number) => {
    onChange({ ...data, budget: { ...data.budget, [key]: value } });
  };
  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Housing</h2>
        <p>Tell us about your housing needs</p>
      </div>
      <div className="step-content">
        <div className="form-group">
          <label htmlFor="move_in_date">Move-in Date</label>
          <input
            type="date"
            id="move_in_date"
            value={data.move_in_date}
            onChange={e => handleChange('move_in_date', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Budget</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={data.budget.min}
              onChange={e => handleBudgetChange('min', Number(e.target.value))}
              placeholder="Min"
            />
            <input
              type="number"
              min={0}
              value={data.budget.max}
              onChange={e => handleBudgetChange('max', Number(e.target.value))}
              placeholder="Max"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="preferred_location">Preferred Location</label>
          <input
            type="text"
            id="preferred_location"
            value={data.preferred_location}
            onChange={e => handleChange('preferred_location', e.target.value)}
            placeholder="e.g. Downtown, Near University"
          />
        </div>
        <div className="form-group">
          <label htmlFor="housing_type">Housing Type</label>
          <select
            id="housing_type"
            value={data.housing_type}
            onChange={e => handleChange('housing_type', e.target.value)}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="studio">Studio</option>
            <option value="shared-room">Shared Room</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HousingStep; 
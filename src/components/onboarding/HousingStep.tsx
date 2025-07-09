import React from 'react';
import type { HousingInfo } from '../../types/onboarding';

interface HousingStepProps {
  data: HousingInfo;
  onChange: (data: HousingInfo) => void;
}

const HousingStep: React.FC<HousingStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof HousingInfo, value: string | number | { min: number; max: number }) => {
    onChange({ ...data, [field]: value });
  };

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({
      ...data,
      budget: {
        ...data.budget,
        [type]: numValue
      }
    });
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Housing details</h2>
        <p>Let's find the perfect place within your budget and timeline</p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="moveInDate">Desired Move-in Date *</label>
          <input
            type="date"
            id="moveInDate"
            value={data.moveInDate}
            onChange={(e) => handleChange('moveInDate', e.target.value)}
            min={today}
            required
          />
        </div>

        <div className="budget-section">
          <h3>Budget Range (Monthly Rent)</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetMin">Minimum ($)</label>
              <input
                type="number"
                id="budgetMin"
                value={data.budget.min || ''}
                onChange={(e) => handleBudgetChange('min', e.target.value)}
                placeholder="500"
                min="0"
                step="50"
              />
            </div>
            <div className="form-group">
              <label htmlFor="budgetMax">Maximum ($)</label>
              <input
                type="number"
                id="budgetMax"
                value={data.budget.max || ''}
                onChange={(e) => handleBudgetChange('max', e.target.value)}
                placeholder="1500"
                min="0"
                step="50"
              />
            </div>
          </div>
          <div className="budget-display">
            {data.budget.min > 0 && data.budget.max > 0 && (
              <p className="budget-range">
                Budget: ${data.budget.min.toLocaleString()} - ${data.budget.max.toLocaleString()} per month
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="preferredLocation">Preferred Area/Neighborhood</label>
          <input
            type="text"
            id="preferredLocation"
            value={data.preferredLocation}
            onChange={(e) => handleChange('preferredLocation', e.target.value)}
            placeholder="e.g., Downtown, Near University, Quiet suburbs"
          />
        </div>

        <div className="form-group">
          <label htmlFor="housingType">Housing Type Preference</label>
          <select
            id="housingType"
            value={data.housingType}
            onChange={(e) => handleChange('housingType', e.target.value as HousingInfo['housingType'])}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="studio">Studio</option>
            <option value="shared-room">Shared Room</option>
          </select>
        </div>

        <div className="housing-tip">
          <div className="tip-icon">🏠</div>
          <div className="tip-content">
            <p><strong>Smart Matching:</strong> We'll help you find roommates with compatible budgets and location preferences to make house hunting easier.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingStep; 
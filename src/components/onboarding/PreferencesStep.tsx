import React from 'react';
import type { PreferencesInfo } from '../../types/onboarding';

interface PreferencesStepProps {
  data: PreferencesInfo;
  onChange: (data: PreferencesInfo) => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PreferencesInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Preferences</h2>
        <p>Tell us about your living preferences</p>
      </div>
      <div className="step-content">
        <div className="form-group">
          <label htmlFor="lgbtq_inclusive">LGBTQ+ Inclusive</label>
          <input
            type="checkbox"
            id="lgbtq_inclusive"
            checked={data.lgbtq_inclusive}
            onChange={e => handleChange('lgbtq_inclusive', e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender_preference">Gender Preference</label>
          <select
            id="gender_preference"
            value={data.gender_preference}
            onChange={e => handleChange('gender_preference', e.target.value)}
          >
            <option value="no-preference">No Preference</option>
            <option value="same-gender">Same Gender</option>
            <option value="different-gender">Different Gender</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pet_friendly">Pet Friendly</label>
          <input
            type="checkbox"
            id="pet_friendly"
            checked={data.pet_friendly}
            onChange={e => handleChange('pet_friendly', e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="smoking_tolerance">Smoking Tolerance</label>
          <select
            id="smoking_tolerance"
            value={data.smoking_tolerance}
            onChange={e => handleChange('smoking_tolerance', e.target.value)}
          >
            <option value="no-smoking">No Smoking</option>
            <option value="outdoor-only">Outdoor Only</option>
            <option value="indoor-ok">Indoor OK</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="noise_level">Noise Level</label>
          <select
            id="noise_level"
            value={data.noise_level}
            onChange={e => handleChange('noise_level', e.target.value)}
          >
            <option value="very-quiet">Very Quiet</option>
            <option value="quiet">Quiet</option>
            <option value="moderate">Moderate</option>
            <option value="lively">Lively</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cleanliness_level">Cleanliness Level</label>
          <select
            id="cleanliness_level"
            value={data.cleanliness_level}
            onChange={e => handleChange('cleanliness_level', e.target.value)}
          >
            <option value="very-clean">Very Clean</option>
            <option value="clean">Clean</option>
            <option value="moderate">Moderate</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep; 
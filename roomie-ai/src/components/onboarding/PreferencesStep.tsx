import React from 'react';
import type { PreferencesInfo } from '../../types/onboarding';

interface PreferencesStepProps {
  data: PreferencesInfo;
  onChange: (data: PreferencesInfo) => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PreferencesInfo, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Your living preferences</h2>
        <p>Help us find roommates who share your values and lifestyle</p>
      </div>

      <div className="step-content">
        <div className="preference-section">
          <h3>Inclusion & Values</h3>
          <div className="checkbox-group">
            <label className="checkbox-label inclusive-option">
              <input
                type="checkbox"
                checked={data.lgbtqInclusive}
                onChange={(e) => handleChange('lgbtqInclusive', e.target.checked)}
              />
              <span className="checkbox-text">
                <span className="option-title">LGBTQ+ Inclusive Living 🏳️‍🌈</span>
                <span className="option-description">I want to live in an LGBTQ+ friendly environment</span>
              </span>
            </label>
          </div>
        </div>

        <div className="preference-section">
          <h3>Roommate Preferences</h3>
          <div className="form-group">
            <label htmlFor="genderPreference">Gender Preference</label>
            <select
              id="genderPreference"
              value={data.genderPreference}
              onChange={(e) => handleChange('genderPreference', e.target.value as PreferencesInfo['genderPreference'])}
            >
              <option value="no-preference">No Preference</option>
              <option value="same-gender">Same Gender</option>
              <option value="different-gender">Different Gender</option>
            </select>
          </div>
        </div>

        <div className="preference-section">
          <h3>Lifestyle Preferences</h3>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.petFriendly}
                onChange={(e) => handleChange('petFriendly', e.target.checked)}
              />
              <span className="checkbox-text">
                <span className="option-title">Pet Friendly 🐕</span>
                <span className="option-description">I'm okay living with pets</span>
              </span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="smokingTolerance">Smoking Policy</label>
            <select
              id="smokingTolerance"
              value={data.smokingTolerance}
              onChange={(e) => handleChange('smokingTolerance', e.target.value as PreferencesInfo['smokingTolerance'])}
            >
              <option value="no-smoking">No Smoking</option>
              <option value="outdoor-only">Outdoor Only</option>
              <option value="indoor-ok">Indoor OK</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="noiseLevel">Noise Tolerance</label>
            <select
              id="noiseLevel"
              value={data.noiseLevel}
              onChange={(e) => handleChange('noiseLevel', e.target.value as PreferencesInfo['noiseLevel'])}
            >
              <option value="very-quiet">Very Quiet</option>
              <option value="quiet">Quiet</option>
              <option value="moderate">Moderate</option>
              <option value="lively">Lively</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cleanlinessLevel">Cleanliness Level</label>
            <select
              id="cleanlinessLevel"
              value={data.cleanlinessLevel}
              onChange={(e) => handleChange('cleanlinessLevel', e.target.value as PreferencesInfo['cleanlinessLevel'])}
            >
              <option value="very-clean">Very Clean</option>
              <option value="clean">Clean</option>
              <option value="moderate">Moderate</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep; 
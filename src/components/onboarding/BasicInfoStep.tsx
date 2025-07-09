import React from 'react';
import type { BasicInfo } from '../../types/onboarding';

interface BasicInfoStepProps {
  data: BasicInfo;
  onChange: (data: BasicInfo) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof BasicInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Let's start with the basics</h2>
        <p>Tell us a bit about yourself</p>
      </div>

      <div className="step-content">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <select
            id="age"
            value={data.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required
          >
            <option value="">Select your age range</option>
            <option value="18-22">18-22</option>
            <option value="23-27">23-27</option>
            <option value="28-32">28-32</option>
            <option value="33-37">33-37</option>
            <option value="38-42">38-42</option>
            <option value="43-47">43-47</option>
            <option value="48-52">48-52</option>
            <option value="53+">53+</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            value={data.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Current Location *</label>
          <input
            type="text"
            id="location"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, State"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio <span>*</span></label>
          <textarea
            id="bio"
            value={data.bio}
            onChange={e => onChange({ ...data, bio: e.target.value })}
            placeholder="Tell us about yourself"
            required
            className="form-control"
            rows={4}
            style={{
              resize: 'vertical',
              minHeight: '80px',
              fontSize: '1rem',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
              background: '#fff',
              color: '#222',
              boxSizing: 'border-box',
              marginBottom: '4px',
            }}
          />
          <style>{`
            #bio::placeholder {
              color: #b0b0b0;
              opacity: 1;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep; 
import React from 'react';
import type { BasicInfo } from '../../types/onboarding';

interface BasicInfoStepProps {
  data: BasicInfo;
  onChange: (data: BasicInfo) => void;
  bio: string;
  onBioChange: (bio: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onChange, bio, onBioChange }) => {
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
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              value={data.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              value={data.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
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
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            value={data.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
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
          <label htmlFor="bio">Bio (self introduction)</label>
          <textarea
            id="bio"
            className="w-full border border-gray-300 rounded-md p-2 mt-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[80px] resize-vertical"
            value={bio}
            onChange={e => onBioChange(e.target.value)}
            placeholder="Tell your future roommate about yourself..."
            maxLength={500}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep; 
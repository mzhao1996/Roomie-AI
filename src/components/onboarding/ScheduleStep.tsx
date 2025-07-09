import React from 'react';
import type { ScheduleInfo } from '../../types/onboarding';

interface ScheduleStepProps {
  data: ScheduleInfo;
  onChange: (data: ScheduleInfo) => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ScheduleInfo, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Tell us about your schedule</h2>
        <p>This helps us find compatible roommates</p>
      </div>

      <div className="step-content">
        <div className="form-group">
          <label htmlFor="workSchedule">Work Schedule *</label>
          <select
            id="workSchedule"
            value={data.workSchedule}
            onChange={(e) => handleChange('workSchedule', e.target.value as ScheduleInfo['workSchedule'])}
            required
          >
            <option value="day-shift">Day Shift (9AM - 5PM)</option>
            <option value="night-shift">Night Shift (11PM - 7AM)</option>
            <option value="freelancer">Freelancer (Flexible)</option>
            <option value="student">Student</option>
            <option value="remote">Remote Work</option>
            <option value="irregular">Irregular Schedule</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="wakeUpTime">Typical Wake Up Time</label>
            <input
              type="time"
              id="wakeUpTime"
              value={data.wakeUpTime}
              onChange={(e) => handleChange('wakeUpTime', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bedTime">Typical Bed Time</label>
            <input
              type="time"
              id="bedTime"
              value={data.bedTime}
              onChange={(e) => handleChange('bedTime', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.workFromHome}
                onChange={(e) => handleChange('workFromHome', e.target.checked)}
              />
              <span className="checkbox-text">I work from home most days</span>
            </label>
          </div>
        </div>

        <div className="schedule-tip">
          <div className="tip-icon">💡</div>
          <div className="tip-content">
            <p><strong>Why we ask:</strong> Matching compatible schedules helps create harmony. For example, night shift workers often prefer other night owls as roommates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep; 
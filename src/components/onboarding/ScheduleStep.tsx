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
        <h2>Schedule</h2>
        <p>Tell us about your daily routine</p>
      </div>
      <div className="step-content">
        <div className="form-group">
          <label htmlFor="work_schedule">Work Schedule</label>
          <select
            id="work_schedule"
            value={data.work_schedule}
            onChange={e => handleChange('work_schedule', e.target.value)}
          >
            <option value="day-shift">Day Shift</option>
            <option value="night-shift">Night Shift</option>
            <option value="freelancer">Freelancer</option>
            <option value="student">Student</option>
            <option value="remote">Remote</option>
            <option value="irregular">Irregular</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="wake_up_time">Wake Up Time</label>
          <input
            type="time"
            id="wake_up_time"
            value={data.wake_up_time}
            onChange={e => handleChange('wake_up_time', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bed_time">Bed Time</label>
          <input
            type="time"
            id="bed_time"
            value={data.bed_time}
            onChange={e => handleChange('bed_time', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={data.work_from_home}
              onChange={e => handleChange('work_from_home', e.target.checked)}
            />
            Work From Home
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep; 
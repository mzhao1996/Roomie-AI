import React from 'react';
import type { ServicesInfo } from '../../types/onboarding';
import { SERVICE_OPTIONS } from '../../types/onboarding';

interface ServicesStepProps {
  data: ServicesInfo;
  onChange: (data: ServicesInfo) => void;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ data, onChange }) => {
  const handleServiceToggle = (service: string, type: 'offered' | 'needed') => {
    const currentServices = type === 'offered' ? data.servicesOffered : data.servicesNeeded;
    const isSelected = currentServices.includes(service);
    
    let newServices;
    if (isSelected) {
      newServices = currentServices.filter(s => s !== service);
    } else {
      newServices = [...currentServices, service];
    }
    
    onChange({
      ...data,
      [type === 'offered' ? 'servicesOffered' : 'servicesNeeded']: newServices
    });
  };

  const ServiceGrid: React.FC<{ type: 'offered' | 'needed' }> = ({ type }) => {
    const selectedServices = type === 'offered' ? data.servicesOffered : data.servicesNeeded;
    
    return (
      <div className="service-grid">
        {SERVICE_OPTIONS.map((service) => (
          <label
            key={service}
            className={`service-option ${selectedServices.includes(service) ? 'selected' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => handleServiceToggle(service, type)}
            />
            <span className="service-label">{service}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Services & Support</h2>
        <p>Create a supportive living environment by sharing skills and needs</p>
      </div>

      <div className="step-content">
        <div className="services-section">
          <h3>Services I can offer</h3>
          <p className="section-description">
            What services or help can you provide to your roommates? This creates a supportive community.
          </p>
          <ServiceGrid type="offered" />
        </div>

        <div className="services-section">
          <h3>Services I might need</h3>
          <p className="section-description">
            What kind of help would you appreciate? This helps match you with roommates who can provide support.
          </p>
          <ServiceGrid type="needed" />
        </div>

        <div className="services-tip">
          <div className="tip-icon">🤝</div>
          <div className="tip-content">
            <p><strong>Community Focus:</strong> Roomie AI believes in creating supportive living environments where roommates help each other thrive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesStep; 
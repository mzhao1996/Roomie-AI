// Onboarding data types and interfaces
// 只保留 DbUser 及嵌套类型
export interface BasicInfo {
  first_name: string;
  last_name: string;
  age: string;
  phone_number: string;
  location: string;
}

export interface ScheduleInfo {
  work_schedule: 'day-shift' | 'night-shift' | 'freelancer' | 'student' | 'remote' | 'irregular';
  wake_up_time: string;
  bed_time: string;
  work_from_home: boolean;
}

export interface PreferencesInfo {
  lgbtq_inclusive: boolean;
  gender_preference: 'no-preference' | 'same-gender' | 'different-gender';
  pet_friendly: boolean;
  smoking_tolerance: 'no-smoking' | 'outdoor-only' | 'indoor-ok';
  noise_level: 'very-quiet' | 'quiet' | 'moderate' | 'lively';
  cleanliness_level: 'very-clean' | 'clean' | 'moderate' | 'relaxed';
}

export interface ServicesInfo {
  services_offered: string[];
  services_needed: string[];
}

export interface HousingInfo {
  move_in_date: string;
  budget: {
    min: number;
    max: number;
  };
  preferred_location: string;
  housing_type: 'apartment' | 'house' | 'condo' | 'studio' | 'shared-room';
}

export interface DbUser {
  id: string;
  bio: string;
  verification_status: 'verified' | 'pending' | 'unverified';
  joined_date: string;
  profile_picture?: string;
  basic_info: BasicInfo;
  schedule_info: ScheduleInfo;
  preferences_info: PreferencesInfo;
  services_info: ServicesInfo;
  housing_info: HousingInfo;
  completed: boolean;
  completed_at?: string;
  match_score?: number;
  match_reasons?: string[];
} 
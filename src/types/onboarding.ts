// Onboarding data types and interfaces
export interface BasicInfo {
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  location: string;
}

export interface ScheduleInfo {
  workSchedule: 'day-shift' | 'night-shift' | 'freelancer' | 'student' | 'remote' | 'irregular';
  wakeUpTime: string;
  bedTime: string;
  workFromHome: boolean;
}

export interface PreferencesInfo {
  lgbtqInclusive: boolean;
  genderPreference: 'no-preference' | 'same-gender' | 'different-gender';
  petFriendly: boolean;
  smokingTolerance: 'no-smoking' | 'outdoor-only' | 'indoor-ok';
  noiseLevel: 'very-quiet' | 'quiet' | 'moderate' | 'lively';
  cleanlinessLevel: 'very-clean' | 'clean' | 'moderate' | 'relaxed';
}

export interface ServicesInfo {
  servicesOffered: string[];
  servicesNeeded: string[];
}

export interface HousingInfo {
  moveInDate: string;
  budget: {
    min: number;
    max: number;
  };
  preferredLocation: string;
  housingType: 'apartment' | 'house' | 'condo' | 'studio' | 'shared-room';
}

export interface OnboardingData {
  basicInfo: BasicInfo;
  scheduleInfo: ScheduleInfo;
  preferencesInfo: PreferencesInfo;
  servicesInfo: ServicesInfo;
  housingInfo: HousingInfo;
  completed: boolean;
  completedAt?: string;
}

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  basicInfo: {
    firstName: '',
    lastName: '',
    age: '',
    phoneNumber: '',
    location: ''
  },
  scheduleInfo: {
    workSchedule: 'day-shift',
    wakeUpTime: '',
    bedTime: '',
    workFromHome: false
  },
  preferencesInfo: {
    lgbtqInclusive: false,
    genderPreference: 'no-preference',
    petFriendly: false,
    smokingTolerance: 'no-smoking',
    noiseLevel: 'moderate',
    cleanlinessLevel: 'clean'
  },
  servicesInfo: {
    servicesOffered: [],
    servicesNeeded: []
  },
  housingInfo: {
    moveInDate: '',
    budget: {
      min: 0,
      max: 0
    },
    preferredLocation: '',
    housingType: 'apartment'
  },
  completed: false
};

export const SERVICE_OPTIONS = [
  'Pet Sitting',
  'House Cleaning',
  'Cooking/Meal Prep',
  'Grocery Shopping',
  'Transportation',
  'Tech Support',
  'Language Exchange',
  'Fitness Buddy',
  'Study Partner',
  'Gardening',
  'Childcare',
  'Elder Care'
]; 
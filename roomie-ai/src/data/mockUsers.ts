import type { OnboardingData } from '../types/onboarding';

export interface MockUser extends OnboardingData {
  id: string;
  profilePicture?: string;
  bio: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  joinedDate: string;
  matchScore?: number; // Will be calculated during matching
  matchReasons?: string[]; // Will be generated during matching
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user_001',
    bio: "Software engineer who loves cooking and quiet evenings. Looking for someone who appreciates a clean, organized space.",
    verificationStatus: 'verified',
    joinedDate: '2024-01-15',
    basicInfo: {
      firstName: 'Alex',
      lastName: 'Chen',
      age: '25-29',
      phoneNumber: '(555) 123-4567',
      location: 'San Francisco, CA'
    },
    scheduleInfo: {
      workSchedule: 'remote',
      wakeUpTime: '07:00',
      bedTime: '23:00',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'quiet',
      cleanlinessLevel: 'very-clean'
    },
    servicesInfo: {
      servicesOffered: ['Cooking/Meal Prep', 'Tech Support', 'Grocery Shopping'],
      servicesNeeded: ['Pet Sitting', 'House Cleaning']
    },
    housingInfo: {
      moveInDate: '2024-03-01',
      budget: { min: 1200, max: 1800 },
      preferredLocation: 'Mission District, SOMA',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user_002',
    bio: "Night shift nurse who values quiet mornings and supportive community. LGBTQ+ friendly and pet parent!",
    verificationStatus: 'verified',
    joinedDate: '2024-01-20',
    basicInfo: {
      firstName: 'Sam',
      lastName: 'Rodriguez',
      age: '30-34',
      phoneNumber: '(555) 987-6543',
      location: 'Oakland, CA'
    },
    scheduleInfo: {
      workSchedule: 'night-shift',
      wakeUpTime: '14:00',
      bedTime: '06:00',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'very-quiet',
      cleanlinessLevel: 'clean'
    },
    servicesInfo: {
      servicesOffered: ['Pet Sitting', 'Elder Care', 'Childcare'],
      servicesNeeded: ['Grocery Shopping', 'House Cleaning']
    },
    housingInfo: {
      moveInDate: '2024-02-15',
      budget: { min: 1000, max: 1500 },
      preferredLocation: 'Oakland, Berkeley',
      housingType: 'house'
    },
    completed: true,
    completedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: 'user_003',
    bio: "Graduate student studying environmental science. Love hiking, yoga, and sustainable living. Seeking like-minded roommate.",
    verificationStatus: 'verified',
    joinedDate: '2024-01-25',
    basicInfo: {
      firstName: 'Jordan',
      lastName: 'Thompson',
      age: '23-27',
      phoneNumber: '(555) 456-7890',
      location: 'Berkeley, CA'
    },
    scheduleInfo: {
      workSchedule: 'student',
      wakeUpTime: '06:30',
      bedTime: '22:30',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'same-gender',
      petFriendly: false,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'moderate',
      cleanlinessLevel: 'very-clean'
    },
    servicesInfo: {
      servicesOffered: ['Gardening', 'Study Partner', 'Language Exchange'],
      servicesNeeded: ['Tech Support', 'Transportation']
    },
    housingInfo: {
      moveInDate: '2024-08-01',
      budget: { min: 800, max: 1200 },
      preferredLocation: 'Berkeley, Near University',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-01-25T16:20:00Z'
  },
  {
    id: 'user_004',
    bio: "Freelance graphic designer with flexible schedule. Love music, art galleries, and hosting small gatherings.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-01',
    basicInfo: {
      firstName: 'Maya',
      lastName: 'Patel',
      age: '28-32',
      phoneNumber: '(555) 234-5678',
      location: 'San Francisco, CA'
    },
    scheduleInfo: {
      workSchedule: 'freelancer',
      wakeUpTime: '09:00',
      bedTime: '01:00',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: false,
      genderPreference: 'same-gender',
      petFriendly: true,
      smokingTolerance: 'outdoor-only',
      noiseLevel: 'lively',
      cleanlinessLevel: 'moderate'
    },
    servicesInfo: {
      servicesOffered: ['Language Exchange', 'Fitness Buddy', 'Cooking/Meal Prep'],
      servicesNeeded: ['Tech Support', 'Transportation']
    },
    housingInfo: {
      moveInDate: '2024-04-01',
      budget: { min: 1400, max: 2000 },
      preferredLocation: 'Castro, Mission, Hayes Valley',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-02-01T11:15:00Z'
  },
  {
    id: 'user_005',
    bio: "Senior marketing manager who travels frequently. Looking for responsible, independent roommate to share spacious home.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-05',
    basicInfo: {
      firstName: 'David',
      lastName: 'Kim',
      age: '35-39',
      phoneNumber: '(555) 345-6789',
      location: 'Palo Alto, CA'
    },
    scheduleInfo: {
      workSchedule: 'day-shift',
      wakeUpTime: '06:00',
      bedTime: '22:00',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: false,
      genderPreference: 'no-preference',
      petFriendly: false,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'quiet',
      cleanlinessLevel: 'very-clean'
    },
    servicesInfo: {
      servicesOffered: ['Transportation', 'Tech Support'],
      servicesNeeded: ['House Cleaning', 'Pet Sitting', 'Grocery Shopping']
    },
    housingInfo: {
      moveInDate: '2024-03-15',
      budget: { min: 2000, max: 3000 },
      preferredLocation: 'Palo Alto, Mountain View, Menlo Park',
      housingType: 'house'
    },
    completed: true,
    completedAt: '2024-02-05T09:30:00Z'
  },
  {
    id: 'user_006',
    bio: "Yoga instructor and wellness coach. Early riser who loves meditation, healthy cooking, and creating peaceful spaces.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-10',
    basicInfo: {
      firstName: 'Luna',
      lastName: 'Williams',
      age: '25-29',
      phoneNumber: '(555) 567-8901',
      location: 'San Rafael, CA'
    },
    scheduleInfo: {
      workSchedule: 'irregular',
      wakeUpTime: '05:30',
      bedTime: '21:30',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'same-gender',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'very-quiet',
      cleanlinessLevel: 'very-clean'
    },
    servicesInfo: {
      servicesOffered: ['Fitness Buddy', 'Cooking/Meal Prep', 'Gardening'],
      servicesNeeded: ['Tech Support', 'Transportation']
    },
    housingInfo: {
      moveInDate: '2024-05-01',
      budget: { min: 1100, max: 1600 },
      preferredLocation: 'Marin County, Sausalito, Mill Valley',
      housingType: 'house'
    },
    completed: true,
    completedAt: '2024-02-10T07:45:00Z'
  },
  {
    id: 'user_007',
    bio: "Medical resident with demanding schedule. Quiet, focused, and looking for understanding roommate who respects study time.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-12',
    basicInfo: {
      firstName: 'Dr. Priya',
      lastName: 'Singh',
      age: '25-29',
      phoneNumber: '(555) 678-9012',
      location: 'San Francisco, CA'
    },
    scheduleInfo: {
      workSchedule: 'irregular',
      wakeUpTime: '05:00',
      bedTime: '23:30',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'same-gender',
      petFriendly: false,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'very-quiet',
      cleanlinessLevel: 'very-clean'
    },
    servicesInfo: {
      servicesOffered: ['Study Partner'],
      servicesNeeded: ['House Cleaning', 'Grocery Shopping', 'Cooking/Meal Prep']
    },
    housingInfo: {
      moveInDate: '2024-06-01',
      budget: { min: 1300, max: 1900 },
      preferredLocation: 'Near UCSF, Inner Richmond, Sunset',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-02-12T20:15:00Z'
  },
  {
    id: 'user_008',
    bio: "Retired teacher who loves reading, cooking, and mentoring young professionals. Seeking intergenerational living arrangement.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-15',
    basicInfo: {
      firstName: 'Robert',
      lastName: 'Johnson',
      age: '53+',
      phoneNumber: '(555) 789-0123',
      location: 'San Mateo, CA'
    },
    scheduleInfo: {
      workSchedule: 'freelancer',
      wakeUpTime: '06:30',
      bedTime: '22:00',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'quiet',
      cleanlinessLevel: 'clean'
    },
    servicesInfo: {
      servicesOffered: ['Cooking/Meal Prep', 'Gardening', 'Study Partner', 'Language Exchange'],
      servicesNeeded: ['Tech Support', 'Transportation']
    },
    housingInfo: {
      moveInDate: '2024-04-15',
      budget: { min: 1500, max: 2200 },
      preferredLocation: 'San Mateo, Burlingame, Foster City',
      housingType: 'house'
    },
    completed: true,
    completedAt: '2024-02-15T13:20:00Z'
  },
  {
    id: 'user_009',
    bio: "Graduate student in computer science. Love gaming, anime, and building cool projects. Night owl seeking similar schedule.",
    verificationStatus: 'pending',
    joinedDate: '2024-02-18',
    basicInfo: {
      firstName: 'Casey',
      lastName: 'Zhang',
      age: '23-27',
      phoneNumber: '(555) 890-1234',
      location: 'Stanford, CA'
    },
    scheduleInfo: {
      workSchedule: 'student',
      wakeUpTime: '10:00',
      bedTime: '02:00',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'moderate',
      cleanlinessLevel: 'moderate'
    },
    servicesInfo: {
      servicesOffered: ['Tech Support', 'Study Partner'],
      servicesNeeded: ['Cooking/Meal Prep', 'House Cleaning']
    },
    housingInfo: {
      moveInDate: '2024-09-01',
      budget: { min: 1000, max: 1500 },
      preferredLocation: 'Stanford, Palo Alto, Mountain View',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-02-18T22:30:00Z'
  },
  {
    id: 'user_010',
    bio: "Social worker passionate about community building. Love board games, cooking for others, and creating inclusive spaces.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-20',
    basicInfo: {
      firstName: 'Alex',
      lastName: 'Rivera',
      age: '28-32',
      phoneNumber: '(555) 901-2345',
      location: 'Oakland, CA'
    },
    scheduleInfo: {
      workSchedule: 'day-shift',
      wakeUpTime: '07:30',
      bedTime: '23:00',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'no-smoking',
      noiseLevel: 'lively',
      cleanlinessLevel: 'clean'
    },
    servicesInfo: {
      servicesOffered: ['Cooking/Meal Prep', 'Childcare', 'Language Exchange'],
      servicesNeeded: ['Tech Support', 'Transportation']
    },
    housingInfo: {
      moveInDate: '2024-05-15',
      budget: { min: 1200, max: 1700 },
      preferredLocation: 'Oakland, Berkeley, Emeryville',
      housingType: 'house'
    },
    completed: true,
    completedAt: '2024-02-20T15:45:00Z'
  },
  {
    id: 'user_011',
    bio: "Art therapist and weekend musician. Love creative projects, farmers markets, and deep conversations over coffee.",
    verificationStatus: 'verified',
    joinedDate: '2024-02-22',
    basicInfo: {
      firstName: 'Taylor',
      lastName: 'Brown',
      age: '30-34',
      phoneNumber: '(555) 012-3456',
      location: 'San Francisco, CA'
    },
    scheduleInfo: {
      workSchedule: 'day-shift',
      wakeUpTime: '08:00',
      bedTime: '23:30',
      workFromHome: true
    },
    preferencesInfo: {
      lgbtqInclusive: true,
      genderPreference: 'no-preference',
      petFriendly: true,
      smokingTolerance: 'outdoor-only',
      noiseLevel: 'moderate',
      cleanlinessLevel: 'clean'
    },
    servicesInfo: {
      servicesOffered: ['Language Exchange', 'Fitness Buddy', 'Pet Sitting'],
      servicesNeeded: ['Tech Support', 'House Cleaning']
    },
    housingInfo: {
      moveInDate: '2024-07-01',
      budget: { min: 1500, max: 2100 },
      preferredLocation: 'Mission, Castro, Haight',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-02-22T12:10:00Z'
  },
  {
    id: 'user_012',
    bio: "International exchange student from Germany. Love soccer, cooking European cuisine, and learning about American culture.",
    verificationStatus: 'pending',
    joinedDate: '2024-02-25',
    basicInfo: {
      firstName: 'Klaus',
      lastName: 'Mueller',
      age: '23-27',
      phoneNumber: '(555) 123-0987',
      location: 'San Francisco, CA'
    },
    scheduleInfo: {
      workSchedule: 'student',
      wakeUpTime: '07:00',
      bedTime: '22:30',
      workFromHome: false
    },
    preferencesInfo: {
      lgbtqInclusive: false,
      genderPreference: 'no-preference',
      petFriendly: false,
      smokingTolerance: 'outdoor-only',
      noiseLevel: 'moderate',
      cleanlinessLevel: 'clean'
    },
    servicesInfo: {
      servicesOffered: ['Cooking/Meal Prep', 'Language Exchange', 'Fitness Buddy'],
      servicesNeeded: ['Transportation', 'Tech Support']
    },
    housingInfo: {
      moveInDate: '2024-08-15',
      budget: { min: 1000, max: 1400 },
      preferredLocation: 'Near UCSF, Richmond, Sunset',
      housingType: 'apartment'
    },
    completed: true,
    completedAt: '2024-02-25T16:55:00Z'
  }
];

export default MOCK_USERS; 
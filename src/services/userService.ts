import { supabase } from './supabaseClient';

export interface User {
  id: string;
  bio: string | null;
  verification_status: string;
  joined_date: string;
  profile_picture: string;
  basic_info: any;
  schedule_info: any;
  preferences_info: any;
  services_info: any;
  housing_info: any;
  completed: boolean;
  completed_at: string;
  match_score: number;
  match_reasons: any;
}

// Upsert onboarding data for a user
export async function upsertOnboardingData(userId: string, onboardingData: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .upsert([
      {
        id: userId,
        ...onboardingData,
      }
    ], { onConflict: 'id' }); // 修正为字符串
    console.log(data);
  
    return error;
}

// Fetch all users who have completed onboarding
export async function fetchCompletedUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('completed', true);
  if (error) throw error;
  return data as User[];
} 

// Get onboarding data for a user
export async function getOnboardingData(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
} 
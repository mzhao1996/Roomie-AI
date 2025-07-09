import { supabase } from './supabaseClient';
import type { DbUser } from '../types/onboarding';

// 获取所有用户
export async function fetchUsers(): Promise<DbUser[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as DbUser[];
}

// 更新或插入用户
export async function updateUser(id: string, updates: Partial<DbUser>) {
  const { error } = await supabase.from('users').upsert({ id, ...updates });
  if (error) throw error;
} 
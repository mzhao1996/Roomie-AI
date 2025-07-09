import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { MOCK_USERS } from '../data/mockUsers';

// 加载 .env 配置
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importUsers() {
  for (const user of MOCK_USERS) {
    // 构造数据库字段
    const dbUser = {
      id: user.id,
      bio: user.bio,
      verification_status: user.verificationStatus,
      joined_date: user.joinedDate,
      profile_picture: user.profilePicture || null,
      basic_info: user.basicInfo,
      schedule_info: user.scheduleInfo,
      preferences_info: user.preferencesInfo,
      services_info: user.servicesInfo,
      housing_info: user.housingInfo,
      completed: user.completed,
      completed_at: user.completedAt,
      match_score: user.matchScore || null,
      match_reasons: user.matchReasons || null,
    };
    const { error } = await supabase.from('users').upsert(dbUser);
    if (error) {
      console.error(`Failed to import user ${user.id}:`, error.message);
    } else {
      console.log(`Imported user ${user.id}`);
    }
  }
  console.log('All users imported.');
}

importUsers(); 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log('⚡ [SUPABASE CLOUD] Đã khởi tạo kết nối Supabase Postgres Cloud thành công!');
  } catch (err) {
    console.error('❌ [SUPABASE ERROR] Lỗi khởi tạo Supabase Client:', err.message);
  }
} else {
  console.log('ℹ️ [STORAGE MODE] Chưa cấu hình SUPABASE_URL / SUPABASE_KEY. Hệ thống sử dụng lưu trữ File JSON cục bộ.');
}

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

// ----------------------------------------------------
// 1. PLAN DATA ENGINE (Lịch sinh hoạt & Mục tiêu)
// ----------------------------------------------------

export async function fetchPlanFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('app_plans')
      .select('content')
      .eq('id', 'main_plan')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.warn('⚠️ [SUPABASE PLAN FETCH WARNING]', error.message);
      return null;
    }
    return data?.content || null;
  } catch (err) {
    console.error('❌ [SUPABASE PLAN FETCH ERROR]', err.message);
    return null;
  }
}

export async function savePlanToSupabase(planContent) {
  if (!supabase) return null;
  try {
    const payload = {
      id: 'main_plan',
      content: planContent,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('app_plans')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('❌ [SUPABASE PLAN SAVE ERROR]', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('❌ [SUPABASE PLAN SAVE EXCEPTION]', err.message);
    return null;
  }
}

// ----------------------------------------------------
// 2. USERS TABLE ENGINE (Quản lý Tác nhân / Người dùng)
// ----------------------------------------------------

export async function fetchUsersFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('⚠️ [SUPABASE USERS FETCH WARNING]', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    // Convert snake_case DB columns to camelCase JS objects
    return data.map((u) => ({
      id: u.id,
      username: u.username,
      password: u.password,
      fullName: u.full_name || u.fullName,
      role: u.role,
      avatar: u.avatar || '👤',
      status: u.status || 'ACTIVE',
      createdAt: u.created_at || u.createdAt || new Date().toISOString(),
    }));
  } catch (err) {
    console.error('❌ [SUPABASE USERS FETCH ERROR]', err.message);
    return null;
  }
}

export async function saveUsersToSupabase(usersList) {
  if (!supabase) return null;
  try {
    const rows = usersList.map((u) => ({
      id: u.id,
      username: u.username,
      password: u.password,
      full_name: u.fullName,
      role: u.role,
      avatar: u.avatar,
      status: u.status,
      created_at: u.createdAt,
    }));

    const { data, error } = await supabase
      .from('app_users')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('❌ [SUPABASE USERS SAVE ERROR]', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('❌ [SUPABASE USERS SAVE EXCEPTION]', err.message);
    return null;
  }
}

export async function deleteUserFromSupabase(userId) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ [SUPABASE USER DELETE ERROR]', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ [SUPABASE USER DELETE EXCEPTION]', err.message);
    return false;
  }
}

// ----------------------------------------------------
// 3. AUDIT LOGS ENGINE (Nhật ký bảo mật)
// ----------------------------------------------------

export async function fetchAuditLogsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('app_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(500);

    if (error) {
      console.warn('⚠️ [SUPABASE LOGS FETCH WARNING]', error.message);
      return null;
    }
    return data || [];
  } catch (err) {
    console.error('❌ [SUPABASE LOGS FETCH ERROR]', err.message);
    return null;
  }
}

export async function appendAuditLogToSupabase(logEntry) {
  if (!supabase) return null;
  try {
    const row = {
      id: logEntry.id,
      timestamp: logEntry.timestamp,
      event: logEntry.event,
      details: logEntry.details,
      username: logEntry.username,
      ip: logEntry.ip,
    };

    const { data, error } = await supabase
      .from('app_audit_logs')
      .insert([row]);

    if (error) {
      console.error('❌ [SUPABASE LOG INSERT ERROR]', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('❌ [SUPABASE LOG INSERT EXCEPTION]', err.message);
    return null;
  }
}

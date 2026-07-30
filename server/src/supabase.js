import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let isSupabaseDisabled = false;

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

function handleSupabaseError(error, actionName) {
  if (!error) return;
  if (error.message && (error.message.includes('Invalid API key') || error.message.includes('apiKey'))) {
    if (!isSupabaseDisabled) {
      isSupabaseDisabled = true;
      console.log('ℹ️ [SYNC MODE] Supabase API Key không hợp lệ. Đã tự động chuyển toàn bộ hệ thống sang Chế Độ Đồng Bộ Cục Bộ Siêu Nhanh (File JSON Local Sync).');
    }
  } else {
    console.warn(`⚠️ [SUPABASE ${actionName} WARNING]`, error.message);
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabase) && !isSupabaseDisabled;
}

// ----------------------------------------------------
// 1. PLAN DATA ENGINE (Lịch sinh hoạt & Mục tiêu)
// ----------------------------------------------------

export async function fetchPlanFromSupabase() {
  if (!supabase || isSupabaseDisabled) return null;
  try {
    const { data, error } = await supabase
      .from('app_plans')
      .select('content')
      .eq('id', 'main_plan')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error, 'PLAN FETCH');
      return null;
    }
    return data?.content || null;
  } catch (err) {
    handleSupabaseError(err, 'PLAN FETCH EXCEPTION');
    return null;
  }
}

export async function savePlanToSupabase(planContent) {
  if (!supabase || isSupabaseDisabled) return null;
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
      handleSupabaseError(error, 'PLAN SAVE');
      return null;
    }
    return data;
  } catch (err) {
    handleSupabaseError(err, 'PLAN SAVE EXCEPTION');
    return null;
  }
}

// ----------------------------------------------------
// 2. USERS TABLE ENGINE (Quản lý Tác nhân / Người dùng)
// ----------------------------------------------------

export async function fetchUsersFromSupabase() {
  if (!supabase || isSupabaseDisabled) return null;
  try {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'USERS FETCH');
      return null;
    }

    if (!data || data.length === 0) return null;

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
    handleSupabaseError(err, 'USERS FETCH EXCEPTION');
    return null;
  }
}

export async function saveUsersToSupabase(usersList) {
  if (!supabase || isSupabaseDisabled) return null;
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
      handleSupabaseError(error, 'USERS SAVE');
      return null;
    }
    return data;
  } catch (err) {
    handleSupabaseError(err, 'USERS SAVE EXCEPTION');
    return null;
  }
}

export async function deleteUserFromSupabase(userId) {
  if (!supabase || isSupabaseDisabled) return false;
  try {
    const { error } = await supabase
      .from('app_users')
      .delete()
      .eq('id', userId);

    if (error) {
      handleSupabaseError(error, 'USER DELETE');
      return false;
    }
    return true;
  } catch (err) {
    handleSupabaseError(err, 'USER DELETE EXCEPTION');
    return false;
  }
}

// ----------------------------------------------------
// 3. AUDIT LOGS ENGINE (Nhật ký bảo mật)
// ----------------------------------------------------

export async function fetchAuditLogsFromSupabase() {
  if (!supabase || isSupabaseDisabled) return null;
  try {
    const { data, error } = await supabase
      .from('app_audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(500);

    if (error) {
      handleSupabaseError(error, 'LOGS FETCH');
      return null;
    }
    return data || [];
  } catch (err) {
    handleSupabaseError(err, 'LOGS FETCH EXCEPTION');
    return null;
  }
}

export async function appendAuditLogToSupabase(logEntry) {
  if (!supabase || isSupabaseDisabled) return null;
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
      handleSupabaseError(error, 'LOG INSERT');
      return null;
    }
    return data;
  } catch (err) {
    handleSupabaseError(err, 'LOG INSERT EXCEPTION');
    return null;
  }
}

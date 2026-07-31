-- =========================================================================
-- CHRONOFLOW ENTERPRISE & KIDS ENGLISH DASHBOARD - MASTER DATABASE SCHEMA
-- Phiên bản: 3.1 (Tự Động Thêm Cột Migration & Tương Thích Supabase 100%)
-- Tác giả kiến trúc: Lê Lương Bảo Nguyên (ChronoFlow & Kids English Suite)
-- 
-- Hướng dẫn cài đặt trên Supabase Cloud:
-- 1. Vào Supabase Dashboard -> SQL Editor (Biểu tượng >_ ở thanh menu bên trái)
-- 2. Click "New Query" -> Dán toàn bộ file SQL này -> Click "Run" (hoặc nhấn Ctrl + Enter)
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. BẢNG KẾ HOẠCH & LỊCH SINH HOẠT TUẦN (Weekly Plan & Schedule)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_plans (
    id TEXT PRIMARY KEY DEFAULT 'main_plan',
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. BẢNG NGƯỜI DÙNG & TÁC NHÂN HỆ THỐNG (Users, Roles & Authentication)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    avatar TEXT DEFAULT '👤',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. BẢNG NHẬT KÝ BẢO MẬT & KIỂM TOÁN (Security & Audit Logs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    event TEXT NOT NULL,
    details TEXT,
    username TEXT DEFAULT 'SYSTEM',
    ip TEXT DEFAULT '127.0.0.1'
);

-- -------------------------------------------------------------------------
-- 4. BẢNG LƯU TRỮ LỊCH SỬ THAO TÁC & KHÔI PHÚC TRẠNG THÁI (State Snapshots)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_state_snapshots (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    username TEXT DEFAULT 'SYSTEM',
    role TEXT DEFAULT 'admin',
    action TEXT NOT NULL,
    summary JSONB,
    snapshot JSONB NOT NULL
);

-- -------------------------------------------------------------------------
-- 5. BẢNG TIẾN ĐỘ HỌC TIẾNG ANH CHO BÉ MINH ANH (Kids English Progress)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_progress (
    id TEXT PRIMARY KEY DEFAULT 'main_progress',
    stars INTEGER DEFAULT 0,
    mastered_cards JSONB DEFAULT '[]'::jsonb,
    quiz_score INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    active_pet TEXT DEFAULT 'pet_unicorn',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🔄 TỰ ĐỘNG NÂNG CẤP CỘT (MIGRATION) NẾU BẢNG ĐÃ TỒN TẠI TRƯỚC ĐÓ ON SUPABASE
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0;
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS mastered_cards JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0;
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS active_pet TEXT DEFAULT 'pet_unicorn';
ALTER TABLE public.app_kids_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------------------------------------------------------
-- 6. BẢNG KHO DỮ LIỆU TỪ VỰNG TIẾNG ANH TÙY CHỈNH (Kids Custom Vocabulary)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_custom_vocab (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL,
    ipa TEXT,
    vietnamese_phonetic TEXT,
    meaning TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'L1',
    type TEXT DEFAULT 'Danh từ',
    image TEXT DEFAULT '⭐',
    hint TEXT,
    example TEXT,
    example_vi TEXT,
    daily_phrase TEXT,
    fun_fact TEXT,
    is_longman_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. BẢNG TRANG TRANH MINH HỌA (Illustrated Poster Pages & Sections)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_poster_pages (
    id TEXT PRIMARY KEY,
    page_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT DEFAULT 'blue',
    sections JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. BẢNG LỊCH SỬ BÀI TẬP & TRÒ CHƠI (Quiz & Game History Logs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_quiz_history (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    student_name TEXT DEFAULT 'Nguyễn Ngọc Minh Anh',
    quiz_mode TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 10,
    accuracy_pct NUMERIC(5, 2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    stars_earned INTEGER DEFAULT 0,
    streak_achieved INTEGER DEFAULT 0
);

-- -------------------------------------------------------------------------
-- 9. BẢNG CHẤM ĐIỂM PHÁT ÂM AI (AI Voice Pronunciation Evaluations)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_voice_evaluations (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    word TEXT NOT NULL,
    spoken_transcript TEXT,
    score INTEGER DEFAULT 0,
    word_match_pct INTEGER DEFAULT 0,
    intonation_pct INTEGER DEFAULT 0,
    fluency_pct INTEGER DEFAULT 0,
    feedback_label TEXT,
    stars_earned INTEGER DEFAULT 0
);

-- -------------------------------------------------------------------------
-- 10. BẢNG HUY HIỆU & ĐỔI PHẦN THƯỞNG BÉ NGOAN (Rewards & Milestones)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_rewards_milestones (
    id TEXT PRIMARY KEY,
    milestone_title TEXT NOT NULL,
    stars_needed INTEGER NOT NULL,
    reward_item TEXT NOT NULL,
    icon TEXT DEFAULT '🎁',
    claimed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'LOCKED'
);

-- -------------------------------------------------------------------------
-- 11. BẢNG THEO DÕI SỨC KHỎE MẸ & BÉ (Maternal & Child Health Care)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_maternal_health_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    log_type TEXT NOT NULL,
    data JSONB NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 12. BẢNG THÙNG RÁC XÓA MỀM KHÔI PHÚC (Soft Delete Trash Can)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_trash_can (
    id TEXT PRIMARY KEY,
    original_table TEXT NOT NULL,
    original_id TEXT NOT NULL,
    record_data JSONB NOT NULL,
    deleted_by TEXT DEFAULT 'SYSTEM',
    deleted_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 13. BẢNG QUẢN LÝ KHÓA CẤP ĐỘ (Level Access Controls & Override Locks)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_level_access_controls (
    id TEXT PRIMARY KEY DEFAULT 'main_level_controls',
    overrides JSONB DEFAULT '{"L1": true, "L2": false, "L3": false, "L4": false}'::jsonb,
    unlock_threshold_pct INTEGER DEFAULT 90,
    updated_by TEXT DEFAULT 'Lê Lương Bảo Nguyên',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 14. BẢNG ĐỒNG BỘ GITHUB & MANIFEST LƯU TRỮ (GitHub Sync & Backup Manifest)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_github_sync_manifest (
    id TEXT PRIMARY KEY,
    commit_sha TEXT,
    branch TEXT DEFAULT 'main',
    sync_status TEXT DEFAULT 'SUCCESS',
    records_exported INTEGER DEFAULT 0,
    exported_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- BẬT ROW LEVEL SECURITY (RLS) & CHÍNH SÁCH BẢO MẬT (Security Policies)
-- =========================================================================
ALTER TABLE public.app_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_custom_vocab ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_poster_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_voice_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_kids_rewards_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_maternal_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_trash_can ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_level_access_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_github_sync_manifest ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy Generator (Permissive Full Access for System Synchronization)
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name LIKE 'app_%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow full access %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Allow full access %I" ON public.%I FOR ALL USING (true)', tbl, tbl);
    END LOOP;
END $$;

-- =========================================================================
-- CHÈN DỮ LIỆU KHỞI TẠO MẶC ĐỊNH (Initial Seed Data)
-- =========================================================================

-- 1. Tài khoản người dùng hệ thống mặc định
INSERT INTO public.app_users (id, username, password, full_name, role, avatar, status)
VALUES 
  ('usr-admin-01', 'admin', '888', 'Lê Lương Bảo Nguyên (Quản Trị Tối Cao)', 'admin', '🛡️', 'ACTIVE'),
  ('usr-editor-01', 'editor', '123', 'Biên Tập Viên Chuyên Nghiệp', 'editor', '✍️', 'ACTIVE'),
  ('usr-viewer-01', 'viewer', '123', 'Quan Sát Viên Sức Khỏe', 'viewer', '👀', 'ACTIVE'),
  ('usr-kids-01', 'minh_anh', '123', 'Nguyễn Ngọc Minh Anh (Thần Đồng Tiếng Anh)', 'kids_english', '🦄', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 2. Tiến độ ban đầu cho bé Minh Anh
INSERT INTO public.app_kids_progress (id, stars, mastered_cards, quiz_score, streak_count, active_pet)
VALUES ('main_progress', 100, '[]'::jsonb, 0, 0, 'pet_unicorn')
ON CONFLICT (id) DO UPDATE SET
  streak_count = EXCLUDED.streak_count,
  active_pet = EXCLUDED.active_pet;

-- 3. Cấu hình khóa cấp độ mặc định
INSERT INTO public.app_level_access_controls (id, overrides, unlock_threshold_pct, updated_by)
VALUES ('main_level_controls', '{"L1": true, "L2": false, "L3": false, "L4": false}'::jsonb, 90, 'Lê Lương Bảo Nguyên')
ON CONFLICT (id) DO NOTHING;

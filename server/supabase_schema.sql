-- =========================================================================
-- CHRONOFLOW ENTERPRISE & KIDS ENGLISH DASHBOARD - SUPABASE POSTGRESQL SCHEMA
-- Hướng dẫn: 
-- 1. Vào Supabase Dashboard -> SQL Editor (Biểu tượng >_ bên thanh menu trái)
-- 2. Click "New Query" -> Dán toàn bộ mã SQL dưới đây -> Click "Run" (hoặc Ctrl + Enter)
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
-- 5. BẢNG DỒNG BỘ TIẾN ĐỘ HỌC TIẾNG ANH CHO BÉ (Kids English Progress)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_progress (
    id TEXT PRIMARY KEY DEFAULT 'main_progress',
    stars INTEGER DEFAULT 0,
    mastered_cards JSONB DEFAULT '[]'::jsonb,
    quiz_score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. BẢNG KHO DỮ LIỆU TỪ VỰNG TIẾNG ANH TÙY CHỈNH (600+ Vocab Database)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_kids_custom_vocab (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL,
    ipa TEXT,
    vietnamese_phonetic TEXT,
    meaning TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    image TEXT DEFAULT '⭐',
    sentence TEXT,
    sentence_vi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
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

-- 1. Policies cho app_plans
DROP POLICY IF EXISTS "Allow full access app_plans" ON public.app_plans;
CREATE POLICY "Allow full access app_plans" ON public.app_plans FOR ALL USING (true);

-- 2. Policies cho app_users
DROP POLICY IF EXISTS "Allow full access app_users" ON public.app_users;
CREATE POLICY "Allow full access app_users" ON public.app_users FOR ALL USING (true);

-- 3. Policies cho app_audit_logs
DROP POLICY IF EXISTS "Allow full access app_audit_logs" ON public.app_audit_logs;
CREATE POLICY "Allow full access app_audit_logs" ON public.app_audit_logs FOR ALL USING (true);

-- 4. Policies cho app_state_snapshots
DROP POLICY IF EXISTS "Allow full access app_state_snapshots" ON public.app_state_snapshots;
CREATE POLICY "Allow full access app_state_snapshots" ON public.app_state_snapshots FOR ALL USING (true);

-- 5. Policies cho app_kids_progress
DROP POLICY IF EXISTS "Allow full access app_kids_progress" ON public.app_kids_progress;
CREATE POLICY "Allow full access app_kids_progress" ON public.app_kids_progress FOR ALL USING (true);

-- 6. Policies cho app_kids_custom_vocab
DROP POLICY IF EXISTS "Allow full access app_kids_custom_vocab" ON public.app_kids_custom_vocab;
CREATE POLICY "Allow full access app_kids_custom_vocab" ON public.app_kids_custom_vocab FOR ALL USING (true);

-- =========================================================================
-- CHÈN DỮ LIỆU KHỞI TẠO MẶC ĐỊNH (Initial Seed Data)
-- =========================================================================

-- Người dùng mặc định
INSERT INTO public.app_users (id, username, password, full_name, role, avatar, status)
VALUES 
  ('usr-admin-01', 'admin', '888', 'Quản Trị Viên Tối Cao', 'admin', '🛡️', 'ACTIVE'),
  ('usr-editor-01', 'editor', '123', 'Biên Tập Viên Chuyên Nghiệp', 'editor', '✍️', 'ACTIVE'),
  ('usr-viewer-01', 'viewer', '123', 'Quan Sát Viên Sức Khỏe', 'viewer', '👀', 'ACTIVE'),
  ('usr-kids-01', 'behoctienganh', '123', 'Bé Minh Anh (Thần Đồng Tiếng Anh)', 'kids_english', '🦄', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Tiến độ học ban đầu cho bé Minh Anh
INSERT INTO public.app_kids_progress (id, stars, mastered_cards, quiz_score)
VALUES ('main_progress', 100, '[]'::jsonb, 0)
ON CONFLICT (id) DO NOTHING;

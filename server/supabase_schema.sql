-- ====================================================
-- SUPABASE POSTGRESQL DATABASE SCHEMA CHRONOFLOW / LỊCH SINH HOẠT
-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Paste đoạn code này -> Click Run.
-- ====================================================

-- 1. Bảng lưu trữ Kế hoạch & Mục tiêu tuần (Plan & Schedule Data)
CREATE TABLE IF NOT EXISTS public.app_plans (
    id TEXT PRIMARY KEY DEFAULT 'main_plan',
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng quản lý Tác nhân & Người dùng (Users & Roles)
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

-- 3. Bảng Nhật ký bảo mật & Kiểm toán (Audit Logs)
CREATE TABLE IF NOT EXISTS public.app_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    event TEXT NOT NULL,
    details TEXT,
    username TEXT,
    ip TEXT
);

-- 4. Bật Row Level Security (RLS) & Cho phép truy cập qua API (Chính sách mặc định)
ALTER TABLE public.app_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_audit_logs ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép Service Role & Anon key đọc/ghi dữ liệu
CREATE POLICY "Allow public read app_plans" ON public.app_plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update app_plans" ON public.app_plans FOR ALL USING (true);

CREATE POLICY "Allow public read app_users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete app_users" ON public.app_users FOR ALL USING (true);

CREATE POLICY "Allow public read app_audit_logs" ON public.app_audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert app_audit_logs" ON public.app_audit_logs FOR ALL USING (true);

-- Chèn người dùng mặc định nếu chưa có
INSERT INTO public.app_users (id, username, password, full_name, role, avatar, status)
VALUES 
  ('usr-admin-01', 'admin', '888', 'Quản Trị Viên Tối Cao', 'admin', '🛡️', 'ACTIVE'),
  ('usr-editor-01', 'editor', '123', 'Biên Tập Viên Chuyên Nghiệp', 'editor', '✍️', 'ACTIVE'),
  ('usr-viewer-01', 'viewer', '123', 'Quan Sát Viên', 'viewer', '👀', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

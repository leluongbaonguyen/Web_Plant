-- =========================================================================
-- CHRONOFLOW ENTERPRISE & KIDS ENGLISH SUITE - FULL DATABASE SCHEMA (CREATE TABLE)
-- Hệ thống Cơ Sở Dữ Liệu Toàn Diện Cho Cả Hiện Tại Về Tương Lai
-- Tác giả Quản Trị: Lê Lương Bảo Nguyên
-- Tác nhân Học Sinh: Nguyễn Ngọc Minh Anh
-- Ngày phát hành: 31/07/2026 (Phiên bản 3.1 Migration Safe)
-- =========================================================================

-- -------------------------------------------------------------------------
-- BẢNG 1: app_plans (Lịch Sinh Hoạt & Kế Hoạch Tuần)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_plans (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'main_plan',
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 2: app_users (Quản Lý Người Dùng & Tác Nhân Hệ Thống)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'editor',
    avatar VARCHAR(32) DEFAULT '👤',
    status VARCHAR(16) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 3: app_audit_logs (Nhật Ký Bảo Mật & Kiểm Toán Thao Tác System)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event VARCHAR(64) NOT NULL,
    details TEXT,
    username VARCHAR(64) DEFAULT 'SYSTEM',
    ip VARCHAR(45) DEFAULT '127.0.0.1'
);

-- -------------------------------------------------------------------------
-- BẢNG 4: app_state_snapshots (Sao Lưu Lịch Sử Trạng Thái & GitHub Backup)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_state_snapshots (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(64) DEFAULT 'SYSTEM',
    role VARCHAR(32) DEFAULT 'admin',
    action VARCHAR(64) NOT NULL,
    summary TEXT,
    snapshot TEXT NOT NULL
);

-- -------------------------------------------------------------------------
-- BẢNG 5: app_kids_progress (Tiến Độ Học Từ Vựng Cho Bé Minh Anh)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_progress (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'main_progress',
    stars INT DEFAULT 0,
    mastered_cards TEXT DEFAULT '[]',
    quiz_score INT DEFAULT 0,
    streak_count INT DEFAULT 0,
    active_pet VARCHAR(32) DEFAULT 'pet_unicorn',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔄 TỰ ĐỘNG THÊM CỘT NẾU BẢNG ĐÃ TỒN TẠI TRƯỚC ĐÓ (MIGRATION SAFE)
ALTER TABLE app_kids_progress ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
ALTER TABLE app_kids_progress ADD COLUMN IF NOT EXISTS active_pet VARCHAR(32) DEFAULT 'pet_unicorn';

-- -------------------------------------------------------------------------
-- BẢNG 6: app_kids_custom_vocab (Kho Từ Vựng Tiếng Anh 600+ Từ Nâng Cấp)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_custom_vocab (
    id VARCHAR(64) PRIMARY KEY,
    word VARCHAR(128) NOT NULL,
    ipa VARCHAR(128),
    vietnamese_phonetic VARCHAR(128),
    meaning TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    level VARCHAR(16) NOT NULL DEFAULT 'L1',
    type VARCHAR(32) DEFAULT 'Danh từ',
    image VARCHAR(32) DEFAULT '⭐',
    hint TEXT,
    example TEXT,
    example_vi TEXT,
    daily_phrase TEXT,
    fun_fact TEXT,
    is_longman_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 7: app_kids_poster_pages (Quản Lý Trang Tranh Minh Họa Poster Pages 1-N)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_poster_pages (
    id VARCHAR(64) PRIMARY KEY,
    page_number INT UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    theme VARCHAR(32) DEFAULT 'blue',
    sections TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 8: app_kids_quiz_history (Lịch Sử Làm Bài Tập & Trò Chơi 100 Câu)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_quiz_history (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_name VARCHAR(128) DEFAULT 'Nguyễn Ngọc Minh Anh',
    quiz_mode VARCHAR(64) NOT NULL,
    score INT DEFAULT 0,
    total_questions INT DEFAULT 10,
    accuracy_pct DECIMAL(5, 2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0,
    stars_earned INT DEFAULT 0,
    streak_achieved INT DEFAULT 0
);

-- -------------------------------------------------------------------------
-- BẢNG 9: app_kids_voice_evaluations (Lịch Sử AI Chấm Điểm Phát Âm Giọng Nói)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_voice_evaluations (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    word VARCHAR(128) NOT NULL,
    spoken_transcript TEXT,
    score INT DEFAULT 0,
    word_match_pct INT DEFAULT 0,
    intonation_pct INT DEFAULT 0,
    fluency_pct INT DEFAULT 0,
    feedback_label VARCHAR(255),
    stars_earned INT DEFAULT 0
);

-- -------------------------------------------------------------------------
-- BẢNG 10: app_kids_rewards_milestones (Quản Lý Phần Thưởng & Huy Hiệu Bé Ngoan)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_kids_rewards_milestones (
    id VARCHAR(64) PRIMARY KEY,
    milestone_title VARCHAR(128) NOT NULL,
    stars_needed INT NOT NULL,
    reward_item VARCHAR(128) NOT NULL,
    icon VARCHAR(32) DEFAULT '🎁',
    claimed_at TIMESTAMP,
    status VARCHAR(32) DEFAULT 'LOCKED'
);

-- -------------------------------------------------------------------------
-- BẢNG 11: app_maternal_health_logs (Nhật Ký Theo Dõi Sức Khỏe Mẹ & Bé)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_maternal_health_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    log_type VARCHAR(64) NOT NULL,
    data TEXT NOT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 12: app_trash_can (Thùng Rác Khôi Phục Dữ Liệu Đã Xóa Mềm)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_trash_can (
    id VARCHAR(64) PRIMARY KEY,
    original_table VARCHAR(64) NOT NULL,
    original_id VARCHAR(64) NOT NULL,
    record_data TEXT NOT NULL,
    deleted_by VARCHAR(64) DEFAULT 'SYSTEM',
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 13: app_level_access_controls (Quản Lý Khóa Cấp Độ Học Nối Tiếp 90%)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_level_access_controls (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'main_level_controls',
    overrides TEXT DEFAULT '{"L1": true, "L2": false, "L3": false, "L4": false}',
    unlock_threshold_pct INT DEFAULT 90,
    updated_by VARCHAR(128) DEFAULT 'Lê Lương Bảo Nguyên',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- BẢNG 14: app_github_sync_manifest (Nhật Ký Tự Động Đồng Bộ Dữ Liệu GitHub)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS app_github_sync_manifest (
    id VARCHAR(64) PRIMARY KEY,
    commit_sha VARCHAR(64),
    branch VARCHAR(32) DEFAULT 'main',
    sync_status VARCHAR(32) DEFAULT 'SUCCESS',
    records_exported INT DEFAULT 0,
    exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- INDEX TỐI ƯU HÓA TỐC ĐỘ TRUY VẤN (Performance Indexes)
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_vocab_level ON app_kids_custom_vocab(level);
CREATE INDEX IF NOT EXISTS idx_vocab_category ON app_kids_custom_vocab(category);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON app_kids_custom_vocab(word);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON app_audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_timestamp ON app_kids_quiz_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_voice_word ON app_kids_voice_evaluations(word);

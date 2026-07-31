import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readAuditLogs, readUsers } from './db.js';
import { fetchKidsProgressFromSupabase, fetchPlanFromSupabase, fetchSnapshotsFromSupabase, isSupabaseConfigured } from './supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const exportDir = path.resolve(dataDir, 'json_exports');

if (!existsSync(exportDir)) {
  mkdirSync(exportDir, { recursive: true });
}

export async function exportAllDatabaseTables() {
  console.log('🚀 [DB EXPORTER] Bắt đầu trích xuất toàn bộ dữ liệu CSDL để tự động hóa lưu trữ & đồng bộ GitHub...');

  try {
    // 1. Export Users Table
    const users = await readUsers();
    writeFileSync(path.resolve(exportDir, 'users_table.json'), JSON.stringify(users, null, 2), 'utf8');

    // 2. Export Audit Logs Table
    const auditLogs = await readAuditLogs();
    writeFileSync(path.resolve(exportDir, 'audit_logs_table.json'), JSON.stringify(auditLogs, null, 2), 'utf8');

    // 3. Export Snapshots Table
    const snapshots = (await fetchSnapshotsFromSupabase()) || [];
    writeFileSync(path.resolve(exportDir, 'snapshots_table.json'), JSON.stringify(snapshots, null, 2), 'utf8');

    // 4. Export Kids Progress Table
    const kidsProgress = (await fetchKidsProgressFromSupabase()) || {
      stars: 100,
      masteredCards: [],
      quizScore: 0,
      updatedAt: new Date().toISOString(),
    };
    writeFileSync(path.resolve(exportDir, 'kids_progress_table.json'), JSON.stringify(kidsProgress, null, 2), 'utf8');

    // 5. Export Plan Table
    const plan = (await fetchPlanFromSupabase()) || {};
    writeFileSync(path.resolve(exportDir, 'plan_table.json'), JSON.stringify(plan, null, 2), 'utf8');

    // 6. Manifest File for GitHub Sync tracking
    const manifest = {
      exportedAt: new Date().toISOString(),
      storageMode: isSupabaseConfigured() ? 'SUPABASE_CLOUD_SYNC' : 'LOCAL_JSON_STORAGE',
      totalTablesExported: 5,
      systemAdmin: 'Lê Lương Bảo Nguyên',
      studentName: 'Nguyễn Ngọc Minh Anh',
    };
    writeFileSync(path.resolve(exportDir, 'sync_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    console.log('🎉 [DB EXPORTER] Đã xuất thành công toàn bộ CSDL ra thư mục server/data/json_exports!');
    console.log('📦 Tất cả file JSON đã sẵn sàng để commit và tự động đồng bộ khi push lên GitHub.');
    return manifest;
  } catch (err) {
    console.error('❌ [DB EXPORTER ERROR]', err.message);
    throw err;
  }
}

// Execute if called directly from command line
if (process.argv[1] && process.argv[1].includes('dbSyncExporter.js')) {
  exportAllDatabaseTables();
}

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const backupDir = path.resolve(dataDir, 'backups');

// Ensure directories exist
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

const usersFile = path.resolve(dataDir, 'users.json');
const planFile = path.resolve(dataDir, 'plan.json');
const logsFile = path.resolve(dataDir, 'audit_logs.json');

// Default initial users table
const DEFAULT_USERS = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    password: '888', // Master Admin Account
    fullName: 'Quản Trị Viên Tối Cao',
    role: 'admin',
    avatar: '🛡️',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-editor-01',
    username: 'editor',
    password: '123',
    fullName: 'Biên Tập Viên Chuyên Nghiệp',
    role: 'editor',
    avatar: '✍️',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-viewer-01',
    username: 'viewer',
    password: '123',
    fullName: 'Quan Sat Viên',
    role: 'viewer',
    avatar: '👀',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

// Atomic Safe Write to File (Prevents Data Corruption / Loss)
function safeWriteFile(filePath, data) {
  const tmpFile = `${filePath}.tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const jsonStr = JSON.stringify(data, null, 2);

  try {
    writeFileSync(tmpFile, jsonStr, 'utf8');
    // Rename temp file atomically
    writeFileSync(filePath, jsonStr, 'utf8');
  } catch (err) {
    console.error(`[DB ERROR] Error writing to ${filePath}:`, err);
  }
}

// Backup Creator Engine (Never Lose Any Data)
export function createBackupSnapshot(category, data) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.resolve(backupDir, `${category}_snapshot_${timestamp}.json`);
    writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');

    // Keep latest 20 backups, delete older ones
    const files = readdirSync(backupDir)
      .filter((f) => f.startsWith(`${category}_snapshot_`))
      .sort();
    if (files.length > 20) {
      const toDelete = files.slice(0, files.length - 20);
      for (const f of toDelete) {
        try {
          const p = path.resolve(backupDir, f);
          if (existsSync(p)) fs.unlinkSync(p);
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[DB BACKUP WARNING]', err.message);
  }
}

// Read Users Table
export function readUsers() {
  try {
    if (!existsSync(usersFile)) {
      safeWriteFile(usersFile, DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    const content = readFileSync(usersFile, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch (err) {
    console.error('[DB ERROR] Failed to read users table, using defaults', err);
    return DEFAULT_USERS;
  }
}

// Write Users Table & Create Snapshot
export function writeUsers(users) {
  safeWriteFile(usersFile, users);
  createBackupSnapshot('users', users);
  return users;
}

// Read Audit Logs Table
export function readAuditLogs() {
  try {
    if (!existsSync(logsFile)) return [];
    const content = readFileSync(logsFile, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Log Security Event
export function appendAuditLog(event, details, username = 'SYSTEM', ip = '127.0.0.1') {
  const logs = readAuditLogs();
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    event,
    details,
    username,
    ip,
  };
  logs.unshift(newLog);
  // Cap logs at 500 records
  const trimmed = logs.slice(0, 500);
  safeWriteFile(logsFile, trimmed);
  return newLog;
}

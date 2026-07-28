import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kangarooVaultDir = path.resolve(__dirname, '../data/kangaroo_vault');

if (!existsSync(kangarooVaultDir)) {
  mkdirSync(kangarooVaultDir, { recursive: true });
}

// In-memory Kangaroo Hop Index Cache (O(1) Access Time)
const kangarooMemoryVault = new Map();
const kangarooStats = {
  engine: 'Kangaroo DB Engine v3.0 (Quantum Hop Persistence)',
  status: 'ONLINE',
  totalHops: 0,
  lastSynced: new Date().toISOString(),
  vaults: ['plan_vault', 'users_vault', 'audit_vault', 'settings_vault'],
};

// Safe File Writer for Kangaroo Vault
function safeKangarooWrite(filename, data) {
  try {
    const filePath = path.resolve(kangarooVaultDir, filename);
    const jsonContent = JSON.stringify(data, null, 2);
    writeFileSync(filePath, jsonContent, 'utf8');
    kangarooStats.totalHops++;
    kangarooStats.lastSynced = new Date().toISOString();
  } catch (err) {
    console.error(`[KANGAROO DB ERROR] Error writing to ${filename}:`, err);
  }
}

// Safe File Reader for Kangaroo Vault
function safeKangarooRead(filename, defaultValue = null) {
  try {
    const filePath = path.resolve(kangarooVaultDir, filename);
    if (!existsSync(filePath)) return defaultValue;
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`[KANGAROO DB WARNING] Could not read ${filename}:`, err.message);
    return defaultValue;
  }
}

/**
 * Hop-Write Record into Kangaroo DB Vault
 */
export function writeKangarooVault(vaultName, data) {
  const filename = `${vaultName}.json`;
  kangarooMemoryVault.set(vaultName, data);
  safeKangarooWrite(filename, {
    _kangaroo_meta: {
      vault: vaultName,
      lastHopTime: new Date().toISOString(),
      checksum: `kng-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
    payload: data,
  });
  return data;
}

/**
 * Hop-Read Record from Kangaroo DB Vault
 */
export function readKangarooVault(vaultName, defaultValue = null) {
  if (kangarooMemoryVault.has(vaultName)) {
    return kangarooMemoryVault.get(vaultName);
  }

  const fileData = safeKangarooRead(`${vaultName}.json`, null);
  if (fileData && fileData.payload) {
    kangarooMemoryVault.set(vaultName, fileData.payload);
    return fileData.payload;
  }

  return defaultValue;
}

/**
 * Rebound Sync Engine: Sync JSON plan & users data into Kangaroo DB
 */
export function syncAllToKangaroo(planData, usersData, auditData) {
  if (planData) writeKangarooVault('plan_vault', planData);
  if (usersData) writeKangarooVault('users_vault', usersData);
  if (auditData) writeKangarooVault('audit_vault', auditData);
}

/**
 * Telemetry Diagnostic info for Kangaroo DB
 */
export function getKangarooTelemetry() {
  const vaultFiles = existsSync(kangarooVaultDir)
    ? readdirSync(kangarooVaultDir).filter((f) => f.endsWith('.json'))
    : [];

  return {
    engine: kangarooStats.engine,
    status: kangarooStats.status,
    totalHops: kangarooStats.totalHops,
    lastSynced: kangarooStats.lastSynced,
    vaultFilesCount: vaultFiles.length,
    vaultFiles,
    memoryVaultKeys: Array.from(kangarooMemoryVault.keys()),
    storagePath: kangarooVaultDir,
  };
}

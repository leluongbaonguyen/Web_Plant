import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readKangarooVault, writeKangarooVault } from './kangarooDb.js';
import {
  deleteSnapshotFromSupabase,
  fetchSnapshotsFromSupabase,
  isSupabaseConfigured,
  saveSnapshotToSupabase,
} from './supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const snapshotsFile = path.resolve(dataDir, 'state_snapshots.json');

if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

function safeWriteFile(filePath, data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const tmpFile = `${filePath}.tmp_${Date.now()}`;
  try {
    writeFileSync(tmpFile, jsonStr, 'utf8');
    writeFileSync(filePath, jsonStr, 'utf8');
  } catch (err) {
    console.error(`[SNAPSHOT WRITE ERROR] ${filePath}:`, err.message);
  }
}

// Calculate summary stats for snapshot comparison
export function generatePlanSummaryStats(plan) {
  if (!plan) return { totalSlots: 0, completedCells: 0, totalCells: 0, goalProgressPercent: 0 };
  const schedule = plan.schedule || [];
  const totalSlots = schedule.length;
  const totalCells = totalSlots * 7;
  let completedCells = 0;

  schedule.forEach((slot) => {
    Object.values(slot.cells || {}).forEach((cell) => {
      if (cell?.done) completedCells++;
    });
  });

  const goals = plan.weeklyGoals || [];
  const completedGoals = goals.filter((g) => g.done).length;
  const goalProgressPercent = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return {
    totalSlots,
    completedCells,
    totalCells,
    overallPercent: totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0,
    completedGoals,
    totalGoals: goals.length,
    goalProgressPercent,
    score: plan.summary?.score || 0,
    title: plan.meta?.title || 'Lịch sinh hoạt tuần',
  };
}

// Read all snapshots
export async function readStateSnapshots() {
  if (isSupabaseConfigured()) {
    const cloudSnaps = await fetchSnapshotsFromSupabase();
    if (cloudSnaps && cloudSnaps.length > 0) return cloudSnaps;
  }

  try {
    const vaultSnaps = readKangarooVault('snapshots_vault', null);
    if (Array.isArray(vaultSnaps) && vaultSnaps.length > 0) return vaultSnaps;

    if (!existsSync(snapshotsFile)) return [];
    const raw = readFileSync(snapshotsFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Create a new snapshot when plan changes
export async function createStateSnapshot(plan, actionDescription = 'Cập nhật lịch sinh hoạt', username = 'SYSTEM', role = 'admin') {
  if (!plan) return null;

  const snapshotEntry = {
    id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    username,
    role,
    action: actionDescription,
    summary: generatePlanSummaryStats(plan),
    snapshot: JSON.parse(JSON.stringify(plan)), // deep clone
  };

  const snapshots = await readStateSnapshots();

  // Deduplicate if identical snapshot within 2 seconds
  const latest = snapshots[0];
  if (latest && (Date.now() - new Date(latest.timestamp).getTime() < 2000) && JSON.stringify(latest.summary) === JSON.stringify(snapshotEntry.summary)) {
    return latest;
  }

  snapshots.unshift(snapshotEntry);
  const trimmed = snapshots.slice(0, 200); // keep 200 point-in-time snapshots

  safeWriteFile(snapshotsFile, trimmed);
  writeKangarooVault('snapshots_vault', trimmed);

  if (isSupabaseConfigured()) {
    await saveSnapshotToSupabase(snapshotEntry);
  }

  return snapshotEntry;
}

// Delete a snapshot
export async function deleteStateSnapshot(snapshotId) {
  let snapshots = await readStateSnapshots();
  snapshots = snapshots.filter((s) => s.id !== snapshotId);

  safeWriteFile(snapshotsFile, snapshots);
  writeKangarooVault('snapshots_vault', snapshots);

  if (isSupabaseConfigured()) {
    await deleteSnapshotFromSupabase(snapshotId);
  }

  return snapshots;
}

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDefaultPlan } from './defaultPlan.js';
import { writeKangarooVault } from './kangarooDb.js';
import { fetchPlanFromSupabase, isSupabaseConfigured, savePlanToSupabase } from './supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');
const dataFile = path.join(dataDir, 'plan.json');
const tempFile = path.join(dataDir, 'plan.tmp.json');

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch {
    await writePlan(createDefaultPlan());
  }
}

export async function readPlan() {
  if (isSupabaseConfigured()) {
    const cloudPlan = await fetchPlanFromSupabase();
    if (cloudPlan) return cloudPlan;
  }

  await ensureDataFile();
  const raw = await readFile(dataFile, 'utf8');
  const localPlan = JSON.parse(raw);

  // Sync initial local plan to Supabase if Supabase is configured
  if (isSupabaseConfigured() && localPlan) {
    savePlanToSupabase(localPlan);
  }

  return localPlan;
}

export async function writePlan(plan) {
  await mkdir(dataDir, { recursive: true });
  const next = {
    ...plan,
    meta: {
      ...plan.meta,
      updatedAt: new Date().toISOString(),
    },
  };

  if (isSupabaseConfigured()) {
    await savePlanToSupabase(next);
  }

  await writeFile(tempFile, JSON.stringify(next, null, 2), 'utf8');
  await rename(tempFile, dataFile);
  writeKangarooVault('plan_vault', next);
  return next;
}

export async function resetPlan() {
  return writePlan(createDefaultPlan());
}

// ----------------------------------------------------
// KIDS ENGLISH LEARNING PROGRESS STORE
// ----------------------------------------------------
const kidsProgressFile = path.join(dataDir, 'kids_progress.json');

export async function readKidsProgress() {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(kidsProgressFile, 'utf8');
    return JSON.parse(raw);
  } catch {
    const defaultProgress = {
      stars: 120,
      masteredCards: ['vocab-1', 'vocab-2', 'vocab-3'],
      quizScore: 0,
      updatedAt: new Date().toISOString(),
    };
    await writeFile(kidsProgressFile, JSON.stringify(defaultProgress, null, 2), 'utf8');
    return defaultProgress;
  }
}

export async function writeKidsProgress(progressData) {
  await mkdir(dataDir, { recursive: true });
  const updated = {
    ...progressData,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(kidsProgressFile, JSON.stringify(updated, null, 2), 'utf8');
  writeKangarooVault('kids_progress_vault', updated);
  return updated;
}


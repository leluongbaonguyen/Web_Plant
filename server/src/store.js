import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDefaultPlan } from './defaultPlan.js';
import { writeKangarooVault } from './kangarooDb.js';

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
  await ensureDataFile();
  const raw = await readFile(dataFile, 'utf8');
  return JSON.parse(raw);
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
  await writeFile(tempFile, JSON.stringify(next, null, 2), 'utf8');
  await rename(tempFile, dataFile);
  writeKangarooVault('plan_vault', next);
  return next;
}

export async function resetPlan() {
  return writePlan(createDefaultPlan());
}

import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createWordBuffer } from './exportWord.js';
import { readPlan, resetPlan, writePlan } from './store.js';
import { sanitizePlan } from './validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'lich-sinh-hoat-api', time: new Date().toISOString() });
});

app.get('/api/plan', async (_req, res, next) => {
  try {
    res.json(await readPlan());
  } catch (error) {
    next(error);
  }
});

app.put('/api/plan', async (req, res, next) => {
  try {
    const plan = sanitizePlan(req.body);
    res.json(await writePlan(plan));
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

app.post('/api/plan/reset', async (_req, res, next) => {
  try {
    res.json(await resetPlan());
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/word', async (_req, res, next) => {
  try {
    const plan = await readPlan();
    const buffer = await createWordBuffer(plan);
    const filename = `Lich_sinh_hoat_1_tuan_${new Date().toISOString().slice(0, 10)}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

const clientDist = path.resolve(__dirname, '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.status ? error.message : 'Máy chủ gặp lỗi. Vui lòng thử lại.',
  });
});

app.listen(port, () => {
  console.log(`Lịch sinh hoạt API đang chạy tại http://localhost:${port}`);
});

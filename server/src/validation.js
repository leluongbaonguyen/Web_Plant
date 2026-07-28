import { DAY_KEYS } from './defaultPlan.js';

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const MAX_TEXT = 4000;

function asText(value, fallback = '', max = MAX_TEXT) {
  if (typeof value !== 'string') return fallback;
  return value.trim().slice(0, max);
}

function asBoolean(value) {
  return value === true;
}

function asTime(value, fallback) {
  return typeof value === 'string' && TIME_PATTERN.test(value) ? value : fallback;
}

function sanitizeCell(cell = {}) {
  const allowedCategories = ['default', 'study', 'work', 'health', 'rest', 'personal'];
  return {
    text: asText(cell.text, '', 1500),
    done: asBoolean(cell.done),
    notes: asText(cell.notes, '', 1500),
    category: allowedCategories.includes(cell.category) ? cell.category : 'default',
  };
}

export function sanitizePlan(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Dữ liệu kế hoạch không hợp lệ.');
  }

  const schedule = Array.isArray(input.schedule) ? input.schedule.slice(0, 200) : [];
  if (schedule.length === 0) {
    throw new Error('Kế hoạch phải có ít nhất một khung giờ.');
  }

  const sanitizedSchedule = schedule.map((row, index) => {
    const cells = {};
    for (const day of DAY_KEYS) cells[day.key] = sanitizeCell(row?.cells?.[day.key]);
    return {
      id: asText(row?.id, `slot-${index + 1}`, 100) || `slot-${index + 1}`,
      start: asTime(row?.start, '06:00'),
      end: asTime(row?.end, '06:15'),
      cells,
    };
  });

  const focus = {};
  for (const day of DAY_KEYS) focus[day.key] = asText(input.dailyFocus?.[day.key], '', 1000);

  const goals = Array.isArray(input.weeklyGoals) ? input.weeklyGoals.slice(0, 100) : [];
  const weeklyGoals = goals.map((goal, index) => ({
    id: asText(goal?.id, `goal-${index + 1}`, 100) || `goal-${index + 1}`,
    title: asText(goal?.title, '', 1000),
    result: asText(goal?.result, '', 1000),
    priority: ['Cao', 'Trung bình', 'Thấp'].includes(goal?.priority) ? goal.priority : 'Trung bình',
    dueDay: asText(goal?.dueDay, '', 50),
    done: asBoolean(goal?.done),
    notes: asText(goal?.notes, '', 1500),
  }));

  const score = Number(input.summary?.score);
  return {
    meta: {
      title: asText(input.meta?.title, 'KẾ HOẠCH SINH HOẠT 1 TUẦN', 300),
      wakeTime: asTime(input.meta?.wakeTime, '06:00'),
      sleepTime: asTime(input.meta?.sleepTime, '00:15'),
      note: asText(input.meta?.note, '', 2000),
      updatedAt: new Date().toISOString(),
    },
    settings: {
      fontFamily: 'Times New Roman',
      fontSize: 13,
      weekendHighlight: input.settings?.weekendHighlight !== false,
      compact: asBoolean(input.settings?.compact),
    },
    dailyFocus: focus,
    weeklyGoals,
    schedule: sanitizedSchedule,
    summary: {
      wins: asText(input.summary?.wins, '', 4000),
      incomplete: asText(input.summary?.incomplete, '', 4000),
      lessons: asText(input.summary?.lessons, '', 4000),
      nextWeek: asText(input.summary?.nextWeek, '', 4000),
      score: Number.isFinite(score) ? Math.min(10, Math.max(0, score)) : 0,
      mood: asText(input.summary?.mood, 'Bình thường', 100),
    },
  };
}

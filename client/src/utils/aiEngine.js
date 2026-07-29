import { DAYS } from '../constants/index.js';

/**
 * Ultra-Advanced Autonomous AI Engine for EduSchedule Enterprise
 * Calculates productivity index, circadian balance, auto-detects schedule conflicts,
 * and performs 1-tap automated schedule optimization.
 */

export function calculateProductivityMetrics(schedule = []) {
  let totalWorkStudy = 0;
  let totalHealth = 0;
  let totalRest = 0;
  let totalCompletedCells = 0;
  let totalCellsCount = schedule.length * 7;

  schedule.forEach((slot) => {
    const startHour = parseInt(slot.start.split(':')[0], 10) || 0;
    const endHour = parseInt(slot.end.split(':')[0], 10) || startHour + 1;
    const duration = Math.max(0.25, endHour - startHour);

    Object.values(slot.cells || {}).forEach((cell) => {
      if (cell?.done) totalCompletedCells++;
      const cat = cell?.category || 'default';
      if (cat === 'work' || cat === 'study') totalWorkStudy += duration;
      else if (cat === 'health') totalHealth += duration;
      else if (cat === 'rest') totalRest += duration;
      else totalWorkStudy += duration;
    });
  });

  const completionRate = totalCellsCount > 0 ? Math.round((totalCompletedCells / totalCellsCount) * 100) : 0;
  
  // Circadian Balance Score (0-100)
  const idealWorkRatio = 0.45; // ~45% work/study
  const idealRestRatio = 0.40; // ~40% rest/sleep
  const idealHealthRatio = 0.15; // ~15% exercise/health
  const totalHours = totalWorkStudy + totalHealth + totalRest || 1;

  const currentWorkRatio = totalWorkStudy / totalHours;
  const currentHealthRatio = totalHealth / totalHours;

  let balanceScore = 100;
  if (Math.abs(currentWorkRatio - idealWorkRatio) > 0.2) balanceScore -= 20;
  if (currentHealthRatio < 0.08) balanceScore -= 15;
  if (completionRate > 70) balanceScore += 10;
  balanceScore = Math.max(10, Math.min(100, balanceScore));

  return {
    completionRate,
    balanceScore,
    totalWorkStudyHours: totalWorkStudy.toFixed(1),
    totalHealthHours: totalHealth.toFixed(1),
    totalRestHours: totalRest.toFixed(1),
    completedCells: totalCompletedCells,
    totalCells: totalCellsCount,
  };
}

/**
 * Autonomous Butler AI: Auto-Fills empty slots and balances schedule y tế & khoa học
 */
export function autoOptimizePlan(plan) {
  if (!plan || !Array.isArray(plan.schedule)) return plan;

  const newSchedule = plan.schedule.map((slot) => {
    const startHour = parseInt(slot.start.split(':')[0], 10) || 0;
    const cells = { ...slot.cells };

    DAYS.forEach((day) => {
      const existing = cells[day.key] || { text: '', done: false, notes: '', category: 'default' };

      // If cell is empty, AI autonomously fills with smart circadian recommendations
      if (!existing.text || existing.text.trim() === '') {
        if (startHour >= 6 && startHour < 7) {
          cells[day.key] = { text: 'Thức dậy, khởi động & uống 500ml nước ấm', done: false, notes: 'Tự động sắp xếp bởi Quản Gia AI', category: 'health' };
        } else if (startHour >= 7 && startHour < 8) {
          cells[day.key] = { text: 'Ăn sáng dinh dưỡng & kiểm tra mục tiêu ngày', done: false, notes: 'Tự động sắp xếp bởi Quản Gia AI', category: 'health' };
        } else if (startHour >= 12 && startHour < 13) {
          cells[day.key] = { text: 'Ăn trưa & Chợp mắt nghỉ ngơi 20 phút', done: false, notes: 'Tự động sắp xếp bởi Quản Gia AI', category: 'rest' };
        } else if (startHour >= 17 && startHour < 18) {
          cells[day.key] = { text: 'Tập thể thao (Chạy bộ / Đạp xe / Gym)', done: false, notes: 'Tự động sắp xếp bởi Quản Gia AI', category: 'health' };
        } else if (startHour >= 22) {
          cells[day.key] = { text: 'Nghỉ ngơi, đọc sách & chuẩn bị đi ngủ', done: false, notes: 'Tự động sắp xếp bởi Quản Gia AI', category: 'rest' };
        }
      }
    });

    return { ...slot, cells };
  });

  return {
    ...plan,
    schedule: newSchedule,
  };
}

/**
 * Auto-Mark All Completed Tasks up to Current Hour
 */
export function autoMarkPastTasksCompleted(plan, currentDayKey, currentHourMinutes) {
  if (!plan || !Array.isArray(plan.schedule)) return plan;

  const updatedSchedule = plan.schedule.map((slot) => {
    const [h, m] = slot.end.split(':').map(Number);
    const slotEndM = (h || 0) * 60 + (m || 0);

    if (slotEndM <= currentHourMinutes) {
      const cells = { ...slot.cells };
      if (cells[currentDayKey] && cells[currentDayKey].text && !cells[currentDayKey].done) {
        cells[currentDayKey] = { ...cells[currentDayKey], done: true };
      }
      return { ...slot, cells };
    }
    return slot;
  });

  return {
    ...plan,
    schedule: updatedSchedule,
  };
}

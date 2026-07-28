import { useState } from 'react';
import { Check, CheckSquare, Edit3, Filter, Plus, Search, Square, Tag, Trash2, Zap } from 'lucide-react';
import { CATEGORIES, DAYS, getCurrentDayKey, cx } from '../../constants/index.js';
import { useRole } from '../../context/RoleContext.jsx';

export function ScheduleTab({
  plan,
  onUpdatePlan,
  onOpenNoteModal,
  search,
  setSearch,
  dayFilter,
  setDayFilter,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}) {
  const { permissions } = useRole();
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [newSlotStart, setNewSlotStart] = useState('08:00');
  const [newSlotEnd, setNewSlotEnd] = useState('08:30');

  if (!plan) return null;

  const todayKey = getCurrentDayKey();
  const schedule = plan.schedule || [];

  // Filter schedule rows
  const filteredSchedule = schedule.filter((row) => {
    // Category filter check
    if (categoryFilter !== 'all') {
      const matchCat = Object.values(row.cells || {}).some((c) => (c.category || 'default') === categoryFilter);
      if (!matchCat) return false;
    }

    // Status filter check
    if (statusFilter === 'done') {
      const anyDone = Object.values(row.cells || {}).some((c) => c.done);
      if (!anyDone) return false;
    } else if (statusFilter === 'pending') {
      const anyPending = Object.values(row.cells || {}).some((c) => !c.done && c.text?.trim());
      if (!anyPending) return false;
    }

    // Search keyword check
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTime = row.start.includes(query) || row.end.includes(query);
      const matchText = Object.values(row.cells || {}).some(
        (c) => c.text?.toLowerCase().includes(query) || c.notes?.toLowerCase().includes(query)
      );
      if (!matchTime && !matchText) return false;
    }

    return true;
  });

  // Cell Content Updater
  const handleCellChange = (slotId, dayKey, field, value) => {
    if (!permissions.canEditCells) return;
    const nextSchedule = schedule.map((slot) => {
      if (slot.id !== slotId) return slot;
      const currentCell = slot.cells[dayKey] || { text: '', done: false, notes: '', category: 'default' };
      return {
        ...slot,
        cells: {
          ...slot.cells,
          [dayKey]: {
            ...currentCell,
            [field]: value,
          },
        },
      };
    });
    onUpdatePlan({ ...plan, schedule: nextSchedule });
  };

  // Add Time Slot (Admin Only)
  const handleAddSlot = () => {
    if (!permissions.canManageSlots) return;
    const newId = `slot-${Date.now()}`;
    const emptyCells = {};
    DAYS.forEach((d) => {
      emptyCells[d.key] = { text: '', done: false, notes: '', category: 'default' };
    });

    const newSlot = {
      id: newId,
      start: newSlotStart,
      end: newSlotEnd,
      cells: emptyCells,
    };

    const nextSchedule = [...schedule, newSlot];
    onUpdatePlan({ ...plan, schedule: nextSchedule });
  };

  // Delete Time Slot (Admin Only)
  const handleDeleteSlot = (slotId) => {
    if (!permissions.canManageSlots) return;
    if (!confirm('Bạn có chắc chắn muốn xóa khung giờ này?')) return;
    const nextSchedule = schedule.filter((s) => s.id !== slotId);
    onUpdatePlan({ ...plan, schedule: nextSchedule });
  };

  // Daily Focus Updater
  const handleFocusChange = (dayKey, text) => {
    if (!permissions.canEditCells) return;
    onUpdatePlan({
      ...plan,
      dailyFocus: {
        ...(plan.dailyFocus || {}),
        [dayKey]: text,
      },
    });
  };

  const displayedDays = dayFilter === 'all' ? DAYS : DAYS.filter((d) => d.key === dayFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Filter Toolbar */}
      <div className="no-print glass-panel rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc, giờ giấc, ghi chú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day Filter */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả các ngày</option>
            {DAYS.map((d) => (
              <option key={d.key} value={d.key}>{d.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="done">Đã hoàn thành</option>
            <option value="pending">Chưa hoàn thành</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả danh mục</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Slot Toolbar (Admin Only) */}
      {permissions.canManageSlots && (
        <div className="no-print glass-panel rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <Plus className="h-4 w-4 text-indigo-400" />
            <span>Thêm khung giờ mới (Admin)</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="time"
              value={newSlotStart}
              onChange={(e) => setNewSlotStart(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            />
            <span className="text-slate-400 font-bold">-</span>
            <input
              type="time"
              value={newSlotEnd}
              onChange={(e) => setNewSlotEnd(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            />

            <button
              onClick={handleAddSlot}
              className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition"
            >
              Thêm Khung Giờ
            </button>
          </div>
        </div>
      )}

      {/* Daily Focus Header Row */}
      <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" /> Trọng Tâm Riêng Từng Ngày
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {displayedDays.map((d) => (
            <div key={d.key} className="space-y-1">
              <span className="text-[11px] font-bold text-slate-300">{d.label}</span>
              <input
                type="text"
                disabled={!permissions.canEditCells}
                placeholder="Trọng tâm ngày..."
                value={plan.dailyFocus?.[d.key] || ''}
                onChange={(e) => handleFocusChange(d.key, e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Schedule Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="border-b border-slate-800 bg-slate-900/90 text-xs text-slate-300 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4 w-32 border-r border-slate-800 text-center">Khung Giờ</th>
              {displayedDays.map((day) => {
                const isToday = day.key === todayKey;
                return (
                  <th
                    key={day.key}
                    className={`p-4 border-r border-slate-800 ${isToday ? 'bg-indigo-950/50 text-indigo-300' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{day.label}</span>
                      {isToday && <span className="rounded-md bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 text-[10px]">Hôm nay</span>}
                    </div>
                  </th>
                );
              })}
              {permissions.canManageSlots && <th className="p-4 w-12 text-center no-print">Xóa</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredSchedule.map((slot) => (
              <tr key={slot.id} className="hover:bg-slate-900/40 transition">
                {/* Slot Time Column */}
                <td className="p-3 font-mono-code font-bold text-slate-300 border-r border-slate-800 text-center bg-slate-950/40">
                  {slot.start} - {slot.end}
                </td>

                {/* Day Columns */}
                {displayedDays.map((day) => {
                  const cell = slot.cells?.[day.key] || { text: '', done: false, notes: '', category: 'default' };
                  const categoryStyle = CATEGORIES[cell.category || 'default'] || CATEGORIES.default;

                  return (
                    <td
                      key={day.key}
                      className={cx(
                        'p-2 border-r border-slate-800/60 align-top transition-all',
                        cell.done ? 'bg-emerald-950/20' : ''
                      )}
                    >
                      <div className="space-y-2">
                        {/* Cell Text & Done Checkbox */}
                        <div className="flex items-start gap-2">
                          <button
                            disabled={!permissions.canEditCells}
                            onClick={() => handleCellChange(slot.id, day.key, 'done', !cell.done)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 disabled:opacity-50"
                          >
                            {cell.done ? (
                              <CheckSquare className="h-4 w-4 text-emerald-400 fill-emerald-950/40" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-600" />
                            )}
                          </button>

                          <textarea
                            rows={2}
                            disabled={!permissions.canEditCells}
                            value={cell.text || ''}
                            onChange={(e) => handleCellChange(slot.id, day.key, 'text', e.target.value)}
                            placeholder="Nhập công việc..."
                            className={cx(
                              'w-full bg-transparent resize-none focus:outline-none text-slate-200 placeholder-slate-600 disabled:cursor-not-allowed',
                              cell.done ? 'line-through text-slate-400' : ''
                            )}
                          />
                        </div>

                        {/* Cell Badges & Category */}
                        <div className="flex items-center justify-between gap-1 pt-1 no-print">
                          {/* Category Selector */}
                          <select
                            disabled={!permissions.canEditCells}
                            value={cell.category || 'default'}
                            onChange={(e) => handleCellChange(slot.id, day.key, 'category', e.target.value)}
                            className="rounded-lg bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 focus:outline-none"
                          >
                            {Object.entries(CATEGORIES).map(([ckey, cat]) => (
                              <option key={ckey} value={ckey}>{cat.label}</option>
                            ))}
                          </select>

                          {/* Notes Button */}
                          <button
                            onClick={() => onOpenNoteModal(cell.notes || '', (newNotes) => handleCellChange(slot.id, day.key, 'notes', newNotes))}
                            className={cx(
                              'flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[10px] font-bold transition border',
                              cell.notes
                                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                            )}
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>{cell.notes ? 'Có note' : '+ Note'}</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}

                {/* Delete Slot Action (Admin Only) */}
                {permissions.canManageSlots && (
                  <td className="p-3 text-center no-print">
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';

export function NoteModal({ isOpen, initialValue, onSave, onClose }) {
  const [note, setNote] = useState(initialValue || '');
  const { permissions } = useRole();

  useEffect(() => {
    setNote(initialValue || '');
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-indigo-400" /> Ghi chú công việc
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 font-bold text-xl">
            ×
          </button>
        </div>

        <textarea
          rows={5}
          disabled={!permissions.canEditCells}
          className="w-full rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 cursor-not-allowed"
          placeholder={permissions.canEditCells ? 'Nhập ghi chú chi tiết, lưu ý hoặc danh sách việc nhỏ...' : 'Chế độ chỉ xem. Bạn không có quyền chỉnh sửa ghi chú.'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-800 transition"
          >
            Hủy / Đóng
          </button>
          {permissions.canEditCells && (
            <button
              onClick={() => {
                onSave(note);
                onClose();
              }}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition"
            >
              Lưu Ghi Chú
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

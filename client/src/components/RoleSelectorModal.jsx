import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Eye, Edit3, Lock, Check, X, KeyRound, UserCheck } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { ROLES, cx } from '../constants/index.js';
import { loginAgent } from '../api.js';

export function RoleSelectorModal({ isOpen, onClose }) {
  const { role, switchRole } = useRole();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAccountLogin = async (e) => {
    e.preventDefault();
    setLoginMsg({ text: '', type: '' });
    try {
      setLoading(true);
      const res = await loginAgent(username, password);
      if (res.ok && res.user) {
        switchRole(res.user.role);
        setLoginMsg({ text: `🎉 Đã đăng nhập thành công với vai trò ${res.user.fullName} (${res.user.role.toUpperCase()})`, type: 'success' });
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setLoginMsg({ text: err.message || 'Mật khẩu hoặc tên đăng nhập không đúng!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const matrix = [
    { name: 'Xem lịch, tìm kiếm, lọc & in', admin: true, editor: true, viewer: true },
    { name: 'Xuất file Word (.docx) & PDF', admin: true, editor: true, viewer: true },
    { name: 'Nghe chuông & thông báo nhắc nhở', admin: true, editor: true, viewer: true },
    { name: 'Đánh dấu hoàn thành việc & cập nhật ghi chú', admin: true, editor: true, viewer: false },
    { name: 'Chỉnh sửa mục tiêu tuần & tổng kết', admin: true, editor: true, viewer: false },
    { name: 'Thêm / Xóa khung giờ thời gian', admin: true, editor: false, viewer: false },
    { name: 'Khôi phục / Đặt lại hệ thống về mặc định', admin: true, editor: false, viewer: false },
    { name: 'Sao lưu & Nhập dữ liệu JSON', admin: true, editor: false, viewer: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-100">Đăng Nhập Quản Lý & Vai Trò (RBAC)</h3>
              <p className="text-xs text-slate-400">Đăng nhập tài khoản Admin/Tác nhân hoặc chọn vai trò trực tiếp để thử nghiệm</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Account Authentication Box */}
        <form onSubmit={handleAccountLogin} className="rounded-2xl border border-indigo-500/30 bg-indigo-950/30 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
            <UserCheck className="h-4 w-4 text-indigo-400" />
            <span>Đăng Nhập Bắt Buộc Tài Khoản Admin / Tác Nhân:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <input
              type="text"
              required
              placeholder="Username (admin, editor, viewer)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500"
            />
            <input
              type="password"
              required
              placeholder="Mật khẩu (Mặc định admin: 888)..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500"
            />
          </div>

          {loginMsg.text && (
            <div className={cx('rounded-xl p-2 text-xs font-bold', loginMsg.type === 'error' ? 'bg-red-950/60 text-red-300 border border-red-500/40' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40')}>
              {loginMsg.text}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('888');
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-slate-700"
            >
              Điền mẫu Admin (888)
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Vai Trò'}
            </button>
          </div>
        </form>

        {/* Role Cards Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.values(ROLES).map((item) => {
            const isSelected = role === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchRole(item.id)}
                className={cx(
                  'flex flex-col justify-between rounded-2xl p-4 text-left transition-all border relative overflow-hidden',
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <span className={cx('inline-block rounded-lg border px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase mb-2', item.color)}>
                    {item.badge}
                  </span>
                  <div className="font-bold text-sm text-slate-100 mb-1">{item.name}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/60 text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                  {isSelected ? '✓ Đang hoạt động' : 'Kích hoạt vai trò ➔'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Permissions Matrix Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-400" /> Ma Trận Phân Quyền Chi Tiết
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Tính năng / Quyền thao tác</th>
                  <th className="p-3 text-center">Admin</th>
                  <th className="p-3 text-center">Editor</th>
                  <th className="p-3 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-medium text-slate-200">{row.name}</td>
                    <td className="p-3 text-center">
                      {row.admin ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.editor ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.viewer ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
          >
            Đóng bảng phân quyền
          </button>
        </div>
      </div>
    </div>
  );
}

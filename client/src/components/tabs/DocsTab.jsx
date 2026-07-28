import { useState } from 'react';
import { BookOpen, CheckCircle2, Code2, Lock, Shield, ShieldCheck, XCircle, Zap } from 'lucide-react';
import { PERMISSION_MATRIX, useRole } from '../../context/RoleContext.jsx';
import { ROLES } from '../../constants/index.js';

export function DocsTab() {
  const { role, switchRole, roleInfo } = useRole();
  const [apiLog, setApiLog] = useState('');
  const [loadingApi, setLoadingApi] = useState(false);

  const testEndpoint = async (endpoint, method = 'GET') => {
    setLoadingApi(true);
    setApiLog(`Đang gửi yêu cầu [${method}] ${endpoint} với vai trò '${role.toUpperCase()}'...`);

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': role,
        },
      });

      const data = await res.json();
      setApiLog(
        `Mã phản hồi HTTP: ${res.status} ${res.statusText}\nHeaders Vai Trò: x-user-role = ${role}\n\nNội dung Phản Hồi từ Máy Chủ:\n${JSON.stringify(data, null, 2)}`
      );
    } catch (err) {
      setApiLog(`Lỗi kết nối API: ${err.message}`);
    } finally {
      setLoadingApi(false);
    }
  };

  const allPermissionsList = [
    { key: 'PERM_READ_SCHEDULE', label: 'Xem Lịch Sinh Hoạt & Tiến Độ' },
    { key: 'PERM_EDIT_CELL', label: 'Chỉnh Sửa Ô Công Việc' },
    { key: 'PERM_DELETE_SLOT', label: 'Xóa Khung Giờ Hoạt Động' },
    { key: 'PERM_MANAGE_GOALS', label: 'Biên Tập Mục Tiêu Tuần' },
    { key: 'PERM_MANAGE_AGENTS', label: 'Thêm / Sửa / Xóa Tác Nhân' },
    { key: 'PERM_RESET_SYSTEM', label: 'Reset Khôi Phục Hệ Thống' },
    { key: 'PERM_KANGAROO_SYNC', label: 'Ép Phục Hồi Kangaroo DB Engine' },
    { key: 'PERM_VIEW_AUDIT_LOGS', label: 'Xem Nhật Ký Bảo Mật Audit Logs' },
    { key: 'PERM_EXPORT_WORD', label: 'Xuất Báo Cáo Word A3 & In' },
    { key: 'PERM_SYSTEM_UPGRADE', label: 'Nâng Cấp Hệ Thống Tự Động' },
    { key: 'PERM_MAINTENANCE_TOGGLE', label: 'Bật/Tắt Chế Độ Bảo Trì' },
    { key: 'PERM_BACKUP_RESTORE', label: 'Sao Lưu & Nhập JSON Database' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper Explanation Header */}
      <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-6 space-y-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-100">
              Hệ Thống Phân Quyền & Bảo Mật Mức Cao Nhất (Military-Grade Security Matrix)
            </h3>
            <p className="text-xs text-slate-400">
              Cơ chế kiểm soát truy cập chi tiết 12 điểm (12-Point Permission Matrix) bảo vệ toàn bộ API và dữ liệu Persistent Kangaroo DB
            </p>
          </div>
        </div>
      </div>

      {/* Military Grade 12-Point Permission Matrix Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" /> Bảng Ma Trận Phân Quyền Chi Tiết 12 Điểm
          </h4>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[10px] font-black text-emerald-300">
            ENFORCED & ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-3">Quyền Hạn (Permission)</th>
                <th className="p-3 text-center">🛡️ Admin</th>
                <th className="p-3 text-center">✍️ Editor</th>
                <th className="p-3 text-center">👀 Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {allPermissionsList.map((perm) => {
                const adminHas = PERMISSION_MATRIX.admin.includes(perm.key);
                const editorHas = PERMISSION_MATRIX.editor.includes(perm.key);
                const viewerHas = PERMISSION_MATRIX.viewer.includes(perm.key);

                return (
                  <tr key={perm.key} className="hover:bg-slate-900/40">
                    <td className="p-3 font-medium text-slate-200">
                      <div className="font-bold text-slate-100">{perm.label}</div>
                      <code className="text-[10px] text-indigo-400 font-mono-code">{perm.key}</code>
                    </td>
                    <td className="p-3 text-center">
                      {adminHas ? <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" /> : <XCircle className="h-5 w-5 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {editorHas ? <CheckCircle2 className="h-5 w-5 text-amber-400 mx-auto" /> : <XCircle className="h-5 w-5 text-slate-600 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {viewerHas ? <CheckCircle2 className="h-5 w-5 text-sky-400 mx-auto" /> : <XCircle className="h-5 w-5 text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Cards & Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(ROLES).map((r) => {
          const isCurrent = role === r.id;
          return (
            <div
              key={r.id}
              className={`glass-panel rounded-2xl p-5 border transition-all space-y-3 ${
                isCurrent ? 'border-indigo-500 bg-indigo-950/30 shadow-lg' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-extrabold uppercase ${r.color}`}>
                  {r.badge}
                </span>
                {isCurrent && <span className="text-[10px] font-bold text-emerald-400">● Đang hoạt động</span>}
              </div>

              <div className="font-bold text-base text-slate-100">{r.name}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>

              <div className="mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-bold text-slate-400">
                {isCurrent ? <span className="text-emerald-400">✓ Vai trò đang hoạt động</span> : <span className="text-slate-500">🔒 Cần đăng nhập để kích hoạt</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive API Explorer */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-indigo-400" /> Thử Nghiệm Kết Nối API Trực Tiếp (RBAC Tester)
        </h4>

        <p className="text-xs text-slate-400">
          Gửi yêu cầu REST API với header <code className="text-indigo-300 font-mono-code">x-user-role: {role}</code> để kiểm tra phản hồi từ Express backend:
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => testEndpoint('/api/health')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            GET /api/health
          </button>
          <button
            onClick={() => testEndpoint('/api/roles')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            GET /api/roles
          </button>
          <button
            onClick={() => testEndpoint('/api/plan')}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          >
            GET /api/plan
          </button>
          <button
            onClick={() => testEndpoint('/api/plan/reset', 'POST')}
            className="rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-900/60 transition"
          >
            POST /api/plan/reset (Yêu cầu Admin)
          </button>
          <button
            onClick={() => testEndpoint('/api/kangaroo/status')}
            className="rounded-xl border border-amber-500/30 bg-amber-950/40 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition"
          >
            GET /api/kangaroo/status (Kangaroo DB)
          </button>
        </div>

        {/* Console Log Display */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono-code text-xs text-emerald-400 min-h-[160px] overflow-x-auto whitespace-pre-wrap">
          {loadingApi ? 'Đang gửi yêu cầu API...' : apiLog || 'Bấm một trong các nút API phía trên để kiểm tra phân quyền thực tế từ máy chủ.'}
        </div>
      </div>
    </div>
  );
}

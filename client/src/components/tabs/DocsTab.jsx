import { useState } from 'react';
import { BookOpen, CheckCircle2, Code2, Lock, Shield, ShieldCheck, Zap } from 'lucide-react';
import { useRole } from '../../context/RoleContext.jsx';
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Upper Explanation Header */}
      <div className="glass-panel rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-6 space-y-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-100">
              Hệ Thống Phân Quyền & API Gateway
            </h3>
            <p className="text-xs text-slate-400">
              Tài liệu kỹ thuật giải thích chi tiết các vai trò (RBAC) và thử nghiệm trực tiếp các Endpoint API
            </p>
          </div>
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

              <button
                onClick={() => switchRole(r.id)}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-slate-200 transition mt-2"
              >
                Chuyển sang vai trò này
              </button>
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
        </div>

        {/* Console Log Display */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono-code text-xs text-emerald-400 min-h-[160px] overflow-x-auto whitespace-pre-wrap">
          {loadingApi ? 'Đang gửi yêu cầu API...' : apiLog || 'Bấm một trong các nút API phía trên để kiểm tra phân quyền thực tế từ máy chủ.'}
        </div>
      </div>
    </div>
  );
}

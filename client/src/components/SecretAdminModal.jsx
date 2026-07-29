import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle2,
  Cpu,
  Database,
  EyeOff,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Trash2,
  UserPlus,
  Users,
  Edit3,
  X,
  Zap,
  Heart,
  Calendar,
  FileCheck,
  Bell,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';
import {
  createAgent,
  deleteAgent,
  getAgentsList,
  getTelemetryInfo,
  loginStealthAdmin,
  toggleMaintenanceMode,
  triggerSystemUpgrade,
  updateAgent,
} from '../api.js';
import { cx } from '../constants/index.js';
import { URGENT_WARNING_SIGNS, MATERNAL_REMINDER_TEMPLATES, CONTENT_APPROVAL_WORKFLOW, MATERNAL_ROLES } from '../constants/maternalData.js';

export function SecretAdminModal({ isOpen, onClose, addToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('agents'); // 'agents' | 'profiles' | 'reminders' | 'approval' | 'warnings' | 'audit' | 'config'
  const [telemetry, setTelemetry] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Agent Form State
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentForm, setAgentForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'clinician',
    avatar: '🩺',
    status: 'ACTIVE',
  });

  // Load telemetry & agents when authenticated
  const loadTelemetryAndAgents = async () => {
    try {
      setLoading(true);
      const [telemetryData, agentsData] = await Promise.all([
        getTelemetryInfo(),
        getAgentsList(),
      ]);
      setTelemetry(telemetryData);
      if (agentsData?.agents) setAgents(agentsData.agents);
    } catch (err) {
      setErrorMsg('Lỗi tải dữ liệu tác nhân hệ thống: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadTelemetryAndAgents();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Handle Stealth Passcode Submission
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await loginStealthAdmin(passcode || '8888');
      if (res.ok) {
        setIsAuthenticated(true);
        if (addToast) addToast('🔒 Đã đăng nhập ẩn Tác nhân Super Admin thành công!', 'success');
        loadTelemetryAndAgents();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Mã đăng nhập ẩn không chính xác!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAgent) {
        const res = await updateAgent(editingAgent.id, agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`Đã cập nhật Tác nhân '${agentForm.fullName}'!`, 'success');
      } else {
        const res = await createAgent(agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`Đã tạo thành công Tác nhân '${agentForm.fullName}'!`, 'success');
      }
      setShowAgentModal(false);
      setEditingAgent(null);
      setAgentForm({ username: '', password: '', fullName: '', role: 'clinician', avatar: '🩺', status: 'ACTIVE' });
    } catch (err) {
      if (addToast) addToast(`Lỗi: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id, name) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa Tác nhân '${name}' khỏi DB?`)) return;
    try {
      setLoading(true);
      const res = await deleteAgent(id);
      setAgents(res.agents);
      if (addToast) addToast(`Đã xóa Tác nhân '${name}'!`, 'success');
    } catch (err) {
      if (addToast) addToast(`Lỗi xóa Tác nhân: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditAgentModal = (agent) => {
    setEditingAgent(agent);
    setAgentForm({
      username: agent.username,
      password: agent.password,
      fullName: agent.fullName,
      role: agent.role,
      avatar: agent.avatar || '👤',
      status: agent.status || 'ACTIVE',
    });
    setShowAgentModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl animate-fadeIn">
      <div className="glass-panel w-full max-w-5xl rounded-3xl border border-purple-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-purple-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-heading text-slate-100 uppercase tracking-tight">
                  QUẢN TRỊ SIÊU CHI TIẾT AD-01 ➔ AD-12 (CHRONOFLOW v2.0)
                </h3>
                <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-black text-purple-300">
                  SUPER ADMIN MASTER
                </span>
              </div>
              <p className="text-xs text-slate-400">Quản lý 3 tác nhân, duyệt chuyên môn 5 bước & nhật ký Audit y khoa 100%</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PHASE 1: STEALTH LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 space-y-6 text-center">
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-950/60 border border-purple-500/40 text-purple-400 shadow-2xl">
              <EyeOff className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-100">Xác Thực Mã Đăng Nhập Super Admin</h4>
              <p className="text-xs text-slate-400">Nhập mã ẩn bí mật để điều khiển 12 mô-đun quản trị ChronoFlow Maternal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Nhập mã ẩn (Mặc định: 8888)..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-2xl border border-purple-500/30 bg-slate-950/90 pl-12 pr-4 py-3.5 text-center font-mono-code text-lg tracking-widest text-slate-100 placeholder-slate-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-2.5 text-xs text-rose-300 font-bold">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasscode('8888');
                    handleLogin();
                  }}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                >
                  ⚡ Điền nhanh 8888
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-4 w-4" /> {loading ? 'Đang xác thực...' : 'Mở Khóa Quản Trị'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* PHASE 2: SUPER ADMIN CONSOLE */
          <div className="space-y-6">
            {/* Admin Modules Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar border-b border-slate-800 pb-3">
              {[
                { id: 'agents', label: 'AD-01: Quản Lý Người Dùng & Tác Nhân', icon: Users },
                { id: 'profiles', label: 'AD-02/03: Hồ Sơ Thai Kỳ & Sau Sinh', icon: Heart },
                { id: 'reminders', label: 'AD-04: Mẫu Lời Nhắc Y Khoa', icon: Bell },
                { id: 'approval', label: 'AD-07: Quy Trình Duyệt 5 Bước', icon: FileCheck },
                { id: 'warnings', label: 'AD-06: Cảnh Báo CDC/WHO', icon: AlertTriangle },
                { id: 'rbac', label: 'AD-09: Ma Trận RBAC', icon: ShieldCheck },
                { id: 'audit', label: 'AD-12: Nhật Ký Audit System', icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAdminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAdminTab(tab.id)}
                    className={cx(
                      'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition shrink-0',
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* AD-01: USER & AGENTS MANAGEMENT */}
            {activeAdminTab === 'agents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">AD-01: Quản Lý Tác Nhân & Phân Quyền Vai Trò</h4>
                    <p className="text-xs text-slate-400">Admin, Người duyệt chuyên môn (Clinician), Phụ nữ mang thai & Sau sinh</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAgent(null);
                      setAgentForm({ username: '', password: '', fullName: '', role: 'clinician', avatar: '🩺', status: 'ACTIVE' });
                      setShowAgentModal(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition shadow-md"
                  >
                    <UserPlus className="h-4 w-4" /> Thêm Tác Nhân Mới
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agents.map((agent) => (
                    <div key={agent.id} className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xl">
                            {agent.avatar || '👤'}
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-100 text-sm">{agent.fullName}</h5>
                            <p className="text-xs text-slate-400 font-mono-code">
                              @{agent.username} | Pass: <span className="text-purple-400 font-bold">{agent.password}</span>
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase">
                          {agent.role}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                        <span>Trạng thái: <strong className="text-emerald-400">{agent.status || 'ACTIVE'}</strong></span>
                        <div className="flex gap-2">
                          <button onClick={() => openEditAgentModal(agent)} className="text-indigo-400 font-bold hover:underline">Sửa</button>
                          {agent.username !== 'admin' && (
                            <button onClick={() => handleDeleteAgent(agent.id, agent.fullName)} className="text-rose-400 font-bold hover:underline">Xóa</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD-02/03: MATERNAL PROFILES */}
            {activeAdminTab === 'profiles' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-100">AD-02 & AD-03: Quản Lý Hồ Sơ Thai Kỳ & Sau Sinh</h4>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300">Họ và Tên Mẹ:</label>
                      <input type="text" defaultValue="Nguyễn Thị Thu Hà" className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300">Giai Đoạn Hiện Tại:</label>
                      <select defaultValue="pregnant" className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100">
                        <option value="pregnant">Phụ Nữ Mang Thai (Pregnancy Phase)</option>
                        <option value="postpartum">Phụ Nữ Sau Sinh (Postpartum Phase)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-300">Tuần Thai / Ngày Sau Sinh:</label>
                      <input type="number" defaultValue={24} className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100" />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300">Bác Sĩ / Chuyên Viên Phụ Trách:</label>
                      <input type="text" defaultValue="BS. CKII Nguyễn Thị Mai - BV Phụ Sản Central" className="w-full mt-1 p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100" />
                    </div>
                  </div>
                  <button onClick={() => addToast && addToast('✅ Đã cập nhật hồ sơ y tế!', 'success')} className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-500 transition">
                    Lưu Thay Đổi Hồ Sơ
                  </button>
                </div>
              </div>
            )}

            {/* AD-04: REMINDER TEMPLATES */}
            {activeAdminTab === 'reminders' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">AD-04: Danh Mục Mẫu Lời Nhắc Y Khoa (Pregnancy & Postpartum)</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {MATERNAL_REMINDER_TEMPLATES.map((tpl) => (
                    <div key={tpl.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{tpl.title}</div>
                        <div className="text-[11px] text-slate-400">{tpl.message}</div>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        {tpl.approvalStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD-07: CONTENT APPROVAL WORKFLOW */}
            {activeAdminTab === 'approval' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">AD-07: Quy Trình Duyệt Nội Dung Chuyên Môn 5 Bước</h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {CONTENT_APPROVAL_WORKFLOW.map((wf, idx) => (
                    <div key={wf.status} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center space-y-1">
                      <span className="text-[10px] font-mono-code text-slate-400">Bước {idx + 1}</span>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${wf.color}`}>{wf.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD-06: URGENT WARNING SIGNS */}
            {activeAdminTab === 'warnings' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">AD-06: Danh Mục Cảnh Báo Khẩn Cấp CDC / WHO</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                  {URGENT_WARNING_SIGNS.map((sign) => (
                    <div key={sign.id} className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-rose-300">{sign.title}</div>
                        <div className="text-[11px] text-slate-300">{sign.action}</div>
                      </div>
                      <span className="rounded-full bg-rose-600 text-white font-extrabold px-2 py-0.5 text-[10px]">
                        {sign.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD-09: RBAC MATRIX */}
            {activeAdminTab === 'rbac' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">AD-09: Ma Trận Phân Quyền Truy Cập (RBAC)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(MATERNAL_ROLES).map((role) => (
                    <div key={role.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100">{role.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.color}`}>{role.badge}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{role.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AD-12: AUDIT LOGS */}
            {activeAdminTab === 'audit' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">AD-12: Nhật Ký Sự Kiện Hệ Thống (HIPAA-Aligned Audit Trail)</h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 max-h-72 custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase sticky top-0">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Sự kiện</th>
                        <th className="p-3">Nội dung chi tiết</th>
                        <th className="p-3 text-right">Tác nhân</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono-code text-[11px] text-slate-300">
                      {(telemetry?.logs || []).map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-purple-400">{log.event}</td>
                          <td className="p-3 text-slate-200">{log.details}</td>
                          <td className="p-3 text-right text-indigo-300">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 font-mono-code">Mã ẩnSuper Admin: 8888</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
          >
            Đóng Admin Suite
          </button>
        </div>
      </div>
    </div>
  );
}

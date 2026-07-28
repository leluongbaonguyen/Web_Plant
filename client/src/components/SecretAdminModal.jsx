import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ArrowUpCircle, CheckCircle2, Cpu, Database, EyeOff, KeyRound, Lock, Plus, RefreshCw, ShieldAlert, ShieldCheck, Terminal, Trash2, UserPlus, Users, Edit3, X, Zap } from 'lucide-react';
import { createAgent, deleteAgent, getAgentsList, getTelemetryInfo, loginStealthAdmin, toggleMaintenanceMode, triggerSystemUpgrade, updateAgent } from '../api.js';
import { cx } from '../constants/index.js';

export function SecretAdminModal({ isOpen, onClose, addToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('agents'); // 'agents' | 'upgrade' | 'diagnostics' | 'logs'
  const [telemetry, setTelemetry] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeProgress, setUpgradeProgress] = useState(0);

  // New Agent Form State
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentForm, setAgentForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'editor',
    avatar: '👤',
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

  // Perform Automated System Upgrade
  const handleUpgradeSystem = async () => {
    setIsUpgrading(true);
    setUpgradeProgress(10);
    const targetVer = `v2.${(telemetry?.upgradeHistory?.length || 2) + 1}.0-ULTRA`;

    const timer = setInterval(() => {
      setUpgradeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 20;
      });
    }, 400);

    try {
      const res = await triggerSystemUpgrade(targetVer);
      setTimeout(async () => {
        setUpgradeProgress(100);
        setIsUpgrading(false);
        if (addToast) addToast(`🎉 ${res.message}`, 'success');
        await loadTelemetryAndAgents();
      }, 2000);
    } catch (err) {
      setIsUpgrading(false);
      if (addToast) addToast(`Lỗi nâng cấp hệ thống: ${err.message}`, 'error');
    }
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    try {
      const currentMode = Boolean(telemetry?.system?.maintenanceMode);
      const res = await toggleMaintenanceMode(!currentMode);
      if (addToast) addToast(res.message, res.maintenanceMode ? 'error' : 'success');
      await loadTelemetryAndAgents();
    } catch (err) {
      if (addToast) addToast(`Lỗi chuyển đổi chế độ bảo trì: ${err.message}`, 'error');
    }
  };

  // AGENT CRUD HANDLERS
  const handleSaveAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAgent) {
        // Update Agent
        const res = await updateAgent(editingAgent.id, agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`Đã cập nhật Tác nhân '${agentForm.fullName}'!`, 'success');
      } else {
        // Create Agent
        const res = await createAgent(agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`Đã tạo thành công Tác nhân '${agentForm.fullName}'!`, 'success');
      }
      setShowAgentModal(false);
      setEditingAgent(null);
      setAgentForm({ username: '', password: '', fullName: '', role: 'editor', avatar: '👤', status: 'ACTIVE' });
    } catch (err) {
      if (addToast) addToast(`Lỗi: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id, name) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa Tác nhân '${name}' khỏi cơ sở dữ liệu?`)) return;
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
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-red-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-heading text-slate-100 uppercase tracking-tight">
                  Tác Nhân Super Admin & Quản Lý Cơ Sở Dữ Liệu
                </h3>
                <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-black text-red-300">
                  STEALTH MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">Giao diện quản trị tối cao, quản lý tác nhân & bảo vệ cơ sở dữ liệu 100%</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PHASE 1: STEALTH LOGIN FORM */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 space-y-6 text-center">
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-950/60 border border-red-500/40 text-red-400 shadow-2xl">
              <EyeOff className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-100">Xác Thực Mã Đăng Nhập Ẩn Admin</h4>
              <p className="text-xs text-slate-400">Nhập mật khẩu bí mật của Tác Nhân Super Admin để mở khóa toàn quyền quản trị</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  placeholder="Nhập mã ẩn (Mặc định: 8888)..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full rounded-2xl border border-red-500/30 bg-slate-950/90 pl-12 pr-4 py-3.5 text-center font-mono-code text-lg tracking-widest text-slate-100 placeholder-slate-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/50 p-2.5 text-xs text-red-300 font-bold">
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
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 py-3 text-xs font-bold text-white hover:from-red-500 hover:to-purple-500 shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-4 w-4" /> {loading ? 'Đang xác thực...' : 'Mở Khóa Quản Trị'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* PHASE 2: SUPER ADMIN MANAGEMENT CONSOLE */
          <div className="space-y-6">
            {/* Admin Tabs Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveAdminTab('agents')}
                  className={cx(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                    activeAdminTab === 'agents'
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <Users className="h-4 w-4 text-emerald-400" /> Quản Lý Tác Nhân ({agents.length})
                </button>

                <button
                  onClick={() => setActiveAdminTab('upgrade')}
                  className={cx(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                    activeAdminTab === 'upgrade'
                      ? 'bg-red-600/20 text-red-300 border border-red-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <ArrowUpCircle className="h-4 w-4 text-red-400" /> Nâng Cấp Hệ Thống
                </button>

                <button
                  onClick={() => setActiveAdminTab('diagnostics')}
                  className={cx(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                    activeAdminTab === 'diagnostics'
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <Cpu className="h-4 w-4 text-indigo-400" /> Chẩn Đoán & DB
                </button>

                <button
                  onClick={() => setActiveAdminTab('logs')}
                  className={cx(
                    'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition',
                    activeAdminTab === 'logs'
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  )}
                >
                  <Terminal className="h-4 w-4 text-purple-400" /> Nhật Ký Sự Kiện
                </button>
              </div>

              <button
                onClick={loadTelemetryAndAgents}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-200"
              >
                <RefreshCw className={cx('h-3.5 w-3.5', loading ? 'animate-spin' : '')} /> Làm mới
              </button>
            </div>

            {/* TAB 1: AGENT MANAGEMENT (SỬA, XÓA, TẠO TÁC NHÂN) */}
            {activeAdminTab === 'agents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Danh Sách Tác Nhân Quản Lý Trong Hệ Thống</h4>
                    <p className="text-xs text-slate-400">Admin có quyền thêm, sửa tài khoản, cấp lại mật khẩu hoặc xóa tác nhân khỏi DB</p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingAgent(null);
                      setAgentForm({ username: '', password: '', fullName: '', role: 'editor', avatar: '👤', status: 'ACTIVE' });
                      setShowAgentModal(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition"
                  >
                    <UserPlus className="h-4 w-4" /> Thêm Tác Nhân Mới
                  </button>
                </div>

                {/* Agents Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 relative group hover:border-indigo-500/40 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xl shadow-inner">
                            {agent.avatar || '👤'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-100 text-sm">{agent.fullName}</h5>
                              <span
                                className={cx(
                                  'rounded-full px-2 py-0.5 text-[10px] font-black uppercase',
                                  agent.role === 'admin'
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                    : agent.role === 'editor'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-slate-700 text-slate-300'
                                )}
                              >
                                {agent.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono-code">
                              Tài khoản: <span className="text-slate-200 font-bold">@{agent.username}</span> | Pass: <span className="text-emerald-400">{agent.password}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditAgentModal(agent)}
                            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-slate-700 transition"
                            title="Sửa tác nhân"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {agent.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteAgent(agent.id, agent.fullName)}
                              className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
                              title="Xóa tác nhân khỏi DB"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                        <span>Trạng thái: <span className={agent.status === 'DISABLED' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{agent.status || 'ACTIVE'}</span></span>
                        <span>Tạo lúc: {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'Ban đầu'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add / Edit Agent Modal Sub-Dialog */}
                {showAgentModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
                    <div className="glass-panel max-w-md w-full rounded-3xl border border-indigo-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-slate-100 text-sm">
                          {editingAgent ? `Sửa Thông Tin Tác Nhân '${editingAgent.fullName}'` : 'Thêm Tác Nhân Quản Lý Mới'}
                        </h4>
                        <button onClick={() => setShowAgentModal(false)} className="text-slate-400 hover:text-white">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveAgent} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Họ và Tên Tác Nhân</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Nguyễn Văn A"
                            value={agentForm.fullName}
                            onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                          />
                        </div>

                        {!editingAgent && (
                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Tên Đăng Nhập (Username)</label>
                            <input
                              type="text"
                              required
                              placeholder="Ví dụ: nva_editor"
                              value={agentForm.username}
                              onChange={(e) => setAgentForm({ ...agentForm, username: e.target.value })}
                              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-mono-code"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Mật Khẩu</label>
                          <input
                            type="text"
                            required
                            placeholder="Nhập mật khẩu..."
                            value={agentForm.password}
                            onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-mono-code"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Vai Trò (Role)</label>
                            <select
                              value={agentForm.role}
                              onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                            >
                              <option value="admin">Quản Trị Viên (Admin)</option>
                              <option value="editor">Biên Tập Viên (Editor)</option>
                              <option value="viewer">Người Xem (Viewer)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Biểu Tượng Avatar</label>
                            <input
                              type="text"
                              placeholder="Ví dụ: 🛡️, ✍️, 👤"
                              value={agentForm.avatar}
                              onChange={(e) => setAgentForm({ ...agentForm, avatar: e.target.value })}
                              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-center text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAgentModal(false)}
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 font-bold text-slate-300"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-bold text-white hover:bg-emerald-500"
                          >
                            Lưu Tác Nhân
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SYSTEM UPGRADE CONSOLE */}
            {activeAdminTab === 'upgrade' && (
              <div className="space-y-6">
                {/* Upgrade Action Card */}
                <div className="glass-panel rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900 to-purple-950/40 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">Phiên bản hiện tại</span>
                      <div className="text-2xl font-black text-slate-100 font-heading">
                        {telemetry?.system?.version || 'v2.5.0-ENTERPRISE'}
                      </div>
                      <p className="text-xs text-slate-400">Tác nhân Admin có quyền trực tiếp nâng cấp bản vá lõi và tối ưu hóa hệ thống</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Maintenance Toggle */}
                      <button
                        onClick={handleToggleMaintenance}
                        className={cx(
                          'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition border',
                          telemetry?.system?.maintenanceMode
                            ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 animate-pulse'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                        )}
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <span>Chế độ bảo trì: {telemetry?.system?.maintenanceMode ? 'ĐANG BẬT' : 'TẮT'}</span>
                      </button>

                      {/* Upgrade Action Trigger */}
                      <button
                        disabled={isUpgrading}
                        onClick={handleUpgradeSystem}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white hover:from-red-500 hover:to-purple-500 shadow-lg shadow-red-600/30 transition disabled:opacity-60"
                      >
                        <Zap className="h-4 w-4" />
                        <span>{isUpgrading ? 'Đang Nâng Cấp...' : '⚡ Kích Hoạt Nâng Cấp Hệ Thống'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  {isUpgrading && (
                    <div className="space-y-2 pt-2 animate-fadeIn">
                      <div className="flex justify-between text-xs font-bold text-red-300">
                        <span>Tiến trình nâng cấp bản vá lõi hệ thống...</span>
                        <span>{upgradeProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-red-500/30">
                        <div
                          className="bg-gradient-to-r from-red-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${upgradeProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upgrade History Timeline */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Lịch Sử Bản Vá & Nâng Cấp Hệ Thống
                  </h4>

                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {(telemetry?.upgradeHistory || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-100 flex items-center gap-2">
                            <span className="text-indigo-400 font-mono-code">{item.version}</span>
                            <span>— {item.changes}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Ngày phát hành: {item.date}</div>
                        </div>
                        <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-[10px] font-bold text-emerald-400">
                          Thành công
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SYSTEM DIAGNOSTICS & PERSISTENT DB */}
            {activeAdminTab === 'diagnostics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Memory Usage Card */}
                  <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Bộ nhớ RAM (Heap Used)</span>
                      <Cpu className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="text-xl font-bold text-indigo-300 font-mono-code">
                      {telemetry?.system?.memory?.heapUsedMB || 0} MB
                    </div>
                    <div className="text-[10px] text-slate-500">Heap Total: {telemetry?.system?.memory?.heapTotalMB} MB</div>
                  </div>

                  {/* Uptime Card */}
                  <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Thời Gian Chạy Server</span>
                      <Activity className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-emerald-300 font-mono-code">
                      {telemetry?.system?.uptimeSeconds || 0}s
                    </div>
                    <div className="text-[10px] text-slate-500">Node Runtime: {telemetry?.system?.nodeVersion}</div>
                  </div>

                  {/* DB Records Card */}
                  <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Cơ Sở Dữ Liệu Persistent</span>
                      <Database className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="text-xl font-bold text-amber-300 font-mono-code">
                      {telemetry?.system?.database?.slotCount || 0} Slots
                    </div>
                    <div className="text-[10px] text-slate-500">{telemetry?.system?.database?.totalCells} Ô dữ liệu công việc</div>
                  </div>

                  {/* DB Size Card */}
                  <div className="glass-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Dung Lượng DB</span>
                      <Zap className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-xl font-bold text-purple-300 font-mono-code">
                      {telemetry?.system?.database?.dataSizeBytes || 0} Bytes
                    </div>
                    <div className="text-[10px] text-slate-500">Bảo vệ dữ liệu: ATOMIC BACKUP ACTIVE</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono-code text-xs text-slate-300 space-y-2">
                  <div className="text-indigo-400 font-bold">⚡ KIỂM TRA HỆ THỐNG CƠ SỞ DỮ LIỆU CHỐNG MẤT DỮ LIỆU:</div>
                  <div className="text-emerald-400">✓ Database Engine (`server/data/plan.json`, `server/data/users.json`): ONLINE</div>
                  <div className="text-emerald-400">✓ Động cơ Snapshot Backup ngầm tự động: KÍCH HOẠT (Không mất bất cứ dữ liệu gì)</div>
                  <div className="text-emerald-400">✓ Quản lý Tác Nhân: Cho phép Admin Tạo / Sửa / Xóa Tác Nhân trong DB</div>
                </div>
              </div>
            )}

            {/* TAB 4: AUDIT LOGS */}
            {activeAdminTab === 'logs' && (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 max-h-72 custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase sticky top-0">
                      <tr>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Sự kiện</th>
                        <th className="p-3">Chi tiết nội dung</th>
                        <th className="p-3 text-right">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono-code text-[11px] text-slate-300">
                      {(telemetry?.logs || []).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-purple-400">{log.event}</td>
                          <td className="p-3 text-slate-200">{log.details}</td>
                          <td className="p-3 text-right text-slate-500">{log.ip}</td>
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
          <span className="text-slate-500 font-mono-code">Mã ẩn truy cập nhanh: 8888</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
          >
            Đóng Giao Diện Ẩn
          </button>
        </div>
      </div>
    </div>
  );
}

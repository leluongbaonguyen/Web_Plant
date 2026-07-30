import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ArrowUpCircle, CheckCircle2, Clock, Cpu, Database, Download, Edit3, Eye, FileText, KeyRound, Lock, LogOut, Plus, Printer, RefreshCw, Save, ShieldAlert, ShieldCheck, Sparkles, Terminal, Trash2, UserCheck, UserPlus, Users, X, Zap } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { createAgent, deleteAgent, forceKangarooSync, getAgentsList, getKangarooStatus, getTelemetryInfo, toggleMaintenanceMode, triggerSystemUpgrade, updateAgent } from '../api.js';
import { cx, getCurrentDayKey, timeToMinutes } from '../constants/index.js';
import { KidsEnglishDashboard } from './tabs/KidsEnglishDashboard.jsx';
import { AdminMasterControl } from './AdminMasterControl.jsx';

export function AgentWorkspaceDashboard({ plan, onUpdatePlan, onExportWord, onPrint, addToast }) {
  const { role, roleInfo, switchRole } = useRole();

  const [telemetry, setTelemetry] = useState(null);
  const [kangarooData, setKangarooData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  if (role === 'kids_english') {
    return <KidsEnglishDashboard plan={plan} addToast={addToast} />;
  }

  // Agent Form State
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

  // Editor Quick Note State
  const [quickNote, setQuickNote] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [telemetryData, agentsData, kngData] = await Promise.all([
        getTelemetryInfo(),
        getAgentsList(),
        getKangarooStatus().catch(() => null),
      ]);
      setTelemetry(telemetryData);
      if (agentsData?.agents) setAgents(agentsData.agents);
      if (kngData?.kangaroo) setKangarooData(kngData.kangaroo);
    } catch (err) {
      console.warn('[Workspace Load Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceKangarooSync = async () => {
    try {
      setLoading(true);
      const res = await forceKangarooSync();
      if (res.kangaroo) setKangarooData(res.kangaroo);
      if (addToast) addToast(res.message, 'success');
    } catch (err) {
      if (addToast) addToast(`Lỗi đồng bộ Kangaroo DB: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  // Statistics Calculation
  const stats = (() => {
    if (!plan || !plan.schedule) return { totalSlots: 0, completedCells: 0, totalCells: 0, completionRate: 0 };
    const totalSlots = plan.schedule.length;
    let completedCells = 0;
    let totalCells = 0;

    plan.schedule.forEach((slot) => {
      Object.values(slot.cells || {}).forEach((cell) => {
        if (cell && cell.text?.trim()) {
          totalCells++;
          if (cell.done) completedCells++;
        }
      });
    });

    const completionRate = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;
    return { totalSlots, completedCells, totalCells, completionRate };
  })();

  // AGENT CRUD
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
        if (addToast) addToast(`Đã tạo Tác nhân '${agentForm.fullName}' thành công!`, 'success');
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Agent Identity Banner */}
      <div className={cx(
        'glass-panel rounded-3xl border p-6 shadow-2xl relative overflow-hidden transition-all',
        role === 'admin'
          ? 'border-red-500/40 bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950'
          : role === 'editor'
          ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/40'
          : 'bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border-sky-500/40'
      )}>
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={cx(
              'flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl shadow-xl',
              role === 'admin' ? 'bg-red-900/40 border-red-500/50 text-red-300' : role === 'editor' ? 'bg-amber-900/40 border-amber-500/50 text-amber-300' : 'bg-sky-900/40 border-sky-500/50 text-sky-300'
            )}>
              {role === 'admin' ? '🛡️' : role === 'editor' ? '✍️' : '👀'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black font-heading text-slate-100 tracking-tight">
                  Không Gian Làm Việc Tác Nhân: <span className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-300">{roleInfo.name}</span>
                </h2>
                <span className={cx('rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border', roleInfo.color)}>
                  {roleInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{roleInfo.description}</p>
            </div>
          </div>

          {/* Active Security Identity Status */}
          <div className="flex items-center gap-2 bg-slate-950/70 px-3 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>Phân quyền bắt buộc: <strong className="text-slate-100 uppercase">{role}</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AGENT TYPE 1: ULTRA-DETAILED SUPER ADMIN WORKSPACE */}
      {/* ========================================================================= */}
      {role === 'admin' && (
        <div className="space-y-6">
          {/* Admin Full CRUD Master Control Center */}
          <AdminMasterControl plan={plan} onUpdatePlan={onUpdatePlan} addToast={addToast} />

          {/* Admin Metrics Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl border border-red-500/30 bg-slate-900/80 p-4 space-y-1">
              <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
                <span>Tác Nhân Quản Lý</span>
                <Users className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl font-black text-slate-100 font-mono-code">{agents.length} Accounts</div>
              <div className="text-[10px] text-slate-400">Đã đăng ký trong Cơ sơ dữ liệu</div>
            </div>

            <div className="glass-panel rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-4 space-y-1">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                <span>Bộ Nhớ RAM Server</span>
                <Cpu className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-indigo-300 font-mono-code">{telemetry?.system?.memory?.heapUsedMB || 0} MB</div>
              <div className="text-[10px] text-slate-400">Total: {telemetry?.system?.memory?.heapTotalMB || 0} MB</div>
            </div>

            <div className="glass-panel rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4 space-y-1">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Trạng Thái DB</span>
                <Database className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300 font-mono-code">ONLINE</div>
              <div className="text-[10px] text-slate-400">Atomic Write & Snapshots Active</div>
            </div>

            <div className="glass-panel rounded-2xl border border-purple-500/30 bg-slate-900/80 p-4 space-y-1">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                <span>Phiên Bản Hệ Thống</span>
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-purple-300 font-mono-code">{telemetry?.system?.version || 'v2.5.0'}</div>
              <div className="text-[10px] text-slate-400">Uptime: {telemetry?.system?.uptimeSeconds || 0}s</div>
            </div>
          </div>

          {/* KANGAROO DATABASE VAULT ENGINE CARD */}
          <div className="glass-panel rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-400 text-xl font-bold animate-pulse">
                  🦘
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">Kangaroo Database Vault Engine</h3>
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-black text-amber-300">
                      FAST HOP INDEXING
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Cơ sở dữ liệu Kangaroo độc quyền: Tự động hop-indexing và lưu trữ dữ liệu an toàn 100%</p>
                </div>
              </div>

              <button
                onClick={handleForceKangarooSync}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:from-amber-500 hover:to-indigo-500 shadow-lg shadow-amber-600/20 transition"
              >
                <Zap className="h-4 w-4" /> Ép Phục Hồi & Đồng Bộ Kangaroo DB
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-code">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                <span className="text-slate-400 font-sans font-bold">Kangaroo Hop Operations</span>
                <div className="text-lg font-bold text-amber-300">{kangarooData?.totalHops || 0} Hops</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                <span className="text-slate-400 font-sans font-bold">Vault Files Active</span>
                <div className="text-lg font-bold text-indigo-300">{kangarooData?.vaultFilesCount || 0} Vault JSONs</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                <span className="text-slate-400 font-sans font-bold">Lần đồng bộ cuối</span>
                <div className="text-xs text-emerald-400 truncate">{kangarooData?.lastSynced ? new Date(kangarooData.lastSynced).toLocaleTimeString() : 'Vừa xong'}</div>
              </div>
            </div>
          </div>

          {/* Admin Agent Management Console */}
          <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-400" /> Trung Tâm Quản Lý Tác Nhân (Agent Control Center)
                </h3>
                <p className="text-xs text-slate-400">Admin có toàn quyền Thêm, Chỉnh sửa thông tin, Đổi mật khẩu hoặc Xóa tác nhân khỏi DB</p>
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

            {/* Agents Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-3">Tác Nhân</th>
                    <th className="p-3">Tài Khoản</th>
                    <th className="p-3">Mật Khẩu</th>
                    <th className="p-3">Vai Trò</th>
                    <th className="p-3">Trạng Thái</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono-code">
                  {agents.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-sans font-bold text-slate-100 flex items-center gap-2">
                        <span>{ag.avatar || '👤'}</span>
                        <span>{ag.fullName}</span>
                      </td>
                      <td className="p-3 text-indigo-300">@{ag.username}</td>
                      <td className="p-3 text-emerald-400 font-bold">{ag.password}</td>
                      <td className="p-3">
                        <span className={cx(
                          'rounded-full px-2 py-0.5 text-[10px] font-black uppercase font-sans',
                          ag.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : ag.role === 'editor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'
                        )}>
                          {ag.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={ag.status === 'DISABLED' ? 'text-red-400 font-bold font-sans' : 'text-emerald-400 font-bold font-sans'}>
                          {ag.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingAgent(ag);
                              setAgentForm({
                                username: ag.username,
                                password: ag.password,
                                fullName: ag.fullName,
                                role: ag.role,
                                avatar: ag.avatar || '👤',
                                status: ag.status || 'ACTIVE',
                              });
                              setShowAgentModal(true);
                            }}
                            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-indigo-400 hover:bg-slate-700"
                            title="Sửa tác nhân"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {ag.username !== 'admin' && (
                            <button
                              onClick={() => handleDeleteAgent(ag.id, ag.fullName)}
                              className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                              title="Xóa tác nhân"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT TYPE 2: ULTRA-DETAILED EDITOR WORKSPACE */}
      {/* ========================================================================= */}
      {role === 'editor' && (
        <div className="space-y-6">
          {/* Editor Operational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Tiến Độ Công Việc Đã Hoàn Thành</span>
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-slate-100 font-mono-code">{stats.completionRate}%</div>
              <div className="text-xs text-slate-400">{stats.completedCells} trên tổng {stats.totalCells} ô việc được đánh dấu xong</div>
            </div>

            <div className="glass-panel rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                <span>Khung Giờ Đang Quản Lý</span>
                <Clock className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-slate-100 font-mono-code">{stats.totalSlots} Slots</div>
              <div className="text-xs text-slate-400">Editor có quyền cập nhật ô công việc & nội dung ghi chú</div>
            </div>

            <div className="glass-panel rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-5 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Quyền Hạn Editor</span>
                <Edit3 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-300">Biên Tập & Điều Hành</div>
              <div className="text-xs text-slate-400">Được sửa nội dung ô, không được xóa slot hoặc reset hệ thống</div>
            </div>
          </div>

          {/* Quick Schedule Operational Matrix */}
          <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Bảng Điều Hành Công Việc Nhanh Dành Cho Editor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(plan?.schedule || []).slice(0, 6).map((slot) => {
                const todayKey = getCurrentDayKey();
                const cell = slot.cells?.[todayKey];

                return (
                  <div key={slot.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-400 font-mono-code">{slot.start} - {slot.end}</span>
                      <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-slate-300">{slot.timeLabel}</span>
                    </div>

                    <div className="text-sm font-bold text-slate-100">
                      {cell?.text || <span className="italic text-slate-500">Chưa có công việc</span>}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span>Trạng thái: {cell?.done ? <span className="text-emerald-400 font-bold">✓ Hoàn thành</span> : <span className="text-amber-400 font-bold">⏳ Đang chờ</span>}</span>
                      <button
                        onClick={() => {
                          const nextSchedule = plan.schedule.map((s) => {
                            if (s.id !== slot.id) return s;
                            return {
                              ...s,
                              cells: {
                                ...s.cells,
                                [todayKey]: {
                                  ...s.cells[todayKey],
                                  done: !cell?.done,
                                },
                              },
                            };
                          });
                          onUpdatePlan({ ...plan, schedule: nextSchedule });
                          if (addToast) addToast(`Đã đổi trạng thái khung giờ ${slot.start}!`, 'success');
                        }}
                        className="rounded-lg bg-indigo-950 border border-indigo-500/40 px-2.5 py-1 text-[11px] font-bold text-indigo-300 hover:bg-indigo-900 transition"
                      >
                        Đổi Trạng Thái
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT TYPE 3: ULTRA-DETAILED VIEWER WORKSPACE */}
      {/* ========================================================================= */}
      {role === 'viewer' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl border border-sky-500/30 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-sky-400" /> Bảng Quan Sát & Xuất Báo Cáo Dành Cho Thành Viên (Viewer)
                </h3>
                <p className="text-xs text-slate-400">Chế độ quan sát trực quan, hỗ trợ tra cứu nhanh, lọc công việc và in ấn báo cáo</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onExportWord}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md transition"
                >
                  <Download className="h-4 w-4" /> Xuất File Word A3
                </button>
                <button
                  onClick={onPrint}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Printer className="h-4 w-4" /> In Báo Cáo
                </button>
              </div>
            </div>

            {/* Progress Summary View */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 text-center">
                <div className="text-xs font-bold text-slate-400">Tỷ Lệ Hoàn Thành Công Việc</div>
                <div className="text-3xl font-black text-sky-300 font-mono-code">{stats.completionRate}%</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 text-center">
                <div className="text-xs font-bold text-slate-400">Mục Tiêu Trọng Tâm Tuần</div>
                <div className="text-3xl font-black text-emerald-300 font-mono-code">{(plan?.weeklyGoals || []).length} Goals</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1 text-center">
                <div className="text-xs font-bold text-slate-400">Chế Độ Bảo Vệ Dữ Liệu</div>
                <div className="text-xl font-bold text-indigo-300">Chỉ Xem (Read Only)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Dialog Agent Create/Edit Form Modal */}
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
  );
}

import { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Plus, Trash2, Edit3, Save, RefreshCw, KeyRound, Lock,
  BookOpen, Clock, CheckCircle2, AlertTriangle, Zap,
  Search, Layers, Sparkles, Filter, ChevronRight, X, UserPlus, Database
} from 'lucide-react';
import { createAgent, deleteAgent, getAgentsList, updateAgent } from '../api.js';
import { COURSE_LEVELS, VOCABULARY_DATABASE, VOCAB_CATEGORIES } from '../constants/kidsVocabularyDatabase.js';

export function AdminMasterControl({ plan, onUpdatePlan, addToast }) {
  const [activeAdminTab, setActiveAdminTab] = useState('agents'); // 'agents' | 'vocab'
  const [loading, setLoading] = useState(false);

  // --- 1. AGENTS MANAGEMENT STATE ---
  const [agents, setAgents] = useState([]);
  const [agentSearch, setAgentSearch] = useState('');
  const [agentRoleFilter, setAgentRoleFilter] = useState('ALL');
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentForm, setAgentForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'kids_english',
    avatar: '🔤',
    status: 'ACTIVE',
  });

  const handleToggleAgentStatus = async (agent) => {
    const nextStatus = agent.status === 'DISABLED' ? 'ACTIVE' : 'DISABLED';
    try {
      setLoading(true);
      const res = await updateAgent(agent.id, { ...agent, status: nextStatus });
      setAgents(res.agents);
      if (addToast) addToast(`[ADMIN] Đã ${nextStatus === 'ACTIVE' ? 'KÍCH HOẠT' : 'KHÓA'} Tác nhân '${agent.fullName}'!`, 'info');
    } catch (err) {
      if (addToast) addToast(`[ADMIN ERROR] ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. VOCABULARY DATABASE CRUD STATE ---
  const [vocabList, setVocabList] = useState(VOCABULARY_DATABASE.slice(0, 30));
  const [vocabSearch, setVocabSearch] = useState('');
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null);
  const [vocabForm, setVocabForm] = useState({
    word: '',
    ipa: '',
    meaning: '',
    category: 'animals',
    level: 'basic',
    image: '🐶',
    sentence: '',
    sentenceVi: '',
    hint: '',
  });

  // Load agents data from server
  const loadAgents = async () => {
    try {
      setLoading(true);
      const res = await getAgentsList();
      if (res?.agents) setAgents(res.agents);
    } catch (err) {
      console.warn('[Admin Agent Fetch Error]', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // AGENT CRUD HANDLERS
  const handleSaveAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAgent) {
        const res = await updateAgent(editingAgent.id, agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`[ADMIN SUCCESS] Đã cập nhật Tác nhân '${agentForm.fullName}'!`, 'success');
      } else {
        const res = await createAgent(agentForm);
        setAgents(res.agents);
        if (addToast) addToast(`[ADMIN SUCCESS] Đã tạo Tác nhân '${agentForm.fullName}' thành công!`, 'success');
      }
      setShowAgentModal(false);
      setEditingAgent(null);
      setAgentForm({ username: '', password: '', fullName: '', role: 'kids_english', avatar: '🔤', status: 'ACTIVE' });
    } catch (err) {
      if (addToast) addToast(`[ADMIN ERROR] ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id, name) => {
    if (!confirm(`ADMIN QUYỀN HẠN KHẨN: Bạn có chắc muốn XÓA VĨNH VIỄN Tác nhân '${name}'?`)) return;
    try {
      setLoading(true);
      const res = await deleteAgent(id);
      setAgents(res.agents);
      if (addToast) addToast(`[ADMIN SUCCESS] Đã xóa Tác nhân '${name}' khỏi DB!`, 'success');
    } catch (err) {
      if (addToast) addToast(`[ADMIN ERROR] ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // VOCABULARY CRUD HANDLERS
  const handleSaveVocab = (e) => {
    e.preventDefault();
    if (!vocabForm.word || !vocabForm.meaning) {
      if (addToast) addToast('Vui lòng điền Từ tiếng Anh và Nghĩa tiếng Việt!', 'error');
      return;
    }

    if (editingVocab) {
      const next = vocabList.map((item) => (item.id === editingVocab.id ? { ...vocabForm, id: editingVocab.id } : item));
      setVocabList(next);
      if (addToast) addToast(`[ADMIN VOCAB] Đã cập nhật từ vựng '${vocabForm.word}'`, 'success');
    } else {
      const newItem = { ...vocabForm, id: `vocab-admin-${Date.now()}` };
      setVocabList([newItem, ...vocabList]);
      if (addToast) addToast(`[ADMIN VOCAB] Đã thêm từ vựng mới '${vocabForm.word}'`, 'success');
    }
    setShowVocabModal(false);
    setEditingVocab(null);
    setVocabForm({ word: '', ipa: '', meaning: '', category: 'animals', level: 'basic', image: '🐶', sentence: '', sentenceVi: '', hint: '' });
  };

  const handleDeleteVocab = (id, word) => {
    if (!confirm(`ADMIN QUYỀN HẠN: Bạn có chắc muốn xóa từ vựng '${word}'?`)) return;
    const next = vocabList.filter((item) => item.id !== id);
    setVocabList(next);
    if (addToast) addToast(`[ADMIN VOCAB] Đã xóa từ '${word}' khỏi kho dữ liệu`, 'info');
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Super Admin Control Center Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/40 bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-950 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-red-500/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-1.5 text-xs font-black text-red-300">
              <ShieldCheck className="h-4 w-4 text-red-400" />
              <span>SUPER ADMIN MASTER CONTROL CENTER 🛡️</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Trung Tâm Quản Trị <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-pink-400">Toàn Quyền Thêm - Sửa - Xóa</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Toàn quyền quản trị độc quyền Admin: Thêm/Sửa/Xóa tài khoản tác nhân, quản lý kho 2,000 từ vựng Tiếng Anh và điều chỉnh hệ thống.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/60 px-4 py-2 text-xs font-black text-red-300">
                <Users className="h-4 w-4 text-red-400" />
                <span>{(agents || []).length} Tác Nhân Đang Quản Lý</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-950/60 px-4 py-2 text-xs font-black text-cyan-300">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>2,000 Từ Vựng CRUD Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 rounded-3xl border border-red-500/40 bg-slate-900/90 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="text-7xl animate-pulse">🛡️</div>
              <div className="text-xs font-black text-red-300 font-heading">MASTER SUPER ADMIN</div>
              <div className="rounded-full bg-red-600 px-3 py-0.5 text-[10px] font-bold text-white">
                Toàn Quyền CRUD Tối Thượng
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Feature Navigation Tabs */}
      <div className="flex flex-wrap rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
        <button
          onClick={() => setActiveAdminTab('agents')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeAdminTab === 'agents' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>1. Quản Lý Tác Nhân ({(agents || []).length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('vocab')}
          className={`flex-1 min-w-[140px] py-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeAdminTab === 'vocab' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>2. Kho Từ Vựng 2000 Từ</span>
        </button>
      </div>

      {/* SECTION 1: AGENTS ACCOUNTS FULL CRUD MANAGEMENT */}
      {activeAdminTab === 'agents' && (
        <div className="space-y-5">
          {/* Header & Main Control Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-red-400" />
                DANH SÁCH & PHÂN QUYỀN TÁC NHÂN HỆ THỐNG ({(agents || []).length})
              </h3>
              <p className="text-xs text-slate-400">Quản lý thêm, sửa, xóa, khóa tài khoản và phân quyền cho từng tác nhân riêng biệt</p>
            </div>

            <button
              onClick={() => {
                setEditingAgent(null);
                setAgentForm({ username: '', password: '', fullName: '', role: 'kids_english', avatar: '🔤', status: 'ACTIVE' });
                setShowAgentModal(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 px-5 py-2.5 text-xs font-extrabold text-white hover:from-red-500 hover:to-amber-500 shadow-xl transition active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              <span>Thêm Tác Nhân Mới</span>
            </button>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex items-center gap-3 flex-wrap bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm tác nhân theo tên hoặc username..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Vai trò:</span>
              <select
                value={agentRoleFilter}
                onChange={(e) => setAgentRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white font-bold"
              >
                <option value="ALL">Tất cả vai trò ({(agents || []).length})</option>
                <option value="admin">Quản Trị Viên (Admin)</option>
                <option value="kids_english">Bé Học Tiếng Anh</option>
                <option value="editor">Biên Tập Viên</option>
                <option value="viewer">Thành Viên Xem</option>
              </select>
            </div>
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents
              .filter((ag) => {
                const matchSearch = ag.fullName?.toLowerCase().includes(agentSearch.toLowerCase()) || ag.username?.toLowerCase().includes(agentSearch.toLowerCase());
                const matchRole = agentRoleFilter === 'ALL' || ag.role === agentRoleFilter;
                return matchSearch && matchRole;
              })
              .map((ag) => (
                <div
                  key={ag.id}
                  className={`rounded-3xl border ${ag.status === 'DISABLED' ? 'border-rose-900/50 bg-rose-950/20' : 'border-slate-800 bg-slate-900/90'} p-5 space-y-4 shadow-xl relative backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition`}
                >
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">{ag.avatar || '👤'}</div>
                        <div>
                          <div className="font-extrabold text-white text-sm flex items-center gap-1.5">
                            {ag.fullName}
                            {ag.role === 'admin' && <ShieldCheck className="h-4 w-4 text-red-400" />}
                          </div>
                          <div className="text-xs font-mono-code text-cyan-300">@{ag.username}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAgentStatus(ag)}
                        className={`rounded-full px-3 py-1 text-[10px] font-black border uppercase transition flex items-center gap-1.5 ${
                          ag.status === 'DISABLED'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                        title="Bấm để bật / tắt trạng thái tài khoản"
                      >
                        <span className={`h-2 w-2 rounded-full ${ag.status === 'DISABLED' ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                        {ag.status || 'ACTIVE'}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Vai Trò Hệ Thống:</span>
                        <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-black border uppercase ${
                          ag.role === 'admin' ? 'bg-red-500/20 text-red-300 border-red-500/40' : ag.role === 'kids_english' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {ag.role}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-400">
                        <span>Ngày Tạo Tài Khoản:</span>
                        <span className="text-slate-200 font-mono-code">{new Date(ag.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300 leading-tight">
                        {ag.role === 'admin' && '🛡️ Toàn quyền CRUD: Thêm/Sửa/Xóa tài khoản, từ vựng và can thiệp toàn bộ hệ thống.'}
                        {ag.role === 'kids_english' && '🔤 Tác nhân Bé Học Tiếng Anh: Truy cập 4,000 từ vựng Flashcard, Đấu trí có thời gian.'}
                        {ag.role === 'editor' && '✍️ Biên Tập Viên: Được phép cập nhật nội dung lịch, từ vựng và ghi chú.'}
                        {ag.role === 'viewer' && '👀 Thành Viên Xem: Được phép xem lịch và theo dõi tiến độ.'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleAgentStatus(ag)}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-200 underline"
                    >
                      {ag.status === 'DISABLED' ? 'Kích hoạt lại' : 'Khóa tài khoản'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAgent(ag);
                          setAgentForm({
                            username: ag.username,
                            password: ag.password || '',
                            fullName: ag.fullName,
                            role: ag.role,
                            avatar: ag.avatar || '👤',
                            status: ag.status || 'ACTIVE',
                          });
                          setShowAgentModal(true);
                        }}
                        className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition active:scale-95"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-amber-400" /> Sửa
                      </button>

                      <button
                        onClick={() => handleDeleteAgent(ag.id, ag.fullName)}
                        className="flex items-center gap-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 transition active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 2: 2000 VOCABULARY DATABASE CRUD MANAGEMENT */}
      {activeAdminTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-black text-white font-heading">QUẢN LÝ KHO DỮ LIỆU 2,000 TỪ VỰNG TIẾNG ANH</h3>
              <p className="text-xs text-slate-400">Admin có thể thêm mới từ vựng, sửa phiên âm IPA, nghĩa tiếng Việt, câu ví dụ hoặc xóa từ vựng</p>
            </div>

            <button
              onClick={() => {
                setEditingVocab(null);
                setVocabForm({ word: '', ipa: '', meaning: '', category: 'animals', level: 'basic', image: '🐶', sentence: '', sentenceVi: '', hint: '' });
                setShowVocabModal(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-extrabold text-white hover:from-cyan-500 hover:to-blue-500 shadow-xl transition"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Từ Vựng Mới</span>
            </button>
          </div>

          {/* Vocab Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {vocabList.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2 mb-2">
                    <span className="text-2xl">{item.image}</span>
                    <span className="text-cyan-300 font-mono-code text-[10px] uppercase">{item.level}</span>
                  </div>

                  <div className="font-black text-white text-base">{item.word} <span className="text-xs font-mono-code text-slate-400 font-normal">{item.ipa}</span></div>
                  <div className="text-xs font-bold text-yellow-300">{item.meaning}</div>
                  <div className="text-[11px] text-slate-400 italic line-clamp-2">"{item.sentence}"</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingVocab(item);
                      setVocabForm({ ...item });
                      setShowVocabModal(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    <Edit3 className="h-3 w-3" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteVocab(item.id, item.word)}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3 w-3" /> Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AGENT EDIT / CREATE MODAL */}
      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">{editingAgent ? 'SỬA TÁC NHÂN' : 'THÊM TÁC NHÂN MỚI'}</h3>
              <button onClick={() => setShowAgentModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSaveAgent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Họ Đầy Đủ *</label>
                <input
                  type="text"
                  required
                  value={agentForm.fullName}
                  onChange={(e) => setAgentForm({ ...agentForm, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={agentForm.username}
                  onChange={(e) => setAgentForm({ ...agentForm, username: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono-code"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Mật Khẩu *</label>
                <input
                  type="password"
                  required={!editingAgent}
                  value={agentForm.password}
                  placeholder={editingAgent ? '(Để trống nếu không đổi mật khẩu)' : 'Nhập mật khẩu...'}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono-code"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Vai Trò / Role *</label>
                  <select
                    value={agentForm.role}
                    onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                  >
                    <option value="kids_english">🔤 Bé Học Tiếng Anh</option>
                    <option value="editor">✍️ Biên Tập Viên</option>
                    <option value="viewer">👀 Thành Viên</option>
                    <option value="admin">🛡️ Quản Trị Viên (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trạng Thái *</label>
                  <select
                    value={agentForm.status}
                    onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                  >
                    <option value="ACTIVE">🟢 ACTIVE (Kích hoạt)</option>
                    <option value="DISABLED">🔴 DISABLED (Tạm khóa)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Biểu Tượng Avatar (Emoji)</label>
                <div className="flex items-center gap-2">
                  {['👤', '🛡️', '🔤', '✍️', '👑', '🚀', '⭐'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAgentForm({ ...agentForm, avatar: emoji })}
                      className={`p-2 rounded-xl text-lg border transition ${
                        agentForm.avatar === emoji ? 'bg-red-600/30 border-red-500 text-white scale-110' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowAgentModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700">Hủy</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black hover:from-red-500 hover:to-amber-500 shadow-lg">
                  {editingAgent ? 'Cập Nhật Tác Nhân' : 'Tạo Tác Nhân Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VOCABULARY EDIT / CREATE MODAL */}
      {showVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">{editingVocab ? 'SỬA TỪ VỰNG' : 'THÊM TỪ VỰNG MỚI'}</h3>
              <button onClick={() => setShowVocabModal(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Từ Tiếng Anh *</label>
                  <input
                    type="text"
                    required
                    value={vocabForm.word}
                    onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phiên Âm IPA</label>
                  <input
                    type="text"
                    value={vocabForm.ipa}
                    onChange={(e) => setVocabForm({ ...vocabForm, ipa: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-cyan-300 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nghĩa Tiếng Việt *</label>
                <input
                  type="text"
                  required
                  value={vocabForm.meaning}
                  onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cấp Độ Course</label>
                  <select
                    value={vocabForm.level}
                    onChange={(e) => setVocabForm({ ...vocabForm, level: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-bold"
                  >
                    <option value="basic">Basic (Cơ Bản)</option>
                    <option value="elementary">Elementary (Sơ Cấp)</option>
                    <option value="intermediate">Intermediate (Trung Cấp)</option>
                    <option value="advanced">Advanced (Nâng Cao)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Biểu Tượng Emoji</label>
                  <input
                    type="text"
                    value={vocabForm.image}
                    onChange={(e) => setVocabForm({ ...vocabForm, image: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Câu Ví Dụ Tiếng Anh</label>
                <input
                  type="text"
                  value={vocabForm.sentence}
                  onChange={(e) => setVocabForm({ ...vocabForm, sentence: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowVocabModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-black hover:bg-cyan-500 shadow-lg">Lưu Từ Vựng</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

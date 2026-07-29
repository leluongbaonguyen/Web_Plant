import { useState } from 'react';
import { ShieldCheck, Lock, User, Key, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, CheckCircle2, Heart, Baby, Stethoscope, UserPlus } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { createAgent, loginStealthAdmin } from '../api.js';

const PRESET_ACCOUNTS = [
  {
    role: 'pregnant',
    title: 'Phụ Nữ Mang Thai 🤰',
    username: 'mangthai',
    password: '123',
    avatar: '🤰',
    color: 'border-pink-500/40 bg-pink-950/40 text-pink-300 hover:bg-pink-900/60',
    badge: 'Hồ Sơ Thai Kỳ & Thai Máy',
    description: 'Chị Thu Hà (Tuần 24 - Thai kỳ)',
  },
  {
    role: 'postpartum',
    title: 'Phụ Nữ Sau Sinh 🤱',
    username: 'sausinh',
    password: '123',
    avatar: '🤱',
    color: 'border-amber-500/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60',
    badge: 'Hậu Sản & Nhật Ký Cữ Bú',
    description: 'Chị Thanh Mai (Ngày 21 sau sinh)',
  },
  {
    role: 'clinician',
    title: 'Người Duyệt Chuyên Môn 🩺',
    username: 'bacti',
    password: '123',
    avatar: '🩺',
    color: 'border-purple-500/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60',
    badge: 'Duyệt Lâm Sàng 5 Bước',
    description: 'BS. CKII Nguyễn Thị Mai',
  },
  {
    role: 'admin',
    title: 'Quản Trị Viên (Admin) 🛡️',
    username: 'admin',
    password: '888',
    avatar: '🛡️',
    color: 'border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/60',
    badge: 'Toàn Quyền Quản Trị',
    description: 'Master Super Admin',
  },
];

export function LoginPortal({ addToast }) {
  const { login, loginWithSession } = useRole();

  const [activePortalTab, setActivePortalTab] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'pregnant', // 'pregnant' | 'postpartum'
    weeksOrDays: 24,
    assignedDoctor: 'BS. CKII Nguyễn Thị Mai',
  });

  // Stealth Passcode mode
  const [showStealthMode, setShowStealthMode] = useState(false);
  const [stealthPasscode, setStealthPasscode] = useState('');

  const handleStandardLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username.trim(), password.trim());
      if (res.ok) {
        if (addToast) addToast(`🎉 Đăng nhập thành công! Chào mừng ${res.user.fullName}`, 'success');
      } else {
        setErrorMsg(res.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regForm.fullName || !regForm.username || !regForm.password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    try {
      setLoading(true);
      const avatar = regForm.role === 'pregnant' ? '🤰' : '🤱';
      await createAgent({
        fullName: regForm.fullName,
        username: regForm.username,
        password: regForm.password,
        role: regForm.role,
        avatar,
        status: 'ACTIVE',
      });

      if (addToast) addToast(`🎉 Đăng ký thành công tài khoản '${regForm.fullName}'! Vui lòng đăng nhập.`, 'success');
      setUsername(regForm.username);
      setPassword(regForm.password);
      setActivePortalTab('login');
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi đăng ký tài khoản mới');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await login(acc.username, acc.password);
      if (res.ok && addToast) {
        addToast(`🎉 Đã đăng nhập tác nhân: ${acc.title}!`, 'success');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập mẫu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleStealthLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await loginStealthAdmin(stealthPasscode);
      if (res.ok && res.token) {
        const stealthUser = {
          id: 'usr-stealth-admin',
          username: 'superadmin',
          fullName: 'Super Admin Stealth Agent ⚡',
          role: 'admin',
          avatar: '⚡',
        };
        loginWithSession(stealthUser, res.token);
        if (addToast) addToast('🔑 Đã xác thực Cổng Đăng Nhập Ẩn thành công!', 'success');
      } else {
        setErrorMsg(res.message || 'Mã xác thực ẩn không đúng!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi xác thực Cổng Ẩn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070a12]/95 p-4 backdrop-blur-xl animate-fadeIn overflow-y-auto custom-scrollbar">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-pink-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl rounded-3xl border border-pink-500/30 bg-slate-900/95 p-6 md:p-8 shadow-2xl space-y-6 backdrop-blur-2xl my-auto">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 mb-1">
            <Heart className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
            CỔNG ĐĂNG NHẬP DÀNH RIÊNG TÁC NHÂN
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Hệ thống ChronoFlow Maternal v2.0 hỗ trợ tài khoản đăng nhập riêng cho <strong className="text-pink-300">Phụ Nữ Mang Thai (🤰)</strong> và <strong className="text-amber-300">Phụ Nữ Sau Sinh (🤱)</strong>.
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
          <button
            onClick={() => setActivePortalTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activePortalTab === 'login' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔑 Đăng Nhập Tài Khoản Tác Nhân
          </button>
          <button
            onClick={() => setActivePortalTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activePortalTab === 'register' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✍️ Đăng Ký Dành Cho Mẹ Bầu / Mẹ Sau Sinh
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-2xl border border-rose-500/50 bg-rose-950/60 p-3.5 flex items-center gap-3 text-xs font-semibold text-rose-200 animate-shake">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN PORTAL */}
        {activePortalTab === 'login' && (
          <div className="space-y-5">
            {/* Quick Dedicated Preset Accounts Grid */}
            {!showStealthMode && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" /> Chọn nhanh cổng tác nhân mẫu:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handlePresetSelect(acc)}
                      disabled={loading}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left group ${acc.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{acc.avatar}</span>
                        <div>
                          <div className="font-extrabold text-xs text-white">{acc.title}</div>
                          <div className="text-[10px] text-slate-300 opacity-90">{acc.description}</div>
                          <div className="text-[10px] font-mono-code text-pink-300/80">
                            {acc.username} / {acc.password}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Login Form */}
            {!showStealthMode ? (
              <form onSubmit={handleStandardLogin} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-pink-400" /> Tên Đăng Nhập (Username)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên tài khoản (ví dụ: mangthai, sausinh, admin)..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-pink-500 focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5 text-pink-400" /> Mật Khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Nhập mật khẩu (Mặc định: 123)..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:border-pink-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 py-3.5 text-sm font-bold text-white hover:from-pink-500 hover:to-purple-500 shadow-xl shadow-pink-600/30 transition flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Đang xác thực tác nhân...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span>ĐĂNG NHẬP VÀO HỆ THỐNG</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Stealth Admin Form */
              <form onSubmit={handleStealthLogin} className="space-y-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-rose-400" /> Mã Xác Thực Super Admin Ẩn (Passcode)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mã passcode (Mặc định: 8888)..."
                    value={stealthPasscode}
                    onChange={(e) => setStealthPasscode(e.target.value)}
                    className="w-full rounded-2xl border border-rose-500/40 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-rose-600 py-3.5 text-sm font-bold text-white hover:bg-rose-500 shadow-xl shadow-rose-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Đang xác thực...' : 'XÁC THỰC CỔNG SUPER ADMIN ẨN'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER DEDICATED MATERNAL ACCOUNT */}
        {activePortalTab === 'register' && (
          <form onSubmit={handleRegisterAccount} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Họ và Tên Mẹ Bầu / Mẹ Sau Sinh *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Thị Mai..."
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tên Đăng Nhập (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: mebau_mai2026..."
                  value={regForm.username}
                  onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-mono-code"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mật Khẩu Đăng Nhập *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-100 font-mono-code"
                />
              </div>

              <div>
                <label className="block text-pink-300 font-bold mb-1">Giai Đoạn Sức Khỏe *</label>
                <select
                  value={regForm.role}
                  onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                  className="w-full rounded-xl border border-pink-500/40 bg-slate-950 p-2.5 text-slate-100 font-bold"
                >
                  <option value="pregnant">🤰 Phụ Nữ Mang Thai (Pregnancy Phase)</option>
                  <option value="postpartum">🤱 Phụ Nữ Sau Sinh (Postpartum Phase)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 text-sm font-extrabold text-white hover:from-purple-500 hover:to-pink-500 shadow-xl transition flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Đang Khởi Tạo Account...' : 'ĐĂNG KÝ TÀI KHOẢN TÁC NHÂN MỚI'}</span>
            </button>
          </form>
        )}

        {/* Footer Toggle for Stealth Login */}
        <div className="pt-2 text-center border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setShowStealthMode(!showStealthMode);
              setErrorMsg('');
            }}
            className="text-xs text-slate-400 hover:text-pink-400 transition underline underline-offset-4"
          >
            {showStealthMode ? '← Quay lại Cổng Đăng Nhập Tác Nhân Thường' : '🔑 Cổng Đăng Nhập Ẩn Super Admin (Passcode: 8888)'}
          </button>
        </div>
      </div>
    </div>
  );
}

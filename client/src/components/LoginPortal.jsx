import { useState } from 'react';
import { ShieldCheck, Lock, User, Key, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRole } from '../context/RoleContext.jsx';
import { loginStealthAdmin } from '../api.js';

const PRESET_ACCOUNTS = [
  {
    role: 'admin',
    title: 'Quản Trị Viên (Admin)',
    username: 'admin',
    password: '888',
    avatar: '🛡️',
    color: 'border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-900/50',
    badge: 'Toàn Quyền Quản Trị',
  },
  {
    role: 'editor',
    title: 'Biên Tập Viên (Editor)',
    username: 'editor',
    password: '123',
    avatar: '✍️',
    color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/50',
    badge: 'Chỉnh Sửa Nội Dung',
  },
  {
    role: 'viewer',
    title: 'Quan Sát Viên (Viewer)',
    username: 'viewer',
    password: '123',
    avatar: '👀',
    color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50',
    badge: 'Xem Kế Hoạch & Tiến Độ',
  },
];

export function LoginPortal({ addToast }) {
  const { login, loginWithSession } = useRole();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handlePresetSelect = async (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await login(acc.username, acc.password);
      if (res.ok && addToast) {
        addToast(`🎉 Đã đăng nhập vai trò ${acc.title}!`, 'success');
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
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-xl rounded-3xl border border-indigo-500/30 bg-slate-900/90 p-6 md:p-8 shadow-2xl space-y-6 backdrop-blur-2xl my-auto">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-600/20 mb-1">
            <Lock className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-white tracking-tight">
            XÁC THỰC BẮT BUỘC TÁC NHÂN
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Hệ thống yêu cầu tất cả tác nhân phải đăng nhập tài khoản trước khi truy cập và sử dụng dịch vụ.
          </p>
        </div>

        {/* Security Alert Tag */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-start gap-3 text-xs text-amber-200/90">
          <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Bảo mật RBAC 3 Cấp: </span>
            Vui lòng đăng nhập tài khoản của bạn (Admin, Editor hoặc Viewer) hoặc chọn tài khoản tác nhân sẵn có bên dưới.
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-2xl border border-red-500/50 bg-red-950/60 p-3.5 flex items-center gap-3 text-xs font-semibold text-red-200 animate-shake">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Preset Accounts Selector */}
        {!showStealthMode && (
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Chọn nhanh tài khoản mẫu tác nhân:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handlePresetSelect(acc)}
                  disabled={loading}
                  className={`flex flex-col p-3 rounded-2xl border transition-all text-left group ${acc.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{acc.avatar}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="font-bold text-xs mt-1 text-slate-100">{acc.title}</span>
                  <span className="text-[10px] text-slate-400 opacity-90">{acc.username} ({acc.password})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Login Form */}
        {!showStealthMode ? (
          <form onSubmit={handleStandardLogin} className="space-y-4 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-400" /> Tên Đăng Nhập (Username)
              </label>
              <input
                type="text"
                required
                placeholder="Nhập username (ví dụ: admin, editor, viewer)..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-indigo-400" /> Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
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
              className="w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Đang xác thực tài khoản...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>ĐĂNG NHẬP HỆ THỐNG</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Stealth Admin Login Form */
          <form onSubmit={handleStealthLogin} className="space-y-4 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-red-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-red-400" /> Mã Xác Thực Super Admin Ẩn (Passcode)
              </label>
              <input
                type="password"
                required
                placeholder="Nhập mã passcode (mặc định: 888 hoặc superadmin)..."
                value={stealthPasscode}
                onChange={(e) => setStealthPasscode(e.target.value)}
                className="w-full rounded-2xl border border-red-500/40 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-500 shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Đang xác thực...' : 'XÁC THỰC CỔNG ADMIN ẨN'}
            </button>
          </form>
        )}

        {/* Footer Toggle for Stealth Login */}
        <div className="pt-2 text-center border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setShowStealthMode(!showStealthMode);
              setErrorMsg('');
            }}
            className="text-xs text-slate-400 hover:text-indigo-400 transition underline underline-offset-4"
          >
            {showStealthMode ? '← Quay lại Đăng Nhập Tác Nhân Thường' : '🔑 Chuyển sang Cổng Đăng Nhập Ẩn Super Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

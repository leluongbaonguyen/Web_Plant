import { useEffect, useMemo, useRef, useState } from 'react';
import { getPlan, getWordFile, resetPlan as resetPlanApi, savePlan } from './api.js';
import { RoleProvider, useRole } from './context/RoleContext.jsx';
import { Header } from './components/Header.jsx';
import { LiveReminderBanner } from './components/LiveReminderBanner.jsx';
import { MobileAutomationDock } from './components/MobileAutomationDock.jsx';
import { AnimatedMascots } from './components/AnimatedMascots.jsx';
import { ButlerAiAssistant } from './components/ButlerAiAssistant.jsx';
import { MobileBottomNav } from './components/MobileBottomNav.jsx';
import { ToastContainer } from './components/ToastContainer.jsx';
import { NoteModal } from './components/NoteModal.jsx';
import { NotificationModal } from './components/NotificationModal.jsx';
import { RoleSelectorModal } from './components/RoleSelectorModal.jsx';
import { SecretAdminModal } from './components/SecretAdminModal.jsx';
import { AgentWorkspaceDashboard } from './components/AgentWorkspaceDashboard.jsx';
import { DashboardTab } from './components/tabs/DashboardTab.jsx';
import { ScheduleTab } from './components/tabs/ScheduleTab.jsx';
import { GoalsTab } from './components/tabs/GoalsTab.jsx';
import { SummaryTab } from './components/tabs/SummaryTab.jsx';
import { DocsTab } from './components/tabs/DocsTab.jsx';
import { LoginPortal } from './components/LoginPortal.jsx';
import { downloadBlob, getCurrentDayKey, timeToMinutes, uid } from './constants/index.js';
import { playChimeSound, playSpecialAlarmSound, stopSpecialAlarmSound } from './utils/audio.js';

function MainAppContent() {
  const { role, permissions, isAuthenticated } = useRole();

  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('Đang tải...');
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());

  // Filters
  const [search, setSearch] = useState('');
  const [dayFilter, setDayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Time & Sound Alerts (Persisted in localStorage)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('sound_enabled') !== 'false';
  });
  const [soundMode, setSoundMode] = useState(() => {
    return localStorage.getItem('sound_mode') || 'special_60s';
  });
  const [desktopNotifyEnabled, setDesktopNotifyEnabled] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const saved = localStorage.getItem('desktop_notify_enabled');
      if (saved !== null) {
        return saved === 'true' && Notification.permission === 'granted';
      }
      return Notification.permission === 'granted';
    }
    return false;
  });
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showSecretAdminModal, setShowSecretAdminModal] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [alarmSecondsLeft, setAlarmSecondsLeft] = useState(60);

  // Note Modal
  const [noteModal, setNoteModal] = useState({ isOpen: false, initialValue: '', onSave: null });

  const saveTimeoutRef = useRef(null);
  const isSavingRef = useRef(isSaving);
  isSavingRef.current = isSaving;

  const planRef = useRef(plan);
  planRef.current = plan;

  const addToast = (message, type = 'info') => {
    const id = uid('toast');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        addToast(`Không thể mở Fullscreen: ${err.message}`, 'error');
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcut listener (Ctrl + Shift + A) to trigger Stealth Admin Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowSecretAdminModal(true);
        addToast('🔑 Đã mở Cổng Đăng Nhập Ẩn Super Admin!', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sound Alarm Dispatcher
  const triggerSoundNotification = (forceTest = false) => {
    if (!soundEnabled && !forceTest) return;

    if (soundMode === 'special_60s' || forceTest) {
      setIsAlarmPlaying(true);
      setAlarmSecondsLeft(60);
      playSpecialAlarmSound(
        60,
        (sec) => setAlarmSecondsLeft(sec),
        () => {
          setIsAlarmPlaying(false);
          setAlarmSecondsLeft(0);
        }
      );
    } else {
      playChimeSound();
    }
  };

  const handleStopAlarm = () => {
    stopSpecialAlarmSound();
    setIsAlarmPlaying(false);
    setAlarmSecondsLeft(0);
  };

  // Initial plan load
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getPlan()
      .then((data) => {
        setPlan(data);
        setSaveStatus('Đã đồng bộ PC ↔ Mobile');
        setLastSyncedTime(new Date());
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải kế hoạch');
        addToast('Lỗi kết nối máy chủ', 'error');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Real-Time Cross-Device Polling Synchronizer (3 seconds interval)
  useEffect(() => {
    if (!isAuthenticated) return;
    const syncInterval = setInterval(async () => {
      if (isSavingRef.current) return;

      try {
        const remoteData = await getPlan();
        const localStr = JSON.stringify(planRef.current);
        const remoteStr = JSON.stringify(remoteData);

        if (localStr && remoteStr && localStr !== remoteStr) {
          setPlan(remoteData);
          setSaveStatus('Đã đồng bộ PC ↔ Mobile');
          setLastSyncedTime(new Date());
        }
      } catch (err) {
        // Silent catch
      }
    }, 3000);

    return () => clearInterval(syncInterval);
  }, []);

  // Update clock every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto save plan with debouncing
  const handleUpdatePlan = (newPlan) => {
    setPlan(newPlan);
    setSaveStatus('Đang lưu...');
    setIsSaving(true);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      savePlan(newPlan)
        .then((updated) => {
          setPlan(updated);
          setSaveStatus('Đã tự động lưu & đồng bộ');
          setIsSaving(false);
          setLastSyncedTime(new Date());
        })
        .catch((err) => {
          setSaveStatus('Lưu thất bại');
          setIsSaving(false);
          addToast(err.message || 'Không có quyền lưu thay đổi!', 'error');
        });
    }, 800);
  };

  // Sync sound settings to localStorage
  useEffect(() => {
    localStorage.setItem('sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('sound_mode', soundMode);
  }, [soundMode]);

  // Toggle desktop notifications (Persisted & Synced)
  const toggleDesktopNotifications = async () => {
    if (!('Notification' in window)) {
      addToast('Trình duyệt không hỗ trợ thông báo desktop', 'error');
      return;
    }
    if (Notification.permission === 'granted') {
      const nextState = !desktopNotifyEnabled;
      setDesktopNotifyEnabled(nextState);
      localStorage.setItem('desktop_notify_enabled', String(nextState));
      addToast(nextState ? 'Đã bật & ghi nhớ cài đặt thông báo Desktop!' : 'Đã tắt thông báo Desktop');
    } else {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setDesktopNotifyEnabled(true);
        localStorage.setItem('desktop_notify_enabled', 'true');
        addToast('Đã cấp quyền & lưu cài đặt thông báo Desktop!', 'success');
      } else {
        setDesktopNotifyEnabled(false);
        localStorage.setItem('desktop_notify_enabled', 'false');
        addToast('Bạn đã từ chối quyền thông báo trên trình duyệt', 'error');
      }
    }
  };

  // Live schedule calculations
  const liveScheduleStatus = useMemo(() => {
    if (!plan || !plan.schedule) return { currentSlot: null, overdueSlots: [], upcomingSlots: [], nextSlot: null };

    const todayKey = getCurrentDayKey();
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const schedule = plan.schedule;

    let currentSlot = null;
    let nextSlot = null;
    const overdueSlots = [];
    const upcomingSlots = [];

    schedule.forEach((slot) => {
      const cell = slot.cells?.[todayKey];
      if (!cell || !cell.text?.trim()) return;

      const startMin = timeToMinutes(slot.start);
      const endMin = timeToMinutes(slot.end);

      if (nowMinutes >= startMin && nowMinutes <= endMin) {
        currentSlot = { slot, cell, minutesLeft: endMin - nowMinutes };
      } else if (nowMinutes > endMin && !cell.done) {
        overdueSlots.push({ slot, cell });
      } else if (nowMinutes < startMin) {
        const minutesUntilStart = startMin - nowMinutes;
        upcomingSlots.push({ slot, cell, minutesUntilStart });
        if (!nextSlot || minutesUntilStart < nextSlot.minutesUntilStart) {
          nextSlot = { slot, cell, minutesUntilStart };
        }
      }
    });

    return { currentSlot, overdueSlots, upcomingSlots, nextSlot };
  }, [plan, currentTime]);

  // Mark done handler
  const handleMarkDone = (slotId, dayKey, isDone) => {
    if (!permissions.canEditCells) {
      addToast('Vai trò của bạn (Viewer) chỉ có quyền xem!', 'error');
      return;
    }
    const nextSchedule = (plan.schedule || []).map((slot) => {
      if (slot.id !== slotId) return slot;
      return {
        ...slot,
        cells: {
          ...slot.cells,
          [dayKey]: {
            ...slot.cells[dayKey],
            done: isDone,
          },
        },
      };
    });
    handleUpdatePlan({ ...plan, schedule: nextSchedule });
    addToast(isDone ? 'Đã đánh dấu hoàn thành!' : 'Đã bỏ đánh dấu hoàn thành', 'success');
  };

  // Reset Plan Handler (Admin Only)
  const handleResetPlan = async () => {
    if (!permissions.canResetSystem) {
      addToast('Chỉ Quản trị viên (Admin) mới có quyền reset hệ thống!', 'error');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn đặt lại toàn bộ kế hoạch về mặc định ban đầu?')) return;

    try {
      setLoading(true);
      const resetData = await resetPlanApi();
      setPlan(resetData);
      addToast('Đã khôi phục kế hoạch mặc định ban đầu!', 'success');
    } catch (err) {
      addToast(err.message || 'Lỗi khôi phục mặc định', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Backup JSON Download
  const handleDownloadJson = () => {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `Lich_Sinh_Hoat_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    addToast('Đã tải tệp sao lưu JSON thành công!', 'success');
  };

  // Import JSON Restore
  const handleImportJson = (e) => {
    if (!permissions.canBackupRestore) {
      addToast('Chỉ Quản trị viên (Admin) mới có quyền nhập dữ liệu JSON!', 'error');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.schedule) throw new Error('Cấu trúc tệp JSON không hợp lệ');
        handleUpdatePlan(parsed);
        addToast('Đã khôi phục dữ liệu từ tệp JSON thành công!', 'success');
      } catch (err) {
        addToast(`Lỗi đọc tệp: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  // Export Word Document
  const handleExportWord = async () => {
    try {
      addToast('Đang tạo tệp Word A3...', 'info');
      const blob = await getWordFile();
      downloadBlob(blob, `Lich_Sinh_Hoat_1_Tuan_${new Date().toISOString().slice(0, 10)}.docx`);
      addToast('Đã tải tệp Word thành công!', 'success');
    } catch (err) {
      addToast(`Lỗi xuất Word: ${err.message}`, 'error');
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return <LoginPortal addToast={addToast} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-bold text-slate-400">Đang tải Lịch Sinh Hoạt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
        <div className="glass-panel max-w-md p-6 rounded-3xl border border-red-500/40 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Lỗi Kết Nối Server</h2>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 transition"
          >
            Tải Lại Trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 pb-20 md:pb-10 pt-3 md:pt-5 px-3 sm:px-6 lg:px-8 space-y-4 w-full font-sans transition-all">
      {/* Toast System */}
      <ToastContainer toasts={toasts} />

      {/* Animated Mascots & Running Boy */}
      <AnimatedMascots addToast={addToast} />

      {/* AI Quản Gia Trợ Lý Thời Gian Gia Đình */}
      <ButlerAiAssistant plan={plan} onUpdatePlan={handleUpdatePlan} addToast={addToast} />

      {/* Header Bar */}
      <Header
        meta={plan?.meta}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRoleModal={() => setShowRoleModal(true)}
        onOpenSecretAdmin={() => setShowSecretAdminModal(true)}
        onOpenReminders={() => setShowNotificationDrawer(true)}
        reminderBadgeCount={liveScheduleStatus.overdueSlots.length}
        onResetPlan={handleResetPlan}
        onDownloadJson={handleDownloadJson}
        onImportJson={handleImportJson}
        onExportWord={handleExportWord}
        onPrint={handlePrint}
        saveStatus={saveStatus}
        isSaving={isSaving}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        lastSyncedTime={lastSyncedTime}
      />

      {/* Live Reminder Banner */}
      <LiveReminderBanner
        liveScheduleStatus={liveScheduleStatus}
        onOpenReminders={() => setShowNotificationDrawer(true)}
        onMarkDone={handleMarkDone}
      />

      {/* Dynamic Mobile & PC Automation Dock */}
      <MobileAutomationDock
        plan={plan}
        onUpdatePlan={handleUpdatePlan}
        addToast={addToast}
      />

      {/* Active Tab View Rendering */}
      <main className="w-full">
        {activeTab === 'dashboard' && (
          <DashboardTab plan={plan} onNavigateTab={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === 'agent_workspace' && (
          <AgentWorkspaceDashboard
            plan={plan}
            onUpdatePlan={handleUpdatePlan}
            onExportWord={handleExportWord}
            onPrint={handlePrint}
            addToast={addToast}
          />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab
            plan={plan}
            onUpdatePlan={handleUpdatePlan}
            onOpenNoteModal={(initialValue, onSave) => setNoteModal({ isOpen: true, initialValue, onSave })}
            search={search}
            setSearch={setSearch}
            dayFilter={dayFilter}
            setDayFilter={setDayFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        )}
        {activeTab === 'goals' && <GoalsTab plan={plan} onUpdatePlan={handleUpdatePlan} />}
        {activeTab === 'summary' && <SummaryTab plan={plan} onUpdatePlan={handleUpdatePlan} />}
        {activeTab === 'docs' && <DocsTab />}
      </main>

      {/* Mobile Bottom Dock Nav */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReminders={() => setShowNotificationDrawer(true)}
        reminderBadgeCount={liveScheduleStatus.overdueSlots.length}
      />

      {/* Role Manager Modal */}
      <RoleSelectorModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />

      {/* Secret Stealth Admin Modal */}
      <SecretAdminModal
        isOpen={showSecretAdminModal}
        onClose={() => setShowSecretAdminModal(false)}
        addToast={addToast}
      />

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        initialValue={noteModal.initialValue}
        onSave={(newVal) => noteModal.onSave && noteModal.onSave(newVal)}
        onClose={() => setNoteModal({ isOpen: false, initialValue: '', onSave: null })}
      />

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        liveScheduleStatus={liveScheduleStatus}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        soundMode={soundMode}
        setSoundMode={setSoundMode}
        desktopNotifyEnabled={desktopNotifyEnabled}
        toggleDesktopNotifications={toggleDesktopNotifications}
        onMarkDone={handleMarkDone}
        triggerSoundNotification={triggerSoundNotification}
        isAlarmPlaying={isAlarmPlaying}
        alarmSecondsLeft={alarmSecondsLeft}
        handleStopAlarm={handleStopAlarm}
      />
    </div>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <MainAppContent />
    </RoleProvider>
  );
}

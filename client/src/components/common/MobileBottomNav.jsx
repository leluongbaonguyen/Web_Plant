import { Bell } from 'lucide-react';
import { TABS, cx } from '../../constants/index.js';

export function MobileBottomNav({ activeTab, setActiveTab, onOpenReminders, reminderBadgeCount }) {
  return (
    <div className="no-print fixed bottom-0 left-0 right-0 z-40 border-t-2 border-pink-500/30 bg-gradient-to-r from-slate-950/95 via-purple-950/95 to-slate-950/95 backdrop-blur-2xl px-2 py-2 md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.8)] select-none">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                'relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all duration-300 active:scale-95 cursor-pointer',
                isActive
                  ? 'bg-gradient-to-b from-pink-500/20 to-purple-600/30 text-white font-black scale-110 shadow-lg border border-pink-400/50 ring-1 ring-pink-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              )}
            >
              <Icon className={cx('h-5 w-5 transition-transform duration-300', isActive ? 'text-pink-300 scale-110 animate-bounce' : 'text-slate-400')} />
              <span className={cx('text-[10px] tracking-tight font-extrabold', isActive ? 'text-pink-200' : 'text-slate-400')}>
                {tab.label.split(' ')[0]}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 flex h-1.5 w-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-sm" />
              )}
            </button>
          );
        })}

        <button
          onClick={onOpenReminders}
          className="relative flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all active:scale-95 cursor-pointer"
        >
          <Bell className="h-5 w-5 text-purple-400 animate-pulse" />
          <span className="text-[10px] tracking-tight font-extrabold text-purple-200">Nhắc nhở</span>
          {reminderBadgeCount > 0 && (
            <span className="absolute -top-1 right-0 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[9px] font-black text-slate-950 shadow-md animate-bounce">
              {reminderBadgeCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

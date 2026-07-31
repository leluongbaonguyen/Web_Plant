import { Bell } from 'lucide-react';
import { TABS, cx } from '../../constants/index.js';

export function MobileBottomNav({ activeTab, setActiveTab, onOpenReminders, reminderBadgeCount }) {
  return (
    <div className="no-print fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-2 py-2 md:hidden shadow-2xl">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cx(
                'flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 transition-all',
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cx('h-5 w-5', isActive ? 'text-indigo-400' : 'text-slate-500')} />
              <span className="text-[10px] tracking-tight font-semibold">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}

        <button
          onClick={onOpenReminders}
          className="relative flex flex-col items-center gap-1 rounded-xl px-2.5 py-1 text-purple-400 hover:text-purple-300 transition-all"
        >
          <Bell className="h-5 w-5 text-purple-400 animate-pulse" />
          <span className="text-[10px] tracking-tight font-semibold">Nhắc nhở</span>
          {reminderBadgeCount > 0 && (
            <span className="absolute top-0 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 animate-bounce">
              {reminderBadgeCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

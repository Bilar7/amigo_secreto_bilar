import React from 'react';
import { Bell, CheckCheck, Gift, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { AppNotification, ThemeMode } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  theme: ThemeMode;
  onMarkAllAsRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  theme,
  onMarkAllAsRead
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`flex items-center justify-between pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Notificações
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Atualizações recentes dos seus grupos e listas de desejos.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Marcar todas como lidas</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              notif.read 
                ? isDark ? 'bg-slate-900/40 border-slate-800/80 opacity-70' : 'bg-slate-50 border-slate-200 opacity-70'
                : isDark ? 'bg-slate-900 border-slate-800 shadow-sm' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 mt-0.5 overflow-hidden ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              {notif.avatar ? (
                <img src={notif.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {notif.title}
                </h4>
                <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

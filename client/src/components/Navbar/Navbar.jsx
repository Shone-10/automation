import React, { useState, useEffect } from 'react';
import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';
import NotificationDrawer from '../NotificationDrawer/NotificationDrawer.jsx';
import api from '../../services/api.js';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications');
        const unread = data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to load notifications count:', error.message);
      }
    };
    if (user) {
      fetchUnread();
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 font-display text-lg font-bold text-white shadow-md shadow-brand-500/10">
                C
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white hidden sm:block">
                Campus<span className="bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">Voice</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification trigger */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative rounded-xl p-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0b0f19]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile info & Logout */}
            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="hidden flex-col text-left md:flex">
                  <span className="text-xs font-semibold text-slate-200 leading-none">{user.name}</span>
                  <span className="text-[10px] font-semibold uppercase text-brand-400 mt-1 tracking-wider leading-none">
                    {user.role === 'admin' ? 'Administrator' : `${user.department || 'Student'}`}
                  </span>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="rounded-xl p-2 text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        setUnreadCount={setUnreadCount}
      />
      {isNotifOpen && (
        <div
          onClick={() => setIsNotifOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        ></div>
      )}
    </>
  );
};
export default Navbar;

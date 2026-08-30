import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCheck, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { getSocket } from '../../services/socket.js';
import StatusBadge from '../StatusBadge/StatusBadge.jsx';

export const NotificationDrawer = ({ isOpen, onClose, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      const unread = data.filter(n => !n.isRead).length;
      if (setUnreadCount) setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Subscribe to real-time socket events
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (setUnreadCount) setUnreadCount(count => count + 1);
      };
      
      socket.on('notification:new', handleNewNotification);
      
      return () => {
        socket.off('notification:new', handleNewNotification);
      };
    }
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (setUnreadCount) setUnreadCount(c => Math.max(0, c - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      if (setUnreadCount) setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-800 bg-[#0f172a] shadow-2xl animate-fade-in md:w-96">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-brand-400" />
            <h2 className="text-lg font-semibold text-slate-100 font-display">Notifications</h2>
          </div>
          <div className="flex items-center space-x-3">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="mr-1 h-4 w-4" />
                Read All
              </button>
            )}
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && notifications.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Bell className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">No new notifications here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                  className={`relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                    notification.isRead
                      ? 'border-slate-800/60 bg-slate-900/30 text-slate-400'
                      : 'border-slate-700/80 bg-slate-900/70 text-slate-100 shadow-md hover:border-slate-600'
                  }`}
                >
                  {!notification.isRead && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand-500"></span>
                  )}
                  <div className="pr-4">
                    <h4 className="text-sm font-semibold mb-1">{notification.title}</h4>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{notification.message}</p>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationDrawer;

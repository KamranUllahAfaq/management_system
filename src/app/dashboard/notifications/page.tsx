'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string; // "Info", "Warning", "Alert"
  date: string;
  read: boolean;
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PUT' });
      if (res.ok) {
        // Optimistic UI update
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Auto-mark notifications as read when entering the page
    markAllRead();
  }, []);

  if (!user) return null;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Alert':
        return {
          bg: 'bg-error-container/20 text-error border-error-container/30',
          icon: 'campaign',
        };
      case 'Warning':
        return {
          bg: 'bg-primary-container/20 text-primary border-primary-container/30',
          icon: 'warning',
        };
      case 'Info':
      default:
        return {
          bg: 'bg-secondary-container/20 text-secondary border-secondary-container/30',
          icon: 'info',
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[900px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Announcements</h3>
          <p className="text-sm text-on-surface-variant mt-1">Stay updated with hostel administration notices.</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Recent Notices</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {notifications.length} announcements
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] opacity-40">notifications_off</span>
            <p className="mt-2 font-semibold text-on-surface">No announcements found!</p>
            <p className="text-xs mt-0.5 text-on-surface-variant">Hostel administration hasn't posted any notices yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notice) => {
              const styles = getTypeStyle(notice.type);
              return (
                <div
                  key={notice.id}
                  className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                    notice.read
                      ? 'bg-white/[0.005] border-white/5 hover:bg-white/[0.015]'
                      : 'bg-primary-container/[0.02] border-primary-container/20 hover:bg-primary-container/[0.04] relative'
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!notice.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></span>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${styles.bg}`}>
                    <span className="material-symbols-outlined text-[20px]">{styles.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h5 className="font-bold text-on-surface text-sm sm:text-base">{notice.title}</h5>
                      <span className="text-[10px] text-on-surface-variant/60 font-semibold">{notice.date}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{notice.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

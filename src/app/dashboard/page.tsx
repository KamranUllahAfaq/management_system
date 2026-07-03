'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Complaint {
  id: number;
  status: string;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  date: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [openComplaints, setOpenComplaints] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Fetch complaints to count open ones
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const open = data.complaints.filter((c: Complaint) => c.status !== 'Resolved').length;
          setOpenComplaints(open);
        }
      })
      .catch((err) => console.error(err));

    // Fetch latest notification
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notifications.length > 0) {
          setLatestNotification(data.notifications[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Overview</h3>
        <p className="text-sm text-on-surface-variant mt-1">Here is a quick summary of your hostel portal status.</p>
      </div>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Fee Status */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[26px]">payments</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                user.balanceDue > 0 ? 'bg-error-container/20 text-error' : 'bg-tertiary-container/20 text-tertiary'
              }`}>
                {user.balanceDue > 0 ? 'DUES PENDING' : 'ALL CLEAR'}
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Fee Balance</h4>
            <p className="text-3xl font-extrabold mt-1 text-on-surface">
              {user.balanceDue.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PKR</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">Due: 10th of July</span>
            {user.balanceDue > 0 ? (
              <Link href="/dashboard/fee/submit" className="px-4 py-2 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs shadow-lg shadow-primary/10 transition-all">
                Pay Now
              </Link>
            ) : (
              <Link href="/dashboard/fee/history" className="text-primary hover:underline text-xs font-bold">
                View Ledger →
              </Link>
            )}
          </div>
        </div>

        {/* Card: Room Details */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">bed</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-wider">
                ACTIVE
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Room Assigned</h4>
            <p className="text-3xl font-extrabold mt-1 text-on-surface">
              Room {user.roomNumber}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Four-bed sharing room, Block C</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">{user.roommates.length} Roommates</span>
            <Link href="/dashboard/room" className="text-secondary hover:underline text-xs font-bold">
              View Details →
            </Link>
          </div>
        </div>

        {/* Card: Transport Schedule */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[26px]">directions_bus</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-wider">
                ACTIVE
              </span>
            </div>
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Next Shuttle</h4>
            <p className="text-xl font-bold mt-1 text-on-surface">
              Route R-1 (COMSATS)
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Departure: 07:30 AM / 08:30 AM</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">Driver: M. Irfan</span>
            <Link href="/dashboard/transport" className="text-tertiary hover:underline text-xs font-bold">
              Full Schedule →
            </Link>
          </div>
        </div>

        {/* Card: Complaints Portal */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-error-container/30 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[26px]">report_problem</span>
              </div>
              {openComplaints > 0 && (
                <span className="px-3 py-1 rounded-full bg-error-container/20 text-error text-[10px] font-bold tracking-wider">
                  ACTION REQUIRED
                </span>
              )}
            </div>
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Open Complaints</h4>
            <p className="text-3xl font-extrabold mt-1 text-on-surface">
              {openComplaints} <span className="text-xs font-normal text-on-surface-variant">active tickets</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">Quick Response SLA</span>
            <Link href="/dashboard/complaints" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-bold rounded-xl text-xs transition-all">
              New Ticket
            </Link>
          </div>
        </div>

        {/* Card: Latest Announcement */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group flex flex-col justify-between min-h-[220px] md:col-span-2">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[26px]">campaign</span>
              </div>
              <span className="text-xs text-on-surface-variant">{latestNotification?.date || 'Today'}</span>
            </div>
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Latest Announcement</h4>
            <p className="text-lg font-bold mt-1 text-on-surface">
              {latestNotification?.title || 'No Announcements'}
            </p>
            <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
              {latestNotification?.content || 'Check back later for recent hostel updates.'}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-on-surface-variant">Hostel Administration</span>
            <Link href="/dashboard/notifications" className="text-primary hover:underline text-xs font-bold">
              View All Announcements →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalBranches: number;
  girlsBranches: number;
  boysBranches: number;
  totalStudents: number;
  totalWardens: number;
  totalStaff: number;
  monthlyRevenue: number;
  pendingDues: number;
  activeComplaints: number;
  transportUsers: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBranches: 20,
    girlsBranches: 10,
    boysBranches: 10,
    totalStudents: 1250,
    totalWardens: 40,
    totalStaff: 120,
    monthlyRevenue: 31250000,
    pendingDues: 2450000,
    activeComplaints: 38,
    transportUsers: 450,
    totalRooms: 380,
    occupiedRooms: 312,
    availableRooms: 68
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Merge dynamic aggregates from DB endpoints to reflect live changes
    Promise.all([
      fetch('/api/admin/branches').then(res => res.json()),
      fetch('/api/admin/students').then(res => res.json()),
      fetch('/api/admin/complaints').then(res => res.json()),
      fetch('/api/admin/transport').then(res => res.json())
    ]).then(([branchesData, studentsData, complaintsData, transportData]) => {
      // Calculate live counts
      const liveBranches = branchesData.branches?.length || 20;
      const liveStudentsCount = studentsData.students?.length || 6;
      const liveComplaintsCount = complaintsData.complaints?.filter((c: any) => c.status !== 'Resolved' && c.status !== 'Rejected').length || 0;
      const liveTransportUsers = transportData.students?.length || 0;

      // Adjust mock figures with live data offsets to show actual activity
      setStats(prev => ({
        ...prev,
        totalBranches: Math.max(prev.totalBranches, liveBranches),
        totalStudents: prev.totalStudents + liveStudentsCount - 6, // Offset default preseeds
        activeComplaints: liveComplaintsCount > 0 ? liveComplaintsCount : prev.activeComplaints,
        transportUsers: liveTransportUsers > 0 ? liveTransportUsers : prev.transportUsers
      }));
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-headline-md text-on-surface">
            Welcome Admin
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Royal Group of Hostel — Islamabad Hostel City Ecosystem
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/fees/verification" className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-green-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            Payment Queue
          </Link>
          <Link href="/admin/notifications" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 font-bold rounded-xl text-xs transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            Post Notice
          </Link>
        </div>
      </div>

      {/* Grid Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Branches */}
        <Link href="/admin/branches" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
              <span className="material-symbols-outlined text-[24px]">store</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-[20px]">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Total Branches</h4>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{stats.totalBranches}</p>
            <div className="flex gap-3 text-[10px] text-on-surface-variant/60 mt-2">
              <span>{stats.girlsBranches} Girls</span>
              <span>•</span>
              <span>{stats.boysBranches} Boys</span>
            </div>
          </div>
        </Link>

        {/* Total Registered Students */}
        <Link href="/admin/students" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-[20px]">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Registered Students</h4>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{stats.totalStudents.toLocaleString()}</p>
            <p className="text-[10px] text-tertiary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              Active enrollment
            </p>
          </div>
        </Link>

        {/* Monthly Revenue */}
        <Link href="/admin/fees" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-[20px]">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Monthly Revenue</h4>
            <p className="text-2xl font-extrabold text-on-surface mt-1">
              PKR {stats.monthlyRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-on-surface-variant/65 mt-2">Expected collection slab</p>
          </div>
        </Link>

        {/* Pending Fee Amount */}
        <Link href="/admin/fees/list" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-yellow-500/10 text-yellow-400 rounded-2xl border border-yellow-500/20">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </span>
            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-[20px]">
              arrow_forward
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Pending Dues</h4>
            <p className="text-2xl font-extrabold text-error mt-1">
              PKR {stats.pendingDues.toLocaleString()}
            </p>
            <p className="text-[10px] text-on-surface-variant/65 mt-2">Dues from active invoices</p>
          </div>
        </Link>

        {/* Staff & Wardens */}
        <Link href="/admin/staff" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Total Staff</h4>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{stats.totalStaff}</p>
            <p className="text-[10px] text-on-surface-variant/65 mt-2">Wardens assigned: {stats.totalWardens}</p>
          </div>
        </Link>

        {/* Room Allotment Grid */}
        <Link href="/admin/rooms" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
              <span className="material-symbols-outlined text-[24px]">meeting_room</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Hostel Rooms</h4>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{stats.totalRooms}</p>
            <div className="flex gap-2 text-[10px] text-on-surface-variant/60 mt-2">
              <span>{stats.occupiedRooms} Occupied</span>
              <span>•</span>
              <span>{stats.availableRooms} Empty</span>
            </div>
          </div>
        </Link>

        {/* Complaints Portal */}
        <Link href="/admin/complaints" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
              <span className="material-symbols-outlined text-[24px]">report_problem</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Active Complaints</h4>
            <p className="text-3xl font-extrabold text-orange-400 mt-1">{stats.activeComplaints}</p>
            <p className="text-[10px] text-on-surface-variant/65 mt-2">Tickets in progress</p>
          </div>
        </Link>

        {/* Transport Users */}
        <Link href="/admin/transport" className="glass-card p-6 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
              <span className="material-symbols-outlined text-[24px]">directions_bus</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">Transport Users</h4>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{stats.transportUsers}</p>
            <p className="text-[10px] text-on-surface-variant/65 mt-2">Daily university shuttle riders</p>
          </div>
        </Link>

      </div>

      {/* Analytics Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Paid vs Pending Fees Chart */}
        <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-on-surface">Fee Collection Ledger</h4>
            <p className="text-xs text-on-surface-variant mt-1">Paid versus outstanding balance statement</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-on-surface">Paid Collections (92.7%)</span>
                <span className="text-tertiary">PKR 28,800,000</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: '92.7%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-on-surface">Pending / Overdue (7.3%)</span>
                <span className="text-error">PKR 2,450,000</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full" style={{ width: '7.3%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints by Category Chart */}
        <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
          <div>
            <h4 className="text-lg font-bold text-on-surface">Complaints Breakdown</h4>
            <p className="text-xs text-on-surface-variant mt-1">Tickets categorized by department</p>
          </div>
          <div className="space-y-3.5">
            {[
              { category: 'Room Issue & Maintenance', count: 18, percentage: '47%', color: 'bg-primary' },
              { category: 'Mess & Dining Services', count: 10, percentage: '26%', color: 'bg-secondary' },
              { category: 'IT & WiFi Services', count: 6, percentage: '16%', color: 'bg-tertiary' },
              { category: 'Housekeeping & Cleaning', count: 4, percentage: '11%', color: 'bg-yellow-500' }
            ].map(c => (
              <div key={c.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-on-surface">
                  <span>{c.category} ({c.count} tickets)</span>
                  <span>{c.percentage}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: c.percentage }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students by Branch Chart */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-on-surface">Students Enrollment Distribution</h4>
            <p className="text-xs text-on-surface-variant mt-1">Top occupied branches across boys and girls sectors</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { name: 'Branch 3 (Girls)', count: 124, percentage: '88%' },
              { name: 'Branch 5 (Girls)', count: 110, percentage: '78%' },
              { name: 'Branch 11 (Boys)', count: 142, percentage: '95%' },
              { name: 'Branch 12 (Boys)', count: 98, percentage: '70%' }
            ].map(b => (
              <div key={b.name} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] text-center space-y-3">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">{b.name}</span>
                <p className="text-2xl font-extrabold text-on-surface">{b.count} students</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: b.percentage }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

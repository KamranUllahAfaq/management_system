'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Branch {
  id: number;
  name: string;
  type: string;
  totalStudents: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  assignedWardens: number;
  totalStaff: number;
  monthlyRevenue: number;
  pendingDues: number;
  activeComplaints: number;
}

export default function BranchesOverview() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/admin/branches')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBranches(data.branches);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getFilteredBranches = () => {
    switch (filter) {
      case 'Girls':
        return branches.filter((b) => b.type === 'Girls');
      case 'Boys':
        return branches.filter((b) => b.type === 'Boys');
      case 'Dues':
        return branches.filter((b) => b.pendingDues > 100000);
      case 'Complaints':
        return branches.filter((b) => b.activeComplaints > 0);
      case 'Vacancy':
        return branches.filter((b) => b.availableRooms > 0);
      case 'All':
      default:
        return branches;
    }
  };

  const filteredBranches = getFilteredBranches();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Hostel Branches</h3>
          <p className="text-sm text-on-surface-variant mt-1">Manage boys and girls hostel sectors system-wide.</p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'All', label: 'All Sectors' },
            { id: 'Girls', label: 'Girls Only (B1-B10)' },
            { id: 'Boys', label: 'Boys Only (B11-B20)' },
            { id: 'Dues', label: 'High Dues (>100k)' },
            { id: 'Complaints', label: 'Active Complaints' },
            { id: 'Vacancy', label: 'Has Vacancy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-red-500/20 via-green-500/10 to-blue-500/10 border-primary text-white font-bold'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-on-surface-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
        </div>
      ) : filteredBranches.length === 0 ? (
        <div className="py-12 text-center text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-[48px] opacity-40">store_mall_directory</span>
          <p className="mt-2">No branches matched the selected filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-white/15 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Branch Header Info */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h4 className="text-xl font-bold text-on-surface">{branch.name}</h4>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider mt-1 ${
                        branch.type === 'Girls'
                          ? 'bg-pink-500/10 border border-pink-500/20 text-pink-400'
                          : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      }`}
                    >
                      {branch.type.toUpperCase()} HOSTEL
                    </span>
                  </div>
                  <span className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-on-surface-variant group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">domain</span>
                  </span>
                </div>

                {/* Occupancy and Staff Details */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Students</span>
                    <span className="text-base font-extrabold text-on-surface">{branch.totalStudents} enrolled</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Rooms Allotment</span>
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {branch.occupiedRooms}/{branch.totalRooms} filled ({branch.availableRooms} vacant)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Wardens</span>
                    <span className="text-xs font-semibold text-on-surface">{branch.assignedWardens} Active</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Staff Members</span>
                    <span className="text-xs font-semibold text-on-surface">{branch.totalStaff} Crew</span>
                  </div>
                </div>

                {/* Financial Ledger Dues */}
                <div className="py-4 space-y-2 border-b border-white/5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Monthly Revenue:</span>
                    <span className="text-on-surface">PKR {branch.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Pending Dues:</span>
                    <span className={branch.pendingDues > 0 ? 'text-error font-bold' : 'text-tertiary'}>
                      PKR {branch.pendingDues.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex justify-between items-center">
                <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">report_problem</span>
                  {branch.activeComplaints} Active Complaints
                </span>
                <Link
                  href={`/admin/branches/${branch.id}`}
                  className="px-4.5 py-2 bg-gradient-to-r from-red-500/10 via-green-500/5 to-blue-500/10 hover:opacity-90 border border-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
                >
                  View details
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

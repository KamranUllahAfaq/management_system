'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface Warden {
  id: number;
  name: string;
  contact: string;
  email: string;
  shift: string;
  salary: number;
  assignedFloor: string;
  status: string;
}

interface Staff {
  id: number;
  name: string;
  category: string;
  role: string;
  contact: string;
  salary: number;
  dutyArea: string;
  shift: string;
  status: string;
  joiningDate: string;
}

interface Student {
  id: number;
  name: string;
  university: string;
  roomNumber: string;
  mobile: string;
  balanceDue: number;
  fine: number;
  transportUsing: boolean;
  complaintsCount: number;
  accountStatus: string;
  feeStatus: string;
}

interface BranchDetail {
  id: number;
  name: string;
  type: string;
  stats: {
    totalStudents: number;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    totalWardens: number;
    messStaffCount: number;
    cleaningStaffCount: number;
    monthlyRevenue: number;
    pendingFees: number;
    activeComplaints: number;
  };
  wardens: Warden[];
  messStaff: Staff[];
  cleaningStaff: Staff[];
  students: Student[];
}

export default function BranchDetail(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const branchId = parseInt(params.id, 10);
  
  const [data, setData] = useState<BranchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  // Search & Filter state for students
  const [searchQuery, setSearchQuery] = useState('');
  const [roomQuery, setRoomQuery] = useState('');
  const [uniFilter, setUniFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');

  useEffect(() => {
    fetch(`/api/admin/branches/${branchId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.branch);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [branchId]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-12 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] text-error">error</span>
        <p className="mt-3 text-lg font-bold text-on-surface">Branch not found</p>
        <Link href="/admin/branches" className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">
          Back to Branches
        </Link>
      </div>
    );
  }

  // Filter students
  const filteredStudents = data.students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoom = s.roomNumber.toLowerCase().includes(roomQuery.toLowerCase());
    const matchesUni = uniFilter === 'All' || s.university === uniFilter;
    const matchesFee = feeFilter === 'All' || s.feeStatus === feeFilter;
    return matchesSearch && matchesRoom && matchesUni && matchesFee;
  });

  // Extract unique universities for filter dropdown
  const universities = Array.from(new Set(data.students.map((s) => s.university)));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
            <Link href="/admin/branches" className="hover:text-white transition-colors">Branches</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>{data.name}</span>
          </div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface mt-2">
            {data.name} — {data.type} Hostel
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">Detailed branch logistics, staff registers and student rosters.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Students</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{data.stats.totalStudents}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Rooms</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{data.stats.totalRooms}</span>
          <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">{data.stats.occupiedRooms} occupied / {data.stats.availableRooms} vacant</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Wardens</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{data.stats.totalWardens}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Mess Staff</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{data.stats.messStaffCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl lg:col-span-2">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Expected Revenue</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">PKR {data.stats.monthlyRevenue.toLocaleString()}</span>
          <span className="text-[9px] text-error font-semibold block mt-0.5">Pending Dues: PKR {data.stats.pendingFees.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-white/5 gap-6">
        {[
          { id: 'students', label: 'Students Roster', icon: 'group' },
          { id: 'wardens', label: 'Wardens Shift', icon: 'shield_person' },
          { id: 'mess', label: 'Mess Crew', icon: 'restaurant' },
          { id: 'cleaning', label: 'Housekeeping & Sanitary', icon: 'mop' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary text-white'
                : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        
        {/* A. Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-white/5">
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high focus:bg-background border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
              />
              <input
                type="text"
                placeholder="Search by Room..."
                value={roomQuery}
                onChange={(e) => setRoomQuery(e.target.value)}
                className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high focus:bg-background border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
              />
              <select
                value={uniFilter}
                onChange={(e) => setUniFilter(e.target.value)}
                className="px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
              >
                <option value="All">All Universities</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
              <select
                value={feeFilter}
                onChange={(e) => setFeeFilter(e.target.value)}
                className="px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid Only</option>
                <option value="Partial Paid">Partial Paid</option>
                <option value="Pending">Pending Dues</option>
                <option value="Overdue">Overdue Only</option>
              </select>
            </div>

            {/* Students Table */}
            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[48px] opacity-40">group_off</span>
                <p className="mt-2">No students match your query criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                      <th className="py-3">Name</th>
                      <th className="py-3">University</th>
                      <th className="py-3">Room</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3">Fee Status</th>
                      <th className="py-3">Dues Remaining</th>
                      <th className="py-3">Transport</th>
                      <th className="py-3">Complaints</th>
                      <th className="py-3 text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 font-semibold text-on-surface flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-secondary">
                            {student.name.charAt(0)}
                          </div>
                          {student.name}
                        </td>
                        <td className="py-4 text-xs font-medium text-on-surface-variant">{student.university}</td>
                        <td className="py-4 text-xs font-semibold text-on-surface">Room {student.roomNumber}</td>
                        <td className="py-4 text-xs text-on-surface-variant">{student.mobile}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                            student.feeStatus === 'Paid'
                              ? 'bg-tertiary-container/20 text-tertiary'
                              : student.feeStatus === 'Partial Paid'
                              ? 'bg-secondary-container/20 text-secondary'
                              : 'bg-error-container/20 text-error'
                          }`}>
                            {student.feeStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-xs font-semibold text-on-surface">
                          {student.balanceDue.toLocaleString()} PKR
                        </td>
                        <td className="py-4">
                          <span className={`material-symbols-outlined text-[20px] ${
                            student.transportUsing ? 'text-tertiary' : 'text-on-surface-variant/40'
                          }`}>
                            {student.transportUsing ? 'check_circle' : 'cancel'}
                          </span>
                        </td>
                        <td className="py-4">
                          {student.complaintsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[9px] font-bold">
                              {student.complaintsCount} OPEN
                            </span>
                          ) : (
                            <span className="text-[10px] text-on-surface-variant/50">Clean</span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <Link href={`/admin/students/${student.id}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold rounded-lg transition-all inline-block">
                            Profile
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* B. Wardens Tab */}
        {activeTab === 'wardens' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-base font-bold text-on-surface">Wardens Roster</h4>
              <button onClick={() => alert('Warden Creation module')} className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-xl flex items-center gap-1 transition-all">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Warden
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.wardens.map((warden) => (
                <div key={warden.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-bold text-on-surface">{warden.name}</h5>
                        <span className="text-[10px] text-on-surface-variant/70 block mt-0.5">Assigned Floor: {warden.assignedFloor}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                        warden.status === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
                      }`}>
                        {warden.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-on-surface-variant">
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-on-surface font-medium">{warden.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="text-on-surface font-medium">{warden.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duty Shift:</span>
                        <span className="text-on-surface font-semibold text-secondary">{warden.shift}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salary:</span>
                        <span className="text-on-surface font-semibold font-mono">{warden.salary.toLocaleString()} PKR</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2">
                    <button onClick={() => alert(`Edit warden: ${warden.name}`)} className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold border border-white/10 rounded-lg transition-all">
                      Edit
                    </button>
                    <button onClick={() => alert(`Supervised student roster for: ${warden.name}`)} className="px-3.5 py-1.5 bg-primary-container/10 hover:bg-primary-container/20 text-[10px] font-bold text-primary-container rounded-lg transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. Mess Crew Tab */}
        {activeTab === 'mess' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-base font-bold text-on-surface">Mess Roster</h4>
              <button onClick={() => alert('Staff creation module')} className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-xl flex items-center gap-1 transition-all">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Crew
              </button>
            </div>

            {data.messStaff.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[48px] opacity-40">restaurant_menu</span>
                <p className="mt-2">No mess staff assigned to this branch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.messStaff.map((staff) => (
                  <div key={staff.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-bold text-on-surface">{staff.name}</h5>
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">{staff.role}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          staff.status === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
                        }`}>
                          {staff.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-on-surface-variant">
                        <div className="flex justify-between">
                          <span>Mobile:</span>
                          <span className="text-on-surface font-medium">{staff.contact}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shift:</span>
                          <span className="text-on-surface font-semibold text-secondary">{staff.shift}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Salary:</span>
                          <span className="text-on-surface font-semibold font-mono">{staff.salary.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* D. Cleaning & Sanitary Tab */}
        {activeTab === 'cleaning' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-base font-bold text-on-surface">Housekeeping Roster</h4>
              <button onClick={() => alert('Staff creation module')} className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-xl flex items-center gap-1 transition-all">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Staff
              </button>
            </div>

            {data.cleaningStaff.length === 0 ? (
              <div className="py-12 text-center text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[48px] opacity-40">mop</span>
                <p className="mt-2">No cleaning staff assigned to this branch.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.cleaningStaff.map((staff) => (
                  <div key={staff.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h5 className="font-bold text-on-surface">{staff.name}</h5>
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-0.5">{staff.category}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          staff.status === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
                        }`}>
                          {staff.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-on-surface-variant">
                        <div className="flex justify-between">
                          <span>Duty Area:</span>
                          <span className="text-on-surface font-medium">{staff.dutyArea}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shift:</span>
                          <span className="text-on-surface font-semibold text-secondary">{staff.shift}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Salary:</span>
                          <span className="text-on-surface font-semibold font-mono">{staff.salary.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

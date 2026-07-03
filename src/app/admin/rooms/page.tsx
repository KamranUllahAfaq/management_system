'use client';

import React, { useEffect, useState } from 'react';

interface Room {
  id: number;
  branchName: string;
  branchType: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  assignedStudents: string;
  status: string;
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetch('/api/admin/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRooms(data.rooms);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getFilteredRooms = () => {
    return rooms.filter((r) => {
      const matchesBranch = branchFilter === 'All' || r.branchName === branchFilter;
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesType = typeFilter === 'All' || r.roomType === typeFilter;
      return matchesBranch && matchesStatus && matchesType;
    });
  };

  const filteredRooms = getFilteredRooms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Full':
        return 'bg-error-container/20 text-error';
      case 'Maintenance':
        return 'bg-orange-500/10 text-orange-400';
      case 'Reserved':
        return 'bg-blue-500/10 text-blue-400';
      case 'Available':
      default:
        return 'bg-tertiary-container/20 text-tertiary';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Room Management</h3>
        <p className="text-sm text-on-surface-variant mt-1">Monitor occupancy levels, maintenance status, and bed allocations.</p>
      </div>

      {/* Filters Card */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1.5">Branch Sector</label>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-xl text-xs text-on-surface outline-none"
          >
            <option value="All">All Branches</option>
            {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1.5">Room Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-xl text-xs text-on-surface outline-none"
          >
            <option value="All">All Room Statuses</option>
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-1.5">Room Bed Configuration</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-xl text-xs text-on-surface outline-none"
          >
            <option value="All">All Types</option>
            <option value="Single">Single Bed</option>
            <option value="Double">Double Bed (Shared)</option>
            <option value="Triple">Triple Bed (Shared)</option>
            <option value="Quad">Quad Bed (Shared)</option>
          </select>
        </div>
      </div>

      {/* Rooms Table Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Bed Inventory Ledger</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {filteredRooms.length} rooms listed
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] opacity-40">meeting_room</span>
            <p className="mt-2">No rooms found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Branch Name</th>
                  <th className="py-3">Room Number</th>
                  <th className="py-3">Floor</th>
                  <th className="py-3">Room Type</th>
                  <th className="py-3">Bed Allocation</th>
                  <th className="py-3">Active Residents</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        room.branchType === 'Girls' ? 'bg-pink-400' : 'bg-blue-400'
                      }`}></span>
                      {room.branchName}
                    </td>
                    <td className="py-4 font-bold text-on-surface">{room.roomNumber}</td>
                    <td className="py-4 text-on-surface-variant font-medium">{room.floor}</td>
                    <td className="py-4 text-on-surface-variant">{room.roomType}</td>
                    <td className="py-4 space-y-1">
                      <div className="flex justify-between max-w-[120px] text-[10px] font-semibold">
                        <span>{room.occupiedBeds} Allotted</span>
                        <span className="text-on-surface-variant">{room.availableBeds} Free</span>
                      </div>
                      <div className="w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-blue-500" style={{ width: `${(room.occupiedBeds / room.totalBeds) * 100}%` }}></div>
                      </div>
                    </td>
                    <td className="py-4 text-on-surface-variant truncate max-w-[200px]" title={room.assignedStudents}>
                      {room.assignedStudents || '—'}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${getStatusBadge(room.status)}`}>
                        {room.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1">
                      <button onClick={() => alert(`Room Details view`)} className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold rounded">
                        View
                      </button>
                      <button onClick={() => alert(`Modify Status`)} className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold rounded">
                        Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

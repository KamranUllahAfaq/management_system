'use client';

import React, { useEffect, useState } from 'react';

interface Warden {
  id: number;
  name: string;
  contact: string;
  email: string;
  shift: string;
  salary: number;
  assignedFloor: string;
  status: string;
  branchName: string;
}

export default function WardenManagement() {
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWarden, setNewWarden] = useState({
    name: '',
    contact: '',
    email: '',
    shift: 'Day',
    salary: '45000',
    assignedFloor: 'All Floors',
    branchName: 'Branch 3',
  });

  const fetchWardens = async () => {
    try {
      const res = await fetch('/api/admin/wardens');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWardens(data.wardens);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardens();
  }, []);

  const handleAddWardenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/wardens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarden),
      });

      if (res.ok) {
        alert('Warden added successfully!');
        setShowAddModal(false);
        fetchWardens();
      } else {
        alert('Failed to add warden');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleToggleStatus = async (warden: Warden) => {
    const nextStatus = warden.status === 'Active' ? 'On Leave' : 'Active';
    try {
      const res = await fetch('/api/admin/wardens', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...warden, status: nextStatus }),
      });
      if (res.ok) {
        fetchWardens();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Wardens Roster</h3>
          <p className="text-sm text-on-surface-variant mt-1">Manage hostel supervisors, salaries, and assignments.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[16px]">shield_person</span>
          Add Warden
        </button>
      </div>

      {/* Wardens list card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Supervisors Ledger</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {wardens.length} wardens active
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Warden Name</th>
                  <th className="py-3">Assigned Branch</th>
                  <th className="py-3">Floor Responsibility</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Email Address</th>
                  <th className="py-3">Shift</th>
                  <th className="py-3">Monthly Salary</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {wardens.map((warden) => (
                  <tr key={warden.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-secondary">
                        {warden.name.charAt(0)}
                      </div>
                      {warden.name}
                    </td>
                    <td className="py-4 font-semibold text-on-surface">{warden.branchName}</td>
                    <td className="py-4 text-on-surface-variant font-medium">{warden.assignedFloor}</td>
                    <td className="py-4 text-on-surface-variant">{warden.contact}</td>
                    <td className="py-4 text-on-surface-variant">{warden.email}</td>
                    <td className="py-4 font-semibold text-secondary">{warden.shift}</td>
                    <td className="py-4 font-bold font-mono text-on-surface">{warden.salary.toLocaleString()} PKR</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${
                        warden.status === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
                      }`}>
                        {warden.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(warden)}
                        className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                          warden.status === 'Active'
                            ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                        }`}
                      >
                        {warden.status === 'Active' ? 'Mark Leave' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Warden Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[450px] w-full p-6 rounded-3xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h4 className="text-lg font-bold text-on-surface">Add Warden</h4>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddWardenSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={newWarden.name}
                  onChange={(e) => setNewWarden({ ...newWarden, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newWarden.contact}
                  onChange={(e) => setNewWarden({ ...newWarden, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={newWarden.email}
                  onChange={(e) => setNewWarden({ ...newWarden, email: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Duty Shift</label>
                  <select
                    value={newWarden.shift}
                    onChange={(e) => setNewWarden({ ...newWarden, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  >
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Floor Allotment</label>
                  <input
                    type="text"
                    value={newWarden.assignedFloor}
                    onChange={(e) => setNewWarden({ ...newWarden, assignedFloor: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Branch Name</label>
                  <select
                    value={newWarden.branchName}
                    onChange={(e) => setNewWarden({ ...newWarden, branchName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  >
                    {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Salary (PKR)</label>
                  <input
                    type="number"
                    value={newWarden.salary}
                    onChange={(e) => setNewWarden({ ...newWarden, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-white/10 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg">Save Warden</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

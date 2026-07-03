'use client';

import React, { useEffect, useState } from 'react';

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
  branchName: string;
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    category: 'Mess Staff',
    role: 'Cook',
    contact: '',
    salary: '25000',
    dutyArea: 'Kitchen',
    shift: 'Day',
    branchName: 'Branch 3',
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStaffList(data.staff);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      if (res.ok) {
        alert('Employee registered successfully!');
        setShowAddModal(false);
        fetchStaff();
      } else {
        alert('Failed to register employee');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleToggleStatus = async (staff: Staff) => {
    const nextStatus = staff.status === 'Active' ? 'On Leave' : 'Active';
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...staff, status: nextStatus }),
      });
      if (res.ok) {
        fetchStaff();
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
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Staff Register</h3>
          <p className="text-sm text-on-surface-variant mt-1">Manage housekeeping, kitchen crew, drivers, guards, and sanitary staff.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[16px]">badge</span>
          Register Employee
        </button>
      </div>

      {/* Staff list card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Employees Ledger</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {staffList.length} staff registered
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
                  <th className="py-3">Staff Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Assigned Branch</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Duty Area</th>
                  <th className="py-3">Shift</th>
                  <th className="py-3">Joining Date</th>
                  <th className="py-3">Monthly Salary</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-secondary">
                        {staff.name.charAt(0)}
                      </div>
                      {staff.name}
                    </td>
                    <td className="py-4 text-on-surface-variant font-medium">{staff.category}</td>
                    <td className="py-4 text-on-surface-variant">{staff.role}</td>
                    <td className="py-4 font-semibold text-on-surface">{staff.branchName}</td>
                    <td className="py-4 text-on-surface-variant">{staff.contact}</td>
                    <td className="py-4 text-on-surface-variant">{staff.dutyArea}</td>
                    <td className="py-4 font-semibold text-secondary">{staff.shift}</td>
                    <td className="py-4 text-on-surface-variant">{staff.joiningDate}</td>
                    <td className="py-4 font-bold font-mono text-on-surface">{staff.salary.toLocaleString()} PKR</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${
                        staff.status === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
                      }`}>
                        {staff.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                          staff.status === 'Active'
                            ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                        }`}
                      >
                        {staff.status === 'Active' ? 'Mark Leave' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[450px] w-full p-6 rounded-3xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h4 className="text-lg font-bold text-on-surface">Register Employee</h4>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newStaff.category}
                    onChange={(e) => setNewStaff({ ...newStaff, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  >
                    <option value="Mess Staff">Mess Staff</option>
                    <option value="Working Maid">Working Maid</option>
                    <option value="Sanitary Staff">Sanitary Staff</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="Maintenance Staff">Maintenance Staff</option>
                    <option value="Driver">Driver</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Specific Role</label>
                  <input
                    type="text"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    placeholder="e.g. Cook, Sweeper"
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={newStaff.contact}
                  onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Duty Shift</label>
                  <select
                    value={newStaff.shift}
                    onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                  >
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                    <option value="Rotating">Rotating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Duty Area</label>
                  <input
                    type="text"
                    value={newStaff.dutyArea}
                    onChange={(e) => setNewStaff({ ...newStaff, dutyArea: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Branch Name</label>
                  <select
                    value={newStaff.branchName}
                    onChange={(e) => setNewStaff({ ...newStaff, branchName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-on-surface"
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
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-white/10 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

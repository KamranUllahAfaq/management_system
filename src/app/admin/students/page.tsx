'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Student {
  id: number;
  name: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  emergencyContact: string;
  email: string;
  university: string;
  semester: string;
  registrationNumber: string;
  branchName: string;
  roomNumber: string;
  joiningDate: string;
  monthlyFee: number;
  paidAmount: number;
  balanceDue: number;
  fine: number;
  transportUsing: boolean;
  feeStatus: string;
  accountStatus: string;
}

export default function AllStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form states
  const [newStudent, setNewStudent] = useState({
    username: '',
    name: '',
    fatherName: '',
    cnic: '',
    permanentAddress: '',
    semester: '1st',
    registrationNumber: '',
    university: 'COMSATS',
    email: '',
    rollNumber: '',
    branchName: 'Branch 3',
    roomNumber: '101',
    mobile: '',
    emergencyContact: '',
    monthlyFee: '25000',
    transportUsing: false,
  });

  const [fineAmount, setFineAmount] = useState('500');

  const fetchStudents = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (branchFilter) query.append('branch', branchFilter);
      if (feeFilter) query.append('feeStatus', feeFilter);

      const res = await fetch(`/api/admin/students?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, branchFilter, feeFilter]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Student registered successfully!');
        setShowAddModal(false);
        fetchStudents();
      } else {
        alert(data.error || 'Failed to register student');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleAddFine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-fine', amount: fineAmount }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Fine imposed successfully!');
        setShowFineModal(false);
        fetchStudents();
      } else {
        alert(data.error || 'Failed to add fine');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const toggleAccountStatus = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportCSV = () => {
    const headers = 'ID,Name,University,Branch,Room,FeeStatus,Dues,Fine,Transport\n';
    const rows = students
      .map(
        (s) =>
          `${s.id},"${s.name}","${s.university}","${s.branchName}","${s.roomNumber}",${s.feeStatus},${s.balanceDue},${s.fine},${s.transportUsing}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'hostel_students_report.csv');
    a.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Registered Students</h3>
          <p className="text-sm text-on-surface-variant mt-1">Manage and track all students residing in Royal Group Hostels.</p>
        </div>
        
        {/* Actions Row */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Add New Student
          </button>
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name, roll number, CNIC or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
        />
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
        >
          <option value="">All Branches</option>
          {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={feeFilter}
          onChange={(e) => setFeeFilter(e.target.value)}
          className="px-4 py-2.5 bg-surface-container/60 border border-white/10 rounded-xl text-xs outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
        >
          <option value="">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial Paid">Partial Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Main Students List Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] opacity-40">group_off</span>
            <p className="mt-2">No student records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Name</th>
                  <th className="py-3">Father Name</th>
                  <th className="py-3">Branch/Room</th>
                  <th className="py-3">University</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Monthly Fee</th>
                  <th className="py-3">Remaining Dues</th>
                  <th className="py-3">Fine</th>
                  <th className="py-3">Fee Status</th>
                  <th className="py-3">Transport</th>
                  <th className="py-3">Account</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-secondary">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <span>{student.name}</span>
                        <span className="block text-[9px] text-on-surface-variant font-medium mt-0.5">#{student.id}</span>
                      </div>
                    </td>
                    <td className="py-4 text-on-surface-variant">{student.fatherName || '—'}</td>
                    <td className="py-4 font-semibold text-on-surface">
                      {student.branchName}
                      <span className="block text-[10px] text-on-surface-variant font-medium">Room {student.roomNumber}</span>
                    </td>
                    <td className="py-4 font-medium text-on-surface-variant">{student.university}</td>
                    <td className="py-4 text-on-surface-variant">{student.mobile}</td>
                    <td className="py-4 font-semibold font-mono text-on-surface">
                      {student.monthlyFee.toLocaleString()} PKR
                    </td>
                    <td className="py-4 font-semibold font-mono text-error">
                      {student.balanceDue.toLocaleString()} PKR
                    </td>
                    <td className="py-4 font-semibold font-mono text-orange-400">
                      {student.fine.toLocaleString()} PKR
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${
                        student.feeStatus === 'Paid'
                          ? 'bg-tertiary-container/20 text-tertiary'
                          : student.feeStatus === 'Partial Paid'
                          ? 'bg-secondary-container/20 text-secondary'
                          : 'bg-error-container/20 text-error'
                      }`}>
                        {student.feeStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                        student.transportUsing ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-on-surface-variant'
                      }`}>
                        {student.transportUsing ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${
                        student.accountStatus === 'Active' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-white/5 text-on-surface-variant'
                      }`}>
                        {student.accountStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link href={`/admin/students/${student.id}`} className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold rounded transition-all inline-block">
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowFineModal(true);
                        }}
                        className="px-2 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-[9px] font-bold rounded transition-all"
                      >
                        + Fine
                      </button>
                      <button
                        onClick={() => toggleAccountStatus(student.id)}
                        className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                          student.accountStatus === 'Active'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                        }`}
                      >
                        {student.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[700px] w-full p-6 md:p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-xl font-bold text-on-surface">Register Student</h4>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Username</label>
                  <input
                    type="text"
                    value={newStudent.username}
                    onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CNIC / B-Form</label>
                  <input
                    type="text"
                    value={newStudent.cnic}
                    onChange={(e) => setNewStudent({ ...newStudent, cnic: e.target.value })}
                    required
                    placeholder="XXXXX-XXXXXXX-X"
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={newStudent.mobile}
                    onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={newStudent.emergencyContact}
                    onChange={(e) => setNewStudent({ ...newStudent, emergencyContact: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">University</label>
                  <select
                    value={newStudent.university}
                    onChange={(e) => setNewStudent({ ...newStudent, university: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  >
                    <option value="COMSATS">COMSATS</option>
                    <option value="IQRA University">IQRA University</option>
                    <option value="ABASYN University">ABASYN University</option>
                    <option value="SHIFA">SHIFA</option>
                    <option value="KMU">KMU</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Roll / Registration Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Semester</label>
                  <input
                    type="text"
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                    required
                    placeholder="e.g. 6th"
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Assigned Branch</label>
                  <select
                    value={newStudent.branchName}
                    onChange={(e) => setNewStudent({ ...newStudent, branchName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  >
                    {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Room Number Allotted</label>
                  <input
                    type="text"
                    value={newStudent.roomNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, roomNumber: e.target.value })}
                    required
                    placeholder="e.g. B3-204"
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="number"
                    value={newStudent.monthlyFee}
                    onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="add-transport"
                    checked={newStudent.transportUsing}
                    onChange={(e) => setNewStudent({ ...newStudent, transportUsing: e.target.checked })}
                    className="w-4 h-4 rounded bg-surface-container border-white/10 text-primary-container"
                  />
                  <label htmlFor="add-transport" className="ml-2 font-bold text-on-surface-variant uppercase tracking-wider">Use Transport</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Permanent Home Address</label>
                  <input
                    type="text"
                    value={newStudent.permanentAddress}
                    onChange={(e) => setNewStudent({ ...newStudent, permanentAddress: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl shadow-lg"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Fine */}
      {showFineModal && selectedStudent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[450px] w-full p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-lg font-bold text-on-surface">Impose Fine</h4>
              <button onClick={() => setShowFineModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddFine} className="space-y-4 text-xs">
              <p className="text-on-surface-variant">
                Impose fine to <strong>{selectedStudent.name}</strong> ({selectedStudent.registrationNumber}).
              </p>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fine Amount (PKR)</label>
                <input
                  type="number"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container border border-white/10 rounded-xl text-on-surface text-sm"
                  required
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFineModal(false)}
                  className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl"
                >
                  Impose Fine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

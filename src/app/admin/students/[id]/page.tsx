'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Payment {
  id: number;
  month: string;
  dueDate: string;
  amount: number;
  status: string;
  paymentDate: string | null;
  transactionId: string | null;
  method: string | null;
  verifiedBy: string | null;
}

interface Complaint {
  id: number;
  title: string;
  category: string;
  description: string;
  status: string;
  date: string;
}

interface StudentDetail {
  id: number;
  username: string;
  name: string;
  fatherName: string;
  cnic: string;
  mobile: string;
  emergencyContact: string;
  email: string;
  permanentAddress: string;
  semester: string;
  registrationNumber: string;
  university: string;
  branchName: string;
  branchId: number;
  roomNumber: string;
  roomId: number;
  joiningDate: string;
  monthlyFee: number;
  balanceDue: number;
  fine: number;
  totalPayable: number;
  transportUsing: boolean;
  feeStatus: string;
  accountStatus: string;
  complaints: {
    total: number;
    open: number;
    resolved: number;
    list: Complaint[];
  };
  payments: Payment[];
}

export default function StudentProfileAdmin(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const studentId = parseInt(params.id, 10);
  const router = useRouter();

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('');
  const [regNo, setRegNo] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [transportUsing, setTransportUsing] = useState(false);

  // Action state (Room / Branch move)
  const [roomMoveMode, setRoomMoveMode] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  
  const [branchMoveMode, setBranchMoveMode] = useState(false);
  const [newBranchName, setNewBranchName] = useState('Branch 3');
  const [branchMoveRoom, setBranchMoveRoom] = useState('101');

  const [fineMode, setFineMode] = useState(false);
  const [fineAmount, setFineAmount] = useState('500');

  const fetchStudentProfile = async () => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStudent(data.student);
          
          // Populate edit values
          setName(data.student.name);
          setFatherName(data.student.fatherName);
          setCnic(data.student.cnic);
          setMobile(data.student.mobile);
          setEmergencyContact(data.student.emergencyContact);
          setEmail(data.student.email);
          setAddress(data.student.permanentAddress);
          setUniversity(data.student.university);
          setSemester(data.student.semester);
          setRegNo(data.student.registrationNumber);
          setMonthlyFee(String(data.student.monthlyFee));
          setTransportUsing(data.student.transportUsing);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-12 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] text-error">error</span>
        <p className="mt-3 text-lg font-bold text-on-surface">Student profile not found</p>
      </div>
    );
  }

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          fatherName,
          cnic,
          email,
          mobile,
          emergencyContact,
          permanentAddress: address,
          university,
          semester,
          registrationNumber: regNo,
          monthlyFee,
          transportUsing,
        }),
      });

      if (res.ok) {
        alert('Details updated successfully!');
        setEditMode(false);
        fetchStudentProfile();
      } else {
        alert('Failed to update student profile');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleRoomMove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/students/${studentId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change-room', newRoomNumber }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Student room changed successfully!');
        setRoomMoveMode(false);
        fetchStudentProfile();
      } else {
        alert(data.error || 'Failed to move room');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleBranchMove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/students/${studentId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change-branch', newBranchName, newRoomNumber: branchMoveRoom }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Student branch changed successfully!');
        setBranchMoveMode(false);
        fetchStudentProfile();
      } else {
        alert(data.error || 'Failed to move branch');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleImposeFine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/students/${studentId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-fine', amount: fineAmount }),
      });
      if (res.ok) {
        alert('Fine imposed!');
        setFineMode(false);
        fetchStudentProfile();
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleAccountToggle = async () => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStudentProfile();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header breadcrumbs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
            <button onClick={() => router.push('/admin/students')} className="hover:text-white transition-colors">Students</button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>{student.name}</span>
          </div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface mt-2">{student.name}</h3>
          <p className="text-sm text-on-surface-variant mt-1">residing in {student.branchName} — Room {student.roomNumber}</p>
        </div>

        {/* Status indicator */}
        <div className="flex gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider ${
            student.accountStatus === 'Active' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error-container/20 text-error'
          }`}>
            {student.accountStatus.toUpperCase()} ACCOUNT
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider ${
            student.feeStatus === 'Paid'
              ? 'bg-tertiary-container/20 text-tertiary'
              : 'bg-error-container/20 text-error'
          }`}>
            {student.feeStatus.toUpperCase()} FEES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Personal Info */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Quick Actions Panel */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-on-surface pb-3 border-b border-white/5">Administrative Tools</h4>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button onClick={() => setEditMode(!editMode)} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button onClick={() => setRoomMoveMode(true)} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                Change Room
              </button>
              <button onClick={() => setBranchMoveMode(true)} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">domain</span>
                Change Branch
              </button>
              <button onClick={() => setFineMode(true)} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                Impose Fine
              </button>
              <button onClick={handleAccountToggle} className={`w-full py-2.5 font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                student.accountStatus === 'Active'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                  : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20'
              }`}>
                <span className="material-symbols-outlined text-[16px]">{student.accountStatus === 'Active' ? 'no_accounts' : 'person'}</span>
                {student.accountStatus === 'Active' ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          </div>

          {/* Dues summary */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-on-surface pb-3 border-b border-white/5">Account Ledger</h4>
            <div className="space-y-3.5 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Monthly Rent:</span>
                <span className="text-on-surface font-semibold font-mono">{student.monthlyFee.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding Dues:</span>
                <span className="text-error font-bold font-mono">{student.balanceDue.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between">
                <span>Accumulated Fines:</span>
                <span className="text-orange-400 font-bold font-mono">{student.fine.toLocaleString()} PKR</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/5 text-sm font-extrabold text-on-surface">
                <span>Total Payable:</span>
                <span>{(student.balanceDue + student.fine).toLocaleString()} PKR</span>
              </div>
            </div>
          </div>

          {/* Complaints overview */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-on-surface pb-3 border-b border-white/5">Complaints Summary</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white/5 rounded-2xl">
                <span className="text-lg font-extrabold text-on-surface block">{student.complaints.total}</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold">Total</span>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/10">
                <span className="text-lg font-extrabold text-orange-400 block">{student.complaints.open}</span>
                <span className="text-[9px] text-orange-400 uppercase font-bold">Open</span>
              </div>
              <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/10">
                <span className="text-lg font-extrabold text-green-400 block">{student.complaints.resolved}</span>
                <span className="text-[9px] text-green-400 uppercase font-bold">Resolved</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Detailed Info Form & History Tables */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal & Academic Profile Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <h4 className="text-lg font-bold text-on-surface pb-4 border-b border-white/5">
              {editMode ? 'Modify Profile Information' : 'Profile Details'}
            </h4>

            {editMode ? (
              <form onSubmit={handleUpdateDetails} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Father Name</label>
                    <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">CNIC</label>
                    <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Mobile</label>
                    <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Emergency Contact</label>
                    <input type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">University</label>
                    <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Semester</label>
                    <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Registration Number</label>
                    <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Monthly Fee (PKR)</label>
                    <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                  <div className="flex items-center pt-6">
                    <input type="checkbox" id="edit-transport" checked={transportUsing} onChange={(e) => setTransportUsing(e.target.checked)} className="w-4 h-4 rounded bg-surface-container border-white/10 text-primary-container" />
                    <label htmlFor="edit-transport" className="ml-2 font-bold text-on-surface-variant uppercase tracking-wider">Use Transport</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Permanent Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-end gap-2">
                  <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg">Save Profile</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Personal Category */}
                <div className="space-y-4">
                  <h5 className="font-bold text-secondary text-[10px] uppercase tracking-wider pb-1 border-b border-white/5">Personal Info</h5>
                  <div className="space-y-2">
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Father's Name:</strong> {student.fatherName}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">CNIC Number:</strong> {student.cnic}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Mobile Number:</strong> {student.mobile}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Emergency Contact:</strong> {student.emergencyContact}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Email Address:</strong> {student.email}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Home Address:</strong> {student.permanentAddress}</p>
                  </div>
                </div>

                {/* Academic & Allotment Category */}
                <div className="space-y-4">
                  <h5 className="font-bold text-secondary text-[10px] uppercase tracking-wider pb-1 border-b border-white/5">University & Housing Info</h5>
                  <div className="space-y-2">
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">University:</strong> {student.university}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Registration Number:</strong> {student.registrationNumber}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Semester & Program:</strong> {student.semester} Semester</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Branch Name:</strong> {student.branchName}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Allotted Room:</strong> Room {student.roomNumber}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Joining Date:</strong> {student.joiningDate}</p>
                    <p className="text-on-surface-variant"><strong className="text-on-surface block font-semibold mb-0.5">Shuttle Service:</strong> {student.transportUsing ? 'Active Route User' : 'Not Subscribed'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Statement Table */}
          <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
            <h4 className="text-lg font-bold text-on-surface pb-4 border-b border-white/5">Billing Statements</h4>
            {student.payments.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-6">No payments registered for this student.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                      <th className="py-2">Month</th>
                      <th className="py-2">Due Date</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Paid Date</th>
                      <th className="py-2">Method</th>
                      <th className="py-2">Transaction ID</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {student.payments.map(p => (
                      <tr key={p.id}>
                        <td className="py-3 font-semibold text-on-surface">{p.month}</td>
                        <td className="py-3 text-on-surface-variant">{p.dueDate}</td>
                        <td className="py-3 font-bold font-mono text-on-surface">{p.amount.toLocaleString()} PKR</td>
                        <td className="py-3 text-on-surface-variant">{p.paymentDate || '—'}</td>
                        <td className="py-3 text-on-surface-variant">{p.method || '—'}</td>
                        <td className="py-3 font-mono text-[10px] text-on-surface-variant/80">{p.transactionId || '—'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${
                            p.status === 'Paid'
                              ? 'bg-tertiary-container/20 text-tertiary'
                              : 'bg-error-container/20 text-error'
                          }`}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal: Room Change */}
      {roomMoveMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[400px] w-full p-6 rounded-3xl space-y-5">
            <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Relocate Student Room</h4>
            <form onSubmit={handleRoomMove} className="space-y-4 text-xs">
              <p className="text-on-surface-variant">Change room allotment in <strong>{student.branchName}</strong>.</p>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">New Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. 102"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRoomMoveMode(false)} className="px-4 py-2 border border-white/10 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg">Move Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Branch Change */}
      {branchMoveMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[400px] w-full p-6 rounded-3xl space-y-5">
            <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Relocate Branch</h4>
            <form onSubmit={handleBranchMove} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Branch</label>
                <select
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                >
                  {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Allotted Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. 201"
                  value={branchMoveRoom}
                  onChange={(e) => setBranchMoveRoom(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setBranchMoveMode(false)} className="px-4 py-2 border border-white/10 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fine */}
      {fineMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[400px] w-full p-6 rounded-3xl space-y-5">
            <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Impose Fine</h4>
            <form onSubmit={handleImposeFine} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fine Amount (PKR)</label>
                <input
                  type="number"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setFineMode(false)} className="px-4 py-2 border border-white/10 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container font-bold rounded-lg">Impose</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

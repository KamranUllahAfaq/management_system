'use client';

import React, { useEffect, useState } from 'react';

interface Complaint {
  id: number;
  studentName: string;
  branchName: string;
  roomNumber: string;
  university: string;
  category: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  status: string;
  assignedTo: string;
  adminNote: string;
}

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Detail state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  
  // Modifiable fields
  const [adminNote, setAdminNote] = useState('');
  const [assignedTo, setAssignedTo] = useState('Maintenance Electrician');
  const [status, setStatus] = useState('In Progress');
  const [priority, setPriority] = useState('Normal');

  const fetchComplaintsList = async () => {
    try {
      const res = await fetch('/api/admin/complaints');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setComplaints(data.complaints);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintsList();
  }, []);

  const openDetails = (ticket: Complaint) => {
    setSelectedComplaint(ticket);
    setAdminNote(ticket.adminNote);
    setAssignedTo(ticket.assignedTo === 'Unassigned' ? 'Maintenance Electrician' : ticket.assignedTo);
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setShowReplyModal(true);
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      const res = await fetch('/api/admin/complaints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          status,
          assignedTo,
          adminNote,
          priority,
        }),
      });

      if (res.ok) {
        alert('Ticket updated successfully!');
        setShowReplyModal(false);
        fetchComplaintsList();
      } else {
        alert('Failed to update ticket');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  // Status statistics counts
  const total = complaints.length;
  const openCount = complaints.filter(c => c.status === 'Open').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const rejectedCount = complaints.filter(c => c.status === 'Rejected').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-tertiary-container/20 text-tertiary';
      case 'In Progress':
        return 'bg-secondary-container/20 text-secondary';
      case 'Rejected':
        return 'bg-error-container/10 text-on-surface-variant/70 border-white/5';
      case 'Open':
      default:
        return 'bg-error-container/20 text-error';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Complaints Portal</h3>
        <p className="text-sm text-on-surface-variant mt-1">Review maintenance tickets and assign staff to resolve student issues.</p>
      </div>

      {/* Stats Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Total Filed</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{total}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center border-l-2 border-l-error">
          <span className="text-[10px] font-bold text-error uppercase tracking-wider block">Open Tickets</span>
          <span className="text-2xl font-extrabold text-error mt-1 block">{openCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center border-l-2 border-l-secondary">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-extrabold text-secondary mt-1 block">{inProgressCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center border-l-2 border-l-tertiary">
          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-extrabold text-tertiary mt-1 block">{resolvedCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Rejected</span>
          <span className="text-2xl font-extrabold text-on-surface-variant mt-1 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Tickets List Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Registered Tickets</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {complaints.length} tickets total
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] opacity-40">assignment_turned_in</span>
            <p className="mt-2 font-semibold text-on-surface">No complaints found!</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Database is completely cleared of support tickets.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Ticket ID</th>
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Branch/Room</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Subject</th>
                  <th className="py-3">Date Filed</th>
                  <th className="py-3">Priority</th>
                  <th className="py-3">Assigned To</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {complaints.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-primary">#{ticket.id}</td>
                    <td className="py-4 font-bold text-on-surface">{ticket.studentName}</td>
                    <td className="py-4 font-semibold text-on-surface">
                      {ticket.branchName}
                      <span className="block text-[10px] text-on-surface-variant font-medium">Room {ticket.roomNumber}</span>
                    </td>
                    <td className="py-4 text-on-surface-variant font-semibold uppercase tracking-wider text-[9px]">{ticket.category}</td>
                    <td className="py-4 text-on-surface truncate max-w-[150px] font-semibold">{ticket.title}</td>
                    <td className="py-4 text-on-surface-variant">{ticket.date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        ticket.priority === 'Urgent'
                          ? 'bg-red-500/10 text-red-400'
                          : ticket.priority === 'Important'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-white/5 text-on-surface-variant'
                      }`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-on-surface">{ticket.assignedTo}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${getStatusStyle(ticket.status)}`}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => openDetails(ticket)}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold rounded-lg transition-all"
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Reply Modal */}
      {showReplyModal && selectedComplaint && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[550px] w-full p-6 md:p-8 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <h4 className="text-xl font-bold text-on-surface">Ticket #{selectedComplaint.id} Details</h4>
              <button onClick={() => setShowReplyModal(false)} className="text-on-surface-variant hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="space-y-4 text-xs">
              <div className="space-y-1.5 bg-white/[0.01] border border-white/5 p-4 rounded-2xl leading-relaxed text-on-surface-variant">
                <p><strong>Resident:</strong> {selectedComplaint.studentName} ({selectedComplaint.university})</p>
                <p><strong>Housing:</strong> {selectedComplaint.branchName} — Room {selectedComplaint.roomNumber}</p>
                <p><strong>Category:</strong> {selectedComplaint.category} (Filed: {selectedComplaint.date})</p>
                <p className="pt-2 border-t border-white/5 text-on-surface text-sm">
                  <strong className="block text-xs font-semibold text-on-surface-variant mb-1">Description:</strong>
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-on-surface">
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Assign Staff</label>
                  <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-on-surface">
                    <option value="Unassigned">Unassigned</option>
                    <option value="Maintenance Electrician">Maintenance Electrician</option>
                    <option value="Mess Manager">Mess Manager</option>
                    <option value="Housekeeping maid">Housekeeping maid</option>
                    <option value="Sanitary Sweeper">Sanitary Sweeper</option>
                    <option value="Hostel Warden">Hostel Warden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-surface-container border border-white/10 rounded-xl text-on-surface">
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Admin Reply Note</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Provide details of steps taken or queries regarding the issue..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowReplyModal(false)} className="px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl shadow-lg">Update Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

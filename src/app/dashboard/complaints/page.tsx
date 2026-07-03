'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Complaint {
  id: number;
  title: string;
  category: string;
  description: string;
  status: string;
  date: string;
  roomNumber: string;
}

export default function ComplaintsPortal() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [expandedComplaint, setExpandedComplaint] = useState<number | null>(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
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
    fetchComplaints();
  }, []);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage({ text: 'Please fill in all form fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: 'Complaint registered successfully!', type: 'success' });
        setTitle('');
        setDescription('');
        fetchComplaints(); // Refresh list
      } else {
        setMessage({ text: data.error || 'Failed to submit complaint.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedComplaint === id) {
      setExpandedComplaint(null);
    } else {
      setExpandedComplaint(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Complaints Portal</h3>
        <p className="text-sm text-on-surface-variant mt-1">Submit maintenance tickets or report facility issues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket Submission Form */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-1 h-fit">
          <div className="pb-4 border-b border-white/5 mb-6">
            <h4 className="text-lg font-bold text-on-surface">New Ticket</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Describe your issue in detail for our support team.</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
              message.type === 'success'
                ? 'bg-tertiary-container/10 border-tertiary text-tertiary'
                : 'bg-error-container/10 border-error text-error'
            }`}>
              <span className="material-symbols-outlined text-[18px]">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 border border-white/10 rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
              >
                <option value="Maintenance" className="bg-surface-container-highest text-on-surface">Maintenance (AC, plumbing, electrical)</option>
                <option value="IT Services" className="bg-surface-container-highest text-on-surface">IT Services (WiFi, portal access)</option>
                <option value="Mess & Dining" className="bg-surface-container-highest text-on-surface">Mess & Dining</option>
                <option value="Housekeeping" className="bg-surface-container-highest text-on-surface">Housekeeping (Room cleaning, laundry)</option>
                <option value="Security" className="bg-surface-container-highest text-on-surface">Security & Safety</option>
              </select>
            </div>

            {/* Subject/Title */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken wall socket, water heater leakage"
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Detailed Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Please describe the issue, specifying exact locations if necessary..."
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Filing Complaint...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  File Complaint
                </>
              )}
            </button>
          </form>
        </div>

        {/* Complaints History List */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Registered Tickets</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Track status updates and resolution history of your complaints.</p>
            </div>
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
              <p className="mt-2 font-semibold text-on-surface">No tickets found!</p>
              <p className="text-xs mt-0.5 text-on-surface-variant">Your history is clean. You haven't registered any complaints.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((ticket) => {
                const isExpanded = expandedComplaint === ticket.id;
                return (
                  <div key={ticket.id} className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] overflow-hidden transition-all">
                    
                    {/* Ticket Header Row */}
                    <div
                      onClick={() => toggleExpand(ticket.id)}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary tracking-wider uppercase">#{ticket.id}</span>
                          <span className="text-xs text-on-surface-variant">• {ticket.date}</span>
                        </div>
                        <h5 className="font-bold text-on-surface">{ticket.title}</h5>
                        <p className="text-[10px] text-on-surface-variant/80 uppercase font-semibold tracking-wider">{ticket.category}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          ticket.status === 'Resolved'
                            ? 'bg-tertiary-container/20 text-tertiary'
                            : ticket.status === 'In Progress'
                            ? 'bg-secondary-container/20 text-secondary'
                            : 'bg-error-container/20 text-error'
                        }`}>
                          {ticket.status.toUpperCase()}
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant/65 text-[20px]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-white/[0.03] bg-white/[0.01] text-xs space-y-3">
                        <p className="text-on-surface-variant leading-relaxed">
                          <strong className="text-on-surface block mb-1">Issue Description:</strong>
                          {ticket.description}
                        </p>
                        <div className="pt-2 flex justify-between items-center text-[10px] text-on-surface-variant/60 font-semibold uppercase">
                          <span>Room No: {ticket.roomNumber}</span>
                          {ticket.status === 'Resolved' && (
                            <span className="text-tertiary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Resolved
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

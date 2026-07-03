'use client';

import React, { useState } from 'react';

interface SentNotice {
  id: number;
  title: string;
  sentTo: string;
  date: string;
  priority: string;
  status: string;
}

export default function AnnouncementsAdmin() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendTo, setSendTo] = useState('All Students');
  const [branchName, setBranchName] = useState('Branch 3');
  const [studentId, setStudentId] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [submitting, setSubmitting] = useState(false);

  // Mock list of past notices
  const [history, setHistory] = useState<SentNotice[]>([
    { id: 1, title: 'Hostel Rent Due Date Extended', sentTo: 'All Students', date: '01-07-2026', priority: 'Important', status: 'Delivered' },
    { id: 2, title: 'Shuttle route R-1 delayed by 20 mins', sentTo: 'Transport Users', date: '29-06-2026', priority: 'Normal', status: 'Delivered' },
    { id: 3, title: 'Urgent Room Relocation Notice', sentTo: 'Branch 3', date: '25-06-2026', priority: 'Urgent', status: 'Delivered' },
  ]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please fill in title and message fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          sendTo,
          branchName: sendTo === 'Specific Branch' ? branchName : undefined,
          studentId: sendTo === 'Specific Student' ? studentId : undefined,
          priority
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Notification dispatched successfully to ${data.count} targeted students!`);
        
        // Add to history list
        const todayStr = new Date().toLocaleDateString();
        setHistory(prev => [
          {
            id: prev.length + 1,
            title,
            sentTo: sendTo === 'Specific Branch' ? branchName : sendTo,
            date: todayStr,
            priority,
            status: 'Delivered'
          },
          ...prev
        ]);

        // Reset composer
        setTitle('');
        setMessage('');
      } else {
        alert(data.error || 'Failed to dispatch notification');
      }
    } catch (err) {
      alert('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Bulletins & Alerts</h3>
        <p className="text-sm text-on-surface-variant mt-1">Compose notices and push alert popups targeting specific student housing clusters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Notice Composer form */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-1 h-fit">
          <div className="pb-4 border-b border-white/5 mb-6">
            <h4 className="text-lg font-bold text-on-surface">Broadcast Bulletin</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Send a push notification directly to targeted portals.</p>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-5 text-xs">
            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mess Charges Update, Maintenance Schedule"
                required
                className="w-full px-4 py-2.5 bg-surface-container hover:bg-surface-container-high focus:bg-background border border-white/10 rounded-xl text-on-surface text-xs outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Audience</label>
              <select
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface outline-none"
              >
                <option value="All Students">All Enrolled Students</option>
                <option value="Specific Branch">Specific Branch Sector</option>
                <option value="Specific Student">Individual Student Profile</option>
                <option value="Fee Pending Students">Fee Pending / Overdue Defaulters</option>
                <option value="Transport Users">Transport Shuttle Passengers</option>
              </select>
            </div>

            {/* Branch Criteria Conditional */}
            {sendTo === 'Specific Branch' && (
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Branch</label>
                <select
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                >
                  {Array.from({ length: 20 }, (_, i) => `Branch ${i + 1}`).map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Student ID Conditional */}
            {sendTo === 'Specific Student' && (
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Target Student ID</label>
                <input
                  type="number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 6"
                  required
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface"
                />
              </div>
            )}

            {/* Priority level */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface outline-none"
              >
                <option value="Normal">Normal (Info notice)</option>
                <option value="Important">Important (Warning banner)</option>
                <option value="Urgent">Urgent (Critical alert popup)</option>
              </select>
            </div>

            {/* Content Message */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Announcement Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter detailed notice content..."
                rows={4}
                required
                className="w-full px-4 py-2.5 bg-surface-container hover:bg-surface-container-high focus:bg-background border border-white/10 rounded-xl text-on-surface resize-none outline-none focus:ring-1 focus:ring-primary-container"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Dispatching...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  Send Notification
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dispatch History List */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h4 className="text-lg font-bold text-on-surface">Bulletin Logs</h4>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
              {history.length} dispatches logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Notice Title</th>
                  <th className="py-3">Target Sent</th>
                  <th className="py-3">Date Dispatched</th>
                  <th className="py-3">Priority</th>
                  <th className="py-3">Dispatch Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((h) => (
                  <tr key={h.id}>
                    <td className="py-4 font-bold text-on-surface">{h.title}</td>
                    <td className="py-4 font-semibold text-on-surface">{h.sentTo}</td>
                    <td className="py-4 text-on-surface-variant">{h.date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        h.priority === 'Urgent'
                          ? 'bg-red-500/10 text-red-400'
                          : h.priority === 'Important'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-white/5 text-on-surface-variant'
                      }`}>
                        {h.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[8px] font-bold tracking-wider">
                        {h.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

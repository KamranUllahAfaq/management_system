'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface QueuedPayment {
  id: number;
  studentName: string;
  branchName: string;
  roomNumber: string;
  university: string;
  paymentMethod: string;
  transactionId: string;
  submittedAmount: number;
  paymentDate: string;
  status: string;
}

export default function PaymentVerification() {
  const [payments, setPayments] = useState<QueuedPayment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Action state
  const [selectedPayment, setSelectedPayment] = useState<QueuedPayment | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPayments(data.payments);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm('Approve this payment receipt? This will reduce the student balance due.')) return;
    
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: id, action: 'Approve', adminNote: 'Approved by admin' }),
      });

      if (res.ok) {
        alert('Payment verified and approved!');
        fetchQueue();
      } else {
        alert('Failed to approve payment');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: selectedPayment.id, action: 'Reject', adminNote }),
      });

      if (res.ok) {
        alert('Payment rejected. Student notified.');
        setShowRejectModal(false);
        setAdminNote('');
        fetchQueue();
      } else {
        alert('Failed to reject payment');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setProcessing(false);
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant font-semibold">
            <Link href="/admin/fees" className="hover:text-white transition-colors">Fees</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Payment Verification</span>
          </div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface mt-2">Payment Verification</h3>
          <p className="text-sm text-on-surface-variant mt-1">Review bank transfers and mobile wallet payment receipts submitted by students.</p>
        </div>
      </div>

      {/* Verification Queue Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Submissions Queue</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {payments.length} submissions pending
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm space-y-3">
            <span className="material-symbols-outlined text-[54px] text-tertiary">check_circle</span>
            <p className="font-bold text-on-surface text-base">Verification Queue Empty!</p>
            <p className="text-xs max-w-[320px] mx-auto leading-relaxed">All student payment submittals have been cleared and verified successfully.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Branch/Room</th>
                  <th className="py-3">University</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Transaction ID</th>
                  <th className="py-3">Submitted Amount</th>
                  <th className="py-3">Payment Date</th>
                  <th className="py-3">Action Queue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-secondary">
                        {p.studentName.charAt(0)}
                      </div>
                      {p.studentName}
                    </td>
                    <td className="py-4 font-semibold text-on-surface">
                      {p.branchName}
                      <span className="block text-[10px] text-on-surface-variant font-medium">Room {p.roomNumber}</span>
                    </td>
                    <td className="py-4 font-medium text-on-surface-variant">{p.university}</td>
                    <td className="py-4 font-medium text-on-surface-variant">{p.paymentMethod}</td>
                    <td className="py-4 font-mono font-bold text-on-surface">{p.transactionId}</td>
                    <td className="py-4 font-extrabold font-mono text-tertiary">{p.submittedAmount.toLocaleString()} PKR</td>
                    <td className="py-4 text-on-surface-variant">{p.paymentDate}</td>
                    <td className="py-4 space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => alert(`Showing receipt image mockup for TXN: ${p.transactionId}`)}
                        className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-bold rounded"
                      >
                        View Receipt
                      </button>
                      <button
                        disabled={processing}
                        onClick={() => handleApprove(p.id)}
                        className="px-2 py-1 bg-tertiary-container hover:bg-tertiary-container/85 text-on-tertiary-container text-[9px] font-bold rounded"
                      >
                        Approve
                      </button>
                      <button
                        disabled={processing}
                        onClick={() => {
                          setSelectedPayment(p);
                          setShowRejectModal(true);
                        }}
                        className="px-2 py-1 bg-error-container hover:bg-error-container/85 text-on-error-container text-[9px] font-bold rounded"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-[450px] w-full p-6 rounded-3xl space-y-5">
            <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Reject Submission</h4>
            <form onSubmit={handleReject} className="space-y-4 text-xs">
              <p className="text-on-surface-variant">Provide a reason for rejecting payment of <strong>PKR {selectedPayment.submittedAmount.toLocaleString()}</strong>.</p>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Rejection Note</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Invalid reference ID or receipt screenshot unreadable..."
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-on-surface resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 border border-white/10 rounded-lg">Cancel</button>
                <button type="submit" disabled={processing} className="px-4 py-2 bg-error-container hover:bg-error-container/85 text-on-error-container font-bold rounded-lg">Reject Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

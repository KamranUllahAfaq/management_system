'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Payment {
  id: number;
  month: string;
  dueDate: string;
  amount: number;
  status: string;
  paymentDate: string | null;
  transactionId: string | null;
  method: string | null;
}

export default function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.payments);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Payment Ledger</h3>
          <p className="text-sm text-on-surface-variant mt-1">Full statement of accounts and transaction records.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/fee" className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface rounded-xl flex items-center gap-2 font-semibold text-xs transition-all">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Dues Summary
          </Link>
        </div>
      </div>

      {/* History Card Container */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Transaction History</h4>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
            {payments.length} invoices total
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-[48px] opacity-40">receipt</span>
            <p className="mt-2">No payment statements found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3">Billing Month</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Date Paid</th>
                  <th className="py-3">Transaction ID</th>
                  <th className="py-3">Method</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface">{payment.month}</td>
                    <td className="py-4 font-semibold text-on-surface">{payment.amount.toLocaleString()} PKR</td>
                    <td className="py-4 text-xs text-on-surface-variant">
                      {payment.paymentDate || '—'}
                    </td>
                    <td className="py-4 text-xs font-mono text-on-surface-variant/80">
                      {payment.transactionId || '—'}
                    </td>
                    <td className="py-4 text-xs text-on-surface-variant">
                      {payment.method || '—'}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider ${
                        payment.status === 'Paid'
                          ? 'bg-tertiary-container/20 text-tertiary'
                          : 'bg-error-container/20 text-error'
                      }`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {payment.status === 'Paid' ? (
                        <button
                          onClick={() => alert(`Downloading receipt for ${payment.month}... (Reference: ${payment.transactionId})`)}
                          className="p-2 text-secondary-fixed-dim hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          title="Download Receipt"
                        >
                          <span className="material-symbols-outlined text-[20px]">download</span>
                        </button>
                      ) : (
                        <Link
                          href={`/dashboard/fee/submit?month=${payment.month}`}
                          className="px-3 py-1.5 bg-primary-container/20 hover:bg-primary-container/30 text-primary-container text-[11px] font-bold rounded-lg transition-all"
                        >
                          Pay Due
                        </Link>
                      )}
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

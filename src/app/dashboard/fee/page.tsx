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

export default function FeeStatus() {
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

  const pendingPayments = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
  const paidPayments = payments.filter((p) => p.status === 'Paid');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Fee Status</h3>
          <p className="text-sm text-on-surface-variant mt-1">Review your invoices and overall financial standing.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/fee/history" className="px-5 py-2.5 glass-card hover:bg-white/10 rounded-xl flex items-center gap-2 font-semibold text-xs transition-all">
            <span className="material-symbols-outlined text-[16px]">history</span>
            Payment History
          </Link>
          {pendingPayments.length > 0 && (
            <Link href="/dashboard/fee/submit" className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-primary/10 transition-all">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              Submit Fee
            </Link>
          )}
        </div>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Outstanding Balance */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-primary-container/20 text-primary-container rounded-xl">
              <span className="material-symbols-outlined text-[24px]">price_check</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
              user.balanceDue > 0 ? 'bg-error-container/20 text-error' : 'bg-tertiary-container/20 text-tertiary'
            }`}>
              {user.balanceDue > 0 ? 'PENDING' : 'PAID'}
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Outstanding Balance</h4>
            <p className="text-2xl font-extrabold text-on-surface mt-1">
              {user.balanceDue.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PKR</span>
            </p>
          </div>
        </div>

        {/* Total Dues Incurred */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-secondary-container/20 text-secondary rounded-xl">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Total Invoices</h4>
            <p className="text-2xl font-extrabold text-on-surface mt-1">
              {payments.length} <span className="text-xs font-normal text-on-surface-variant">Invoices</span>
            </p>
          </div>
        </div>

        {/* Total Paid */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-tertiary-container/20 text-tertiary rounded-xl">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Total Amount Paid</h4>
            <p className="text-2xl font-extrabold text-on-surface mt-1">
              {(paidPayments.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PKR</span>
            </p>
          </div>
        </div>

        {/* Hostel Rent Slab */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2.5 bg-white/5 text-on-surface-variant rounded-xl">
              <span className="material-symbols-outlined text-[24px]">home_work</span>
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Monthly Room Rent</h4>
            <p className="text-2xl font-extrabold text-on-surface mt-1">
              11,000 <span className="text-xs font-normal text-on-surface-variant">PKR</span>
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Invoices List */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div className="pb-4 border-b border-white/5">
            <h4 className="text-lg font-bold text-on-surface">Unpaid Invoices</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Fees currently pending or overdue.</p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[48px] text-tertiary">check_circle</span>
              <p className="mt-3 font-semibold text-on-surface">All bills are cleared!</p>
              <p className="text-xs mt-1 text-on-surface-variant">No pending invoices found for your account.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((invoice) => (
                <div key={invoice.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">{invoice.month}</span>
                    <h5 className="text-lg font-extrabold text-on-surface">{invoice.amount.toLocaleString()} PKR</h5>
                    <p className="text-xs text-on-surface-variant">Due Date: {invoice.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-error-container/20 text-error text-[10px] font-bold tracking-wider">
                      PENDING
                    </span>
                    <Link href={`/dashboard/fee/submit?month=${invoice.month}`} className="px-4 py-2 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs shadow-lg shadow-primary/10 transition-all">
                      Pay Bill
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box / Notes */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-1 space-y-6">
          <div className="pb-4 border-b border-white/5">
            <h4 className="text-lg font-bold text-on-surface">Payment Guide</h4>
          </div>
          
          <div className="space-y-4 text-xs text-on-surface-variant leading-relaxed">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>Fees are due by the 10th of every month. Late submissions attract a fine of 500 PKR.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>You can pay via Bank Transfer, Credit Card, or Mobile Wallet scans.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>Online transactions take up to 24 hours to reconcile. Keep the transaction ID as proof.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link href="/dashboard/fee/history" className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all">
              <span className="material-symbols-outlined text-[16px]">receipt</span>
              Receipt Ledger
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

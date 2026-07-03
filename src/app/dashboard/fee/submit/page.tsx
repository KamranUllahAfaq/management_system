'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Payment {
  id: number;
  month: string;
  amount: number;
  status: string;
}

function SubmitFeeForm() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.payments);
          const pending = data.payments.filter((p: Payment) => p.status === 'Pending' || p.status === 'Overdue');
          
          // Pre-select month if passed in query string, otherwise select the first pending month
          const queryMonth = searchParams.get('month');
          if (queryMonth && pending.some((p: Payment) => p.month === queryMonth)) {
            setSelectedMonth(queryMonth);
          } else if (pending.length > 0) {
            setSelectedMonth(pending[0].month);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (!user) return null;

  const pendingPayments = payments.filter((p) => p.status === 'Pending' || p.status === 'Overdue');
  const activePayment = pendingPayments.find((p) => p.month === selectedMonth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth || !accountNumber || !accountTitle) {
      setMessage({ text: 'Please fill in all form details.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          amount: activePayment ? activePayment.amount : 11000.0,
          method: paymentMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        setMessage({ text: `Fee for ${selectedMonth} paid successfully! Redirecting...`, type: 'success' });
        setTimeout(() => {
          router.push('/dashboard/fee/history');
        }, 2000);
      } else {
        setMessage({ text: data.error || 'Failed to submit fee payment.', type: 'error' });
        setSubmitting(false);
      }
    } catch (err) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[800px] mx-auto">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Submit Fee</h3>
        <p className="text-sm text-on-surface-variant mt-1">Make an online hostel fee payment securely.</p>
      </div>

      {/* Main Layout Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
        
        {/* Message Alert */}
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

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
          </div>
        ) : pendingPayments.length === 0 ? (
          <div className="py-12 text-center space-y-4">
            <span className="material-symbols-outlined text-[54px] text-tertiary">verified_user</span>
            <h4 className="text-lg font-bold text-on-surface">No Pending Dues!</h4>
            <p className="text-sm text-on-surface-variant max-w-[400px] mx-auto leading-relaxed">
              All outstanding payments have been settled. Thank you for your timely clearance.
            </p>
            <div className="pt-2">
              <Link href="/dashboard/fee" className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-semibold rounded-xl text-xs transition-all">
                Back to Dues
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Select Month */}
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                  Bill Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 border border-white/10 rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                >
                  {pendingPayments.map((p) => (
                    <option key={p.id} value={p.month} className="bg-surface-container-highest text-on-surface">
                      {p.month} ({p.amount.toLocaleString()} PKR)
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 border border-white/10 rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                >
                  <option value="Bank Transfer" className="bg-surface-container-highest text-on-surface">Bank Transfer</option>
                  <option value="Scan to Pay" className="bg-surface-container-highest text-on-surface">Scan to Pay (EasyPaisa/JazzCash)</option>
                  <option value="Credit Card" className="bg-surface-container-highest text-on-surface">Credit Card</option>
                </select>
              </div>

              {/* Billing Amount (Display Only) */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-semibold text-on-surface-variant">Amount Payable</h5>
                  <p className="text-[10px] text-on-surface-variant/60">Hostel room rent + facilities charges</p>
                </div>
                <p className="text-2xl font-extrabold text-on-surface">
                  {activePayment ? activePayment.amount.toLocaleString() : '11,000'} PKR
                </p>
              </div>

              {/* Bank/Account Details */}
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                  {paymentMethod === 'Credit Card' ? 'Card Number' : 'Account/Phone Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={paymentMethod === 'Credit Card' ? 'XXXX XXXX XXXX XXXX' : 'Enter account or wallet number'}
                  className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                  required
                />
              </div>

              {/* Account Title */}
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                  {paymentMethod === 'Credit Card' ? 'Cardholder Name' : 'Account Title'}
                </label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder={paymentMethod === 'Credit Card' ? 'John Doe' : 'Enter account title'}
                  className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                  required
                />
              </div>

            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
              <Link href="/dashboard/fee" className="px-5 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface font-semibold rounded-xl text-xs transition-all flex items-center justify-center">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center gap-2 text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    Verify & Pay
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SubmitFee() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">progress_activity</span>
      </div>
    }>
      <SubmitFeeForm />
    </Suspense>
  );
}

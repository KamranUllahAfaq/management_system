'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface BranchFeeSummary {
  branchName: string;
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  partialPaidStudents: number;
  overdueStudents: number;
  expectedRevenue: number;
  receivedAmount: number;
  remainingDues: number;
  totalFine: number;
}

export default function FeesManagement() {
  const [summaries, setSummaries] = useState<BranchFeeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Totals
  const [totals, setTotals] = useState({
    monthlyFee: 31250000,
    paidAmount: 28800000,
    pendingDues: 2450000,
    totalFines: 120000,
    overdueStudents: 45,
    partialPayments: 24
  });

  useEffect(() => {
    fetch('/api/admin/branches')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const liveSummaries: BranchFeeSummary[] = data.branches.map((b: any) => {
            // Distribute mock ratios for realistic reports
            const paid = Math.floor(b.totalStudents * 0.75);
            const pending = Math.floor(b.totalStudents * 0.15);
            const partial = Math.floor(b.totalStudents * 0.07);
            const overdue = b.totalStudents - paid - pending - partial;

            return {
              branchName: b.name,
              totalStudents: b.totalStudents,
              paidStudents: paid,
              pendingStudents: pending,
              partialPaidStudents: partial,
              overdueStudents: overdue,
              expectedRevenue: b.monthlyRevenue,
              receivedAmount: Math.max(0, b.monthlyRevenue - b.pendingDues),
              remainingDues: b.pendingDues,
              totalFine: overdue * 1000
            };
          });

          setSummaries(liveSummaries);

          // Calculate totals
          const totalExpected = liveSummaries.reduce((acc, curr) => acc + curr.expectedRevenue, 0);
          const totalReceived = liveSummaries.reduce((acc, curr) => acc + curr.receivedAmount, 0);
          const totalRemaining = liveSummaries.reduce((acc, curr) => acc + curr.remainingDues, 0);
          const totalFines = liveSummaries.reduce((acc, curr) => acc + curr.totalFine, 0);
          const totalOverdue = liveSummaries.reduce((acc, curr) => acc + curr.overdueStudents, 0);
          const totalPartial = liveSummaries.reduce((acc, curr) => acc + curr.partialPaidStudents, 0);

          setTotals({
            monthlyFee: totalExpected > 0 ? totalExpected : 31250000,
            paidAmount: totalReceived > 0 ? totalReceived : 28800000,
            pendingDues: totalRemaining > 0 ? totalRemaining : 2450000,
            totalFines: totalFines > 0 ? totalFines : 120000,
            overdueStudents: totalOverdue > 0 ? totalOverdue : 45,
            partialPayments: totalPartial > 0 ? totalPartial : 24
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Fees Management</h3>
          <p className="text-sm text-on-surface-variant mt-1">Monitor billing summary sheets, collections, and dues by branch.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/fees/list" className="px-5 py-2.5 bg-gradient-to-r from-red-500/20 via-green-500/10 to-blue-500/10 border border-white/10 text-white font-bold rounded-xl text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            Student Ledger
          </Link>
          <Link href="/admin/fees/verification" className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            Verify Submissions
          </Link>
        </div>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Collections expected vs received */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Expected Revenue</span>
          <p className="text-2xl font-extrabold text-on-surface">
            PKR {totals.monthlyFee.toLocaleString()}
          </p>
          <div className="pt-2 flex justify-between text-xs border-t border-white/5 text-on-surface-variant">
            <span>Collected:</span>
            <span className="text-tertiary font-bold">PKR {totals.paidAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Outstanding Dues */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Outstanding Dues</span>
          <p className="text-2xl font-extrabold text-error">
            PKR {totals.pendingDues.toLocaleString()}
          </p>
          <div className="pt-2 flex justify-between text-xs border-t border-white/5 text-on-surface-variant">
            <span>Accumulated Fines:</span>
            <span className="text-orange-400 font-bold">PKR {totals.totalFines.toLocaleString()}</span>
          </div>
        </div>

        {/* Defaulter Statistics */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Account Health</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-2xl font-extrabold text-error block">{totals.overdueStudents}</span>
              <span className="text-[9px] text-on-surface-variant uppercase font-bold">Overdue Invoices</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-secondary block">{totals.partialPayments}</span>
              <span className="text-[9px] text-on-surface-variant uppercase font-bold">Partial Paid</span>
            </div>
          </div>
        </div>

      </div>

      {/* Branch Table */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <h4 className="text-lg font-bold text-on-surface">Branch Billing Sheet</h4>
          <div className="flex gap-2">
            <button onClick={() => alert('Fee Ledger Generated for July 2026')} className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold">
              Generate Monthly Fees
            </button>
            <button onClick={() => alert('Sent Fee Reminders to all outstanding accounts')} className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold">
              Send Reminders
            </button>
          </div>
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
                  <th className="py-3">Branch Name</th>
                  <th className="py-3">Total Residents</th>
                  <th className="py-3">Paid Accounts</th>
                  <th className="py-3">Partial Paid</th>
                  <th className="py-3">Pending Dues</th>
                  <th className="py-3">Overdue Bills</th>
                  <th className="py-3">Expected Revenue</th>
                  <th className="py-3">Received Amount</th>
                  <th className="py-3">Outstanding</th>
                  <th className="py-3">Fines Imposed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {summaries.map((summary) => (
                  <tr key={summary.branchName} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface">{summary.branchName}</td>
                    <td className="py-4 font-semibold text-on-surface">{summary.totalStudents}</td>
                    <td className="py-4 font-medium text-tertiary">{summary.paidStudents}</td>
                    <td className="py-4 font-medium text-secondary">{summary.partialPaidStudents}</td>
                    <td className="py-4 font-medium text-on-surface-variant">{summary.pendingStudents}</td>
                    <td className="py-4 font-bold text-error">{summary.overdueStudents}</td>
                    <td className="py-4 font-bold font-mono text-on-surface">{summary.expectedRevenue.toLocaleString()} PKR</td>
                    <td className="py-4 font-semibold font-mono text-tertiary">{(summary.receivedAmount).toLocaleString()} PKR</td>
                    <td className="py-4 font-semibold font-mono text-error">{summary.remainingDues.toLocaleString()} PKR</td>
                    <td className="py-4 font-semibold font-mono text-orange-400">{summary.totalFine.toLocaleString()} PKR</td>
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

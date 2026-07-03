'use client';

import React from 'react';

export default function ReportsAndAnalytics() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:p-6 print:bg-white print:text-black">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print:hidden">
        <div>
          <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Reports & Analytics</h3>
          <p className="text-sm text-on-surface-variant mt-1">Generate system-wide operational summaries, cashflow audits, and student counts.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Report
          </button>
          <button
            onClick={() => alert('Exporting statement ledger to Excel...')}
            className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            Export Excel
          </button>
        </div>
      </div>

      {/* Grid of Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Revenue by Branch Report */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>Branch-wise Revenue Report</span>
            <span className="material-symbols-outlined text-[16px] text-cyan-400">payments</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Branch 3 (Girls):</span>
              <span className="font-bold text-on-surface">PKR 3,100,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Branch 5 (Girls):</span>
              <span className="font-bold text-on-surface">PKR 2,750,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Branch 11 (Boys):</span>
              <span className="font-bold text-on-surface">PKR 1,562,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Branch 12 (Boys):</span>
              <span className="font-bold text-on-surface">PKR 2,450,000</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Total Revenue:</span>
              <span>PKR 9,862,000</span>
            </div>
          </div>
        </div>

        {/* Students by University Report */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>University Demographics</span>
            <span className="material-symbols-outlined text-[16px] text-green-400">school</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">COMSATS:</span>
              <span className="font-bold text-on-surface">450 students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">IQRA University:</span>
              <span className="font-bold text-on-surface">280 students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">ABASYN University:</span>
              <span className="font-bold text-on-surface">190 students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">SHIFA / KMU / Other:</span>
              <span className="font-bold text-on-surface">330 students</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Total Residing:</span>
              <span>1,250 students</span>
            </div>
          </div>
        </div>

        {/* Complaints and Maintenance Audits */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>Complaints & Ticket Reports</span>
            <span className="material-symbols-outlined text-[16px] text-orange-400">report_problem</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Room Issue & Maintenance:</span>
              <span className="font-bold text-on-surface">18 tickets (resolved: 14)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">IT & Internet Services:</span>
              <span className="font-bold text-on-surface">10 tickets (resolved: 9)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Mess & Catering Services:</span>
              <span className="font-bold text-on-surface">6 tickets (resolved: 6)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Housekeeping Cleaning:</span>
              <span className="font-bold text-on-surface">4 tickets (resolved: 4)</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Resolution Rate:</span>
              <span className="text-tertiary">86.8% Efficiency</span>
            </div>
          </div>
        </div>

        {/* Transport Usage Summary */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>Transport Shuttle Report</span>
            <span className="material-symbols-outlined text-[16px] text-cyan-400">directions_bus</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Daily Bus Users:</span>
              <span className="font-bold text-on-surface">450 students</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Active Shuttle Routes:</span>
              <span className="font-bold text-on-surface">2 routes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Addon Fee collected:</span>
              <span className="font-bold text-on-surface">PKR 2,250,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Driver Salaries:</span>
              <span className="font-bold text-on-surface">PKR 90,000</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Net Transport Surplus:</span>
              <span className="text-tertiary">PKR 2,160,000</span>
            </div>
          </div>
        </div>

        {/* Staff Payroll Audits */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>Staff Payroll Audit</span>
            <span className="material-symbols-outlined text-[16px] text-purple-400">badge</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Wardens Salaries (40):</span>
              <span className="font-bold text-on-surface">PKR 1,860,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Mess Staff Wages (40):</span>
              <span className="font-bold text-on-surface">PKR 1,140,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Housekeeping Cleaning (40):</span>
              <span className="font-bold text-on-surface">PKR 760,000</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Total Payroll Cost:</span>
              <span className="text-error">PKR 3,760,000</span>
            </div>
          </div>
        </div>

        {/* Cashflow audit summary */}
        <div className="glass-card p-6 rounded-3xl space-y-4 print:border print:border-black/10">
          <h4 className="text-sm font-bold text-on-surface pb-2.5 border-b border-white/5 flex justify-between items-center">
            <span>Cashflow Reconciliation</span>
            <span className="material-symbols-outlined text-[16px] text-pink-400">analytics</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Gross Fee Collections:</span>
              <span className="font-bold text-on-surface">PKR 28,800,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Transport Collections:</span>
              <span className="font-bold text-on-surface">PKR 2,250,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Operating Salaries Out:</span>
              <span className="text-error font-bold">- PKR 3,760,000</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-white/5 font-extrabold text-on-surface">
              <span>Net Operative Surplus:</span>
              <span className="text-tertiary">PKR 27,290,000</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

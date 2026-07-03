'use client';

import React, { useState } from 'react';

export default function SettingsAdmin() {
  const [companyName, setCompanyName] = useState('Royal Group of Hostel');
  const [location, setLocation] = useState('Islamabad Hostel City');
  const [phone, setPhone] = useState('+92 345 5551234');
  const [email, setEmail] = useState('contact@royalhostels.pk');
  const [address, setAddress] = useState('Sector H-12, Hostel City, Islamabad');
  
  // Payment methods
  const [bankAccount, setBankAccount] = useState('Askari Bank - 098765432101');
  const [easypaisaNumber, setEasypaisaNumber] = useState('0300 1234567');
  const [jazzcashNumber, setJazzcashNumber] = useState('0312 9876543');

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert('Global ERP settings saved successfully!');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[900px] mx-auto">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Global Settings</h3>
        <p className="text-sm text-on-surface-variant mt-1">Configure company profiles, payment gateways, room rent slabs, and system parameters.</p>
      </div>

      {/* Main Settings Panel */}
      <div className="glass-card p-6 md:p-8 rounded-3xl">
        <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
          
          {/* Section: Company Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-secondary pb-1.5 border-b border-white/5 uppercase tracking-wider">Hostel Company Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hostel Location Hub</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Hotline Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Main Headquarters Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Payment Method Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-secondary pb-1.5 border-b border-white/5 uppercase tracking-wider">Payment Method Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bank Transfer Details</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Easypaisa Mobile Wallet</label>
                <input
                  type="text"
                  value={easypaisaNumber}
                  onChange={(e) => setEasypaisaNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">JazzCash Mobile Wallet</label>
                <input
                  type="text"
                  value={jazzcashNumber}
                  onChange={(e) => setJazzcashNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Fee Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-secondary pb-1.5 border-b border-white/5 uppercase tracking-wider">Fine & Fee Parameter Guidelines</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Late payment fine (PKR/month)</label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Invoice grace period (days after 1st)</label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg"
            >
              {saving ? 'Saving System parameters...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

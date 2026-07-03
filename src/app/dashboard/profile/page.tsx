'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setEmergencyContact(user.emergencyContact || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mobile, emergencyContact }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error occurred. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-[800px]">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Student Profile</h3>
        <p className="text-sm text-on-surface-variant mt-1">Manage your personal details and contact information.</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/5">
          <div className="w-20 h-20 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[48px]">account_circle</span>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-2xl font-bold text-on-surface">{user.name}</h4>
            <p className="text-sm text-primary font-semibold tracking-wider uppercase">{user.rollNumber}</p>
            <p className="text-xs text-on-surface-variant">{user.hostelName}</p>
          </div>
        </div>

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

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Input: Name (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-3 bg-surface-container-lowest/50 border border-white/5 rounded-xl text-sm text-on-surface-variant/60 cursor-not-allowed outline-none"
              />
            </div>

            {/* Input: Roll Number (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Roll Number
              </label>
              <input
                type="text"
                value={user.rollNumber}
                disabled
                className="w-full px-4 py-3 bg-surface-container-lowest/50 border border-white/5 rounded-xl text-sm text-on-surface-variant/60 cursor-not-allowed outline-none"
              />
            </div>

            {/* Input: Hostel Name (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Hostel Name
              </label>
              <input
                type="text"
                value={user.hostelName}
                disabled
                className="w-full px-4 py-3 bg-surface-container-lowest/50 border border-white/5 rounded-xl text-sm text-on-surface-variant/60 cursor-not-allowed outline-none"
              />
            </div>

            {/* Input: Room Number (Disabled) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Room Assigned
              </label>
              <input
                type="text"
                value={`Room ${user.roomNumber}`}
                disabled
                className="w-full px-4 py-3 bg-surface-container-lowest/50 border border-white/5 rounded-xl text-sm text-on-surface-variant/60 cursor-not-allowed outline-none"
              />
            </div>

            {/* Input: Email (Editable) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
            </div>

            {/* Input: Mobile (Editable) */}
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
            </div>

            {/* Input: Emergency Contact (Editable) */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Emergency Contact Number
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

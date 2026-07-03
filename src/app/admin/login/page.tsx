'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';

export default function AdminLogin() {
  const { adminLogin } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminLogin(username, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Dynamic Red-Green-Blue Cinematic Spotlights */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="w-full max-w-[450px] space-y-8 z-10">
        
        {/* Branding Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 via-green-400 to-blue-500 items-center justify-center shadow-lg shadow-black/45 mb-2">
            <span className="material-symbols-outlined text-[36px] text-white">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline-md text-on-surface">
            Admin Portal
          </h2>
          <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">
            Royal Group of Hostel
          </p>
        </div>

        {/* Form Box */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
          <p className="text-xs text-on-surface-variant/80 leading-relaxed text-center mb-6">
            “Login to manage hostel branches, students, rooms, fees, transport, staff and complaints.”
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container/10 border border-error text-error text-xs flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input: Username */}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
                Admin Username / Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                  required
                />
              </div>
            </div>

            {/* Input: Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Default password is "password"')}
                  className="text-[10px] font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant/60 text-[18px]">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-surface-container text-primary-container focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-xs text-on-surface-variant cursor-pointer select-none">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Admin Login
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-on-surface-variant/80 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Portal Home
          </Link>
        </div>

      </div>
    </div>
  );
}

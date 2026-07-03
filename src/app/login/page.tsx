'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
        setSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background relative flex flex-col justify-center items-center p-6 overflow-hidden">
      {/* Decorative Blur Background Circles */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-secondary-container/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] glass-panel p-8 rounded-3xl glow-shadow relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-extrabold font-headline-md text-primary tracking-tight">Royal Group</h1>
            <p className="text-xs font-label-sm text-on-surface-variant/70 mt-1 uppercase tracking-wider">Islamabad Hostel City</p>
          </Link>
          <h2 className="text-xl font-bold mt-8 text-on-surface">Student Portal Sign In</h2>
          <p className="text-xs text-on-surface-variant mt-1">Enter your credentials to access your account.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container/20 border border-error-container text-error text-xs flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mb-2">
              Username or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px]">
                person
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[11px] text-primary hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-surface-container/60 hover:bg-surface-container/90 focus:bg-background border border-white/10 focus:border-primary-container rounded-xl text-sm transition-all outline-none text-on-surface focus:ring-1 focus:ring-primary-container"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface p-1 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 mt-2 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-bold rounded-xl transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Back to Home & Admin Portal */}
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center px-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[16px] transform group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Home
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 hover:underline transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px]">
              admin_panel_settings
            </span>
            Admin Portal
          </Link>
        </div>
      </div>
    </main>
  );
}

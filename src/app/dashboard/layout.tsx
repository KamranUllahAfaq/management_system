'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  fillIcon?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { name: 'Profile', href: '/dashboard/profile', icon: 'person', fillIcon: true },
  { name: 'Room Details', href: '/dashboard/room', icon: 'bed' },
  { name: 'Fee Status', href: '/dashboard/fee', icon: 'payments' },
  { name: 'Transport', href: '/dashboard/transport', icon: 'directions_bus' },
  { name: 'Complaints', href: '/dashboard/complaints', icon: 'report_problem' },
  { name: 'Notifications', href: '/dashboard/notifications', icon: 'notifications' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client-side redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">
          progress_activity
        </span>
        <p className="text-on-surface-variant font-medium mt-4">Loading student profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Side Navigation Bar (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-4 bg-surface-container/40 backdrop-blur-xl border-r border-white/10 z-50">
        <div className="mb-10 px-2">
          <Link href="/dashboard" className="block">
            <h1 className="text-2xl font-bold font-headline-md text-primary-container tracking-tight">Royal Group</h1>
            <p className="text-[11px] font-label-sm text-on-surface-variant/70">Islamabad Hostel City</p>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary/20 scale-95 font-semibold'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-primary-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110"
                  style={item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
          <Link
            href="/dashboard/fee/submit"
            className="w-full py-2.5 bg-primary-container hover:bg-primary-container/85 text-on-primary-container font-semibold rounded-lg shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            Submit Fee
          </Link>
          <button
            onClick={logout}
            className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 text-on-surface-variant hover:text-red-400 font-semibold rounded-lg border border-white/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-surface-container/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div>
          <h1 className="text-lg font-bold text-primary-container font-headline-md leading-none">Royal Group</h1>
          <p className="text-[10px] text-on-surface-variant/70">Student Portal</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/notifications" className="relative p-1 text-on-surface-variant hover:text-primary-container">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-on-surface-variant hover:text-primary-container"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-background/95 backdrop-blur-md z-30 flex flex-col p-6 space-y-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3 pt-6 border-t border-white/10">
            <Link
              href="/dashboard/fee/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-primary-container text-on-primary-container font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              Submit Fee
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full py-3 bg-white/5 text-red-400 font-semibold rounded-lg border border-red-500/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/10 bg-surface/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-sm text-on-surface-variant font-medium">Welcome back,</span>
              <h2 className="text-lg font-bold text-on-surface font-headline-md">{user.name}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-fixed-dim text-[11px] font-bold tracking-wider">
              ROOM {user.roomNumber}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-on-surface-variant hover:text-primary transition-all duration-300 group"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-container rounded-full ring-2 ring-background"></span>
            </Link>

            <Link href="/dashboard/profile" className="flex items-center gap-3 group">
              <div className="text-right">
                <span className="block text-xs font-semibold text-on-surface-variant group-hover:text-primary-container transition-colors">
                  {user.rollNumber}
                </span>
                <span className="block text-[10px] text-on-surface-variant/60">{user.hostelName}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center hover:border-primary-container transition-all">
                <span className="material-symbols-outlined text-primary text-[24px]">account_circle</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

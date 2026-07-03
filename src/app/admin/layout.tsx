'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const adminNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Branches', href: '/admin/branches', icon: 'store' },
  { name: 'Students', href: '/admin/students', icon: 'group' },
  { name: 'Rooms', href: '/admin/rooms', icon: 'meeting_room' },
  { name: 'Fees Management', href: '/admin/fees', icon: 'payments' },
  { name: 'Payment Verification', href: '/admin/fees/verification', icon: 'verified_user' },
  { name: 'Complaints', href: '/admin/complaints', icon: 'report_problem' },
  { name: 'Transport', href: '/admin/transport', icon: 'directions_bus' },
  { name: 'Wardens', href: '/admin/wardens', icon: 'shield_person' },
  { name: 'Staff', href: '/admin/staff', icon: 'badge' },
  { name: 'Reports', href: '/admin/reports', icon: 'analytics' },
  { name: 'Notifications', href: '/admin/notifications', icon: 'campaign' },
  { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, loading, adminLogout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!loading && !isAdminAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAdminAuthenticated, loading, pathname, router]);

  // Bypass layout wrapper for login screen
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <span className="material-symbols-outlined animate-spin text-primary text-[48px]">
          progress_activity
        </span>
        <p className="text-on-surface-variant font-medium mt-4">Loading Admin Portal...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative">
      {/* Cinematic Accent Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-red-500/5 via-green-500/2 to-blue-500/5 pointer-events-none z-0"></div>
      
      {/* Side Navigation Bar (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col p-4 bg-surface-container/30 backdrop-blur-xl border-r border-white/5 z-50 overflow-y-auto">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-500 via-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
            R
          </div>
          <div>
            <h1 className="text-sm font-bold font-headline-md text-on-surface leading-tight">Royal Admin</h1>
            <p className="text-[10px] text-on-surface-variant/75">Hostel ERP Ecosystem</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group text-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500/20 via-green-500/10 to-blue-500/10 border-l-2 border-primary text-white font-bold'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-white/5">
          <button
            onClick={adminLogout}
            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/20 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Exit Admin Panel
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface-container/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-red-500 via-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
            R
          </div>
          <h1 className="text-sm font-bold text-on-surface font-headline-md leading-none">Royal Admin</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-on-surface-variant hover:text-white"
        >
          <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[52px] bg-background/95 backdrop-blur-md z-30 flex flex-col p-6 space-y-3 overflow-y-auto">
          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-on-surface-variant hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                adminLogout();
              }}
              className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg border border-red-500/20 flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined">logout</span>
              Exit Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen z-10 relative">
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

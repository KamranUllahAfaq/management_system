'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  loading: boolean;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAdminSession = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        const data = await res.json();
        setIsAdminAuthenticated(data.authenticated);
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch (e) {
      console.error(e);
      setIsAdminAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminSession();
  }, []);

  const adminLogin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        router.push('/admin/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (e) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const adminLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false);
    router.push('/admin/login');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, loading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

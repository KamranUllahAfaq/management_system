'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Route {
  id: number;
  routeNumber: string;
  destination: string;
  departure: string;
  status: string;
  driverName: string;
  contact: string;
}

export default function TransportFacility() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transport')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRoutes(data.routes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Transport Facility</h3>
        <p className="text-sm text-on-surface-variant mt-1">Track daily university bus routes and shuttle schedules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shuttle Schedule Table */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Bus Routes</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Shuttles operating between hostel city and university.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
              {routes.length} routes active
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
            </div>
          ) : routes.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[48px] opacity-40">directions_bus</span>
              <p className="mt-2">No active bus schedules found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3">Route</th>
                    <th className="py-3">Destination</th>
                    <th className="py-3">Departure Times</th>
                    <th className="py-3">Driver Details</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {routes.map((route) => (
                    <tr key={route.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-bold text-on-surface flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-tertiary-container/10 border border-tertiary-container/20 flex items-center justify-center text-tertiary font-bold text-xs">
                          {route.routeNumber}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-on-surface">{route.destination}</td>
                      <td className="py-4 text-xs font-medium text-on-surface-variant">{route.departure}</td>
                      <td className="py-4 space-y-0.5">
                        <span className="block text-xs font-semibold text-on-surface">{route.driverName}</span>
                        <span className="block text-[10px] text-on-surface-variant/80">{route.contact}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          route.status === 'Active'
                            ? 'bg-tertiary-container/20 text-tertiary'
                            : 'bg-error-container/20 text-error'
                        }`}>
                          {route.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transport Guidelines Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-1 space-y-6">
          <div className="pb-4 border-b border-white/5">
            <h4 className="text-lg font-bold text-on-surface">Shuttle Rules</h4>
          </div>
          
          <div className="space-y-4 text-xs text-on-surface-variant leading-relaxed">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>Please arrive at the hostel pickup point 5 minutes before scheduled departure.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>Carry your student ID card or hostel portal card at all times for boarding validation.</p>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">check_circle</span>
              <p>Shuttles run strictly on academic working days (Monday - Friday). Schedule may change during exams.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <a
              href="tel:+923455551234"
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              Contact Transport Desk
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

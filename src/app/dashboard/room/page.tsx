'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function RoomDetails() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Room Details</h3>
        <p className="text-sm text-on-surface-variant mt-1">Information about your room allotment and roommates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Room Specifications Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[28px]">bed</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-wider">
                ALLOTED
              </span>
            </div>
            
            <h4 className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">Room Assigned</h4>
            <p className="text-4xl font-extrabold text-on-surface mt-1">Room {user.roomNumber}</p>
            <p className="text-sm text-on-surface-variant mt-2 font-medium">{user.hostelName}</p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-on-surface-variant">Sharing Type</span>
                <span className="text-sm font-semibold text-on-surface">Quad (4-Bed Shared)</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-on-surface-variant">Attached Bath</span>
                <span className="text-sm font-semibold text-tertiary">Yes</span>
              </div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
                <span className="text-xs text-on-surface-variant">Air Conditioning</span>
                <span className="text-sm font-semibold text-tertiary">Yes (Split AC)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">Internet Access</span>
                <span className="text-sm font-semibold text-tertiary">Yes (Fiber WiFi)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-secondary-container/5 rounded-2xl border border-secondary/15 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">info</span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Contact hostel manager for room changes or maintenance requests.
            </p>
          </div>
        </div>

        {/* Roommates Card */}
        <div className="glass-card p-6 md:p-8 rounded-3xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Your Roommates</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Students sharing Room {user.roomNumber} with you.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-on-surface text-xs font-bold">
              {user.roommates.length} occupancies
            </span>
          </div>

          {user.roommates.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[48px] opacity-40">group_off</span>
              <p className="mt-2">No roommates allocated yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                    <th className="py-3">Name</th>
                    <th className="py-3">Roll Number</th>
                    <th className="py-3">Mobile</th>
                    <th className="py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {user.roommates.map((roommate) => (
                    <tr key={roommate.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-semibold text-on-surface flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-secondary">
                          {roommate.name.charAt(0)}
                        </div>
                        {roommate.name}
                      </td>
                      <td className="py-4 text-xs font-semibold text-primary">{roommate.rollNumber}</td>
                      <td className="py-4 text-xs text-on-surface-variant">{roommate.mobile}</td>
                      <td className="py-4 text-xs text-on-surface-variant">{roommate.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

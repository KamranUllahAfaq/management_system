'use client';

import React, { useEffect, useState } from 'react';

interface TransportUser {
  id: number;
  name: string;
  branchName: string;
  roomNumber: string;
  university: string;
  contact: string;
  transportUsing: boolean;
  routeName: string;
  pickupPoint: string;
  dropOffPoint: string;
  driverName: string;
  driverContact: string;
  vehicleNumber: string;
  transportFee: number;
  status: string;
}

interface Route {
  id: number;
  routeNumber: string;
  destination: string;
  departure: string;
  status: string;
  driverName: string;
  contact: string;
}

export default function TransportManagement() {
  const [users, setUsers] = useState<TransportUser[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransportDetails = async () => {
    try {
      const res = await fetch('/api/admin/transport');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUsers(data.students);
          setRoutes(data.routes);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportDetails();
  }, []);

  const handleRemoveTransport = async (id: number) => {
    if (!confirm('Remove transport subscription for this student?')) return;

    try {
      const res = await fetch('/api/admin/transport', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: id, action: 'Remove' }),
      });

      if (res.ok) {
        alert('Transport removed!');
        fetchTransportDetails();
      }
    } catch (e) {
      alert('Network error');
    }
  };

  // Stats calculations
  const totalUsersCount = users.length;
  const totalRoutesCount = routes.length;
  const totalDriversCount = routes.length;
  const transportRevenue = totalUsersCount * 5000.0;
  const nonTransportCount = 1250 - totalUsersCount; // sample offset

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h3 className="text-3xl font-extrabold font-headline-md text-on-surface">Transport Desk</h3>
        <p className="text-sm text-on-surface-variant mt-1">Manage university shuttle routes, drivers, and student passenger manifests.</p>
      </div>

      {/* Summary Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Shuttle Passengers</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{totalUsersCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Non-Transport Students</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{nonTransportCount.toLocaleString()}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Active Routes</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{totalRoutesCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">Assigned Drivers</span>
          <span className="text-2xl font-extrabold text-on-surface mt-1 block">{totalDriversCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl text-center border-l-2 border-l-cyan-400">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Transport Revenue</span>
          <span className="text-xl font-extrabold text-cyan-400 mt-1.5 block">PKR {transportRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Section: Route List Grid */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Route Management</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route) => (
            <div key={route.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      {route.routeNumber}
                    </span>
                    <h5 className="font-bold text-on-surface">{route.destination}</h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[9px] font-bold tracking-wider">
                    {route.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Driver Name:</span>
                    <span className="text-on-surface font-medium">{route.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver Contact:</span>
                    <span className="text-on-surface font-medium">{route.contact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timings:</span>
                    <span className="text-on-surface font-semibold text-secondary">{route.departure}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Student Passengers Table */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-6">
        <h4 className="text-lg font-bold text-on-surface pb-3 border-b border-white/5">Passenger Manifest</h4>

        {loading ? (
          <div className="py-12 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-[28px]">progress_activity</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-6 text-center text-on-surface-variant text-sm">
            <p>No students registered for transport yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3">Student Name</th>
                  <th className="py-3">Branch/Room</th>
                  <th className="py-3">University</th>
                  <th className="py-3">Assigned Route</th>
                  <th className="py-3">Stops (Pickup/Dropoff)</th>
                  <th className="py-3">Driver Info</th>
                  <th className="py-3">Addon Fee</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((passenger) => (
                  <tr key={passenger.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 font-bold text-on-surface">{passenger.name}</td>
                    <td className="py-4 font-semibold text-on-surface">
                      {passenger.branchName}
                      <span className="block text-[10px] text-on-surface-variant font-medium">Room {passenger.roomNumber}</span>
                    </td>
                    <td className="py-4 font-medium text-on-surface-variant">{passenger.university}</td>
                    <td className="py-4 font-bold text-cyan-400">{passenger.routeName}</td>
                    <td className="py-4 text-on-surface-variant leading-relaxed">
                      <span className="block text-[10px] text-on-surface font-medium">From: {passenger.pickupPoint}</span>
                      <span className="block text-[9px] text-on-surface-variant">To: {passenger.dropOffPoint}</span>
                    </td>
                    <td className="py-4 space-y-0.5">
                      <span className="block text-on-surface font-semibold">{passenger.driverName}</span>
                      <span className="block text-[9px] text-on-surface-variant/80">{passenger.driverContact}</span>
                    </td>
                    <td className="py-4 font-bold font-mono text-on-surface">{passenger.transportFee.toLocaleString()} PKR</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleRemoveTransport(passenger.id)}
                        className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[9px] font-bold border border-red-500/20 rounded-lg transition-all"
                      >
                        Remove Transport
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

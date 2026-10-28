'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: number;
  receiptNumber: string;
  totalAmount: string | number;
  paymentMethod: string;
  createdAt: string;
}

interface DashboardData {
  totalSales: number;
  transactionCount: number;
  activePrescriptions: number;
  lowStockItems: number;
  recentTransactions: Transaction[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalSales: 0,
    transactionCount: 0,
    activePrescriptions: 0,
    lowStockItems: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard/kpis', {
          headers: { 'x-tenant-id': '1' },
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const json = await response.json();
        setData(json);
        setIsOffline(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full px-6 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your daily pharmacy performance, sales metrics, and inventory status.</p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
          <span>⚠️</span>
          <span>Notice: Operating in offline mode. Live backend metrics could not be retrieved from port 5000.</span>
        </div>
      )}

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm">💰</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gross Sales</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {loading ? '...' : `KES ${data.totalSales.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm">🧾</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Completed Orders</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {loading ? '...' : data.transactionCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg text-sm">💊</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Prescriptions</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {loading ? '...' : data.activePrescriptions}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 bg-red-50 text-red-600 rounded-lg text-sm">⚠️</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Low Stock Alerts</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {loading ? '...' : data.lowStockItems}
          </p>
        </div>
      </div>

      {/* Two-Column Grid: Quick Actions & System Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Grid */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <Link 
              href="/dashboard/pos" 
              className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</span>
              <span className="text-sm font-bold text-gray-800">Open POS Terminal</span>
            </Link>

            <Link 
              href="/dashboard/medicines/new" 
              className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</span>
              <span className="text-sm font-bold text-gray-800">Add Medicine</span>
            </Link>

            <Link 
              href="/dashboard/inventory" 
              className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/40 hover:border-purple-200 transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</span>
              <span className="text-sm font-bold text-gray-800">Manage Inventory</span>
            </Link>

            <Link 
              href="/dashboard/payments" 
              className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-amber-50/40 hover:border-amber-200 transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💳</span>
              <span className="text-sm font-bold text-gray-800">View Payments</span>
            </Link>
          </div>
        </div>

        {/* System Ready Dark Card */}
        <div className="bg-[#0b192c] text-white p-8 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold tracking-tight mb-2">SmartCare Pharmacy System Ready</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your core commerce engine is fully operational. You can securely process sales, manage multi-branch inventory, and track financial transactions in real-time.
            </p>
          </div>

          <div className="space-y-2.5 relative z-10 pt-6 mt-6 border-t border-white/10 text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300">API Services: <strong className="text-white">Online (Port 5000)</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300">Database Connection: <strong className="text-white">Secure (PostgreSQL via Drizzle)</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-gray-300">Tenant Context: <strong className="text-white">Active (Nairobi Branch)</strong></span>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-600/20 blur-2xl pointer-events-none"></div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent POS Sales & Transactions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Live feed capturing M-Pesa, Cash, and Card sales.</p>
          </div>
          <Link href="/dashboard/payments" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            View All Transactions &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Receipt Number</th>
                <th className="px-6 py-3 text-left">Payment Method</th>
                <th className="px-6 py-3 text-left">Timestamp</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading recent activity...</td>
                </tr>
              ) : data.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No recent sales recorded yet. Head over to the POS terminal to make a sale!</td>
                </tr>
              ) : (
                data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{tx.receiptNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 uppercase">
                        {tx.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      KES {parseFloat(tx.totalAmount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
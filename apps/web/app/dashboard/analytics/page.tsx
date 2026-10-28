'use client';

import { useEffect, useState, JSX } from 'react';

interface TrendItem {
  label: string;
  sales: number;
}

interface AnalyticsData {
  period: string;
  todaySales: string;
  todayTransactionsCount: number;
  grossProfit: string;
  totalStockQuantity: number;
  inventoryValuation: string;
  pendingInsuranceClaims: string;
  outstandingSupplierBalance: string;
  salesBreakdown: {
    cash: string;
    mpesa: string;
    card: string;
  };
  trendLabel: string;
  dailyTrend: TrendItem[];
}

export default function AnalyticsPage(): JSX.Element {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/analytics?period=${period}`, {
          headers: { 'x-tenant-id': '1' },
        });
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const json = await response.json();
        setData(json);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Could not connect to backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  // Determine appropriate grid columns based on the dataset length
  const gridColsClass = data?.dailyTrend.length === 12 
    ? 'grid-cols-6 sm:grid-cols-12' 
    : data?.dailyTrend.length === 4 
      ? 'grid-cols-4' 
      : 'grid-cols-6 sm:grid-cols-7';

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section with Timeframe Selector */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Executive Analytics</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Real-time pharmacy performance metrics, valuation, and financial summaries.</p>
        </div>
        
        {/* Time Period Filter Buttons */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1 self-start md:self-auto">
          {(['day', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${
                period === p 
                  ? 'bg-[#366498] text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-gray-500 font-medium animate-pulse">Crunching numbers for the selected {period}...</div>
      ) : data ? (
        <>
          {/* Top KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full">
            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue ({period})</p>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">KES {parseFloat(data.todaySales || '0').toLocaleString()}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Transaction Volume</span>
                <span className="text-[#366498] font-bold">{data.todayTransactionsCount || 0} sales</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Profit ({period})</p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#62C02A] mt-2">KES {parseFloat(data.grossProfit || '0').toLocaleString()}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Estimated Margin</span>
                <span className="text-emerald-600 font-bold">~35.2%</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory Valuation</p>
                <h3 className="text-2xl sm:text-3xl font-black text-[#366498] mt-2">KES {parseFloat(data.inventoryValuation || '0').toLocaleString()}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Total Catalog Units</span>
                <span className="text-gray-900 font-bold">{data.totalStockQuantity || 0} items</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Claims</p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">KES {parseFloat(data.pendingInsuranceClaims || '0').toLocaleString()}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Third-Party Payers</span>
                <span className="text-amber-700 font-bold">Awaiting Review</span>
              </div>
            </div>
          </div>

          {/* Secondary Metrics & Dynamic Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{data.trendLabel}</h3>
                <p className="text-xs text-gray-400 mb-6 capitalize">Showing performance trend for this {period}</p>
              </div>
              <div className={`grid ${gridColsClass} gap-2 sm:gap-3 items-end h-56 pt-6 border-b border-gray-100 overflow-x-auto pb-2`}>
                {data.dailyTrend.map((item, index) => {
                  const maxSales = Math.max(...(data.dailyTrend.map(d => d.sales) || [100]));
                  const heightPercent = Math.max(Math.round((item.sales / maxSales) * 100), 12);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 h-full justify-end group min-w-[32px]">
                      <div className="text-[9px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(item.sales / 1000).toFixed(1)}k
                      </div>
                      <div 
                        style={{ height: `${heightPercent}%` }} 
                        className="w-full bg-[#366498] rounded-t-xl transition-all group-hover:bg-[#23456b]"
                      ></div>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-600 truncate w-full text-center">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-gray-700">M-Pesa</span>
                      <span className="text-[#366498]">KES {parseFloat(data.salesBreakdown.mpesa || '0').toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#366498] h-full rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-gray-700">Cash</span>
                      <span className="text-[#62C02A]">KES {parseFloat(data.salesBreakdown.cash || '0').toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#62C02A] h-full rounded-full" style={{ width: '46%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span className="text-gray-700">Card / Bank</span>
                      <span className="text-purple-600">KES {parseFloat(data.salesBreakdown.card || '0').toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>Supplier Balance Due</span>
                  <span className="font-bold text-gray-900">KES {parseFloat(data.outstandingSupplierBalance || '0').toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
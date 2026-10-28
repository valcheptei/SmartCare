'use client';

import { useEffect, useState, JSX } from 'react';

interface ReportData {
  type: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export default function ReportsPage(): JSX.Element {
  const [reportType, setReportType] = useState<string>('sales');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchReport = async (type: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`http://localhost:5000/api/reports?type=${type}`, {
        headers: { 'x-tenant-id': '1' },
      });
      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(reportType);
  }, [reportType]);

  const handleExportCSV = () => {
    if (!report) return;
    
    const csvContent = [
      report.columns.join(','),
      ...report.rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${report.type}-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Enterprise Reports</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Generate, view, and export operational, financial, and compliance reports.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={!report || loading}
            className="px-5 py-3 bg-[#62C02A] hover:bg-[#57ad25] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 w-full">
        {[
          { id: 'sales', label: 'Sales Report' },
          { id: 'inventory', label: 'Inventory & Expiry' },
          { id: 'financial', label: 'Financial & Profit' },
          { id: 'insurance', label: 'Insurance Claims' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              reportType === tab.id 
                ? 'bg-[#366498] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Report Data Table Container */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-black text-gray-900 text-lg">{report?.title || 'Report Details'}</h3>
          <span className="text-xs font-semibold text-gray-500">Tenant ID: 1 (Main Branch)</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 font-medium animate-pulse">Compiling report data...</div>
        ) : report && report.rows.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {report.columns.map((col, index) => (
                    <th key={index} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-6 py-4 text-sm ${cellIndex === 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-gray-500">No records found for this report type.</div>
        )}
      </div>
    </div>
  );
}
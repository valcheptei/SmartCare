'use client';

import { useEffect, useState, JSX } from 'react';
import { Loader2, Download, Calendar, ShieldAlert } from 'lucide-react';

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
  
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`, {
        headers: { 
          'x-tenant-id': '1',
          'x-user-role': 'admin' 
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }
      
      setReport(data);
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Could not connect to backend server.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleExportCSV = () => {
    if (!report || report.rows.length === 0) return;
    
    const csvContent = [
      report.columns.join(','),
      ...report.rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartCare_${report.type}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Enterprise Reports</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Generate, view, and export operational and financial reports.</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-end sm:items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 shadow-sm">
            <div className="flex items-center pl-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
              />
            </div>
            <span className="text-gray-300 font-bold">→</span>
            <div className="flex items-center pr-2">
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-gray-700 focus:ring-0 cursor-pointer"
              />
            </div>
            <button 
              onClick={fetchReport}
              className="ml-2 px-3 py-1.5 bg-[#366498] text-white text-xs font-bold rounded-lg hover:bg-[#2a4d75] transition-colors"
            >
              Apply Filter
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={!report || loading || report.rows.length === 0}
            className="w-full sm:w-auto px-5 py-3 bg-[#62C02A] hover:bg-[#57ad25] text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 w-full">
        {[
          { id: 'sales', label: 'Detailed Sales Summary' },
          { id: 'financial', label: 'Financial & Gross Profit' },
          { id: 'insurance', label: 'Insurance Claims' },
          { id: 'inventory', label: 'Inventory & Expiry' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm border ${
              reportType === tab.id 
                ? 'bg-[#366498] text-white border-[#366498]' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h3 className="font-black text-gray-900 text-lg">{report?.title || 'Report Details'}</h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/50 px-3 py-1 rounded-full w-fit">
            Showing records for: {startDate} to {endDate}
          </span>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-500 font-medium">
            <Loader2 className="h-8 w-8 animate-spin text-[#366498]" />
            Compiling secure report data...
          </div>
        ) : report && report.rows.length > 0 ? (
          <div className="w-full overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="bg-gray-50/90 backdrop-blur-sm border-b border-gray-200">
                  {report.columns.map((col, index) => (
                    <th key={index} className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50/50 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-6 py-4 text-sm whitespace-nowrap ${cellIndex === 0 ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <span className="text-4xl opacity-40 mb-3">📄</span>
            <p className="text-base font-bold text-gray-700">No records found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your date filters for this report type.</p>
          </div>
        )}
      </div>
    </div>
  );
}
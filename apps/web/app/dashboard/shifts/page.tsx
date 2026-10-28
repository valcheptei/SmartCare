'use client';

import { useEffect, useState } from 'react';

interface Shift {
  id: number;
  userId: number;
  userName: string;
  startTime: string;
  endTime: string | null;
  openingCash: string;
  expectedCash?: string | null;
  actualCash?: string | null;
  variance?: string | null;
  status: string;
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals State
  const [isStartModalOpen, setStartModalOpen] = useState(false);
  const [isEndModalOpen, setEndModalOpen] = useState(false);
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  
  // Form State
  const [openingCash, setOpeningCash] = useState('');
  const [actualCash, setActualCash] = useState('');
  const [reconciliationNotes, setReconciliationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Current Logged-in User
  const currentUser = { id: 1, name: 'Mary Chemtai' };

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/shifts', {
        headers: { 'x-tenant-id': '1' },
      });
      if (!response.ok) throw new Error('Failed to fetch shifts');
      const data = await response.json();
      setShifts(Array.isArray(data) ? data : data.data || data.shifts || []);
    } catch (err) {
      setError('Could not load shifts. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/shifts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': '1' },
        body: JSON.stringify({ 
          userId: currentUser.id, 
          userName: currentUser.name, 
          openingCash: parseFloat(openingCash) 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setStartModalOpen(false);
      setOpeningCash('');
      fetchShifts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/shifts/${activeShift.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': '1' },
        body: JSON.stringify({ 
          userId: currentUser.id,
          actualCash: parseFloat(actualCash),
          notes: reconciliationNotes
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setEndModalOpen(false);
      setActualCash('');
      setReconciliationNotes('');
      setActiveShift(null);
      fetchShifts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeShifts = Array.isArray(shifts) ? shifts : [];

  // Simulate expected cash for the UI before submission (Opening + KES 15,000 in mock sales)
  const simulatedExpectedCash = activeShift ? parseFloat(activeShift.openingCash) + 15000 : 0;
  const currentVariance = actualCash ? parseFloat(actualCash) - simulatedExpectedCash : 0;

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Cashier Shifts</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Monitor active registers and clock-ins.</p>
        </div>
        <button 
          onClick={() => { setError(''); setStartModalOpen(true); }}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#366498] hover:bg-[#23456b] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>⏱️</span> Start New Shift
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Syncing shift data...</div>
        ) : safeShifts.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50 mb-4">📭</span>
            <h3 className="text-xl font-bold text-gray-900">No shifts recorded</h3>
            <p className="text-sm text-gray-500 mt-2">Start a new shift to open the register.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time (In - Out)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Opening Cash</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Variance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {safeShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">{shift.userName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {shift.userId}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        shift.status === 'active' ? 'bg-[#CBEBD0] text-[#4d9921] border border-[#62C02A]/20' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {shift.status === 'active' ? '🟢 Active' : '⚪ Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">
                      <div className="font-medium">{new Date(shift.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                      {shift.endTime && <div className="text-gray-500 text-xs mt-1">out: {new Date(shift.endTime).toLocaleTimeString([], { timeStyle: 'short' })}</div>}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      KES {parseFloat(shift.openingCash).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium">
                      {shift.status === 'closed' ? (
                        <span className={parseFloat(shift.variance || '0') < 0 ? 'text-red-600' : 'text-green-600'}>
                          KES {parseFloat(shift.variance || '0').toLocaleString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {shift.status === 'active' && currentUser.id === shift.userId && (
                        <button 
                          onClick={() => { setActiveShift(shift); setEndModalOpen(true); }}
                          className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#366498] hover:bg-[#366498] hover:text-white border border-[#366498]/30 hover:border-[#366498] rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Clock Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Start Shift Modal */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900">Start Cashier Shift</h3>
              <button onClick={() => setStartModalOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleStartShift} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Opening Till Cash (KES)</label>
                <input 
                  type="number" step="0.01" required value={openingCash} onChange={(e) => setOpeningCash(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#366498]" 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setStartModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#62C02A] text-white text-sm font-bold rounded-xl disabled:opacity-50">
                  {isSubmitting ? 'Clocking In...' : 'Clock In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Shift Modal & Reconciliation */}
      {isEndModalOpen && activeShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900">Close Register & Reconcile</h3>
              <button onClick={() => setEndModalOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            
            <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Opening Cash</p>
                <p className="text-lg font-bold text-gray-900">KES {parseFloat(activeShift.openingCash).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Expected Closing Cash</p>
                <p className="text-lg font-bold text-[#366498]">KES {simulatedExpectedCash.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleEndShift} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Actual Physical Cash Count (KES)</label>
                <input 
                  type="number" step="0.01" required value={actualCash} onChange={(e) => setActualCash(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-medium text-gray-900 focus:ring-2 focus:ring-[#366498]" 
                />
              </div>

              {actualCash && (
                <div className={`p-4 rounded-xl border ${currentVariance < 0 ? 'bg-red-50 border-red-200' : currentVariance > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <p className="text-sm font-bold text-gray-700">Variance: 
                    <span className={`ml-2 ${currentVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      KES {currentVariance.toLocaleString()}
                    </span>
                  </p>
                </div>
              )}

              {currentVariance !== 0 && actualCash && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Reconciliation Notes (Required for variance)</label>
                  <textarea 
                    required={currentVariance !== 0}
                    value={reconciliationNotes} onChange={(e) => setReconciliationNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#366498]" 
                    rows={2} placeholder="Explain the cash variance..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEndModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#366498] text-white text-sm font-bold rounded-xl disabled:opacity-50">
                  {isSubmitting ? 'Processing...' : 'Confirm & Clock Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
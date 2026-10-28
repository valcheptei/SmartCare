'use client';

import { useEffect, useState, JSX } from 'react';
import Link from 'next/link';

interface PrescriptionItem {
  medicineName: string;
  prescribedQuantity: number;
  directions: string;
}

interface Prescription {
  id: number;
  patientId?: number;
  patient_id?: number;
  patientName?: string;
  patient_name?: string;
  prescriberName?: string;
  prescriber_name?: string;
  facility: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  items?: PrescriptionItem[];
}

export default function PrescriptionsPage(): JSX.Element {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      
      const data = await response.json();
      setPrescriptions(Array.isArray(data) ? data : data.data || data.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDispense = async (id: number) => {
    try {
      setProcessingId(id);
      const response = await fetch(`http://localhost:5000/api/prescriptions/${id}/dispense`, {
        method: 'POST',
        headers: { 'x-tenant-id': '1' },
      });

      if (!response.ok) throw new Error('Failed to update prescription status');

      await fetchPrescriptions();
      setSelectedRx(null);
    } catch (error) {
      console.error('Error dispensing prescription:', error);
      alert('Failed to complete dispensing workflow.');
    } finally {
      setProcessingId(null);
    }
  };

  const safePrescriptions = Array.isArray(prescriptions) ? prescriptions : [];

  const filteredPrescriptions = safePrescriptions.filter(rx => {
    if (activeTab === 'pending') return rx.status === 'PENDING_VERIFICATION';
    if (activeTab === 'verified') return rx.status === 'VERIFIED';
    if (activeTab === 'dispensed') return rx.status === 'DISPENSED';
    return true;
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Prescription Management</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Verify, review, and dispense clinical prescriptions.</p>
        </div>
        <Link 
          href="/dashboard/prescriptions/new"
          className="w-full md:w-auto px-6 py-3.5 bg-[#366498] hover:bg-[#23456b] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Register New Prescription
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 w-full">
        {['all', 'pending', 'verified', 'dispensed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all shadow-sm ${
              activeTab === tab 
                ? 'bg-[#366498] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Prescriptions Table / Cards Container */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading prescription records...</div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50 mb-4">📋</span>
            <h3 className="text-xl font-bold text-gray-900">No prescriptions found</h3>
            <p className="text-sm text-gray-500 mt-2">There are no records matching this filter.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prescriber</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Facility</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrescriptions.map((rx) => {
                  const date = rx.createdAt || rx.created_at;
                  const patientName = rx.patientName || rx.patient_name || `Patient #${rx.patientId || rx.patient_id}`;
                  const prescriber = rx.prescriberName || rx.prescriber_name;
                  
                  let badgeClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
                  if (rx.status === 'DISPENSED') badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                  if (rx.status === 'VERIFIED') badgeClass = "bg-blue-100 text-blue-800 border border-blue-200";
                  if (rx.status === 'CANCELLED') badgeClass = "bg-red-100 text-red-800 border border-red-200";

                  return (
                    <tr key={rx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                        {date ? new Date(date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900">{patientName}</p>
                        <p className="text-xs text-gray-400">ID: {rx.patientId || rx.patient_id || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-gray-800">
                        {prescriber || '-'}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {rx.facility || '-'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm ${badgeClass}`}>
                          {rx.status ? rx.status.replace(/_/g, ' ') : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setSelectedRx(rx)}
                          className="px-4 py-2 bg-white text-[#366498] hover:bg-[#366498] hover:text-white border border-[#366498]/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Review & Dispense
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Dispense Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#366498]">Clinical Verification</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">Prescription #{selectedRx.id}</h3>
              </div>
              <button onClick={() => setSelectedRx(null)} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">✕</button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Patient Name</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedRx.patientName || selectedRx.patient_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Prescribing Doctor</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedRx.prescriberName || selectedRx.prescriber_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Health Facility</p>
                  <p className="font-medium text-gray-800 mt-0.5">{selectedRx.facility}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Current Status</p>
                  <p className="font-bold text-[#366498] mt-0.5">{selectedRx.status.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Prescribed Medications</h4>
                <div className="space-y-3">
                  {selectedRx.items && selectedRx.items.length > 0 ? (
                    selectedRx.items.map((item, index) => (
                      <div key={index} className="p-4 rounded-2xl border border-gray-200/80 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900 text-base">{item.medicineName}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">Instructions: {item.directions}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-[#8BCBF0]/20 text-[#366498] rounded-xl text-xs font-bold self-start sm:self-center">
                          Qty: {item.prescribedQuantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No item details recorded.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRx(null)}
                className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Close
              </button>
              {selectedRx.status !== 'DISPENSED' && (
                <button 
                  onClick={() => handleDispense(selectedRx.id)}
                  disabled={processingId === selectedRx.id}
                  className="px-6 py-3 bg-[#62C02A] hover:bg-[#57ad25] text-white text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {processingId === selectedRx.id ? 'Processing Dispensing...' : '✓ Authorize & Dispense'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
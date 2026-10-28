'use client';

import { useEffect, useState, JSX } from 'react';
import Link from 'next/link';

interface Claim {
  id: number;
  patientName: string;
  insuranceProvider: string;
  policyNumber: string;
  claimAmount: string;
  status: string;
  submittedAt: string;
}

export default function InsurancePage(): JSX.Element {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/insurance', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch insurance claims');
      
      const data = await response.json();
      setClaims(Array.isArray(data) ? data : data.data || data.claims || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const safeClaims = Array.isArray(claims) ? claims : [];

  const filteredClaims = safeClaims.filter(claim => {
    if (activeTab === 'pending') return claim.status === 'PENDING';
    if (activeTab === 'approved') return claim.status === 'APPROVED';
    if (activeTab === 'rejected') return claim.status === 'REJECTED';
    return true;
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Insurance & Payer Claims</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Track and verify third-party medical insurance claims and reimbursements.</p>
        </div>
        <Link 
          href="/dashboard/insurance/new"
          className="w-full md:w-auto px-6 py-3.5 bg-[#366498] hover:bg-[#23456b] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Submit New Claim
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 w-full">
        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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

      {/* Claims Table Container */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading insurance claims...</div>
        ) : filteredClaims.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50 mb-4">🛡️</span>
            <h3 className="text-xl font-bold text-gray-900">No claims found</h3>
            <p className="text-sm text-gray-500 mt-2">There are no records matching this category.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Insurance Provider</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Policy Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Claim Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClaims.map((claim) => {
                  let badgeClass = "bg-yellow-100 text-yellow-800 border border-yellow-200";
                  if (claim.status === 'APPROVED') badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
                  if (claim.status === 'REJECTED') badgeClass = "bg-red-100 text-red-800 border border-red-200";

                  return (
                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-gray-900">
                        {claim.patientName}
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-gray-800">
                        {claim.insuranceProvider}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-600 font-mono">
                        {claim.policyNumber}
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-[#366498]">
                        KES {parseFloat(claim.claimAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm ${badgeClass}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 text-right">
                        {new Date(claim.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Batch {
  id: number;
  medicineName?: string;
  genericName?: string;
  sku?: string;
  batchNumber?: string;
  expiryDate?: string;
  currentQuantity?: number;
  quantityReceived?: number;
  purchaseCost?: number | string;
  sellingPrice?: number | string;
}

export default function InventoryPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/inventory/batches', {
          headers: { 'x-tenant-id': '1' },
        });
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server returned status ${response.status}: ${text}`);
        }
        
        const data = await response.json();
        const actualData = Array.isArray(data) ? data : data.data || data.batches || [];
        setBatches(actualData);
      } catch (error: any) {
        console.error('Error fetching batches:', error);
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory & Batches</h1>
          <p className="text-gray-500 text-sm mt-1">Track medicine batches, expiry dates, stock quantities, and pricing.</p>
        </div>
        <Link 
          href="/dashboard/inventory/new"
          className="bg-[#366498] text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-800 text-sm font-bold transition-all flex items-center gap-2"
        >
          + Receive Stock
        </Link>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
          ⚠️ Connection Error: {errorMsg}. Check your backend terminal on port 5000.
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by medicine name, batch #, or SKU..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Medicine Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Batch #</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cost / Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Qty</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">Loading inventory batches...</td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">No stock batches found.</td>
              </tr>
            ) : (
              batches.map((batch) => {
                const qty = batch.currentQuantity ?? 0;
                const isLowStock = qty < 10;
                const cost = Number(batch.purchaseCost || 0);
                const price = Number(batch.sellingPrice || 150);

                return (
                  <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-gray-900">{batch.medicineName || 'Unknown Medicine'}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {batch.sku || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 font-semibold">
                      {batch.batchNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <p className="text-xs text-gray-500">Cost: KES {cost.toFixed(2)}</p>
                      <p className="text-sm font-black text-[#62C02A] mt-0.5">Price: KES {price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-black">
                      {qty} <span className="text-xs font-normal text-gray-500">units</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        isLowStock ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isLowStock ? '⚠️ Low Stock' : '✓ In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
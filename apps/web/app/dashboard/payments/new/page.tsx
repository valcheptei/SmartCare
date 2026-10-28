'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiptNumber: `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    totalAmount: '',
    paymentMethod: 'M-Pesa',
    status: 'COMPLETED'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': '1' 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save payment');
      
      // Redirect back to the payments table on success
      router.push('/dashboard/payments');
      router.refresh();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Record New Payment</h1>
        <Link href="/dashboard/payments" className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Back to Payments
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
            <input 
              type="text" 
              value={formData.receiptNumber}
              onChange={(e) => setFormData({...formData, receiptNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input 
              type="number" 
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
              placeholder="e.g. 2500.00"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select 
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}
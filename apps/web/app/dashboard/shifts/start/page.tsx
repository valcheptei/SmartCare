'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartShiftPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '1', // Hardcoded for testing since auth is bypassed
    openingCash: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/shifts/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': '1',
        },
        body: JSON.stringify({
          userId: parseInt(formData.userId),
          openingCash: parseFloat(formData.openingCash) || 0
        }),
      });

      if (!response.ok) throw new Error('Failed to start shift');
      
      router.push('/shifts');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Start Cashier Shift</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID *</label>
            <input 
              required 
              type="number" 
              name="userId" 
              value={formData.userId} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Cash Balance (KES) *</label>
            <input 
              required 
              type="number" 
              step="0.01"
              min="0"
              name="openingCash" 
              value={formData.openingCash} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => router.push('/shifts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Shift'}
          </button>
        </div>
      </form>
    </div>
  );
}
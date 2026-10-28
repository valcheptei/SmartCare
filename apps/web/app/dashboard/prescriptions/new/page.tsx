'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '1', // Defaulting to 1 for development/testing without a patient picker
    prescriberName: '',
    facility: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': '1',
        },
        body: JSON.stringify({
          ...formData,
          patientId: parseInt(formData.patientId)
        }),
      });

      if (!response.ok) throw new Error('Failed to create prescription');
      
      router.push('/prescriptions');
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
        <h1 className="text-2xl font-bold text-gray-900">Capture Prescription</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID *</label>
            <input 
              required 
              type="number" 
              name="patientId" 
              value={formData.patientId} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescriber Name *</label>
            <input 
              required
              type="text" 
              name="prescriberName" 
              value={formData.prescriberName} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic / Facility</label>
            <input 
              type="text" 
              name="facility" 
              value={formData.facility} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => router.push('/prescriptions')}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
}
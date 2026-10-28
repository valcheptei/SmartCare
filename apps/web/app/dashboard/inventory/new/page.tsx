'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReceiveStockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<{id: number, medicineName: string}[]>([]);
  const [formData, setFormData] = useState({
    medicineId: '',
    batchNumber: '',
    expiryDate: '',
    quantityReceived: '',
    purchaseCost: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/medicines', { headers: { 'x-tenant-id': '1' } })
      .then(res => res.json())
      .then(data => {
        // Safely extract the array whether it's wrapped in { data: [...] } or returned directly
        const rawList = Array.isArray(data) ? data : data.data || data.medicines || [];
        setMedicines(rawList);
      })
      .catch(err => console.error('Error fetching medicines:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      medicineId: parseInt(formData.medicineId),
      quantityReceived: parseInt(formData.quantityReceived),
      currentQuantity: parseInt(formData.quantityReceived),
      purchaseCost: parseFloat(formData.purchaseCost) || 0
    };

    try {
      const response = await fetch('http://localhost:5000/api/inventory/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': '1',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to receive stock');
      
      router.push('/dashboard/inventory');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to record stock batch.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Safe guard to guarantee .map() never fails even if state is temporarily non-array
  const safeMedicines = Array.isArray(medicines) ? medicines : [];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Receive Stock (New Batch)</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Medicine *</label>
            <select 
              required
              name="medicineId"
              value={formData.medicineId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white"
            >
              <option value="">-- Select a medicine --</option>
              {safeMedicines.map(med => (
                <option key={med.id} value={med.id}>
                  {med.medicineName || (med as any).name || `Medicine ID: ${med.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
            <input 
              required 
              type="text" 
              name="batchNumber" 
              value={formData.batchNumber} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
            <input 
              required 
              type="date" 
              name="expiryDate" 
              value={formData.expiryDate} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Received *</label>
            <input 
              required 
              type="number" 
              min="1"
              name="quantityReceived" 
              value={formData.quantityReceived} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Purchase Cost</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              name="purchaseCost" 
              value={formData.purchaseCost} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => router.push('/dashboard/inventory')}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Receive Batch'}
          </button>
        </div>
      </form>
    </div>
  );
}
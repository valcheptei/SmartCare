'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMedicinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medicineName: '',
    genericName: '',
    category: '',
    dosageForm: '',
    strength: '',
    manufacturer: '',
    price: '',
    sku: '',
    stockQuantity: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using FormData to easily handle file upload alongside text fields
      const data = new FormData();
      data.append('medicineName', formData.medicineName);
      data.append('genericName', formData.genericName);
      data.append('category', formData.category);
      data.append('dosageForm', formData.dosageForm);
      data.append('strength', formData.strength);
      data.append('manufacturer', formData.manufacturer);
      data.append('price', formData.price || '100');
      data.append('sku', formData.sku || `MED-${Math.floor(1000 + Math.random() * 9000)}`);
      data.append('stockQuantity', formData.stockQuantity || '100');

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/medicines', {
        method: 'POST',
        headers: {
          'x-tenant-id': '1',
          // Do not set Content-Type header manually when using FormData; fetch handles it with boundaries automatically
        },
        body: data,
      });

      if (!response.ok) throw new Error('Failed to create medicine');
      
      router.push('/dashboard/medicines');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save medicine.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Add New Medicine</h1>
        <button 
          type="button" 
          onClick={() => router.push('/dashboard/medicines')}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          &larr; Back to Catalog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
            <input 
              required 
              type="text" 
              name="medicineName" 
              value={formData.medicineName} 
              onChange={handleChange}
              placeholder="e.g. Panadol Extra"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
            <input 
              type="text" 
              name="genericName" 
              value={formData.genericName} 
              onChange={handleChange}
              placeholder="e.g. Paracetamol + Caffeine"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              placeholder="e.g. Analgesic"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
            <input 
              type="text" 
              name="dosageForm" 
              value={formData.dosageForm} 
              onChange={handleChange}
              placeholder="e.g. Tablet, Syrup, Inhaler"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
            <input 
              type="text" 
              name="strength" 
              value={formData.strength} 
              onChange={handleChange}
              placeholder="e.g. 500mg"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
            <input 
              type="text" 
              name="manufacturer" 
              value={formData.manufacturer} 
              onChange={handleChange}
              placeholder="e.g. GSK"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (KES)</label>
            <input 
              type="number" 
              step="0.01"
              name="price" 
              value={formData.price} 
              onChange={handleChange}
              placeholder="e.g. 150.00"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock Quantity</label>
            <input 
              type="number" 
              name="stockQuantity" 
              value={formData.stockQuantity} 
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
        </div>

        {/* Product Image Upload Section */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image / Package Photo</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 text-center p-1">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Upload a clear PNG, JPG, or WebP photo of the medicine packaging.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button 
            type="button" 
            onClick={() => router.push('/dashboard/medicines')}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Saving Medicine...' : 'Save Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Medicine {
  id: number;
  name?: string;
  medicineName?: string;
  medicine_name?: string;
  genericName?: string;
  generic_name?: string;
  category?: string;
  categoryName?: string;
  category_name?: string;
  price?: number | string;
  sellingPrice?: number | string;
  selling_price?: number | string;
  sku?: string;
  stockQuantity?: number;
  stock_quantity?: number;
  stock?: number;
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/medicines', {
          headers: {
            'x-tenant-id': '1',
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch medicines');
        
        const data = await response.json();
        setMedicines(Array.isArray(data) ? data : data.data || data.medicines || []);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this medicine?\n\nNote: Medicines with existing sales history or active inventory cannot be deleted for security and audit transparency.");
    if (!confirmed) return;

    setProcessingId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/medicines/${id}`, {
        method: 'DELETE',
        headers: {
          'x-tenant-id': '1',
        },
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        // Catch foreign key violations from the database which prevent deletion of sold items
        if (response.status === 409 || errorText.includes('foreign key') || errorText.includes('constraint')) {
          alert("Action Denied: This medicine cannot be deleted because it is linked to past sales or active inventory batches. Deleting it would compromise financial records.");
          return;
        }
        throw new Error(errorText || 'Failed to delete medicine');
      }

      setMedicines(medicines.filter(m => m.id !== id));
      alert("Medicine deleted successfully.");
    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message || 'Could not delete medicine. Please check backend connection.'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const safeMedicines = Array.isArray(medicines) ? medicines : [];

  const filteredMedicines = safeMedicines.filter((med) => {
    const name = med.medicineName || med.name || med.medicine_name || '';
    const generic = med.genericName || med.generic_name || '';
    const category = med.category || med.categoryName || med.category_name || '';
    const sku = med.sku || '';
    const query = searchQuery.toLowerCase();
    
    return (
      name.toLowerCase().includes(query) ||
      generic.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      sku.toLowerCase().includes(query)
    );
  });

  const getPlaceholderImage = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0e7ff&color=4f46e5&size=100`;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Manage pharmacy items, pricing, SKU codes, and stock levels.</p>
        </div>
        <Link 
          href="/dashboard/medicines/new"
          className="bg-emerald-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-emerald-700 text-sm font-medium transition-colors flex items-center gap-2"
        >
          + Add Medicine
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines by name, generic, category, or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (KES)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Loading catalog...</td>
              </tr>
            ) : filteredMedicines.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No matching medicines found.</td>
              </tr>
            ) : (
              filteredMedicines.map((med) => {
                const name = med.medicineName || med.name || med.medicine_name || 'Unknown';
                const generic = med.genericName || med.generic_name || 'No generic';
                
                // Remove hardcoded fallbacks to expose real backend values
                const rawPrice = med.price ?? med.sellingPrice ?? med.selling_price ?? 0;
                const price = parseFloat(rawPrice.toString());
                
                const stock = med.stockQuantity ?? med.stock_quantity ?? med.stock ?? 0;
                const sku = med.sku || 'N/A';
                const category = med.category || med.categoryName || med.category_name || 'Uncategorized';
                
                const imgSrc = `/${name}.jpg`;

                return (
                  <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={imgSrc} 
                          alt={name} 
                          className="w-10 h-10 rounded-md object-contain bg-gray-50 border border-gray-200" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getPlaceholderImage(name);
                          }}
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{generic}</span>
                            <span className="font-mono text-gray-400">({sku})</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium px-2.5 py-1 rounded-full text-xs border ${
                        category === 'Uncategorized' 
                          ? 'bg-gray-100 text-gray-600 border-gray-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      KES {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={stock > 0 ? "text-emerald-600" : "text-red-500 font-bold"}>
                        {stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-4 pt-7">
                      <Link 
                        href={`/dashboard/medicines/${med.id}/edit`}
                        title="Edit" 
                        className="text-[#366498] hover:text-blue-800 transition-colors"
                      >
                        ✏️ Edit
                      </Link>
                      <button 
                        title="Delete" 
                        onClick={() => handleDelete(med.id)}
                        disabled={processingId === med.id}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {processingId === med.id ? '⏳...' : '🗑️ Delete'}
                      </button>
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
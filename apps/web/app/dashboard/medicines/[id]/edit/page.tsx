'use client';

import { useParams, useRouter } from 'next/navigation';

export default function EditMedicinePage() {
  const params = useParams();
  const router = useRouter();
  const medicineId = params.id;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-black text-gray-900">Edit Medicine</h1>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
          ID: {medicineId}
        </span>
      </div>

      <p className="text-gray-600 mb-6">
        This is the scaffold for your edit form. You can load the existing medicine details from the database here and provide inputs to update the name, category, and SKU.
      </p>

      <div className="flex justify-end gap-3 mt-8">
        <button 
          onClick={() => router.push('/dashboard/medicines')}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          className="px-5 py-2.5 rounded-xl bg-[#366498] text-white font-bold hover:bg-blue-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
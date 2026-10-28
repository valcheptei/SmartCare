'use client';

import { useEffect, useState, JSX } from 'react';
import Link from 'next/link';

interface Supplier {
  id: number;
  companyName?: string;
  company_name?: string;
  contactPerson?: string;
  contact_person?: string;
  phone: string;
  email: string;
}

export default function PurchasingPage(): JSX.Element {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/purchasing/suppliers', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch suppliers');
      
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : data.data || data.suppliers || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const filteredSuppliers = safeSuppliers.filter(s => {
    const compName = s.companyName || s.company_name || '';
    const contact = s.contactPerson || s.contact_person || '';
    return compName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.phone.includes(searchQuery) ||
           s.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Suppliers & Procurement</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Manage pharmaceutical vendors, distributors, and purchase orders.</p>
        </div>
        <Link 
          href="/dashboard/purchasing/new"
          className="w-full md:w-auto px-6 py-3.5 bg-[#366498] hover:bg-[#23456b] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Add New Supplier
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 w-full">
        <input 
          type="text"
          placeholder="Search by company name, contact person, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] outline-none transition-all shadow-sm"
        />
      </div>

      {/* Suppliers Table Container */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading suppliers directory...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50 mb-4">🏭</span>
            <h3 className="text-xl font-bold text-gray-900">No suppliers found</h3>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSuppliers.map((supplier) => {
                  const companyName = supplier.companyName || supplier.company_name;
                  const contactPerson = supplier.contactPerson || supplier.contact_person;

                  return (
                    <tr key={supplier.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-gray-900">
                        {companyName || '-'}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-700">
                        {contactPerson || '-'}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#366498]">
                        {supplier.phone || '-'}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {supplier.email || '-'}
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
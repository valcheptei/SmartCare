'use client';

import { useEffect, useState, JSX } from 'react';
import Link from 'next/link';

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

export default function CustomersPage(): JSX.Element {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/customers', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch customers');
      
      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : data.data || data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const safeCustomers = Array.isArray(customers) ? customers : [];
  
  const filteredCustomers = safeCustomers.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Customers & Loyalty</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5">Manage patient and retail customer directory and loyalty rewards.</p>
        </div>
        <Link 
          href="/dashboard/customers/new"
          className="w-full md:w-auto px-6 py-3.5 bg-[#366498] hover:bg-[#23456b] text-white text-sm sm:text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>+</span> Add New Customer
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 w-full">
        <input 
          type="text"
          placeholder="Search by customer name, phone number, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] outline-none transition-all shadow-sm"
        />
      </div>

      {/* Customers Table Container */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading customer profiles...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl opacity-50 mb-4">👥</span>
            <h3 className="text-xl font-bold text-gray-900">No customers found</h3>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Loyalty Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-bold text-gray-900">
                      {customer.fullName}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">
                      {customer.phone || '-'}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {customer.email || '-'}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-[#366498] text-right">
                      <span className="px-3 py-1 bg-[#8BCBF0]/20 rounded-full text-xs font-bold">
                        {customer.loyaltyPoints || 0} pts
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
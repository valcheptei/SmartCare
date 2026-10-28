'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Payment {
  id: number;
  receiptNumber?: string;
  receipt_number?: string;
  totalAmount?: string | number;
  total_amount?: string | number;
  paymentMethod?: string;
  payment_method?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch payments');
      
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : data.data || data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRecordSamplePayment = async () => {
    setSubmitting(true);
    try {
      const methods = ['M-Pesa', 'Cash', 'Bank Transfer', 'Insurance'];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      const randomAmount = Math.floor(300 + Math.random() * 4500);

      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': '1' 
        },
        body: JSON.stringify({
          totalAmount: randomAmount,
          paymentMethod: randomMethod,
          status: 'COMPLETED'
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to record payment');
      }
      
      await fetchPayments();
    } catch (error: any) {
      console.error('Error recording sample payment:', error);
      alert(`Could not record payment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const safePayments = Array.isArray(payments) ? payments : [];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payments & Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time ledger of all completed sales, payment methods, and receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRecordSamplePayment}
            disabled={submitting}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 text-sm font-bold transition-all disabled:opacity-50"
          >
            {submitting ? 'Recording...' : '+ Simulate POS Payment'}
          </button>
          <Link 
            href="/dashboard/payments/new"
            className="bg-[#366498] text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-blue-800 text-sm font-bold transition-all"
          >
            + Record Manual
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receipt #</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">Loading transactions...</td>
              </tr>
            ) : safePayments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                  No payment transactions found. Click <strong>Simulate POS Payment</strong> above to test live recording.
                </td>
              </tr>
            ) : (
              safePayments.map((payment) => {
                const date = payment.createdAt || payment.created_at;
                const receiptNum = payment.receiptNumber || payment.receipt_number;
                const method = payment.paymentMethod || payment.payment_method || 'Cash';
                const amount = payment.totalAmount || payment.total_amount || (payment as any).amount || '0';
                const status = payment.status || 'COMPLETED';
                
                let badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                if (status === 'PENDING') badgeClass = "bg-amber-50 text-amber-700 border border-amber-200";
                if (status === 'FAILED') badgeClass = "bg-red-50 text-red-700 border border-red-200";

                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {date ? new Date(date).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                      {receiptNum || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-semibold px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700">
                        {method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">
                      KES {parseFloat(amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${badgeClass}`}>
                        ✓ {status}
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
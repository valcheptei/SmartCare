'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: number;
  userId?: number;
  user_id?: number;
  action: string;
  recordType?: string;
  record_type?: string;
  recordId?: number | null;
  record_id?: number | null;
  createdAt?: string;
  created_at?: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/audit', {
        headers: { 'x-tenant-id': '1' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : data.data || data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleInjectLog = async () => {
    setSubmitting(true);
    try {
      const actions = ['CREATE', 'UPDATE', 'DELETE'];
      const types = ['MEDICINE', 'INVENTORY_BATCH', 'POS_SALE', 'SETTINGS'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const response = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': '1' 
        },
        body: JSON.stringify({
          action: randomAction,
          recordType: randomType,
          recordId: Math.floor(10 + Math.random() * 90)
        })
      });

      if (!response.ok) throw new Error('Failed to create audit log');
      await fetchLogs();
    } catch (error) {
      console.error('Error injecting audit log:', error);
      alert('Could not inject sample log.');
    } finally {
      setSubmitting(false);
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Audit Logs & Trails</h1>
          <p className="text-gray-500 text-sm mt-1">Track system activity, user actions, and database modifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleInjectLog}
            disabled={submitting}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 text-sm font-bold transition-all disabled:opacity-50"
          >
            {submitting ? 'Injecting...' : '+ Inject Test Log'}
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-white text-gray-700 px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 text-sm font-bold transition-all"
          >
            Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Record Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Record ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">Loading audit trails...</td>
              </tr>
            ) : safeLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 font-medium">
                  No audit logs found. Click <strong>Inject Test Log</strong> above to test entry recording.
                </td>
              </tr>
            ) : (
              safeLogs.map((log) => {
                const date = log.createdAt || log.created_at;
                const userId = log.userId || log.user_id;
                const recordType = log.recordType || log.record_type;
                const recordId = log.recordId || log.record_id;

                const action = (log.action || '').toUpperCase();
                let badgeClass = "bg-gray-100 text-gray-800";
                if (action === 'CREATE') badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                if (action === 'UPDATE') badgeClass = "bg-blue-50 text-blue-700 border border-blue-200";
                if (action === 'DELETE') badgeClass = "bg-red-50 text-red-700 border border-red-200";

                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {date ? new Date(date).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      User #{userId || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${badgeClass}`}>
                        {action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {recordType ? recordType.replace('_', ' ') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      #{recordId || '-'}
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
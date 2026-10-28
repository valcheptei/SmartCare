'use client';

import { useState } from 'react';

// Mock data for pharmacy notifications
const initialNotifications = [
  {
    id: 1,
    type: 'inventory',
    title: 'Low Stock Alert: Amoxicillin 500mg',
    message: 'Current stock is below the minimum threshold (12 strips remaining). Please reorder soon to avoid stockouts.',
    time: '10 minutes ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Expiring Medicines Detected',
    message: 'Batch #B7739 (Paracetamol Syrup) is set to expire in 30 days. Action required.',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'sales',
    title: 'Large Prescription Order Processed',
    message: 'An order totaling KES 24,500 was processed at the Main Branch terminal.',
    time: '5 hours ago',
    isRead: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'System Backup Completed',
    message: 'Daily automated cloud backup of inventory and sales records was successful.',
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: 5,
    type: 'insurance',
    title: 'NHIF Claim Approved',
    message: 'Claim #CLM-99201 for patient John Doe has been successfully verified and approved.',
    time: 'Yesterday',
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const toggleReadStatus = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'inventory') return n.type === 'inventory' || n.type === 'warning';
    if (activeTab === 'system') return n.type === 'system';
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'inventory': return '📦';
      case 'warning': return '⚠️';
      case 'sales': return '💰';
      case 'system': return '⚙️';
      case 'insurance': return '🏥';
      default: return '🔔';
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">Notifications Center</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">
            You have <strong className="text-[#366498]">{unreadCount} unread</strong> messages across your branches.
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="w-full md:w-auto px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm sm:text-base font-bold rounded-xl border border-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          ✓ Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 sm:gap-3 pb-2 w-full">
        {['all', 'unread', 'inventory', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold capitalize whitespace-nowrap transition-all shadow-sm ${
              activeTab === tab 
                ? 'bg-[#366498] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 sm:p-20 text-center flex flex-col items-center justify-center w-full">
            <span className="text-5xl sm:text-6xl mb-4 opacity-50">📭</span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-sm sm:text-base text-gray-500 mt-2">No notifications found for this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 w-full">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-5 sm:p-6 lg:p-8 flex gap-4 sm:gap-6 transition-colors hover:bg-gray-50 w-full ${
                  !notification.isRead ? 'bg-[#8BCBF0]/5 border-l-4 border-[#366498]' : 'bg-white border-l-4 border-transparent'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                  !notification.isRead ? 'bg-white shadow-sm border border-[#8BCBF0]/30' : 'bg-gray-100'
                }`}>
                  {getIconForType(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1.5 sm:mb-2 w-full">
                    <h4 className={`text-base sm:text-lg truncate ${!notification.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm sm:text-base leading-relaxed ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                    {notification.message}
                  </p>
                  
                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-5 sm:gap-6">
                    <button 
                      onClick={() => toggleReadStatus(notification.id)}
                      className={`text-xs sm:text-sm font-bold transition-colors ${
                        !notification.isRead ? 'text-[#366498] hover:text-[#23456b]' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {notification.isRead ? 'Mark as unread' : 'Mark as read'}
                    </button>
                    {notification.type === 'inventory' && (
                      <button className="text-xs sm:text-sm font-bold text-[#62C02A] hover:text-[#4d9921] transition-colors">
                        View Inventory →
                      </button>
                    )}
                  </div>
                </div>

                {/* Unread Indicator Dot (Mobile hidden, desktop visible) */}
                {!notification.isRead && (
                  <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-4 lg:w-6">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#366498] rounded-full shadow-sm"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    lowStock: true,
    dailyReport: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight leading-tight">System Settings</h1>
          <p className="text-sm sm:text-base xl:text-lg text-gray-500 mt-1.5 sm:mt-2 leading-relaxed max-w-3xl">
            Manage your pharmacy workspace, security, and notification preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 xl:gap-12 w-full">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <nav className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto custom-scrollbar pb-2 lg:pb-0 w-full">
            {[
              { id: 'general', name: 'General Information', icon: '🏢' },
              { id: 'security', name: 'Security & Access', icon: '🔒' },
              { id: 'notifications', name: 'Alert Preferences', icon: '🔔' },
              { id: 'billing', name: 'Billing & Plan', icon: '💳' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base xl:text-lg font-bold transition-all whitespace-nowrap flex-shrink-0 w-full lg:w-auto text-left ${
                  activeTab === tab.id
                    ? 'bg-[#366498] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 shadow-sm lg:shadow-none'
                }`}
              >
                <span className="text-lg sm:text-xl xl:text-2xl flex-shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10 xl:p-12 w-full overflow-hidden">
          
          {/* GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="space-y-8 xl:space-y-10 animate-fadeIn w-full">
              <div className="w-full">
                <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 xl:pb-4 mb-5 xl:mb-6 w-full">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 xl:gap-8 w-full">
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Pharmacy Name</label>
                    <input 
                      type="text" 
                      defaultValue="SmartCare Pharmacy (Main)"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">KRA PIN</label>
                    <input 
                      type="text" 
                      defaultValue="P051234567Z"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="md:col-span-2 w-full">
                    <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Business Address</label>
                    <input 
                      type="text" 
                      defaultValue="Kimathi Street, Nairobi CBD"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 xl:pb-4 mb-5 xl:mb-6 w-full">Administrator Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 xl:gap-8 w-full">
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Mary Chemtai"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="admin@smartcare.co.ke"
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 xl:pt-8 border-t border-gray-100 flex justify-end w-full">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-[#62C02A] hover:bg-[#57ad25] text-white rounded-xl font-bold text-sm sm:text-base xl:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* NOTIFICATIONS SETTINGS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 sm:space-y-8 xl:space-y-10 animate-fadeIn w-full">
              <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 xl:pb-4 mb-5 xl:mb-6 w-full">Alert Preferences</h2>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 w-full">
                {Object.entries({
                  emailAlerts: { label: 'Email Notifications', desc: 'Receive system alerts directly in your inbox.' },
                  smsAlerts: { label: 'SMS Alerts', desc: 'Get critical alerts via SMS (charges may apply).' },
                  lowStock: { label: 'Low Stock Warnings', desc: 'Trigger alerts when inventory falls below minimum threshold.' },
                  dailyReport: { label: 'Daily End-of-Day Report', desc: 'Automated sales and shift summaries sent at midnight.' }
                }).map(([key, info]) => (
                  <div key={key} className="flex items-center justify-between p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100/50 w-full">
                    <div className="pr-4">
                      <h4 className="text-sm sm:text-base xl:text-lg font-bold text-gray-900">{info.label}</h4>
                      <p className="text-xs sm:text-sm xl:text-base text-gray-500 mt-1 sm:mt-1.5 leading-relaxed">{info.desc}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`relative inline-flex h-7 sm:h-8 w-12 sm:w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#366498] focus:ring-offset-2 ${
                        notifications[key as keyof typeof notifications] ? 'bg-[#366498]' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-6 sm:h-7 w-6 sm:w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notifications[key as keyof typeof notifications] ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6 sm:space-y-8 xl:space-y-10 animate-fadeIn w-full">
              <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 xl:pb-4 mb-5 xl:mb-6 w-full">Change Password</h2>
              
              <div className="w-full max-w-3xl space-y-5 sm:space-y-6 xl:space-y-8">
                <div className="w-full">
                  <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                  />
                </div>
                <div className="w-full">
                  <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">New Password (Min 8 characters)</label>
                  <input 
                    type="password" 
                    placeholder="Enter new strong password"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                  />
                </div>
                <div className="w-full">
                  <label className="block text-xs sm:text-sm xl:text-base font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Repeat new password"
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base xl:text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                  />
                </div>
              </div>

              <div className="pt-6 xl:pt-8 flex justify-end w-full border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-[#366498] hover:bg-[#23456b] text-white rounded-xl font-bold text-sm sm:text-base xl:text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* BILLING SETTINGS */}
          {activeTab === 'billing' && (
            <div className="space-y-6 sm:space-y-8 xl:space-y-10 animate-fadeIn w-full">
              <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 xl:pb-4 mb-5 xl:mb-6 w-full">Subscription Plan</h2>
              
              <div className="p-6 sm:p-8 xl:p-10 bg-gradient-to-br from-[#8BCBF0]/20 to-[#CBEBD0]/30 rounded-2xl sm:rounded-3xl border border-[#8BCBF0]/50 w-full shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 xl:gap-10 w-full">
                  <div className="w-full sm:w-auto flex-1">
                    <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#366498] text-white text-xs sm:text-sm xl:text-base font-bold mb-4 sm:mb-5 shadow-sm">
                      Enterprise Tier
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 tracking-tight">
                      KES 15,000 <span className="text-base sm:text-lg xl:text-xl font-bold text-gray-500">/ month</span>
                    </h3>
                    <p className="text-sm sm:text-base xl:text-lg text-gray-700 mt-2 sm:mt-3 font-medium">Next billing date: November 1st, 2026</p>
                  </div>
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#366498] border-2 border-[#366498]/20 hover:border-[#366498] rounded-xl font-bold text-sm sm:text-base xl:text-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                    Manage Billing via M-Pesa
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
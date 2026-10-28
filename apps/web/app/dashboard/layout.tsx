'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Added Analytics into the navigation array
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'POS', href: '/dashboard/pos' },
    { name: 'Medicines', href: '/dashboard/medicines' },
    { name: 'Inventory', href: '/dashboard/inventory' },
    { name: 'Prescriptions', href: '/dashboard/prescriptions' },
    { name: 'Purchasing', href: '/dashboard/purchasing' },
    { name: 'Insurance', href: '/dashboard/insurance' },
    { name: 'Shifts', href: '/dashboard/shifts' },
    { name: 'Reports', href: '/dashboard/reports' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'AI Insights', href: '/dashboard/ai' },
    { name: 'Customers', href: '/dashboard/customers' },
    { name: 'Audit', href: '/dashboard/audit' },
    { name: 'Compliance', href: '/dashboard/compliance' },
    { name: 'Payments', href: '/dashboard/payments' },
    { name: 'Notifications', href: '/dashboard/notifications' },
    { name: 'Settings', href: '/dashboard/settings' },
  ];

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fully Responsive Drawer on Mobile, Fixed on Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl shadow-md p-1.5 flex items-center justify-center flex-shrink-0">
              <img 
                src="/logo/smartcare%20logo.jpg" 
                alt="SmartCare POS Logo" 
                className="h-8 w-auto object-contain mix-blend-multiply contrast-125"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">SmartCare-POS</h1>
              <p className="text-[11px] text-gray-400 font-medium">Pharmacy Platform</p>
            </div>
          </div>
          {/* Close button for mobile drawer */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
        
        {/* Navigation List */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm w-full">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Open Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h2 className="text-base sm:text-lg font-bold text-gray-800 capitalize truncate">
              {pathname === '/dashboard' ? 'Executive Overview' : pathname?.split('/')[2]?.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Branch: Main (Nairobi)
            </span>

            {/* Logged-in User Profile */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
                MC
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900 leading-tight">Mary Chemtai</p>
                <p className="text-xs text-gray-500 font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
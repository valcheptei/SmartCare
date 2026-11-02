'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col justify-between font-sans selection:bg-[#366498] selection:text-white overflow-x-hidden">
      {/* Navbar - Edge-to-edge with #366498 deep blue brand accent */}
      <header className="w-full px-6 lg:px-16 py-5 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-[#8BCBF0]/30 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3.5">
          {/* Explicit width/height on the Image forces it to render without collapsing */}
          <div className="flex-shrink-0 bg-white rounded-xl shadow-md border border-[#8BCBF0]/40 p-1 flex items-center justify-center">
            <Image 
              src="/logo/smartcare%20logo.jpg" 
              alt="SmartCare POS Logo" 
              width={100} 
              height={100} 
              className="object-contain"
              priority
            />
          </div>
          <span className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 truncate">
            SmartCare<span className="text-[#366498]">-POS</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-base font-semibold text-gray-700">
          <a href="#features" className="hover:text-[#366498] transition-colors">What the POS Covers</a>
          <a href="#about" className="hover:text-[#366498] transition-colors">About Us</a>
          <a href="#contact" className="hover:text-[#366498] transition-colors">Contact Us</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#62C02A] hover:bg-[#57ad25] rounded-xl shadow-lg shadow-[#62C02A]/30 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Sign In</span> &rarr;
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center justify-start text-center px-6 lg:px-16 pt-12 pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden bg-gradient-to-b from-[#8BCBF0]/20 via-[#CBEBD0]/30 to-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop')` }}
        ></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBEBD0] text-[#366498] text-sm font-bold tracking-wide shadow-sm border border-[#8BCBF0]">
            <span>🛡️ Clinical-Grade Pharmacy Operating System for Kenya</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] text-gray-900">
            Intelligent Pharmacy Management & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#366498] to-[#62C02A]">Dispensary Platform</span>
          </h1>
          
          <p className="text-gray-700 text-lg lg:text-xl max-w-3xl mx-auto font-normal leading-relaxed">
            Manage multi-branch inventory, real-time batch tracking, prescriptions, M-Pesa payments, and regulatory compliance seamlessly in one unified platform.
          </p>
        </div>
      </main>

      {/* #features Section */}
      <section id="features" className="w-full px-6 lg:px-16 py-24 bg-[#CBEBD0]/20 border-t border-[#8BCBF0]/30">
        <div className="w-full space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900">What the POS Covers</h2>
            <p className="text-gray-600 text-lg lg:text-xl">Engineered specifically for clinical accuracy and high-speed retail checkout workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-white p-8 lg:p-10 rounded-3xl border border-[#8BCBF0]/50 shadow-xl flex flex-col justify-between hover:border-[#366498] transition-all group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#8BCBF0]/30 text-[#366498] flex items-center justify-center text-3xl font-bold border border-[#8BCBF0] group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Lightning-Fast POS Terminal</h3>
                <p className="text-gray-600 text-base leading-relaxed">Process sales instantly with integrated M-Pesa, cash, and card checkout options, paired with instant thermal receipt generation.</p>
              </div>
            </div>

            <div className="bg-white p-8 lg:p-10 rounded-3xl border border-[#62C02A]/30 shadow-xl flex flex-col justify-between hover:border-[#62C02A] transition-all group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#CBEBD0] text-[#62C02A] flex items-center justify-center text-3xl font-bold border border-[#62C02A]/50 group-hover:scale-110 transition-transform">📦</div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Batch & Inventory Tracking</h3>
                <p className="text-gray-600 text-base leading-relaxed">Never lose track of expiry dates or stock levels. Monitor batch numbers, quantities received, and automated low-stock alerts.</p>
              </div>
            </div>

            <div className="bg-white p-8 lg:p-10 rounded-3xl border border-[#8BCBF0]/50 shadow-xl flex flex-col justify-between hover:border-[#366498] transition-all group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#8BCBF0]/30 text-[#366498] flex items-center justify-center text-3xl font-bold border border-[#8BCBF0] group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Executive Telemetry & Reports</h3>
                <p className="text-gray-600 text-base leading-relaxed">Gain immediate visibility into gross revenue, completed orders, payment breakdowns, and branch performance metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #about Section */}
      <section id="about" className="w-full px-6 lg:px-16 py-24 bg-white border-t border-[#8BCBF0]/30">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CBEBD0] text-[#366498] text-sm font-bold border border-[#8BCBF0]">
              <span>About SmartCare POS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Empowering African Healthcare & Pharmacies
            </h2>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
              Developed by <strong className="text-gray-900">Mavora Technologies</strong>, SmartCare POS is built to solve the unique operational challenges faced by modern pharmacies in Nairobi and across the region. We combine enterprise-grade security with intuitive user interfaces to make dispensary management effortless.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              <div>
                <p className="text-3xl lg:text-4xl font-black text-[#366498]">100%</p>
                <p className="text-sm text-gray-500 mt-1 font-semibold">Tenant Isolated</p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-3xl lg:text-4xl font-black text-[#62C02A]">24/7</p>
                <p className="text-sm text-gray-500 mt-1 font-semibold">Reliable Uptime</p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-3xl lg:text-4xl font-black text-[#366498]">Multi</p>
                <p className="text-sm text-gray-500 mt-1 font-semibold">Payment Integration</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8BCBF0]/20 to-[#CBEBD0]/40 p-8 lg:p-12 rounded-3xl border border-[#366498]/30 shadow-xl space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Why Pharmacy Leaders Choose Us</h3>
            <ul className="space-y-5 text-base text-gray-700">
              <li className="flex items-start gap-4">
                <span className="text-[#62C02A] font-bold text-xl flex-shrink-0">✓</span>
                <span>Custom product imaging & catalog management with local uploads or Cloudinary support.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#62C02A] font-bold text-xl flex-shrink-0">✓</span>
                <span>Optimized receipt printing workflows with zero browser margin hassle.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#62C02A] font-bold text-xl flex-shrink-0">✓</span>
                <span>Secure role-based access control and live audit trails.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* #contact Section */}
      <section id="contact" className="w-full px-6 lg:px-16 py-24 bg-[#8BCBF0]/10 border-t border-[#8BCBF0]/30">
        <div className="w-full max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Get in Touch with Mavora Technologies</h2>
            <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto">Ready to elevate your pharmacy operations? Contact our team for onboarding, inquiries, or custom enterprise solutions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 w-full pt-4">
            <a 
              href="tel:+254795707823"
              className="bg-white hover:border-[#366498] border border-[#8BCBF0]/50 p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all shadow-xl group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📞</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Call / WhatsApp</span>
              <span className="text-lg lg:text-xl font-bold text-gray-900">+254 (0) 795 707 823</span>
            </a>

            <a 
              href="mailto:info@mavoratechnologies.com"
              className="bg-white hover:border-[#366498] border border-[#8BCBF0]/50 p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all shadow-xl group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">✉️</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Email Support</span>
              <span className="text-lg lg:text-xl font-bold text-gray-900 break-all">info@mavoratechnologies.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 lg:px-16 py-10 border-t border-[#366498]/30 bg-[#366498] text-white text-xs sm:text-sm">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-3.5">
            {/* Same explicit width/height fix here for the footer */}
            <div className="flex-shrink-0 bg-white rounded-xl shadow border border-white/40 p-1 flex items-center justify-center">
              <Image 
                src="/logo/smartcare%20logo.jpg" 
                alt="SmartCare POS Logo" 
                width={100} 
                height={100} 
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SmartCare-POS</span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-6 text-white">
            <a href="https://mavora.co.ke" target="_blank" rel="noopener noreferrer" title="Website" className="hover:text-[#8BCBF0] transition-colors text-lg">
              🌐
            </a>
            <a href="https://linkedin.com/company/mavora-technologies" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:text-[#8BCBF0] transition-colors text-lg">
              💼
            </a>
            <a href="https://facebook.com/mavoratechnologies" target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-[#8BCBF0] transition-colors text-lg">
              📘
            </a>
            <a href="https://instagram.com/mavoratechnologies" target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-[#8BCBF0] transition-colors text-lg">
              📸
            </a>
            <a href="https://tiktok.com/@mavoratechnologies" target="_blank" rel="noopener noreferrer" title="TikTok" className="hover:text-[#8BCBF0] transition-colors text-lg">
              🎬
            </a>
          </div>
        </div>

        <div className="w-full pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-white/90">
            &copy; 2026 Developed and maintained by <span className="text-[#8BCBF0] font-bold">Mavora Technologies</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 text-white/90 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
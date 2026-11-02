'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@smartcare.co.ke');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 8) {
      setError('Access Denied: Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    
    try {
      // Send credentials to the secure backend for validation
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store the secure token (in localStorage for now, consider HttpOnly cookies for production)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-[#366498] selection:text-white overflow-x-hidden">
      {/* Left Column: High-Visibility Pharmacy Backdrop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#071321] overflow-hidden flex-col justify-between p-12 lg:p-16">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1400&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#071321]/95 via-[#071321]/50 to-transparent"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="bg-white rounded-xl shadow-lg border border-white/20 p-1.5 flex items-center justify-center transition-transform group-hover:scale-105">
              <img 
                src="/logo/smartcare%20logo.jpg" 
                alt="SmartCare POS Logo" 
                className="h-12 sm:h-10 w-auto object-contain mix-blend-multiply contrast-125"
              />
            </div>
            <span className="text-white text-2xl font-black tracking-tight drop-shadow-md">
              SmartCare-POS
            </span>
          </Link>
        </div>

        {/* Bottom Hero Content */}
        <div className="relative z-10 max-w-xl space-y-4 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#62C02A]/20 border border-[#62C02A]/40 text-[#62C02A] text-xs font-semibold">
            <span>🛡️ Enterprise-Grade Security</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
            The intelligent operating system for modern pharmacies.
          </h2>
          <p className="text-gray-200 text-sm lg:text-base leading-relaxed font-normal drop-shadow-sm">
            Manage your branches, sync inventory in real-time, and process transactions lightning-fast with strict role-based access.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Form with Strict Validation */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to SmartCare-POS</h1>
            <p className="text-sm text-gray-500 font-normal">Enter your secure credentials to access your business workspace.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">✉️</span>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#8BCBF0]/15 border border-[#8BCBF0]/40 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                  placeholder="admin@smartcare.co.ke"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-bold text-[#62C02A] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-sm">🔒</span>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#8BCBF0]/15 border border-[#8BCBF0]/40 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#366498] focus:border-[#366498] outline-none transition-all shadow-sm" 
                  placeholder="Enter secure password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#62C02A] hover:bg-[#57ad25] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign in to Workspace →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
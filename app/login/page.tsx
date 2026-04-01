'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    // Artificial delay for a "premium" secure feel
    setTimeout(() => {
      if (email === 'airfarebooker@gmail.com' && password === '12345678') {
        localStorage.setItem('isLoggedIn', 'true');
        setStatus({ type: 'success', message: 'Credentials verified. Preparing your terminal...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setStatus({ type: 'error', message: 'Invalid credentials. Please check your details.' });
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] opacity-60" />

      <div className="w-full max-w-md z-10">
        {/* Brand/Logo Section */}
        <div className="flex flex-col items-center mb-10 group">
          <Link href="/" className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3 group-hover:rotate-0 transition-all duration-500">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
                Air Care Booker
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mt-1">
                Global Travel Partner
              </p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Sign in to manage your bookings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Account Email
              </label>
              <input
                type="email"
                placeholder="traveler@example.com"
                className="w-full bg-slate-50 border-transparent border-2 p-4 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Password
                </label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border-transparent border-2 p-4 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98] shadow-xl ${
                isLoading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {status.message && (
            <div
              className={`mt-6 p-4 rounded-2xl text-xs font-bold uppercase tracking-wide text-center animate-in fade-in zoom-in-95 duration-300 ${
                status.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Secure access powered by <span className="text-slate-900 italic">Stripe Identity</span>
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <Link
              href="/"
              className="text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

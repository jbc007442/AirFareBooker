'use client';

import React from 'react';
import Link from 'next/link';

const AirFareBooker = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-100 bg-white">
      {/* --- HEADER --- */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
            <svg
              className="w-5 h-5 text-white"
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
          <span className="text-xl font-black text-slate-900 tracking-tight">Air Care Booker</span>
        </div>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100"
        >
          Get Started
        </Link>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-5xl mx-auto relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60" />

          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="py-1.5 px-4 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-[0.2em]">
              Premium Travel Services
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900">
            Book with <span className="text-blue-600">Confidence.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Experience the simplest way to secure your next flight. Fast, transparent, and built for
            the modern traveler.
          </p>

          {/* Stripe Badge Slogan */}
          <div className="inline-flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Securely Powered By
            </span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              alt="Stripe"
              className="h-7 opacity-80"
            />
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: 'Tokyo', price: '₹68,400', color: 'bg-indigo-50' },
              { city: 'London', price: '₹52,200', color: 'bg-blue-50' },
              { city: 'Dubai', price: '₹34,500', color: 'bg-slate-50' },
            ].map((dest, i) => (
              <div
                key={i}
                className={`${dest.color} aspect-[4/5] rounded-[2.5rem] p-10 flex flex-col justify-end group cursor-pointer border border-transparent hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500`}
              >
                <div className="mb-auto">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{dest.city}</h3>
                <p className="font-bold text-slate-500 uppercase text-xs tracking-widest">
                  Fares from {dest.price}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 py-20 px-8 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <h3 className="text-xl font-black tracking-tight text-white">Air Care Booker</h3>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Simplifying global travel through secure, modern technology. Fly anywhere with just a
              few clicks.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
              <Link href="#" className="hover:text-blue-500 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-blue-500 transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-blue-500 transition-colors">
                Support
              </Link>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2026 Air Care Booker Inc.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AirFareBooker;

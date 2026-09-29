'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, LogOut } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/Dashboard';

export default function AdminPage() {
  const handleLogout = () => {
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24">
      {/* Admin Top Header - High Contrast White Bar */}
      <div className="border-b border-slate-200 bg-white py-3.5 px-4 sm:px-6 lg:px-10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3">
              {/* Round Logo */}
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="VSBCETC Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span className="font-headline text-base font-bold text-slate-900 block leading-tight">
                  VSBCETC E-CELL ADMIN
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-semibold">
                  COIMBATORE • FOUNDRY PORTAL
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-500 font-mono">
              Logged in: <strong className="text-slate-800">admin@vsbcetc.ac.in</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <div className="mb-8 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-vermilion font-semibold mb-1">
              <Shield className="w-4 h-4" />
              <span>PORTAL &amp; EXPO GOVERNANCE</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-slate-900">
              Command Dashboard
            </h1>
          </div>
          <span className="text-xs font-mono text-slate-500">
            VSBCETC Coimbatore • Autonomous Node
          </span>
        </div>

        <AdminDashboard />
      </main>
    </div>
  );
}

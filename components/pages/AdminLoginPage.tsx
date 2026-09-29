'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '@/lib/validators';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: 'admin@vsbcetc.ac.in', password: '' },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || 'Invalid credentials');
      } else {
        window.location.href = '/admin';
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-slate-200 bg-white p-2 shadow-sm flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src="/logo.png" alt="VSBCETC Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-slate-900">
            Admin Portal
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">
            VSBCETC E-CELL • COIMBATORE
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md">
          <div className="flex items-center gap-2 pb-3 mb-6 border-b border-slate-200 text-xs text-vermilion font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>SECURE GOVERNANCE ACCESS</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors"
                  placeholder="admin@vsbcetc.ac.in"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 font-mono mt-1">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors"
                  placeholder="Enter administrator password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600 font-mono mt-1">{errors.password.message as string}</p>
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-vermilion transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In to Dashboard →</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

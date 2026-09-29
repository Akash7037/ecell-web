'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to admin
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(r => { if (r.ok) window.location.href = '/admin'; })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0f]">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto mb-5 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-1">
            <img src="/logo.png" alt="E-Cell Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-lg font-bold text-white/80">Admin Portal</h1>
          <p className="text-[11px] font-mono tracking-wider uppercase text-white/25 mt-1.5">
            Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-[11px] font-mono tracking-wider uppercase text-white/30 mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-vermilion/40 focus:ring-1 focus:ring-vermilion/20 transition-all"
              placeholder="admin@vsb.ac.in"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-[11px] font-mono tracking-wider uppercase text-white/30 mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/15 focus:outline-none focus:border-vermilion/40 focus:ring-1 focus:ring-vermilion/20 transition-all"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-rose-400/80 font-mono"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-vermilion text-white text-xs font-semibold uppercase tracking-wider hover:bg-vermilion/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-white/[0.04] text-center">
          <Link href="/" className="text-[11px] font-mono text-white/20 hover:text-white/40 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" />
            Return to Public Site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

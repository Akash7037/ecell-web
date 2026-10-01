'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';

interface AdminGateProps {
  children: React.ReactNode;
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ecell2026';
const SESSION_KEY = 'ecell_admin_auth';

export function AdminGate({ children }: AdminGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') setAuthenticated(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  if (checking) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <LockIcon size={20} className="text-vermilion mb-4" strokeWidth={1.5} />
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-light mb-2">
            Restricted Access
          </p>
          <h1 className="font-headline text-2xl font-bold text-ink">Admin Panel</h1>
          <p className="text-sm text-ink-muted mt-1">E-Cell VSBCETC</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-full border border-paper-muted bg-paper-dim rounded-sm px-4 py-3 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors duration-150 pr-10"
              autoFocus
              autoComplete="current-password"
              id="admin-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-vermilion font-mono">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-ink text-paper-DEFAULT py-3 text-sm font-semibold rounded-sm hover:bg-ink/80 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

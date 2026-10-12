'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, PenToolIcon } from 'lucide-react';

interface BloggerGateProps {
  children: React.ReactNode;
}

const BLOGGER_PASSWORD = process.env.NEXT_PUBLIC_BLOGGER_PASSWORD || 'Blogger@26';
const SESSION_KEY = 'ecell_blogger_auth';

export function BloggerGate({ children }: BloggerGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === BLOGGER_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect blogger password. Please check your credentials.');
      setPassword('');
    }
  };

  if (checking) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-rust/10 flex items-center justify-center text-rust mb-4 mx-auto sm:mx-0">
            <PenToolIcon size={20} strokeWidth={1.75} />
          </div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
            E-Cell VSBCETC · Content Portal
          </p>
          <h1 className="font-headline text-2xl font-bold text-ink">Blogger Studio</h1>
          <p className="text-sm text-ink-muted mt-1">Author &amp; Editorial Workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter blogger password"
              className="w-full border border-paper-muted bg-paper rounded-sm px-4 py-3 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors duration-150 pr-10 font-mono"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink transition-colors"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>

          {error && <p className="text-xs text-vermilion">{error}</p>}

          <button
            type="submit"
            className="w-full bg-rust hover:bg-vermilion text-white font-semibold text-sm py-3 px-4 rounded-sm transition-colors duration-150 focus:outline-none"
          >
            Access Blogger Studio
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-paper-muted text-center text-xs text-ink-light font-mono">
          <span>Protected Area · E-Cell VSBCETC</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon, PenToolIcon } from 'lucide-react';

export type BloggerRole = 'editor' | 'creator';

interface BloggerGateProps {
  children: React.ReactNode;
}

const PASSWORD_EDITOR = process.env.NEXT_PUBLIC_BLOGGER_PASSWORD || 'Blogger@26';
const PASSWORD_CREATOR = process.env.NEXT_PUBLIC_BLOGGER_CREATOR_PASSWORD || 'Blogger@24';
const SESSION_KEY_AUTH = 'ecell_blogger_auth';
const SESSION_KEY_ROLE = 'ecell_blogger_role';

export function BloggerGate({ children }: BloggerGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<BloggerRole>('editor');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem(SESSION_KEY_AUTH);
    const storedRole = (sessionStorage.getItem(SESSION_KEY_ROLE) as BloggerRole) || 'editor';
    if (storedAuth === 'true') {
      setAuthenticated(true);
      setRole(storedRole);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPw = password.trim();

    if (cleanPw === PASSWORD_EDITOR) {
      sessionStorage.setItem(SESSION_KEY_AUTH, 'true');
      sessionStorage.setItem(SESSION_KEY_ROLE, 'editor');
      setRole('editor');
      setAuthenticated(true);
      setError('');
    } else if (cleanPw === PASSWORD_CREATOR) {
      sessionStorage.setItem(SESSION_KEY_AUTH, 'true');
      sessionStorage.setItem(SESSION_KEY_ROLE, 'creator');
      setRole('creator');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect blogger password. Please check your credentials.');
      setPassword('');
    }
  };

  if (checking) return null;
  if (authenticated) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { role });
    }
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-vermilion/10 flex items-center justify-center text-vermilion mb-4 mx-auto sm:mx-0">
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
            className="w-full bg-[#C2410C] text-white font-semibold text-sm py-3 px-4 rounded-sm focus:outline-none select-none cursor-pointer"
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

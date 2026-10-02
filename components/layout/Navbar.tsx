'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

const NAV_LINKS = [
  { href: '/events', label: 'Events' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E4] shadow-xs' : 'bg-[#FAF9F6]/80 backdrop-blur-sm border-b border-[#E7E5E4]/50'
        }`}
      >
        <nav
          className="mx-auto max-w-7xl px-6 flex items-center justify-between h-16 md:h-[72px]"
          aria-label="Main navigation"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex flex-col leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion rounded"
          >
            <span className="font-headline text-sm font-bold tracking-tight text-ink uppercase">
              E-Cell
            </span>
            <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">
              VSBCETC
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion rounded
                      ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                  >
                    {label}
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-vermilion" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion rounded"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span
              className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${
                isOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-ink transition-all duration-300 ${
                isOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-paper flex flex-col justify-center px-6 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <ul className="flex flex-col gap-2" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <li key={href}>
                <Link
                  href={href}
                  tabIndex={isOpen ? 0 : -1}
                  className={`block font-headline text-4xl font-bold py-3 border-b border-paper-muted transition-colors duration-150 focus:outline-none
                    ${active ? 'text-vermilion' : 'text-ink hover:text-vermilion'}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-12 font-mono text-xs text-ink-light tracking-widest uppercase">
          E-Cell VSBCETC · Coimbatore
        </p>
      </div>
    </>
  );
}

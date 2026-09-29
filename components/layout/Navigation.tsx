'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Users, Calendar, Mail, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Compass },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Auto-hide when scrolling down, show when scrolling up
      if (currentScrollY > 70) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
          setVisible(false); // scrolling down -> hide
        } else if (lastScrollY - currentScrollY > 6) {
          setVisible(true); // scrolling up -> reveal
        }
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
          visible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'bg-paper/90 backdrop-blur-md border-b border-paper-border/60 py-3 shadow-xs'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <nav
            className="flex items-center justify-between"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* College & E-Cell Brand with Official Logo */}
            <Link
              href="/"
              className="flex items-center gap-3.5 group select-none"
              aria-label="VSB E-Cell Home"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-paper-border/80 bg-white/80 shadow-xs flex items-center justify-center p-1 transition-transform group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="VSB E-Cell Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline text-base font-bold tracking-tight text-ink">
                    VSB E-CELL
                  </span>
                  <span className="w-1.5 h-1.5 bg-vermilion rounded-full"></span>
                </div>
                <span className="font-mono text-[9px] tracking-wider text-ink-muted uppercase mt-0.5">
                  VSBCETC
                </span>
              </div>
            </Link>

            {/* Editorial Minimalist Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-paper-border/60 shadow-xs">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-1.5 rounded-full flex items-center gap-2 text-xs transition-all ${
                      isActive
                        ? 'text-ink bg-paper font-semibold shadow-xs'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-vermilion' : 'text-ink-muted/80'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Action: Clean Editorial Button (No Clunky Badges) */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact#pitch"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-semibold hover:bg-vermilion transition-all shadow-sm"
              >
                <span>Launch Pitch</span>
                <ArrowRight className="w-3.5 h-3.5 text-vermilion group-hover:text-white" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-paper-border bg-white text-ink hover:bg-paper transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-paper/98 pt-24 pb-8 px-6 lg:hidden flex flex-col justify-between border-b-2 border-ink"
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-paper-border text-ink-muted font-mono text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-vermilion" />
                <span>NAVIGATION // VSB CETC</span>
              </div>

              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-3.5 border transition-all ${
                      isActive
                        ? 'bg-white border-ink text-ink font-bold shadow-[3px_3px_0px_#121316]'
                        : 'border-paper-border/80 bg-paper-dim/60 text-ink-muted hover:text-ink hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-vermilion' : 'text-ink-muted'}`} />
                      <span className="font-headline text-lg font-bold uppercase">{item.label}</span>
                    </div>
                    {isActive ? (
                      <span className="w-2 h-2 bg-vermilion"></span>
                    ) : (
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="max-w-md mx-auto w-full pt-6 border-t border-paper-border flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3 bg-white border border-paper-border">
                <span className="w-2 h-2 bg-vermilion rounded-full animate-pulse" />
                <span className="font-mono text-xs text-ink font-bold uppercase tracking-wider">
                  Upcoming: Project Expo '26 Showcase
                </span>
              </div>

              <Link
                href="/contact#pitch"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-ink text-paper font-mono text-xs uppercase font-bold tracking-wider text-center hover:bg-vermilion transition-colors btn-3d"
              >
                Submit Startup Pitch →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

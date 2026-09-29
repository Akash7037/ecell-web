'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '@/data/seed';

const FOOTER_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Events', href: '/events' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: siteConfig.socials.linkedin },
  { label: 'Instagram', href: siteConfig.socials.instagram },
  { label: 'GitHub', href: siteConfig.socials.github },
  { label: 'Twitter/X', href: siteConfig.socials.twitter },
];

export function Footer() {
  return (
    <footer className="relative mt-24 bg-paper text-ink" role="contentinfo">
      
      {/* Thin separator */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="border-t border-paper-border/80" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-paper-dim flex items-center justify-center p-0.5">
                <img
                  src="/logo.png"
                  alt="VSB E-Cell Official Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h2 className="font-headline text-base font-bold tracking-tight text-ink">
                  E-Cell VSB CETC
                </h2>
                <p className="text-[11px] font-mono tracking-wider text-ink-muted">
                  College of Engineering &amp; Technical Campus
                </p>
              </div>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-md font-body font-light">
              Converting student engineering hypotheses into enduring enterprises. Autonomous prototyping foundry, seed accelerator, and patent cell at VSBCETC.
            </p>
            <div className="mt-5 flex flex-col gap-1.5 text-xs text-ink-muted">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-vermilion transition-colors">
                <Mail className="w-3.5 h-3.5 text-vermilion" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-ink-muted/60" />
                <span>Coimbatore, Tamil Nadu</span>
              </span>
            </div>
          </div>

          {/* Navigation column */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-ink-muted mb-4">
              Directory
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Connect column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-mono font-semibold tracking-wider uppercase text-ink-muted mb-4">
              Connect
            </h3>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted hover:text-ink transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-vermilion" />
                </a>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-paper-border/60">
              <span className="text-xs font-mono text-vermilion font-semibold uppercase tracking-wider block mb-1.5">
                Upcoming
              </span>
              <p className="font-body text-sm text-ink-muted font-light">
                Inter-college events and new initiatives — follow our socials for updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="border-t border-paper-border/60 py-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-ink-muted/60">
            &copy; {new Date().getFullYear()} VSB E-Cell. VSBCETC, Coimbatore.
          </span>
          <span className="text-xs text-ink-muted/40 font-mono">
            VSBCETC • Coimbatore
          </span>
        </div>
      </div>
    </footer>
  );
}

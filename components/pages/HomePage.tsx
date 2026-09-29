'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react';
import { events as defaultEvents } from '@/data/seed';
import type { Event } from '@/types';
import { HeroCanvasBackground } from '@/components/ui/HeroCanvasBackground';

export function HomePage() {
  const [eventsList, setEventsList] = useState<Event[]>(defaultEvents);
  const [heroBgEnabled, setHeroBgEnabled] = useState(true);

  useEffect(() => {
    // Fetch live site settings (dynamic background toggle)
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.heroDynamicBackground === 'boolean') {
          setHeroBgEnabled(data.heroDynamicBackground);
        }
      })
      .catch(() => {});

    // Fetch live events / announcements
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEventsList(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full bg-paper text-ink relative">
      
      {/* ═══════ HERO SECTION WITH DYNAMIC BACKGROUND ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 pt-24 pb-20 lg:pt-36 lg:pb-28 relative overflow-hidden">
        
        {/* Dynamic Interactive Canvas Background (Toggled from Admin) */}
        <HeroCanvasBackground enabled={heroBgEnabled} />

        <div className="mx-auto max-w-[1440px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Typographic Statement */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              
              {/* Mobile-Friendly Crest Badge (Replaces awkward oversized circle on mobile) */}
              <div className="flex lg:hidden items-center gap-3 p-2 pr-4 rounded-full bg-white/85 border border-paper-border/80 shadow-xs mb-6 w-fit backdrop-blur-md">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-paper-border/80 bg-white p-0.5 shrink-0">
                  <img src="/logo.png" alt="VSBCETC Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-ink tracking-tight">VSBCETC E-Cell</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  <span className="font-mono text-[10px] text-ink-muted uppercase">Coimbatore</span>
                </div>
              </div>

              {/* Clean Desktop Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex items-center gap-2.5 text-xs text-ink-muted mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-vermilion"></span>
                <span className="font-semibold text-ink uppercase tracking-wider">
                  Entrepreneurship Cell
                </span>
                <span className="text-ink/30">•</span>
                <span>VSBCETC Coimbatore</span>
              </motion.div>

              {/* Expansive Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-headline text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-ink leading-[1.02]"
              >
                Where student <br />
                curiosity meets <br />
                <span className="text-vermilion italic font-normal">venture scale.</span>
              </motion.h1>

              {/* Editorial Lead */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="font-body text-lg sm:text-xl text-ink-muted max-w-2xl mt-8 leading-relaxed font-light"
              >
                The autonomous student incubator, rapid prototyping sandbox, and venture syndicate at <strong className="text-ink font-semibold">VSBCETC</strong>. We provide the labs, patent counsel, and venture mentorship to turn student hypotheses into defensible commercial enterprises.
              </motion.p>

              {/* Clean Navigation Actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-4 mt-12"
              >
                <Link
                  href="/events"
                  className="px-8 py-4 rounded-full bg-ink text-paper text-sm font-semibold hover:bg-vermilion transition-all shadow-md flex items-center gap-3 group"
                >
                  <span>Upcoming Announcements</span>
                  <ArrowRight className="w-4 h-4 text-vermilion group-hover:text-white transition-colors" />
                </Link>

                <Link
                  href="/team"
                  className="px-6 py-4 rounded-full border border-paper-border text-sm font-medium text-ink hover:border-ink transition-colors"
                >
                  Meet Our Team
                </Link>
              </motion.div>
            </div>

            {/* Desktop Only: Official Round Showcase Logo (Hidden on mobile for sleek proportions) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-end text-right"
              >
                <div className="relative w-60 h-60 lg:w-64 lg:h-64 rounded-full overflow-hidden bg-white/80 border border-paper-border/80 shadow-lg p-5 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-vermilion/5 rounded-full blur-xl pointer-events-none" />
                  <img
                    src="/logo.png"
                    alt="Official VSBCETC E-Cell Logo"
                    className="w-full h-full object-contain rounded-full relative z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ THE FOUNDRY STORY ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-24 lg:py-32 border-b border-paper-border/80 bg-paper">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-vermilion block mb-3">
                EDITORIAL NARRATIVE
              </span>
              <h2 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-[1.08]">
                From laboratory benches to industrial corridors.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 font-body text-base sm:text-lg text-ink-muted leading-relaxed font-light">
              <p>
                VSB College of Engineering Technical Campus (VSBCETC) is located in the engineering and manufacturing heart of Tamil Nadu. Precision engineering, automation, embedded telemetry, and sustainable technologies form our regional innovation ecosystem.
              </p>
              <p>
                Yet across academic classrooms, student engineering inventions too often stop at project presentations. The Entrepreneurship Cell at VSBCETC bridges this divide.
              </p>
              <p>
                We equip student founders with dedicated 24/7 testing equipment, seed micro-grants, and legal support to file provisional utility patents before teams publish.
              </p>

              <div className="pt-4 flex items-center gap-6">
                <Link
                  href="/about"
                  className="font-semibold text-sm text-ink hover:text-vermilion flex items-center gap-1.5 transition-colors"
                >
                  <span>Read Institutional Manifesto</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-ink/20">•</span>
                <Link
                  href="/team"
                  className="font-semibold text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  Meet The Operators →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ EVENT ANNOUNCEMENTS ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-24 lg:py-32 border-b border-paper-border/80 bg-white/40">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-12 border-b border-paper-border/80">
            <div>
              <span className="text-xs uppercase tracking-wider text-vermilion font-semibold block mb-1">
                EVENT ANNOUNCEMENTS
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-ink">
                Upcoming &amp; Active Initiatives
              </h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-semibold text-ink hover:text-vermilion inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-paper-border/80 border-y border-paper-border/80">
            {eventsList.slice(0, 4).map((event) => {
              const regUrl = event.registrationUrl || 'https://forms.gle/vsbcetc-expo-26-registration';
              const isExternal = regUrl.startsWith('http://') || regUrl.startsWith('https://');

              return (
                <div
                  key={event.id}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center group"
                >
                  {/* Date, Timing & Fee */}
                  <div className="lg:col-span-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-vermilion font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {event.id === 'evt-expo-26' ? 'DATES ANNOUNCING SOON' : new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {event.time && (
                      <span className="text-xs text-ink-muted block">{event.time}</span>
                    )}
                    <span className="text-xs text-ink-muted block">{event.location}</span>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <Tag className="w-3 h-3" />
                        <span>{event.amountPerTeam || 'Free Entry'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div className="lg:col-span-6 space-y-1">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-ink group-hover:text-vermilion transition-colors">
                      {event.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-ink-muted leading-relaxed font-light line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* External Registration Link */}
                  <div className="lg:col-span-3 flex lg:justify-end items-center">
                    {isExternal ? (
                      <a
                        href={regUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-semibold hover:bg-vermilion transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Register on Portal</span>
                        <ExternalLink className="w-3.5 h-3.5 text-vermilion" />
                      </a>
                    ) : (
                      <Link
                        href={regUrl}
                        className="px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-semibold hover:bg-vermilion transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Register on Portal</span>
                        <ArrowRight className="w-3.5 h-3.5 text-vermilion" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ EDITORIAL CALL TO ACTION ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-24 lg:py-32 bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-vermilion uppercase tracking-widest block mb-4">
              COMMENCE YOUR BLUEPRINT
            </span>
            <h2 className="font-headline text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Have an engineering invention? Let's turn it into a company.
            </h2>
            <p className="font-body text-base text-paper-muted mt-6 max-w-2xl font-light leading-relaxed">
              Whether you have an embedded circuit, an autonomous machine, or a software system, VSBCETC E-Cell provides the prototyping guidance, lab access, and patent counsel to take you from concept to launch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link
              href="/contact#pitch"
              className="px-8 py-4 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-light transition-all shadow-lg shadow-vermilion/20 text-center"
            >
              Submit Pitch Deck →
            </Link>
            <Link
              href="/team"
              className="px-8 py-4 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-all text-center"
            >
              Meet The Operators
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

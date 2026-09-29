'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { events as initialEvents } from '@/data/seed';
import type { Event } from '@/types';
import { Calendar, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export function EventsPage() {
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEventsList(data);
        }
      })
      .catch(() => {});
  }, []);

  const now = Date.now();
  const upcomingEvents = eventsList.filter((e) => new Date(e.date).getTime() >= now && !e.isPast);
  const pastEvents = eventsList.filter((e) => new Date(e.date).getTime() < now || e.isPast);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getFeeLabel = (event: Event) => {
    if (event.feeType === 'Free' || (!event.feeType && event.amountPerTeam?.toLowerCase().includes('free'))) {
      return { text: 'Free', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    return { text: event.amountPerTeam || 'Paid', className: 'bg-amber-50 text-amber-700 border-amber-200' };
  };

  return (
    <div className="w-full bg-paper text-ink pb-36">
      
      {/* ═══════ HERO ═══════ */}
      <section className="pt-24 pb-14 px-4 sm:px-8 lg:px-16 border-b border-paper-border/60">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-vermilion mb-4">
            <span className="w-2 h-2 rounded-full bg-vermilion"></span>
            <span>EVENTS &amp; ANNOUNCEMENTS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.05]">
                What&apos;s <br />
                <span className="text-vermilion italic font-normal">happening.</span>
              </h1>
              <p className="font-body text-base sm:text-lg text-ink-muted max-w-xl mt-4 leading-relaxed font-light">
                Upcoming events, workshops, and initiatives by E-Cell, VSB CETC. Registration is handled through our external portal.
              </p>
            </div>

            <div className="text-xs font-mono text-ink-muted shrink-0">
              <span className="font-bold text-ink text-sm mr-1">{upcomingEvents.length}</span> upcoming · <span className="font-bold text-ink text-sm mx-1">{pastEvents.length}</span> past
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ UPCOMING EVENTS ═══════ */}
      {upcomingEvents.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-16 py-14 border-b border-paper-border/60">
          <div className="mx-auto max-w-[1440px]">
            
            <div className="flex items-center gap-2.5 mb-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vermilion opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-vermilion"></span>
              </span>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-ink">
                Upcoming
              </h2>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, i) => {
                const fee = getFeeLabel(event);
                const regUrl = event.registrationUrl || '#';
                const isExternal = regUrl.startsWith('http://') || regUrl.startsWith('https://');

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group rounded-2xl border border-paper-border/80 bg-white/60 hover:bg-white hover:border-paper-border transition-all p-5 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left: Event Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-headline text-lg sm:text-xl font-bold text-ink group-hover:text-vermilion transition-colors">
                            {event.title}
                          </h3>
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${fee.className}`}>
                            {fee.text}
                          </span>
                        </div>

                        <p className="text-sm text-ink-muted font-light leading-relaxed line-clamp-2">
                          {event.subtitle || event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-vermilion" />
                            <span>{formatDate(event.date)}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-ink-muted/60" />
                            <span>{formatTime(event.date)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Registration Link */}
                      <div className="shrink-0">
                        {isExternal ? (
                          <a
                            href={regUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-xs font-semibold hover:bg-vermilion transition-all"
                          >
                            <span>Register</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-paper-border text-xs font-semibold text-ink-muted">
                            <span>Details Soon</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ═══════ PAST EVENTS ═══════ */}
      {pastEvents.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-16 py-14">
          <div className="mx-auto max-w-[1440px]">
            
            <div className="mb-10">
              <span className="text-xs font-mono text-ink-muted/60 uppercase block mb-1">Archive</span>
              <h2 className="font-headline text-xl sm:text-2xl font-bold text-ink">
                Past Events
              </h2>
            </div>

            <div className="space-y-3">
              {pastEvents.map((event) => {
                const fee = getFeeLabel(event);

                return (
                  <div
                    key={event.id}
                    className="rounded-xl border border-paper-border/60 bg-paper-dim/40 p-4 sm:p-5 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-headline text-base font-bold text-ink">
                            {event.title}
                          </h3>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${fee.className}`}>
                            {fee.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-ink-muted">
                          <span>{formatDate(event.date)}</span>
                          <span>·</span>
                          <span>{event.subtitle || 'Concluded'}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-ink-muted/60 shrink-0">Concluded</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}

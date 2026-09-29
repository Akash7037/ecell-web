'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/seed';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Compass, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const MISSION_PILLARS = [
  {
    code: '01',
    title: 'Convert Hypotheses Into Defensible Equity',
    body: 'We transform academic engineering research at VSB CETC into real, investable, defensible hardware and software ventures. Every student engineer with an inventive idea gets access to lab tools, mentorship, and patent drafting.',
  },
  {
    code: '02',
    title: 'Build Tamil Nadu’s Premier Student Foundry',
    body: 'Located at VSBCETC Coimbatore, our objective is to anchor funded student ventures, file patents, and bridge the regional manufacturing corridor across Coimbatore and Tamil Nadu.',
  },
  {
    code: '03',
    title: 'The Prototyping-First Methodology',
    body: 'Students submit a one-page engineering problem statement. Our technical leads assess hardware feasibility and allocate prototyping allowances, CNC equipment, and mentor matching. Zero equity taken until commercial launch.',
  },
  {
    code: '04',
    title: 'Interdisciplinary Engineering Collaboration',
    body: 'Mechanical designers, robotics engineers, AI coders, and business leads collaborate across departments and academic batches. From first-year tinkerers to final-year capstone builders, all are welcome in the foundry.',
  },
];


export function AboutPage() {
  return (
    <div className="w-full bg-paper text-ink pb-28">
      {/* ═══════ HERO ═══════ */}
      <section className="border-b border-paper-border bg-white/70 backdrop-blur-sm pt-14 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-vermilion mb-4">
            <span className="w-2 h-2 rounded-full bg-vermilion"></span>
            <span>INSTITUTIONAL MANIFESTO</span>
          </div>

          <h1 className="font-headline text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink leading-[1.05] max-w-4xl">
            Where student research <br />
            <span className="text-ink/50 font-normal">becomes commercial reality.</span>
          </h1>

          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <p className="font-body text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
              The Entrepreneurship Cell of <strong className="text-ink font-semibold">VSB College of Engineering &amp; Technical Campus</strong>, Coimbatore, Tamil Nadu. Converting student engineering hypotheses into enduring enterprises.
            </p>
            <div className="text-xs font-mono text-ink-muted shrink-0">
              <span className="px-3.5 py-1.5 rounded-full bg-paper-dim border border-paper-border text-ink font-medium block">
                CAMPUS NODE: VSBCETC COIMBATORE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EMBLEM & PHILOSOPHY CARD ═══════ */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-10 border-b border-paper-border bg-paper">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[380px] smooth-card p-8 text-center">
                <div className="w-28 h-28 mx-auto p-3 rounded-2xl border border-paper-border bg-paper-dim mb-5 flex items-center justify-center">
                  <img src="/logo.png" alt="VSB Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-headline text-xl font-bold text-ink">
                  VSBCETC E-CELL
                </h3>
                <span className="font-body text-xs text-ink-muted block mt-1">
                  Coimbatore, Tamil Nadu
                </span>
                <div className="mt-4 pt-4 border-t border-paper-border text-[11px] font-mono text-vermilion font-medium">
                  NODE // VSBCETC
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-semibold text-vermilion uppercase tracking-wider block">
                OUR OPERATIONAL PHILOSOPHY
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-ink leading-tight">
                Bridging Academic Engineering with Enterprise Equity
              </h2>
              <p className="font-body text-base text-ink-muted leading-relaxed">
                Engineering education is often weighed down by passive theoretical models. At VSB CETC, we believe the best way to understand microcontrollers, power electronics, machine learning, and automation is to build and commercialize them.
              </p>
              <p className="font-body text-base text-ink-muted leading-relaxed">
                Through our rapid prototyping sandboxes, patent assistance desk, and flagship summits like <strong className="text-ink font-semibold">Project Expo '26</strong>, we empower students to turn capstone projects into funded, defensible startups.
              </p>

              <div className="pt-2">
                <Link href="/team" className="btn-apple-primary gap-2">
                  <span>Explore Team Stories &amp; Dedicated Views</span>
                  <ChevronRight className="w-4 h-4 text-vermilion" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ FOUR PILLARS ═══════ */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-10 border-b border-paper-border bg-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="pb-6 mb-12 border-b border-paper-border">
            <span className="text-xs uppercase tracking-wider text-vermilion font-semibold block mb-1">
              CORE PRINCIPLES
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-ink">
              Foundry Directives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSION_PILLARS.map((item) => (
              <div
                key={item.code}
                className="smooth-card p-8 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-vermilion uppercase block mb-2">
                    {item.code} // DIRECTIVE
                  </span>
                  <h3 className="font-headline text-xl font-bold text-ink mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-ink-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

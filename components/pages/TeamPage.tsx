'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { members } from '@/data/seed';
import type { Member } from '@/types';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  ChevronLeft,
  ChevronRight,
  Quote,
  Compass,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const WINGS = [
  'All Wings',
  'Core Leadership',
  'Technical & Hardware Sandbox',
  'Corporate & Venture Relations',
  'Incubation & IP Cell',
  'Media & Design Foundry',
];

export function TeamPage() {
  const [selectedWing, setSelectedWing] = useState('All Wings');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredMembers = selectedWing === 'All Wings'
    ? members
    : members.filter((m) => m.wing === selectedWing);

  // Keep active index in bounds if filter changes
  const currentMember = filteredMembers[activeIndex] || filteredMembers[0] || members[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredMembers.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredMembers.length) % filteredMembers.length);
  };

  const handleSelectMember = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full bg-paper text-ink pb-36">
      
      {/* ═══════ HERO: OPEN EDITORIAL INTRODUCTION ═══════ */}
      <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 border-b border-paper-border/80">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-vermilion mb-4">
            <span className="w-2 h-2 rounded-full bg-vermilion"></span>
            <span>FOUNDRY OPERATORS &amp; BUILDERS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-ink leading-[1.02]">
                The minds <br />
                <span className="text-vermilion italic font-normal">behind the foundry.</span>
              </h1>
              <p className="font-body text-lg sm:text-xl text-ink-muted max-w-2xl mt-6 leading-relaxed font-light">
                Faculty mentors, multidisciplinary student engineers, and venture operators orchestrating prototype sandboxes, patent assistance, and angel syndicates at <strong className="text-ink font-semibold">VSB College of Engineering &amp; Technical Campus (VSBCETC)</strong>, Coimbatore.
              </p>
            </div>

            <div className="text-xs font-mono text-ink-muted shrink-0">
              <span className="font-bold text-ink text-sm mr-1.5">{members.length}</span> OPERATORS ACTIVE
            </div>
          </div>

          {/* Wing Category Filter Pills */}
          <div className="flex items-center gap-3 mt-12 overflow-x-auto pb-2 scrollbar-none">
            {WINGS.map((wing) => {
              const isActive = selectedWing === wing;
              return (
                <button
                  key={wing}
                  onClick={() => {
                    setSelectedWing(wing);
                    setActiveIndex(0);
                  }}
                  className={`text-xs whitespace-nowrap transition-all pb-1 border-b-2 ${
                    isActive
                      ? 'border-ink text-ink font-semibold'
                      : 'border-transparent text-ink-muted hover:text-ink'
                  }`}
                >
                  {wing}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ KIN-STYLE DEDICATED SEPARATE VIEWS (NO BOXES, NO GRID) ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 pt-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Clean Unboxed Roster Rail */}
            <div className="lg:col-span-4 flex flex-col divide-y divide-paper-border/80 border-y border-paper-border/80 max-h-[880px] overflow-y-auto pr-2">
              <div className="py-4 flex items-center justify-between text-xs text-ink-muted font-mono uppercase">
                <span>MEMBER ROSTER</span>
                <span>{filteredMembers.length} ACTIVE</span>
              </div>

              {filteredMembers.map((member, idx) => {
                const isCurrent = member.id === currentMember.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(idx)}
                    className={`py-4 text-left transition-all flex items-center gap-4 group ${
                      isCurrent ? 'opacity-100' : 'opacity-45 hover:opacity-85'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-paper-dim shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-ink truncate group-hover:text-vermilion transition-colors">
                          {member.name}
                        </h4>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-vermilion shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-ink-muted truncate mt-0.5 font-light">
                        {member.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Dedicated Individual Member View (Open Stage) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMember.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-12"
                >
                  
                  {/* Top Bar: Wing Tag & Previous/Next Navigation */}
                  <div className="flex items-center justify-between pb-6 border-b border-paper-border/80">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase font-semibold text-vermilion tracking-wider">
                        {currentMember.wing || 'Foundry Member'}
                      </span>
                      {currentMember.keyMetric && (
                        <>
                          <span className="text-ink/20">•</span>
                          <span className="text-xs font-mono text-ink-muted">
                            {currentMember.keyMetric}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-ink-muted">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(filteredMembers.length).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrev}
                          className="w-9 h-9 rounded-full border border-paper-border bg-white flex items-center justify-center hover:bg-paper-dim text-ink transition-colors"
                          aria-label="Previous member"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="w-9 h-9 rounded-full border border-paper-border bg-white flex items-center justify-center hover:bg-paper-dim text-ink transition-colors"
                          aria-label="Next member"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Portrait & Story Spread */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                    
                    {/* Portrait Side */}
                    <div className="md:col-span-5">
                      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-paper-dim">
                        <img
                          src={currentMember.image}
                          alt={currentMember.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Portfolio Button (only when provided) */}
                      {currentMember.portfolio && (
                        <a
                          href={currentMember.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/port mt-4 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
                            bg-white/30 backdrop-blur-md border border-white/40
                            shadow-[0_2px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]
                            hover:bg-vermilion/10 hover:border-vermilion/30 hover:shadow-[0_4px_24px_rgba(255,77,46,0.15),inset_0_1px_0_rgba(255,255,255,0.4)]
                            transition-all duration-300 ease-out cursor-pointer"
                        >
                          <span className="text-xs font-semibold text-ink group-hover/port:text-vermilion transition-colors">
                            View Portfolio
                          </span>
                          <svg className="w-3.5 h-3.5 text-ink-muted group-hover/port:text-vermilion transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}

                      {/* Social Links */}
                      <div className="flex items-center gap-3 mt-4 text-xs font-mono">
                        {currentMember.socials.linkedin && (
                          <a
                            href={currentMember.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-muted hover:text-vermilion transition-colors"
                          >
                            LinkedIn ↗
                          </a>
                        )}
                        {currentMember.socials.github && (
                          <a
                            href={currentMember.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-muted hover:text-ink transition-colors"
                          >
                            GitHub ↗
                          </a>
                        )}
                        {currentMember.socials.twitter && (
                          <a
                            href={currentMember.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink-muted hover:text-ink transition-colors"
                          >
                            Twitter ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Member Voice & Quotes */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-vermilion uppercase tracking-wider block mb-1">
                          {currentMember.role}
                        </span>
                        <h2 className="font-headline text-4xl sm:text-5xl font-bold text-ink leading-tight">
                          {currentMember.name}
                        </h2>
                        <p className="font-mono text-xs text-ink-muted mt-1.5">
                          {currentMember.department} {currentMember.year && !currentMember.role.includes('Faculty') ? `• Year ${currentMember.year}` : ''}
                        </p>

                        {/* Large Editorial Quote */}
                        {currentMember.quote && (
                          <blockquote className="font-headline text-xl sm:text-2xl font-normal italic text-ink leading-snug border-l-2 border-vermilion pl-5 my-8">
                            "{currentMember.quote}"
                          </blockquote>
                        )}

                        <p className="font-body text-base text-ink-muted leading-relaxed font-light">
                          {currentMember.bio}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Open Editorial Q&A / Dedicated Perspectives */}
                  <div className="pt-10 border-t border-paper-border/80 grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                    {/* Perspective */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ink">
                        <Compass className="w-3.5 h-3.5 text-vermilion" />
                        <span>MY E-CELL MANDATE &amp; PERSPECTIVE</span>
                      </div>
                      <p className="font-body text-sm text-ink-muted leading-relaxed font-light">
                        {currentMember.ecellPerspective || 'Directing student engineering sprints to build tangible hardware and software ventures.'}
                      </p>
                    </div>

                    {/* Active Blueprint */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ink">
                        <Cpu className="w-3.5 h-3.5 text-vermilion" />
                        <span>ACTIVE BLUEPRINT &amp; EXPERIMENT</span>
                      </div>
                      <p className="font-body text-sm text-ink-muted leading-relaxed font-light">
                        {currentMember.currentProject || 'Leading hardware development and Project Expo 26 preparations.'}
                      </p>
                    </div>

                    {/* Why E-Cell */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ink">
                        <Sparkles className="w-3.5 h-3.5 text-vermilion" />
                        <span>WHY E-CELL VSB CETC?</span>
                      </div>
                      <p className="font-body text-sm text-ink-muted leading-relaxed font-light">
                        {currentMember.whyEcell || 'The unmatched community of hardware hackers, software builders, and faculty mentors committed to turning lab projects into companies.'}
                      </p>
                    </div>

                    {/* Mandates */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-ink">
                        <CheckCircle2 className="w-3.5 h-3.5 text-vermilion" />
                        <span>KEY MANDATES GUIDED</span>
                      </div>
                      <ul className="space-y-1.5 font-body text-xs text-ink-muted font-light">
                        {currentMember.contributions.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-vermilion font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ OPEN RECRUITMENT CALLOUT ═══════ */}
      <section className="w-full px-4 sm:px-8 lg:px-16 mt-28">
        <div className="mx-auto max-w-[1440px] pt-12 border-t border-paper-border/80 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-semibold text-vermilion uppercase tracking-wider block mb-1">
              STUDENT VENTURE RECRUITMENT
            </span>
            <h3 className="font-headline text-3xl font-bold text-ink">
              Want to lead an engineering or venture wing?
            </h3>
            <p className="font-body text-sm text-ink-muted mt-2 max-w-xl font-light">
              Cohort inductions open each semester for student engineers across Mechatronics, CSE, AI&amp;DS, EEE, and Mechanical departments at VSB CETC.
            </p>
          </div>

          <Link
            href="/contact#join"
            className="px-8 py-4 rounded-full bg-ink text-paper text-xs font-semibold hover:bg-vermilion transition-colors shrink-0"
          >
            Apply for Induction Cohort →
          </Link>
        </div>
      </section>

    </div>
  );
}

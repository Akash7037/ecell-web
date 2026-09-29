'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Mail, 
  ArrowUpRight, 
  Lock, 
  Cpu, 
  Layers
} from 'lucide-react';
import { HeroCanvasBackground } from '@/components/ui/HeroCanvasBackground';

export function UnderDevelopmentPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white/90 relative overflow-hidden flex flex-col justify-between selection:bg-vermilion selection:text-white">
      
      {/* Dynamic Interactive Ambient Canvas */}
      <HeroCanvasBackground enabled={true} />

      {/* Subtle Radial Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vermilion/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-white/5 p-1 flex items-center justify-center backdrop-blur-md shadow-xs">
            <img 
              src="/logo.png" 
              alt="VSBCETC E-Cell Logo" 
              className="w-full h-full object-contain rounded-full" 
            />
          </div>
          <div>
            <span className="font-headline font-bold text-sm tracking-tight text-white/90 block leading-tight">
              VSB E-CELL
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-vermilion font-medium">
              VSBCETC • Coimbatore
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-vermilion animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/60 font-semibold">
            Under Development
          </span>
        </div>
      </header>

      {/* Center Hero Card */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center flex flex-col items-center justify-center">
        
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-2 bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative group">
            <div className="absolute inset-0 bg-vermilion/20 rounded-full blur-2xl group-hover:blur-3xl transition-all pointer-events-none" />
            <img 
              src="/logo.png" 
              alt="VSBCETC Official Logo" 
              className="w-full h-full object-contain rounded-full relative z-10" 
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>CAMPUS VENTURE FOUNDRY &bull; VSBCETC</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-headline text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-3xl"
        >
          Something enduring <br className="hidden sm:inline" />
          is being <span className="text-vermilion italic font-normal">engineered.</span>
        </motion.h1>

        {/* Editorial Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-sm sm:text-base lg:text-lg text-white/50 max-w-xl mt-6 leading-relaxed font-light"
        >
          The official digital presence for the <strong className="text-white/80 font-medium">Entrepreneurship Cell at VSB College of Engineering Technical Campus (VSBCETC), Coimbatore</strong> is currently undergoing system calibrations and final deployment.
        </motion.p>

        {/* Technical Progress Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 w-full max-w-lg p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-3">
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-vermilion" />
              <span>SYSTEM CALIBRATION</span>
            </span>
            <span className="text-vermilion font-bold">85% COMPLETE</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-vermilion to-amber-500 rounded-full w-[85%]" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-white/[0.04]">
            <div>
              <span className="text-[10px] font-mono uppercase text-white/30 block">Location Node</span>
              <span className="text-xs font-semibold text-white/70">Coimbatore, Tamil Nadu</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-white/30 block">Official Launch</span>
              <span className="text-xs font-semibold text-white/70">Coming Soon &bull; 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Contact Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="mailto:ecell@vsbcetc.ac.in"
            className="px-6 py-3 rounded-full bg-white text-ink text-xs font-semibold hover:bg-vermilion hover:text-white transition-all shadow-md flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-vermilion group-hover:text-white" />
            <span>ecell@vsbcetc.ac.in</span>
          </a>

          <Link
            href="/admin"
            className="px-5 py-3 rounded-full border border-white/10 text-xs font-mono text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
          >
            <Lock className="w-3 h-3 text-white/40" />
            <span>Operator Access</span>
          </Link>
        </motion.div>

      </main>

      {/* Footer Bar */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/30">
        <div>
          &copy; {new Date().getFullYear()} VSB E-Cell &bull; VSBCETC Coimbatore.
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/company/vsbcetc-ecell"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-50" />
          </a>
          <a
            href="https://instagram.com/vsbcetc_ecell"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Instagram</span>
            <ArrowUpRight className="w-3 h-3 opacity-50" />
          </a>
          <a
            href="https://github.com/vsbcetc-ecell"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-50" />
          </a>
        </div>
      </footer>

    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/Atoms';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface HeroProps {
  watermarkEnabled?: boolean;
  watermarkOpacity?: number;
}

export default function Hero({
  watermarkEnabled = true,
  watermarkOpacity = 0.02,
}: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-16 md:pt-[72px] overflow-hidden">
      {/* Reduced Opacity Background Image & Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Ambient atmospheric aura spots using palette colors */}
        <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-[#DAD0ED]/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/3 left-1/4 w-[420px] h-[420px] bg-[#D0E4ED]/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#EDE8D0]/30 rounded-full blur-3xl -z-10" />

        {/* Faint, subtle reduced-opacity watermark of the student team */}
        {watermarkEnabled && (
          <img
            src="/images/hero-team.jpg"
            alt=""
            aria-hidden="true"
            style={{ opacity: watermarkOpacity }}
            className="absolute inset-0 w-full h-full object-cover contrast-110 filter grayscale mix-blend-multiply transition-opacity duration-300 pointer-events-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F2] via-transparent to-[#FAF8F2]/70" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-6 py-14 md:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left: Text & Positioning */}
          <div className="lg:col-span-7">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-4">
              <p className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                VSB College of Engineering &amp; Technical Campus &bull; Coimbatore
              </p>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-headline text-[2.4rem] sm:text-[3.25rem] md:text-[3.85rem] lg:text-[4.2rem] font-bold text-ink leading-[1.04] tracking-tight"
            >
              Building the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vermilion via-[#D6391C] to-[#8B5CF6]">
                next generation
              </span><br />
              of founders.
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-xl"
            >
              The official Entrepreneurship Cell of VSB CETC Coimbatore. Converting student engineering hypotheses into defensible enterprise equity, utility patents, and venture-backed prototypes.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-7 flex flex-wrap items-center gap-3.5"
            >
              <Button href="/events" size="lg">
                Explore Events &rarr;
              </Button>
              <Button href="/team" variant="ghost" size="lg" className="border-paper-muted hover:bg-[#D0E4ED]/40 text-ink">
                Meet the Team
              </Button>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 pt-6 border-t border-paper-muted flex flex-wrap items-center gap-6 sm:gap-10 text-xs font-mono"
            >
              <div>
                <span className="block font-headline text-lg sm:text-xl font-bold text-ink">12+</span>
                <span className="text-ink-light uppercase tracking-wider text-[10px]">Utility Patents</span>
              </div>
              <div className="h-7 w-px bg-paper-muted" />
              <div>
                <span className="block font-headline text-lg sm:text-xl font-bold text-ink">8 Cohorts</span>
                <span className="text-ink-light uppercase tracking-wider text-[10px]">Hardware Sandboxes</span>
              </div>
              <div className="h-7 w-px bg-paper-muted" />
              <div>
                <span className="block font-headline text-lg sm:text-xl font-bold text-ink">22 Leads</span>
                <span className="text-ink-light uppercase tracking-wider text-[10px]">Student Council</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Real Team Photography Showcase */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="relative rounded-sm overflow-hidden border border-paper-muted bg-paper shadow-xl">
                <img
                  src="/images/hero-team.jpg"
                  alt="E-Cell VSBCETC Student Founders and Executive Council"
                  className="w-full h-auto aspect-[16/10] object-cover"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

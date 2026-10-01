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
  watermarkOpacity = 0.08,
}: HeroProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center pt-20 md:pt-24 pb-16 overflow-hidden">
      {/* Background Watermark Image & Ambient Palette Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft atmospheric radial gradients using brand palette */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#DAD0ED]/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-[#D0E4ED]/35 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EDE8D0]/30 rounded-full blur-3xl -z-10" />

        {/* The student team photo as the background visual */}
        {watermarkEnabled && (
          <img
            src="/images/hero-team.jpg"
            alt=""
            aria-hidden="true"
            style={{ opacity: watermarkOpacity }}
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-110 mix-blend-multiply transition-opacity duration-300 pointer-events-none"
          />
        )}
        {/* Subtle gradient wash to keep text crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F2] via-transparent to-[#FAF8F2]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F2]/85 via-[#FAF8F2]/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-6 py-12 md:py-20 z-10">
        <div className="max-w-3xl lg:max-w-4xl">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-5">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-wider">
              VSB College of Engineering &amp; Technical Campus &bull; Coimbatore
            </p>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-headline text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] font-bold text-ink leading-[1.03] tracking-tight"
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
            className="mt-6 text-lg sm:text-xl text-ink-muted leading-relaxed max-w-2xl"
          >
            The official Entrepreneurship Cell of VSB CETC Coimbatore. Empowering student innovators, supporting hands-on projects, and fostering the entrepreneurial ecosystem on campus.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button href="/events" size="lg">
              Explore Events &rarr;
            </Button>
            <Button href="/team" variant="ghost" size="lg" className="border-paper-muted hover:bg-[#D0E4ED]/40 text-ink">
              Meet the Team
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

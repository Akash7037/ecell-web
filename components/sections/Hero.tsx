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
  watermarkOpacity = 0.15,
}: HeroProps) {
  const displayOpacity = Math.max(watermarkOpacity ?? 0.15, 0.14);

  return (
    <section className="relative min-h-[88vh] flex items-center pt-20 md:pt-24 pb-16 overflow-hidden">
      {/* Background Watermark Image & Ambient Palette Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Soft atmospheric radial gradients using user brand palette (#DBFFFD, #C4FEFF, #FFD0C4, #FFEEDB) */}
        <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] bg-[#DBFFFD]/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-[460px] h-[460px] bg-[#C4FEFF]/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-[#FFEEDB]/60 rounded-full blur-3xl -z-10" />
        <div className="absolute top-2/3 right-1/3 w-[380px] h-[380px] bg-[#FFD0C4]/35 rounded-full blur-3xl -z-10" />

        {/* Seamless 2-Tile Infinite Moving Backdrop revealing 100% of all team members across the scroll */}
        {watermarkEnabled && (
          <div
            className="hero-tile-container absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ opacity: displayOpacity }}
          >
            <div className="hero-tile-track flex w-max h-full">
              {/* Tile 1: Full uncropped natural aspect ratio */}
              <div className="h-full w-auto shrink-0 relative overflow-hidden flex items-center">
                <img
                  src="/images/hero-team.jpg"
                  alt=""
                  aria-hidden="true"
                  width={2800}
                  height={1292}
                  className="h-full w-auto max-w-none object-contain filter grayscale contrast-110 mix-blend-multiply pointer-events-none"
                />
              </div>
              {/* Tile 2: Seamless identical clone */}
              <div className="h-full w-auto shrink-0 relative overflow-hidden flex items-center">
                <img
                  src="/images/hero-team.jpg"
                  alt=""
                  aria-hidden="true"
                  width={2800}
                  height={1292}
                  className="h-full w-auto max-w-none object-contain filter grayscale contrast-110 mix-blend-multiply pointer-events-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Subtle gradient wash to keep text crystal clear without hiding the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F2] via-transparent to-[#FAF8F2]/50" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FAF8F2]/90 via-[#FAF8F2]/45 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-6 py-10 sm:py-12 md:py-20 z-10">
        <div className="max-w-3xl lg:max-w-4xl">
          <h1 className="font-headline text-[2.15rem] xs:text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.5rem] font-bold text-ink leading-[1.08] sm:leading-[1.04] tracking-tight">
            Building the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C3A26] via-[#824539] to-[#268B8C]">
              next generation
            </span><br />
            of founders.
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#1C1917] font-medium sm:font-normal sm:text-ink-muted leading-relaxed max-w-2xl">
            The official Entrepreneurship Cell of VSB CETC Coimbatore. Empowering student innovators, supporting hands-on projects, and fostering the entrepreneurial ecosystem on campus.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-xs sm:max-w-none">
            <Button href="/events" size="lg" className="justify-center text-center">
              Explore Events &rarr;
            </Button>
            <Button
              href="/team"
              variant="ghost"
              size="lg"
              className="border-[#268B8C]/40 text-[#268B8C] hover:bg-[#DBFFFD]/40 hover:border-[#268B8C] justify-center text-center"
            >
              Meet the Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

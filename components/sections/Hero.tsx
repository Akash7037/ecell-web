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

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-16 md:pt-[72px] bg-paper">
      <div className="mx-auto max-w-7xl w-full px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left: Text */}
          <div className="order-2 md:order-1">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <SectionLabel>VSB College of Engineering · Coimbatore</SectionLabel>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-headline text-[2.25rem] md:text-[3.5rem] lg:text-[4rem] font-bold text-ink leading-[1.05] tracking-tight"
            >
              Building the<br />
              <span className="text-vermilion">next generation</span><br />
              of founders.
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5 text-base md:text-lg text-ink-muted leading-relaxed max-w-sm"
            >
              E-Cell VSBCETC is the entrepreneurship cell for student innovators,
              prototype builders, and aspiring venture founders.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button href="/events" size="lg">
                View Events
              </Button>
              <Button href="/team" variant="ghost" size="lg">
                Meet the Team
              </Button>
            </motion.div>
          </div>

          {/* Right: Visual */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="order-1 md:order-2 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Abstract geometric visual — bold, editorial */}
              <div className="absolute inset-0 rounded-sm bg-paper-muted overflow-hidden">
                {/* Grid lines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <g key={i}>
                      <line x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="#DDD7CB" strokeWidth="1" />
                      <line x1="0" y1={i * 100} x2="400" y2={i * 100} stroke="#DDD7CB" strokeWidth="1" />
                    </g>
                  ))}
                  {/* Bold E mark */}
                  <rect x="100" y="80" width="200" height="28" fill="#121316" />
                  <rect x="100" y="186" width="160" height="28" fill="#121316" />
                  <rect x="100" y="292" width="200" height="28" fill="#121316" />
                  <rect x="100" y="80" width="28" height="240" fill="#121316" />
                  {/* Vermilion accent dot */}
                  <circle cx="320" cy="210" r="20" fill="#FF4D2E" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

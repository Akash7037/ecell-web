'use client';

import { motion } from 'framer-motion';

interface MottoSectionProps {
  quote?: string;
  author?: string;
  role?: string;
}

export default function MottoSection({
  quote = "Ideas today, impact tomorrow. We do not wait for permission or polish—we prototype at midnight, test to failure, and build defensible enterprises from engineering hypotheses.",
  author = "E-Cell Council & Prototyping Sandbox",
  role = "VSB College of Engineering & Technical Campus · Coimbatore",
}: MottoSectionProps) {
  return (
    <section className="relative bg-ink text-white py-20 md:py-28 overflow-hidden border-y border-ink/80">
      {/* Ambient background glows matching palette lavender (#DAD0ED) and ice (#D0E4ED) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-24 left-1/4 w-[450px] h-[450px] bg-[#DAD0ED]/15 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 right-1/4 w-[450px] h-[450px] bg-[#D0E4ED]/10 rounded-full blur-3xl -z-10" />
        
        {/* Subtle grid lines in dark background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(to right, #EDE8D0 1px, transparent 1px), linear-gradient(to bottom, #EDE8D0 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 z-10 text-center">


        {/* The Quote Statement */}
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold leading-[1.25] tracking-tight text-white max-w-4xl mx-auto"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {/* Attribution Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 pt-6 border-t border-white/10 max-w-md mx-auto"
        >
          <p className="font-semibold text-sm sm:text-base text-[#EDE8D0] tracking-wide">
            {author}
          </p>
          <p className="font-mono text-xs text-[#D0E4ED]/80 mt-1 uppercase tracking-wider">
            {role}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

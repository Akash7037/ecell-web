'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ZapIcon, UsersIcon, TrophyIcon } from 'lucide-react';
import { SectionLabel, Divider } from '@/components/ui/Atoms';

const pillars = [
  {
    icon: ZapIcon,
    title: 'Prototype & Build',
    body: 'From IoT rigs to mechatronics systems — we give students the labs and mentorship to build real working prototypes.',
  },
  {
    icon: TrophyIcon,
    title: 'Compete & Showcase',
    body: 'Our flagship Project Expo brings together student innovators to present, compete, and connect with industry leaders.',
  },
  {
    icon: UsersIcon,
    title: 'Mentor & Network',
    body: 'Direct access to startup mentors, angel investors, and IPR advisors from Tamil Nadu and beyond.',
  },
];

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return { ref, isInView };
}

export default function AboutStrip() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#FAF9F6] py-16 md:py-24 border-y border-[#E7E5E4]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#1C1917] max-w-xl">
            From engineering ideas to enduring enterprises.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="py-8 md:py-0 md:px-8 first:pl-0 last:pr-0 border-b md:border-b-0 md:border-l border-[#E7E5E4] first:border-l-0 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5] shadow-xs">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="font-headline text-base font-bold text-[#1C1917] mb-2">{pillar.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{pillar.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

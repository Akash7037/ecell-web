'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MemberCard, type TeamMember } from '@/components/ui/MemberCard';
import { SectionLabel } from '@/components/ui/Atoms';
import Button from '@/components/ui/Button';

interface TeamSectionProps {
  members: TeamMember[];
  showViewAll?: boolean;
  limit?: number;
}

export default function TeamSection({ members, showViewAll = true, limit = 6 }: TeamSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const displayed = limit ? members.slice(0, limit) : members;

  return (
    <section ref={ref} className="bg-paper py-16 md:py-24 border-t border-paper-muted">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <SectionLabel>People</SectionLabel>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink">The Team</h2>
          </div>
          {showViewAll && members.length > limit && (
            <Button href="/team" variant="text" size="sm">
              Full team →
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayed.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

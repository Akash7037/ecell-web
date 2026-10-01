'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EventCard, type Event } from '@/components/ui/EventCard';
import { SectionLabel } from '@/components/ui/Atoms';
import Button from '@/components/ui/Button';

interface EventsSectionProps {
  events: Event[];
  showViewAll?: boolean;
  limit?: number;
}

export default function EventsSection({ events, showViewAll = true, limit = 3 }: EventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const displayed = limit ? events.slice(0, limit) : events;

  return (
    <section ref={ref} className="bg-paper-dim py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2"
        >
          <div>
            <SectionLabel>Upcoming</SectionLabel>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink">Events</h2>
          </div>
          {showViewAll && events.length > limit && (
            <Button href="/events" variant="text" size="sm">
              View all events →
            </Button>
          )}
        </motion.div>

        {displayed.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="py-12 text-sm text-ink-light border-t border-paper-muted"
          >
            No upcoming events. Check back soon.
          </motion.p>
        ) : (
          <div>
            {displayed.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

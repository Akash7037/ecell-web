'use client';

import { useState } from 'react';
import { EventCard, type Event } from '@/components/ui/EventCard';
import { SectionLabel } from '@/components/ui/Atoms';
import EventModal from '@/components/ui/EventModal';

interface EventsPageClientProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export default function EventsPageClient({ upcomingEvents, pastEvents }: EventsPageClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <>
      {/* Upcoming Section */}
      <section className="bg-paper-dim py-16 md:py-24 border-t border-paper-muted">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6">
            <SectionLabel>Scheduled</SectionLabel>
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink">Upcoming Events</h2>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="py-12 text-sm text-ink-light border-t border-paper-muted">
              No upcoming events scheduled right now. Check back soon.
            </p>
          ) : (
            <div>
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past & Concluded Events (Old Events) */}
      {pastEvents.length > 0 && (
        <section className="bg-paper py-16 md:py-20 border-t border-paper-muted">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8">
              <SectionLabel>Archive & Past Summits</SectionLabel>
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink">Past & Concluded Events</h2>
              <p className="text-xs text-ink-muted mt-1">
                Click any concluded event to view the header photos, highlights, and hardware prototypes.
              </p>
            </div>

            <div className="divide-y divide-paper-muted">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Modal with Header Photo & Gallery Grid */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}

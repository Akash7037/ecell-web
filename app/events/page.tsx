import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventsSection from '@/components/sections/EventsSection';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredEvents } from '@/lib/dataStoreServer';
import { SectionLabel } from '@/components/ui/Atoms';
import { EventCard } from '@/components/ui/EventCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events and innovation summits from E-Cell VSBCETC, Coimbatore.',
};

export default async function EventsPage() {
  const events = await getStoredEvents();

  const isFinished = (e: any) => {
    const d = (e.date || '').toLowerCase();
    const s = (e.shortDescription || '').toLowerCase();
    return d.includes('completed') || d.includes('archive') || d.includes('concluded') || s.includes('completed') || s.includes('archived');
  };

  const upcomingEvents = events.filter((e) => !isFinished(e));
  const pastEvents = events.filter((e) => isFinished(e));

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px]">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-4">
            E-Cell VSBCETC
          </p>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-2">
            Events & Summits
          </h1>
          <p className="text-base text-ink-muted max-w-lg">
            Engineering prototype expos, hackathons, and investor rounds hosted at VSBCETC Coimbatore.
          </p>
        </div>

        {/* Upcoming Section */}
        <EventsSection events={upcomingEvents} showViewAll={false} limit={100} />

        {/* Past Events Archive (if any) */}
        {pastEvents.length > 0 && (
          <section className="bg-paper py-16 border-t border-paper-muted">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-8">
                <SectionLabel>Archive</SectionLabel>
                <h2 className="font-headline text-2xl font-bold text-ink">Past & Concluded Events</h2>
                <p className="text-xs text-ink-muted mt-1">Previous hackathons and prototypes tested on campus.</p>
              </div>
              <div className="divide-y divide-paper-muted opacity-80">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Subscribe Section */}
        <SubscribeSection />
      </div>
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventsPageClient from '@/components/sections/EventsPageClient';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredEvents } from '@/lib/dataStoreServer';
import { isEventConcluded } from '@/lib/eventUtils';

import { SuggestEventButton } from '@/components/ui/SuggestEventModal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events and innovation summits from E-Cell VSBCETC, Coimbatore.',
};

export default async function EventsPage() {
  const events = await getStoredEvents();

  const upcomingEvents = events.filter((e) => !isEventConcluded(e));
  const pastEvents = events.filter((e) => isEventConcluded(e));

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px]">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-3">
              E-Cell VSBCETC
            </p>
            <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-3">
              Events &amp; Summits
            </h1>
            <p className="text-base text-ink-muted max-w-lg mx-auto md:mx-0 leading-relaxed">
              Engineering prototype expos, hackathons, and investor rounds hosted at VSBCETC Coimbatore.
            </p>
          </div>
          <div className="flex justify-center md:justify-end shrink-0">
            <SuggestEventButton />
          </div>
        </div>

        {/* Events List (Upcoming & Past with Modal Photo Support) */}
        <EventsPageClient upcomingEvents={upcomingEvents} pastEvents={pastEvents} />

        {/* Subscribe Section */}
        <SubscribeSection />
      </div>
      <Footer />
    </>
  );
}

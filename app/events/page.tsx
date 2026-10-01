import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventsSection from '@/components/sections/EventsSection';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredEvents } from '@/lib/dataStoreServer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events from E-Cell VSBCETC, Coimbatore.',
};

export default async function EventsPage() {
  const events = await getStoredEvents();

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-4">
            E-Cell VSBCETC
          </p>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-2">
            Events
          </h1>
          <p className="text-base text-ink-muted max-w-lg">
            All upcoming events hosted by E-Cell VSBCETC. Registration links open on announcement.
          </p>
        </div>
        <EventsSection events={events} showViewAll={false} limit={100} />
        <SubscribeSection />
      </div>
      <Footer />
    </>
  );
}

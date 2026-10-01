import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import AboutStrip from '@/components/sections/AboutStrip';
import EventsSection from '@/components/sections/EventsSection';
import TeamSection from '@/components/sections/TeamSection';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredEvents, getStoredMembers } from '@/lib/dataStoreServer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await getStoredEvents();
  const members = await getStoredMembers();

  // Only display active & upcoming events on the homepage (filter out finished/archived)
  const upcomingEvents = events.filter((e) => {
    const d = (e.date || '').toLowerCase();
    const s = (e.shortDescription || '').toLowerCase();
    if (d.includes('completed') || d.includes('archive') || d.includes('concluded')) return false;
    if (s.includes('completed') || s.includes('archived')) return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <Hero />
      <AboutStrip />
      <EventsSection events={upcomingEvents} showViewAll={events.length > upcomingEvents.length || upcomingEvents.length > 3} limit={3} />
      <TeamSection members={members} showViewAll={members.length > 6} limit={6} />
      <SubscribeSection />
      <Footer />
    </>
  );
}

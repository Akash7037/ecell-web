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

  return (
    <>
      <Navbar />
      <Hero />
      <AboutStrip />
      <EventsSection events={events} showViewAll={events.length > 3} limit={3} />
      <TeamSection members={members} showViewAll={members.length > 6} limit={6} />
      <SubscribeSection />
      <Footer />
    </>
  );
}

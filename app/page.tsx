import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import AboutStrip from '@/components/sections/AboutStrip';
import EventsSection from '@/components/sections/EventsSection';
import MottoSection from '@/components/sections/MottoSection';
import TeamSection from '@/components/sections/TeamSection';
import SubscribeSection from '@/components/ui/SubscribeSection';
import { getStoredEvents, getStoredMembers } from '@/lib/dataStoreServer';
import { getSiteSettings } from '@/lib/siteSettingsServer';

import { isEventConcluded } from '@/lib/eventUtils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await getStoredEvents();
  const members = await getStoredMembers();
  const settings = getSiteSettings();

  // Only display active & upcoming events on the homepage (filter out finished/concluded)
  const upcomingEvents = events.filter((e) => !isEventConcluded(e));

  return (
    <>
      <Navbar />
      <Hero
        watermarkEnabled={settings.heroWatermarkEnabled ?? true}
        watermarkOpacity={settings.heroWatermarkOpacity ?? 0.08}
      />
      <AboutStrip />
      <EventsSection events={upcomingEvents} showViewAll={events.length > upcomingEvents.length || upcomingEvents.length > 3} limit={3} />
      <MottoSection quote={settings.mottoQuote} author={settings.mottoAuthor} role={settings.mottoRole} />
      <TeamSection members={members} showViewAll={members.length > 6} limit={6} />
      <SubscribeSection />
      <Footer />
    </>
  );
}

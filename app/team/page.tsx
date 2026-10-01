import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TeamSection from '@/components/sections/TeamSection';
import { getStoredMembers } from '@/lib/dataStoreServer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the team behind E-Cell VSBCETC, Coimbatore.',
};

export default async function TeamPage() {
  const members = await getStoredMembers();

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-4">
            E-Cell VSBCETC
          </p>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-2">
            The Team
          </h1>
          <p className="text-base text-ink-muted max-w-lg">
            The people building E-Cell VSBCETC — students, faculty mentors, and advisors.
          </p>
        </div>
        <TeamSection members={members} showViewAll={false} limit={100} />
      </div>
      <Footer />
    </>
  );
}

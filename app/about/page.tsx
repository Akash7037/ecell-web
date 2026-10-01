import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutStrip from '@/components/sections/AboutStrip';

export const metadata: Metadata = {
  title: 'About',
  description: 'About E-Cell VSBCETC — the Entrepreneurship Cell at VSB College of Engineering & Technical Campus, Coimbatore.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-4">
            E-Cell VSBCETC
          </p>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-4">
            About
          </h1>
          <p className="text-base text-ink-muted max-w-2xl leading-relaxed">
            E-Cell VSBCETC is the student-led Entrepreneurship Cell at VSB College of Engineering &amp;
            Technical Campus, Coimbatore, Tamil Nadu. We bridge the gap between academic engineering and
            real-world venture creation — through prototype labs, patent advisory, events, and mentorship.
          </p>
        </div>
        <AboutStrip />
      </div>
      <Footer />
    </>
  );
}

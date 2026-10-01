import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MailIcon, MapPinIcon, InstagramIcon, LinkedinIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with E-Cell VSBCETC, Coimbatore.',
};

const contacts = [
  {
    icon: MailIcon,
    label: 'Email',
    value: 'ecell@vsb.ac.in',
    href: 'mailto:ecell@vsb.ac.in',
  },
  {
    icon: MapPinIcon,
    label: 'Location',
    value: 'Pollachi Main Road, Coimbatore, Tamil Nadu',
    href: 'https://maps.google.com/?q=VSB+College+Coimbatore',
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: '@vsb_ecell',
    href: 'https://instagram.com/vsb_ecell',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    value: 'E-Cell VSBCETC',
    href: 'https://linkedin.com',
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-[72px] min-h-screen flex flex-col">
        <div className="mx-auto max-w-7xl w-full px-6 py-16 md:py-24 flex-1">
          <p className="font-mono text-xs tracking-widest uppercase text-ink-light mb-4">
            Get in Touch
          </p>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-ink mb-6">
            Contact
          </h1>
          <p className="text-base text-ink-muted max-w-md mb-16">
            Reach out for event queries, team partnerships, or sponsorship discussions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {contacts.map(({ icon: Icon, label, value, href }, i) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-5 py-8 border-t border-paper-muted last:border-b sm:last:border-b-0 hover:bg-paper-dim transition-colors duration-150 px-4 -mx-4 rounded-sm"
              >
                <Icon size={18} className="text-vermilion mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-ink group-hover:text-vermilion transition-colors duration-150">
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'Events', href: '/events' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-paper-muted bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Brand */}
          <div>
            <p className="font-headline text-xl font-bold text-ink">E-Cell VSBCETC</p>
            <p className="mt-1 font-mono text-xs text-ink-light tracking-widest uppercase">
              Entrepreneurship Cell
            </p>
            <p className="mt-3 text-sm text-ink-muted max-w-xs leading-relaxed">
              VSB College of Engineering &amp; Technical Campus,
              Pollachi Main Road, Coimbatore, Tamil Nadu.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <p className="font-mono text-[10px] text-ink-light tracking-widest uppercase mb-4">
              Navigate
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink-muted hover:text-ink transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] text-ink-light tracking-widest uppercase mb-4">
              Contact
            </p>
            <a
              href="mailto:ecell@vsb.ac.in"
              className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 block"
            >
              ecell@vsb.ac.in
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-paper-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-ink-light">
            © {year} E-Cell VSBCETC. All rights reserved.
          </p>
          <p className="text-xs text-ink-light font-mono">
            10.8277° N, 77.0195° E
          </p>
        </div>
      </div>
    </footer>
  );
}

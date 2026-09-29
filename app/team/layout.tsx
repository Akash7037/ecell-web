import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the operators driving innovation at VSB E-Cell.',
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

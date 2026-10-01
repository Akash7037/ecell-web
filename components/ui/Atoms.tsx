interface BadgeProps {
  label: string;
  variant?: 'default' | 'accent' | 'muted';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const styles = {
    default: 'bg-paper-muted text-ink border border-paper-muted',
    accent: 'bg-vermilion/10 text-vermilion border border-vermilion/20',
    muted: 'bg-transparent text-ink-light border border-paper-muted',
  };

  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[11px] tracking-[0.15em] uppercase text-ink-light mb-4 ${className}`}
    >
      {children}
    </p>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-paper-muted ${className}`} />;
}

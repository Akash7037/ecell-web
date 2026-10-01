import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'ghost' | 'text';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
}

const base =
  'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-vermilion rounded-sm cursor-pointer select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-vermilion text-white hover:bg-vermilion-dark active:scale-[0.98]',
  ghost:
    'border border-ink text-ink hover:bg-paper-muted active:scale-[0.98]',
  text:
    'text-ink hover:text-vermilion underline-offset-4 hover:underline',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 py-2 gap-1.5',
  md: 'text-sm px-6 py-3 gap-2',
  lg: 'text-base px-8 py-4 gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', href, external, className = '', children, ...props },
  ref
) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;

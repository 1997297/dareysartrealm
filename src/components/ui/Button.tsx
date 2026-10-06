import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'editorial';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      isExternal,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-caps uppercase text-xs transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group select-none';

    const variantStyles = {
      primary:
        'bg-charcoal text-canvas hover:bg-charcoal-light active:bg-black px-6 py-3.5 border border-charcoal rounded-lg',
      secondary:
        'bg-canvas-subtle text-charcoal hover:bg-canvas-muted active:bg-canvas-border px-6 py-3.5 border border-canvas-border rounded-lg',
      outline:
        'bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal hover:bg-charcoal/5 px-6 py-3.5 rounded-lg',
      ghost:
        'bg-transparent text-charcoal hover:text-charcoal-muted px-3 py-2 rounded-lg',
      editorial:
        'bg-transparent text-charcoal px-0 py-1 border-b border-charcoal/40 hover:border-charcoal hover:text-charcoal transition-colors font-medium',
    };

    const sizeStyles = {
      sm: 'text-[0.6875rem] py-2 px-4 tracking-gallery',
      md: 'text-xs py-3.5 px-7 tracking-gallery',
      lg: 'text-xs py-4 px-9 tracking-gallery font-semibold',
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      variant !== 'editorial' && variant !== 'ghost' && sizeStyles[size],
      className
    );

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClassName}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

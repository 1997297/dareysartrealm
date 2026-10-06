import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'subtle';
}

export function Badge({
  children,
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-canvas-subtle text-charcoal border-canvas-border',
    accent: 'bg-charcoal text-canvas border-charcoal',
    outline: 'bg-transparent text-charcoal-muted border-charcoal/20',
    subtle: 'bg-canvas-muted/50 text-charcoal-subtle border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-[0.625rem] font-sans font-medium uppercase tracking-gallery px-2.5 py-1 border',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

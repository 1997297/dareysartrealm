import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article';
  spacing?: 'none' | 'sm' | 'default' | 'lg' | 'xl';
  background?: 'canvas' | 'subtle' | 'paper' | 'muted';
  children: React.ReactNode;
}

export function Section({
  as: Component = 'section',
  spacing = 'default',
  background = 'canvas',
  className,
  children,
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: 'py-0',
    sm: 'py-8 sm:py-12 md:py-16',
    default: 'py-14 sm:py-20 md:py-24 lg:py-28',
    lg: 'py-16 sm:py-24 md:py-32 lg:py-40',
    xl: 'py-20 sm:py-32 md:py-40 lg:py-48',
  };

  const backgroundClasses = {
    canvas: 'bg-canvas',
    subtle: 'bg-canvas-subtle',
    paper: 'bg-canvas-paper',
    muted: 'bg-canvas-muted',
  };

  return (
    <Component
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-500',
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

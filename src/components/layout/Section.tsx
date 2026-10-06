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
    sm: 'py-12 md:py-16',
    default: 'py-20 md:py-28 lg:py-32',
    lg: 'py-28 md:py-36 lg:py-44',
    xl: 'py-36 md:py-48 lg:py-56',
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

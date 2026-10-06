import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  kicker?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'between';
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = 'left',
  action,
  className,
}: SectionHeadingProps) {
  if (align === 'between') {
    return (
      <div className={cn('mb-12 md:mb-16 lg:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6', className)}>
        <div className="max-w-2xl">
          {kicker && (
            <p className="gallery-plaque mb-3 text-xs tracking-gallery text-charcoal-subtle font-medium">
              {kicker}
            </p>
          )}
          <h2 className="font-display text-3xl xs:text-[2rem] sm:text-5xl md:text-6xl text-charcoal font-normal leading-[1.12] sm:leading-[1.1] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 sm:mt-4 text-charcoal-muted text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="self-start md:self-end pt-2">{action}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mb-10 sm:mb-14 md:mb-16 lg:mb-20',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl',
        className
      )}
    >
      {kicker && (
        <p className="gallery-plaque mb-2 sm:mb-3 text-[0.625rem] sm:text-xs tracking-gallery text-charcoal-subtle font-medium">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-3xl xs:text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-charcoal-muted text-base md:text-lg font-light leading-relaxed">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

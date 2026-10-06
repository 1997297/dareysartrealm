import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'editorial' | 'narrow' | 'full';
  children: React.ReactNode;
}

export function Container({
  size = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-3xl',
    editorial: 'max-w-4xl',
    default: 'max-w-6xl',
    wide: 'max-w-[92rem]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

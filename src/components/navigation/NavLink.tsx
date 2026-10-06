'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isLight?: boolean;
}

export function NavLink({ href, children, className, onClick, isLight = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group relative py-1 text-xs font-sans tracking-gallery uppercase transition-colors duration-200 select-none',
        isLight
          ? isActive
            ? 'text-canvas font-semibold'
            : 'text-canvas/75 hover:text-canvas'
          : isActive
          ? 'text-charcoal font-semibold'
          : 'text-charcoal-muted hover:text-charcoal',
        className
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          'absolute bottom-0 left-0 h-[1px] w-full origin-left transition-transform duration-300 ease-out',
          isLight ? 'bg-canvas' : 'bg-charcoal',
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
}

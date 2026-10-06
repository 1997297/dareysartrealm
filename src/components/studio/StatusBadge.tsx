import React from 'react';
import { cn } from '@/lib/utils';

export type StudioStatus =
  | 'available'
  | 'reserved'
  | 'sold'
  | 'commissioned'
  | 'draft'
  | 'archived'
  | 'published'
  | 'confirmed'
  | 'preparing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'new'
  | 'unread'
  | 'responded'
  | 'negotiating'
  | 'converted'
  | 'closed'
  | 'pending'
  | 'approved'
  | 'hidden'
  | 'vip'
  | 'active'
  | 'prospective'
  | 'dormant'
  | 'in_creation'
  | 'site_visit_scheduled'
  | 'proposal_sent'
  | 'reviewing';

interface StatusBadgeProps {
  status: StudioStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  let styleClasses = 'bg-stone-100 text-stone-700 border-stone-200';
  let dotColor = 'bg-stone-400';
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'available':
    case 'approved':
    case 'delivered':
    case 'active':
    case 'published':
      styleClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      break;

    case 'reserved':
    case 'pending':
    case 'reviewing':
    case 'negotiating':
    case 'preparing':
    case 'in_creation':
    case 'site_visit_scheduled':
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotColor = 'bg-amber-500';
      break;

    case 'sold':
    case 'closed':
    case 'converted':
    case 'contracted':
      styleClasses = 'bg-stone-900 text-stone-100 border-stone-800';
      dotColor = 'bg-stone-300';
      break;

    case 'vip':
      styleClasses = 'bg-amber-900/10 text-amber-950 border-amber-300/80 font-medium';
      dotColor = 'bg-amber-600';
      break;

    case 'new':
    case 'unread':
    case 'dispatched':
    case 'proposal_sent':
      styleClasses = 'bg-blue-50 text-blue-800 border-blue-200/80 font-medium';
      dotColor = 'bg-blue-500';
      break;

    case 'draft':
    case 'prospective':
    case 'dormant':
      styleClasses = 'bg-stone-100 text-stone-600 border-stone-200';
      dotColor = 'bg-stone-400';
      break;

    case 'archived':
    case 'cancelled':
    case 'hidden':
      styleClasses = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotColor = 'bg-rose-500';
      break;

    default:
      styleClasses = 'bg-stone-100 text-stone-700 border-stone-200';
      dotColor = 'bg-stone-400';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-sans font-medium transition-colors',
        size === 'sm' ? 'px-2.5 py-0.5 text-[0.6875rem]' : 'px-3 py-1 text-xs',
        styleClasses,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor)} />
      {label}
    </span>
  );
}

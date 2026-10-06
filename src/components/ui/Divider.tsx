import React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  subtle?: boolean;
}

export function Divider({ subtle = true, className, ...props }: DividerProps) {
  return (
    <hr
      className={cn(
        'w-full border-t border-hairline my-12 md:my-16 lg:my-20',
        subtle && 'opacity-60',
        className
      )}
      {...props}
    />
  );
}

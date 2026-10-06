'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-xs uppercase tracking-gallery font-medium text-charcoal"
        >
          {label} {required && <span className="text-accent">*</span>}
        </label>
        {hint && <span className="text-[11px] text-charcoal-muted font-light">{hint}</span>}
      </div>

      <div>{children}</div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

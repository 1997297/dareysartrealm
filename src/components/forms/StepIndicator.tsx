'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepNames,
  onStepClick,
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Top Bar with Number and Current Step Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-gallery font-medium text-charcoal">
          Step {String(currentStep).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </span>
        <span className="font-serif italic text-sm text-charcoal-muted">
          {stepNames[currentStep - 1] || ''}
        </span>
      </div>

      {/* Thin elegant Progress Bar */}
      <div className="relative h-1 w-full bg-canvas-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-charcoal transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Discrete step dots / labels on desktop */}
      <div className="hidden sm:grid grid-cols-7 gap-2 pt-1">
        {stepNames.map((name, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = onStepClick && stepNum < currentStep;

          return (
            <button
              key={name}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(stepNum)}
              className={`text-left group transition-all duration-200 ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium transition-colors ${
                    isCurrent
                      ? 'bg-charcoal text-canvas'
                      : isCompleted
                      ? 'bg-accent/20 text-accent font-semibold'
                      : 'bg-canvas-muted text-charcoal-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : stepNum}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight truncate transition-colors ${
                  isCurrent
                    ? 'font-medium text-charcoal'
                    : isCompleted
                    ? 'text-charcoal-muted group-hover:text-charcoal'
                    : 'text-charcoal-muted/60'
                }`}
              >
                {name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

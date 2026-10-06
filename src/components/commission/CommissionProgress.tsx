'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { CommissionTrackingStage } from '@/types/collector';

interface CommissionProgressProps {
  currentStage: CommissionTrackingStage;
  stageIndex: number; // 1 to 5
}

const STAGES = [
  { index: 1, label: 'Vision & Brief', desc: 'Concept submitted and reviewed' },
  { index: 2, label: 'Study Sketches', desc: 'Ratio & palette direction aligned' },
  { index: 3, label: 'In Creation', desc: 'Heavy impasto & tactile sculpting' },
  { index: 4, label: 'Studio Preview', desc: 'Collector review & final balance' },
  { index: 5, label: 'Provenance Handover', desc: 'Wax-sealed crated delivery' },
];

export const CommissionProgress: React.FC<CommissionProgressProps> = ({
  currentStage,
  stageIndex,
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent">
          Artistic Progression
        </span>
        <span className="font-serif italic text-sm text-charcoal">
          Stage 0{stageIndex} — {currentStage}
        </span>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-canvas-muted -translate-y-1/2 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-charcoal -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((stageIndex - 1) / (STAGES.length - 1)) * 100}%` }}
        />

        <div className="relative z-10 grid grid-cols-5 gap-2">
          {STAGES.map((s) => {
            const isCompleted = s.index < stageIndex;
            const isCurrent = s.index === stageIndex;

            return (
              <div key={s.index} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isCurrent
                      ? 'bg-charcoal text-canvas ring-4 ring-charcoal/10 shadow-sm'
                      : isCompleted
                      ? 'bg-accent text-canvas font-semibold'
                      : 'bg-canvas border border-canvas-border text-charcoal-muted'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${s.index}`}
                </div>
                <div className="hidden sm:block space-y-0.5">
                  <p
                    className={`text-xs font-serif leading-tight ${
                      isCurrent
                        ? 'font-medium text-charcoal'
                        : isCompleted
                        ? 'text-charcoal'
                        : 'text-charcoal-muted/70'
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-[10px] text-charcoal-muted font-light leading-tight">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

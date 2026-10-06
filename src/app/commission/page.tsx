'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  Maximize2,
  Clock,
  DollarSign,
  Palette,
  Loader2,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/forms/StepIndicator';
import { FormField } from '@/components/forms/FormField';
import { FileUploader } from '@/components/forms/FileUploader';
import { commissionService as directCommissionService } from '@/services/commissionService';
import { MOCK_ARTWORKS } from '@/data/mockArtworks';
import {
  CommissionArtworkType,
  CommissionPreferredSize,
  CommissionSpace,
  CommissionBudgetRange,
  CommissionTimeline,
  ReferenceFile,
  CommissionFormData,
  CommissionSubmissionResult,
} from '@/types/commission';

const STEP_NAMES = [
  'Vision & Medium',
  'Dimensions & Scale',
  'Narrative & Space',
  'Investment & Timeline',
  'Review & Confirmation',
];

const ARTWORK_TYPES: { id: CommissionArtworkType; title: string; desc: string }[] = [
  { id: 'abstract', title: 'Tactile Abstract', desc: 'Sculptural impasto knife-work, rich earth pigments and geometric tensions.' },
  { id: 'portrait', title: 'Contemporary Figurative', desc: 'Poignant human presence, expressive anatomy and deep psychological resonance.' },
  { id: 'landscape', title: 'Atmospheric Horizon', desc: 'Evocative organic terrains, coastlines, storm sweeps and tonal skies.' },
  { id: 'architectural', title: 'Architectural Intervention', desc: 'Site-specific scale conceived in direct dialogue with structural planes.' },
  { id: 'inspired-by', title: 'Inspired by Existing Piece', desc: 'A dialogue responding to an established masterwork from Darey’s oeuvre.' },
  { id: 'other', title: 'Bespoke Custom Medium', desc: 'Multi-panel diptych/triptych, sculptural panel, or specialized installation.' },
];

const SIZE_PRESETS: { id: CommissionPreferredSize; label: string; dimensions: string; desc: string }[] = [
  { id: 'small', label: 'Cabinet / Study', dimensions: 'Up to 60 × 60 cm', desc: 'Intimate focal point for private studies, alcoves, and personal rooms.' },
  { id: 'medium', label: 'Salon Scale', dimensions: '80 × 100 cm to 100 × 120 cm', desc: 'Commanding residential proportions for living rooms and collector dining halls.' },
  { id: 'large', label: 'Hero Canvas', dimensions: '120 × 150 cm to 150 × 180 cm', desc: 'Monumental presence suited for high-ceilinged galleries and architectural residences.' },
  { id: 'monumental', label: 'Monumental Scale', dimensions: '200 cm+ Multi-panel', desc: 'Grand institutional scale, corporate atriums, or custom diptych/triptych installations.' },
  { id: 'custom', label: 'Custom Dimension', dimensions: 'Tailored precisely', desc: 'Specify your exact wall measurements in centimetres or inches.' },
];

const SPACE_OPTIONS: { id: CommissionSpace; label: string }[] = [
  { id: 'living-room', label: 'Living Room / Main Salon' },
  { id: 'dining-room', label: 'Dining Hall' },
  { id: 'bedroom', label: 'Primary Bedroom / Suite' },
  { id: 'office', label: 'Executive Office / Library' },
  { id: 'hallway', label: 'Gallery Entry / Foyer' },
  { id: 'commercial', label: 'Corporate / Hospitality' },
  { id: 'other', label: 'Other Private Interior' },
];

const BUDGET_OPTIONS: { id: CommissionBudgetRange; label: string; note: string }[] = [
  { id: 'under-2k', label: 'Under $2,000 USD', note: 'Intimate study or smaller single canvas' },
  { id: '2k-5k', label: '$2,000 – $5,000 USD', note: 'Medium salon canvas or detailed portrait' },
  { id: '5k-10k', label: '$5,000 – $10,000 USD', note: 'Large commanding hero canvas' },
  { id: '10k-plus', label: '$10,000+ USD', note: 'Monumental diptych, triptych, or architectural commission' },
  { id: 'guidance', label: 'Seeking Studio Guidance', note: 'Discuss options during preliminary studio consultation' },
];

const TIMELINE_OPTIONS: { id: CommissionTimeline; label: string; desc: string }[] = [
  { id: 'flexible', label: 'Flexible / Standard Atelier Pace', desc: '8 to 12 weeks for optimal curing and layered glaze depth.' },
  { id: '1-2-months', label: 'Priority (6–8 weeks)', desc: 'Prioritized studio schedule for focused creation.' },
  { id: '3-6-months', label: 'Long-term Planning (3–6 months)', desc: 'Aligned with an architectural build or interior completion date.' },
  { id: 'specific-date', label: 'Specific Milestone Date', desc: 'An anniversary, private inauguration, or delivery milestone.' },
];

function CommissionFlow() {
  const searchParams = useSearchParams();
  const inspiredArtworkSlug = searchParams?.get('artwork') || searchParams?.get('inspiredBy') || '';

  const matchedArtwork = inspiredArtworkSlug
    ? MOCK_ARTWORKS.find((a) => a.slug === inspiredArtworkSlug)
    : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<CommissionSubmissionResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form Fields State
  const [artworkType, setArtworkType] = useState<CommissionArtworkType>(
    matchedArtwork ? 'inspired-by' : 'abstract'
  );
  const [customTypeDescription, setCustomTypeDescription] = useState('');
  const [preferredSize, setPreferredSize] = useState<CommissionPreferredSize>('medium');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [dimensionUnit, setDimensionUnit] = useState<'cm' | 'inches'>('cm');

  const [narrative, setNarrative] = useState('');
  const [palettePreferences, setPalettePreferences] = useState('');
  const [placementSpace, setPlacementSpace] = useState<CommissionSpace>('living-room');
  const [referenceImages, setReferenceImages] = useState<ReferenceFile[]>([]);

  const [budgetRange, setBudgetRange] = useState<CommissionBudgetRange>('2k-5k');
  const [targetTimeline, setTargetTimeline] = useState<CommissionTimeline>('flexible');
  const [targetDate, setTargetDate] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Validate step transitions
  const validateStep = (step: number): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!artworkType) errs.artworkType = 'Please select a commission direction.';
      if (artworkType === 'other' && !customTypeDescription.trim()) {
        errs.customTypeDescription = 'Please describe your desired artwork medium.';
      }
    } else if (step === 2) {
      if (!preferredSize) errs.preferredSize = 'Please choose a scale or dimension option.';
      if (preferredSize === 'custom') {
        if (!customWidth.trim() || isNaN(Number(customWidth)) || Number(customWidth) <= 0) {
          errs.customWidth = 'Enter a valid width.';
        }
        if (!customHeight.trim() || isNaN(Number(customHeight)) || Number(customHeight) <= 0) {
          errs.customHeight = 'Enter a valid height.';
        }
      }
    } else if (step === 3) {
      if (!narrative.trim() || narrative.trim().length < 15) {
        errs.narrative = 'Please provide at least a brief concept or story description (min 15 characters).';
      }
    } else if (step === 4) {
      if (!budgetRange) errs.budgetRange = 'Please select a budget investment bracket.';
      if (targetTimeline === 'specific-date' && !targetDate.trim()) {
        errs.targetDate = 'Please select your target milestone date.';
      }
    } else if (step === 5) {
      if (!fullName.trim()) errs.fullName = 'Please provide your full name.';
      if (!email.trim() || !email.includes('@')) errs.email = 'Please provide a valid email address.';
      if (!country.trim()) errs.country = 'Please provide your country/location for fine-art crating.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload: CommissionFormData = {
        artworkType,
        customTypeDescription: artworkType === 'other' ? customTypeDescription : undefined,
        narrative,
        palettePreferences,
        preferredSize,
        customWidth: preferredSize === 'custom' ? customWidth : undefined,
        customHeight: preferredSize === 'custom' ? customHeight : undefined,
        dimensionUnit,
        placementSpace,
        inspiredBySlug: matchedArtwork?.slug,
        inspiredByTitle: matchedArtwork?.title,
        referenceImages,
        budgetRange,
        targetTimeline,
        targetDate: targetTimeline === 'specific-date' ? targetDate : undefined,
        fullName,
        email,
        phone,
        country,
        city,
        specialNotes,
      };

      const result = await directCommissionService.submitCommission(payload);
      setSubmissionSuccess(result);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      setErrors({ form: 'An error occurred while transmitting your commission request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="narrow">
        {/* Breadcrumb / Return */}
        <div className="mb-8">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Artwork Catalogue</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-canvas-border pb-8 mb-10">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-2">
            BESPOKE ATELIER CREATION
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
            Commission a Piece
          </h1>
          <p className="mt-4 text-sm sm:text-base text-charcoal-muted font-light leading-relaxed max-w-2xl">
            Collaborate directly with Darey to originate a one-of-a-kind fine art creation tailored to your space, aesthetic rhythm, and personal narrative.
          </p>

          {/* Inspired-by Context Banner if linked from artwork */}
          {matchedArtwork && (
            <div className="mt-6 p-4 sm:p-5 bg-canvas-subtle border border-canvas-border flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-canvas-muted shrink-0 overflow-hidden">
                <Image
                  src={matchedArtwork.coverImage.url}
                  alt={matchedArtwork.title}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle block">
                  Inspired by Exhibition Work
                </span>
                <p className="font-serif text-lg text-charcoal font-medium leading-tight mt-0.5">
                  {matchedArtwork.title}
                </p>
                <p className="text-xs text-charcoal-muted mt-1">
                  Your commission will reference the textural and palette language of this masterwork.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Success View */}
        {submissionSuccess ? (
          <div className="bg-canvas border border-canvas-border p-8 sm:p-12 space-y-8 shadow-subtle animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2 max-w-lg mx-auto">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                COMMISSION INTAKE REGISTERED
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
                Your Commission Brief Has Been Received
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                Thank you for entrusting Darey with your vision. Your request has entered the studio consultation pipeline.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-none space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-canvas-border">
                <div>
                  <span className="text-charcoal-subtle uppercase tracking-gallery text-[10px] block">
                    Commission Reference ID
                  </span>
                  <span className="font-mono text-sm font-semibold text-charcoal">
                    {submissionSuccess.referenceId}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-subtle uppercase tracking-gallery text-[10px] block">
                    Atelier Review Window
                  </span>
                  <span className="font-medium text-charcoal">
                    {submissionSuccess.estimatedContactWindow}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-charcoal-muted">
                  <strong className="text-charcoal font-medium">Next Step: </strong>
                  Darey will review your spatial brief, dimensions, and reference imagery, and will contact you at{' '}
                  <span className="text-charcoal font-mono">{email}</span> with preliminary palette suggestions and a formal studio quotation.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button href="/account" variant="primary" size="md">
                View in Collector Portal
              </Button>
              <Button href="/artworks" variant="secondary" size="md">
                Continue Exploring Catalogue
              </Button>
            </div>
          </div>
        ) : (
          /* Step-by-Step Form */
          <div className="space-y-10">
            {/* Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              stepNames={STEP_NAMES}
              onStepClick={(s) => {
                if (s < currentStep) setCurrentStep(s);
              }}
            />

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* STEP 1: Vision & Medium */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                      Select Artwork Direction
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-1">
                      Choose the overarching artistic aesthetic or medium you envision for your piece.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ARTWORK_TYPES.map((type) => {
                      const isSelected = artworkType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setArtworkType(type.id)}
                          className={`p-5 text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal/20'
                              : 'border-canvas-border bg-canvas hover:border-charcoal/40'
                          }`}
                        >
                          <div>
                            <span className="font-serif text-lg font-medium text-charcoal block">
                              {type.title}
                            </span>
                            <p className="text-xs text-charcoal-muted font-light leading-relaxed mt-1.5">
                              {type.desc}
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-between text-[11px]">
                            <span className={isSelected ? 'text-charcoal font-medium' : 'text-charcoal-subtle'}>
                              {isSelected ? 'Selected' : 'Select direction'}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-charcoal" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {artworkType === 'other' && (
                    <FormField
                      label="Describe Custom Medium or Configuration"
                      required
                      error={errors.customTypeDescription}
                    >
                      <input
                        type="text"
                        value={customTypeDescription}
                        onChange={(e) => setCustomTypeDescription(e.target.value)}
                        placeholder="e.g. Diptych oil on raw linen with 24k gold leaf accents"
                        className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                      />
                    </FormField>
                  )}
                </div>
              )}

              {/* STEP 2: Dimensions & Scale */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                      Dimensions &amp; Scale
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-1">
                      Select a standard studio format or specify custom measurements tailored to your wall space.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {SIZE_PRESETS.map((preset) => {
                      const isSelected = preferredSize === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setPreferredSize(preset.id)}
                          className={`w-full p-4 sm:p-5 text-left border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal/20'
                              : 'border-canvas-border bg-canvas hover:border-charcoal/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-serif text-lg font-medium text-charcoal">
                                {preset.label}
                              </span>
                              <span className="text-xs font-mono px-2 py-0.5 bg-canvas-muted text-charcoal-muted border border-canvas-border">
                                {preset.dimensions}
                              </span>
                            </div>
                            <p className="text-xs text-charcoal-muted font-light mt-1">
                              {preset.desc}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2 text-xs">
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-charcoal" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {preferredSize === 'custom' && (
                    <div className="p-6 bg-canvas-subtle border border-canvas-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                          CUSTOM MEASUREMENTS
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setDimensionUnit('cm')}
                            className={`px-2.5 py-1 text-xs transition-colors ${
                              dimensionUnit === 'cm' ? 'bg-charcoal text-canvas' : 'bg-canvas text-charcoal border border-canvas-border'
                            }`}
                          >
                            Centimetres (cm)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDimensionUnit('inches')}
                            className={`px-2.5 py-1 text-xs transition-colors ${
                              dimensionUnit === 'inches' ? 'bg-charcoal text-canvas' : 'bg-canvas text-charcoal border border-canvas-border'
                            }`}
                          >
                            Inches (in)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField label={`Width (${dimensionUnit})`} required error={errors.customWidth}>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            placeholder="e.g. 140"
                            className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                          />
                        </FormField>
                        <FormField label={`Height (${dimensionUnit})`} required error={errors.customHeight}>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            placeholder="e.g. 180"
                            className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                          />
                        </FormField>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Narrative & Space */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                      Concept, Narrative &amp; Environment
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-1">
                      Share the emotions, stories, and physical interior setting that this artwork will inhabit.
                    </p>
                  </div>

                  <FormField
                    label="Artistic Vision & Narrative Brief"
                    required
                    error={errors.narrative}
                    hint="What mood, memory, subject, or emotional feeling should this piece evoke?"
                  >
                    <textarea
                      rows={5}
                      value={narrative}
                      onChange={(e) => setNarrative(e.target.value)}
                      placeholder="Share your personal vision... e.g. A contemplative piece evoking resilience and family heritage, featuring earthy textures and heavy sculptural knife-work with quiet metallic warmth."
                      className="w-full p-4 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal leading-relaxed resize-y"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      label="Intended Room / Space Setting"
                      hint="Where will this work be installed?"
                    >
                      <select
                        value={placementSpace}
                        onChange={(e) => setPlacementSpace(e.target.value as CommissionSpace)}
                        className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                      >
                        {SPACE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      label="Palette & Texture Preferences"
                      hint="Specific tones (e.g. burnt ochre, bone black, raw linen)"
                    >
                      <input
                        type="text"
                        value={palettePreferences}
                        onChange={(e) => setPalettePreferences(e.target.value)}
                        placeholder="e.g. Warm neutral umber, matte charcoal, gold leaf"
                        className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                      />
                    </FormField>
                  </div>

                  {/* Reference Image Uploader */}
                  <div className="pt-2">
                    <FileUploader
                      files={referenceImages}
                      onFilesChange={setReferenceImages}
                      maxFiles={5}
                      label="Reference Images & Space Photographs"
                      hint="Upload photos of your wall, room architectural lighting, color swatches, or inspiration sketches."
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Investment & Timeline */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                      Investment &amp; Timeline
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-1">
                      Choose your approximate budget parameter and scheduling expectations for this custom commission.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-gallery font-medium text-charcoal mb-2">
                      Investment Budget Bracket *
                    </label>
                    {BUDGET_OPTIONS.map((option) => {
                      const isSelected = budgetRange === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setBudgetRange(option.id)}
                          className={`w-full p-4 text-left border transition-all flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal/20'
                              : 'border-canvas-border bg-canvas hover:border-charcoal/40'
                          }`}
                        >
                          <div>
                            <span className="font-serif text-base font-medium text-charcoal">
                              {option.label}
                            </span>
                            <span className="text-xs text-charcoal-muted font-light block mt-0.5">
                              {option.note}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-charcoal shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-canvas-border">
                    <label className="block text-xs uppercase tracking-gallery font-medium text-charcoal mb-2">
                      Target Completion Pace
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {TIMELINE_OPTIONS.map((t) => {
                        const isSelected = targetTimeline === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTargetTimeline(t.id)}
                            className={`p-4 text-left border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal/20'
                                : 'border-canvas-border bg-canvas hover:border-charcoal/40'
                            }`}
                          >
                            <div>
                              <span className="font-serif text-sm font-medium text-charcoal block">
                                {t.label}
                              </span>
                              <p className="text-xs text-charcoal-muted font-light mt-1">
                                {t.desc}
                              </p>
                            </div>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-charcoal mt-3 self-end" />}
                          </button>
                        );
                      })}
                    </div>

                    {targetTimeline === 'specific-date' && (
                      <div className="pt-2">
                        <FormField label="Target Milestone Date" required error={errors.targetDate}>
                          <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                          />
                        </FormField>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Collector Details */}
              {currentStep === 5 && (
                <div className="space-y-8 animate-in fade-in">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                      Collector Contact &amp; Final Review
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-1">
                      Provide your contact coordinates so Darey can send your personalized study proposal.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-6 bg-canvas-subtle border border-canvas-border space-y-4 text-xs">
                    <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                      COMMISSION SPECIFICATION SUMMARY
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-canvas-border">
                      <div>
                        <span className="text-charcoal-subtle block">Direction</span>
                        <span className="font-medium text-charcoal capitalize">{artworkType}</span>
                      </div>
                      <div>
                        <span className="text-charcoal-subtle block">Scale</span>
                        <span className="font-medium text-charcoal capitalize">
                          {preferredSize === 'custom' ? `${customWidth} × ${customHeight} ${dimensionUnit}` : preferredSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-subtle block">Budget</span>
                        <span className="font-medium text-charcoal">{budgetRange}</span>
                      </div>
                      <div>
                        <span className="text-charcoal-subtle block">Timeline</span>
                        <span className="font-medium text-charcoal capitalize">{targetTimeline}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-charcoal-subtle block mb-1">Brief Overview</span>
                      <p className="text-charcoal font-light italic leading-relaxed line-clamp-3">
                        &ldquo;{narrative}&rdquo;
                      </p>
                    </div>

                    {referenceImages.length > 0 && (
                      <div className="flex items-center gap-2 text-charcoal-muted text-[11px] pt-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-charcoal" />
                        <span>{referenceImages.length} reference file(s) attached to brief</span>
                      </div>
                    )}
                  </div>

                  {/* Collector Contact Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Full Name" required error={errors.fullName}>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Collector or representative name"
                          className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                        />
                      </FormField>

                      <FormField label="Email Address" required error={errors.email}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="client@domain.com"
                          className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <FormField label="Phone / WhatsApp" hint="Optional">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 / +44 / +234..."
                          className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                        />
                      </FormField>

                      <FormField label="Country / Territory" required error={errors.country}>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. United Kingdom"
                          className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                        />
                      </FormField>

                      <FormField label="City / Region" hint="Optional">
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. London"
                          className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                        />
                      </FormField>
                    </div>

                    <FormField label="Additional Notes or Delivery Considerations" hint="Optional">
                      <textarea
                        rows={3}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Any architectural access restrictions, crating requirements, or milestone expectations..."
                        className="w-full p-4 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal leading-relaxed resize-y"
                      />
                    </FormField>

                    {errors.form && (
                      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errors.form}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Navigation Actions */}
              <div className="pt-6 border-t border-canvas-border flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors px-4 py-2.5 border border-canvas-border"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 text-xs font-medium bg-charcoal text-canvas hover:bg-charcoal-muted transition-colors px-6 py-3"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 text-xs font-medium bg-charcoal text-canvas hover:bg-charcoal-muted transition-colors px-8 py-3.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Commission Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Commission Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function CommissionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas pt-32 text-center text-xs text-charcoal-muted">
          Loading commission atelier...
        </div>
      }
    >
      <CommissionFlow />
    </Suspense>
  );
}

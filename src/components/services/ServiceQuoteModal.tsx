'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Sparkles, Building2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Service } from '@/types/service';
import { ServiceQuoteRequestData, ServiceProjectScope } from '@/types/serviceRequest';
import { ReferenceFile } from '@/types/commission';
import { serviceRequestService } from '@/services/serviceRequestService';
import { FormField } from '@/components/forms/FormField';
import { FileUploader } from '@/components/forms/FileUploader';
import { Button } from '@/components/ui/Button';

interface ServiceQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  allServices?: Service[];
}

export const ServiceQuoteModal: React.FC<ServiceQuoteModalProps> = ({
  isOpen,
  onClose,
  service,
  allServices = [],
}) => {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(service?.slug || '');
  const [scope, setScope] = useState<ServiceProjectScope>('residential');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [surfaceType, setSurfaceType] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [files, setFiles] = useState<ReferenceFile[]>([]);
  
  // Contact
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    referenceId: string;
    estimatedContactWindow: string;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (service) {
      setSelectedServiceSlug(service.slug);
    }
  }, [service]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form after closing
      const timeout = setTimeout(() => {
        setSubmissionResult(null);
        setErrors({});
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSelectedService =
    allServices.find((s) => s.slug === selectedServiceSlug) || service;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = 'Please describe your project (minimum 15 characters)';
    }
    if (!country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: ServiceQuoteRequestData = {
        serviceSlug: selectedServiceSlug || service?.slug || 'studio-service',
        serviceTitle: currentSelectedService?.title || 'Studio Consultation',
        projectScope: scope,
        locationCity: city,
        locationCountry: country,
        spaceDimensions: dimensions,
        surfaceType: surfaceType,
        projectDescription: description,
        targetCompletionDate: targetDate,
        estimatedBudgetRange: budgetRange,
        referenceImages: files,
        fullName,
        email,
        phone,
        organization,
        additionalNotes,
      };

      const res = await serviceRequestService.submitQuoteRequest(payload);
      setSubmissionResult({
        referenceId: res.referenceId,
        estimatedContactWindow: res.estimatedContactWindow,
      });
    } catch (err) {
      setErrors({ form: 'An error occurred while submitting. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-canvas rounded-2xl border border-canvas-border shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-canvas-border bg-canvas-subtle/50">
          <div>
            <span className="text-[11px] uppercase tracking-gallery font-medium text-accent">
              Studio Consultation & Quote
            </span>
            <h2 className="font-serif text-2xl text-charcoal tracking-wide mt-0.5">
              {submissionResult
                ? 'Request Received'
                : `Consultation: ${currentSelectedService?.title || 'Architectural Services'}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-canvas-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submissionResult ? (
            /* Confirmation Screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-charcoal text-canvas flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-3xl text-charcoal">
                  Your Vision Is in Dialogue
                </h3>
                <p className="text-sm text-charcoal-muted leading-relaxed">
                  Darey and the studio architectural team have logged your project inquiry. We review structural parameters, surface substrates, and scheduling with utmost care.
                </p>
              </div>

              <div className="p-4 bg-canvas-subtle border border-canvas-border rounded-sm max-w-sm mx-auto text-left space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-charcoal-muted uppercase tracking-gallery">Reference ID</span>
                  <span className="font-mono font-medium text-charcoal">{submissionResult.referenceId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-charcoal-muted uppercase tracking-gallery">Service</span>
                  <span className="font-medium text-charcoal">{currentSelectedService?.title}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-charcoal-muted uppercase tracking-gallery">Response Window</span>
                  <span className="font-medium text-accent">{submissionResult.estimatedContactWindow}</span>
                </div>
              </div>

              <p className="text-xs text-charcoal-muted italic">
                A verification copy has been staged for {email}.
              </p>

              <div className="pt-4 flex justify-center">
                <Button onClick={onClose} variant="primary" size="md">
                  Return to Studio
                </Button>
              </div>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection dropdown if multiple available */}
              {allServices.length > 1 && (
                <FormField label="Service Stream" required>
                  <select
                    value={selectedServiceSlug}
                    onChange={(e) => setSelectedServiceSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  >
                    {allServices.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title} ({s.number})
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              {/* Project Scope & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Project Scope">
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as ServiceProjectScope)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  >
                    <option value="residential">Private Residential</option>
                    <option value="commercial">Commercial / Corporate Office</option>
                    <option value="hospitality">Hospitality / Boutique Hotel</option>
                    <option value="cultural">Gallery / Cultural Institution</option>
                    <option value="other">Other Unique Architecture</option>
                  </select>
                </FormField>

                <FormField label="City & Country" required error={errors.country}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </div>
                </FormField>
              </div>

              {/* Dimensions & Substrates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Approx. Dimensions / Area" hint="e.g. 4m x 3m wall, or 45 sqm">
                  <input
                    type="text"
                    placeholder="e.g. 4.5m width × 3.2m height"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

                <FormField label="Surface / Substrate" hint="e.g. Concrete, plasterboard, brick">
                  <input
                    type="text"
                    placeholder="e.g. Smooth drywall, exposed concrete"
                    value={surfaceType}
                    onChange={(e) => setSurfaceType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField
                label="Project Vision & Spatial Goals"
                required
                hint="Share lighting atmosphere, architectural style, or conceptual feeling"
                error={errors.description}
              >
                <textarea
                  rows={4}
                  placeholder="Describe what you envision for this space. Are you looking for bold gestural marks, subtle earthen calm, or a monumental focal point?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal placeholder-charcoal-muted/50 focus:border-charcoal focus:outline-none leading-relaxed"
                />
              </FormField>

              {/* Timeline & Budget range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Desired Timeframe">
                  <input
                    type="text"
                    placeholder="e.g. Within 2 months, by November 2026"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

                <FormField label="Estimated Budget Range">
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  >
                    <option value="">Flexible / Seeking Studio Estimate</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 – $15,000</option>
                    <option value="15k-30k">$15,000 – $30,000</option>
                    <option value="30k-plus">$30,000+</option>
                  </select>
                </FormField>
              </div>

              {/* Reference Images */}
              <FileUploader
                files={files}
                onFilesChange={setFiles}
                maxFiles={4}
                label="Architectural Plans & Room Photos"
                hint="Upload elevations, floorplans, or photos of the current space (Max 4 images)"
              />

              {/* Client Contact Info */}
              <div className="pt-4 border-t border-canvas-border space-y-4">
                <h4 className="text-xs uppercase tracking-gallery font-medium text-charcoal">
                  Your Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required error={errors.fullName}>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Email" required error={errors.email}>
                    <input
                      type="email"
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Phone / WhatsApp" hint="Optional for faster consultation">
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Architecture Studio / Firm" hint="If applying on behalf of a client">
                    <input
                      type="text"
                      placeholder="e.g. Studio Vista Architecture"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-canvas-border">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Vision...
                    </span>
                  ) : (
                    'Submit Consultation Request'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

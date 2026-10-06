'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, MapPin, ArrowRight, CheckCircle2, Loader2, AlertCircle, Phone, Instagram } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { contactService } from '@/services/contactService';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { ContactIntent, GeneralContactFormData } from '@/types/contact';

const INTENT_OPTIONS: { id: ContactIntent; label: string; desc: string }[] = [
  { id: 'artwork', label: 'Artwork Inquiry', desc: 'Questions about availability, acquisition, or private viewing of an existing canvas.' },
  { id: 'commission', label: 'Bespoke Commission', desc: 'Initiate a dialogue regarding a custom original artwork or multi-panel piece.' },
  { id: 'service', label: 'Architectural / Finishes', desc: 'Mural, interior finishes, or fine-art painting project consultation.' },
  { id: 'general', label: 'General Correspondence', desc: 'Curatorial inquiries, media/press, exhibition proposals, or studio notes.' },
];

export default function ContactPage() {
  const [intent, setIntent] = useState<ContactIntent>('artwork');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'email' | 'whatsapp' | 'phone'>('email');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ referenceId: string; timestamp: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your name.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address.';
    if (!subject.trim()) errs.subject = 'Please enter a subject.';
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide details in your message (min 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const data: GeneralContactFormData = {
        fullName,
        email,
        phone,
        subject,
        message,
        intent,
        preferredChannel,
      };

      const result = await contactService.submitContact(data);
      setSubmissionSuccess(result);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (err) {
      setErrors({ form: 'Unable to send message at this moment. Please email studio directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="wide">
        {/* Header */}
        <div className="border-b border-canvas-border pb-12 mb-16">
          <div className="max-w-3xl">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
              DIRECT CORRESPONDENCE
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
              Contact the Studio
            </h1>
            <p className="mt-6 text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
              For acquisition inquiries, curatorial questions, bespoke architectural commissions, or private studio viewings. Darey responds personally to all serious inquiries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Direct Coordinates */}
          <div className="lg:col-span-5 space-y-10">
            <div className="p-8 bg-canvas-subtle border border-canvas-border rounded-2xl space-y-6">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                STUDIO COORDINATES
              </span>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal-subtle block">Direct Email</span>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="font-medium text-charcoal text-sm hover:underline"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal-subtle block">Studio Presence</span>
                    <p className="font-medium text-charcoal text-sm">{CONTACT_INFO.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-charcoal-subtle block">Atelier Hours</span>
                    <p className="font-medium text-charcoal text-sm">{CONTACT_INFO.hours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-canvas-border space-y-2">
                <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle block">
                  Confidentiality Notice
                </span>
                <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                  Collector identity, residential addresses, and acquired artwork values are held in strict confidence. No information is ever shared or marketed.
                </p>
              </div>
            </div>

            {/* Direct Commission CTA */}
            <div className="p-8 bg-canvas border border-canvas-border rounded-2xl space-y-4">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                BESPOKE CREATION
              </span>
              <h3 className="font-display text-xl text-charcoal font-medium">
                Seeking a Commissioned Piece?
              </h3>
              <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                If you already know the scale and concept of the custom artwork you desire, our interactive commission form allows you to attach reference photographs and wall dimensions directly.
              </p>
              <Button href="/commission" variant="secondary" size="sm">
                Open Commission Atelier &rarr;
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            {submissionSuccess ? (
              <div className="p-8 sm:p-12 bg-canvas-subtle border border-canvas-border rounded-2xl space-y-6 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                    TRANSMISSION CONFIRMED
                  </span>
                  <h2 className="font-display text-3xl text-charcoal font-normal">
                    Message Delivered to Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                    Thank you, {fullName}. Darey will review your correspondence and respond via {preferredChannel} shortly.
                  </p>
                </div>

                <div className="p-4 bg-canvas border border-canvas-border text-xs space-y-1">
                  <span className="text-charcoal-subtle uppercase tracking-gallery text-[10px] block">
                    Inquiry Reference
                  </span>
                  <span className="font-mono text-charcoal font-semibold">{submissionSuccess.referenceId}</span>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionSuccess(null);
                      setMessage('');
                      setSubject('');
                    }}
                    className="text-xs text-charcoal font-medium hover:underline underline-offset-4"
                  >
                    Send another message
                  </button>
                  <Link
                    href="/artworks"
                    className="text-xs text-charcoal-muted hover:text-charcoal transition-colors ml-auto"
                  >
                    Return to Catalogue &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 bg-canvas border border-canvas-border rounded-2xl space-y-8 shadow-subtle">
                <div>
                  <h2 className="font-display text-2xl text-charcoal font-medium mb-1">
                    Send a Message
                  </h2>
                  <p className="text-xs text-charcoal-muted font-light">
                    Select the inquiry type that best describes your request.
                  </p>
                </div>

                {/* Intent Radio Selection */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-gallery font-medium text-charcoal mb-2">
                    Inquiry Direction
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIntent(opt.id)}
                        className={`p-3.5 text-left border text-xs transition-all ${
                          intent === opt.id
                            ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal/20'
                            : 'border-canvas-border bg-canvas hover:border-charcoal/40'
                        }`}
                      >
                        <span className="font-medium text-charcoal block mb-0.5">{opt.label}</span>
                        <span className="text-[11px] text-charcoal-muted font-light leading-tight block">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField label="Full Name" required error={errors.fullName}>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField label="Phone / WhatsApp" hint="Optional">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 / +44 / +234..."
                      className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                    />
                  </FormField>

                  <FormField label="Preferred Contact Channel">
                    <select
                      value={preferredChannel}
                      onChange={(e) => setPreferredChannel(e.target.value as 'email' | 'whatsapp' | 'phone')}
                      className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                    >
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Direct Phone</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Subject" required error={errors.subject}>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiry regarding artwork acquisition or studio appointment"
                    className="w-full px-4 py-3 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal"
                  />
                </FormField>

                <FormField label="Message" required error={errors.message} hint="Describe your request in detail">
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide context, piece titles, wall dimensions, or preferred studio viewing dates..."
                    className="w-full p-4 bg-canvas border border-canvas-border focus:border-charcoal focus:outline-none text-sm text-charcoal leading-relaxed resize-y"
                  />
                </FormField>

                {errors.form && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-medium bg-charcoal text-canvas hover:bg-charcoal-muted transition-colors px-8 py-3.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Correspondence</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

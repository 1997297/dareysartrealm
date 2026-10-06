'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isConfigured } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setEmailConfirmationRequired(true);
      } else {
        router.push('/account');
      }
    } else {
      setError(result.error || 'Registration could not be completed');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT: ART-DIRECTED VISUAL */}
      <div className="hidden lg:block lg:col-span-6 relative bg-canvas-muted overflow-hidden">
        <Image
          src="/artworks/pic4.jpeg"
          alt="Original Artwork by Darey"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-canvas space-y-3">
          <span className="gallery-plaque text-[0.625rem] text-canvas-muted block">
            PRIVATE PATRONAGE
          </span>
          <h2 className="font-display text-3xl font-light leading-snug">
            “Art is not decoration. It is an enduring emotional presence in your architecture.”
          </h2>
          <p className="text-xs text-canvas-muted font-light">
            Darey’s Artrealm Collector Network
          </p>
        </div>
      </div>

      {/* RIGHT: REGISTER FORM */}
      <div className="lg:col-span-6 flex items-center justify-center px-4 xs:px-6 sm:p-12 md:p-16 pt-24 sm:pt-32 lg:pt-16">
        <div className="w-full max-w-md space-y-8">
          {emailConfirmationRequired ? (
            <div className="text-center space-y-5 py-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                  REGISTRATION RECEIVED
                </span>
                <h1 className="font-display text-3xl text-charcoal font-medium">
                  Verify Your Email
                </h1>
                <p className="text-xs text-charcoal-muted leading-relaxed max-w-sm mx-auto">
                  A verification transmission has been dispatched to <strong className="text-charcoal">{email}</strong>. Please click the secure link in your inbox to confirm your account and enter your collection.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button href="/login" variant="primary" size="md">
                  Go to Sign In
                </Button>
                <Button href="/" variant="outline" size="md">
                  Return to Gallery
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
                  NEW COLLECTOR
                </span>
                <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-medium">
                  Create Your Collector Account
                </h1>
                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                  Consolidate your acquired originals, follow commissioned works in real time, and archive verified provenance.
                </p>
              </div>

              {!isConfigured && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1 text-amber-900">
                  <p className="font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    Supabase Configuration Required
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Please add your production <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">.env.local</code>.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-500/10 text-red-700 text-xs rounded-xl border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <FormField label="First Name" required>
                    <input
                      type="text"
                      placeholder="Elena"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Last Name" required>
                    <input
                      type="text"
                      placeholder="Rostova"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    placeholder="collector@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

                <FormField label="Phone / WhatsApp" hint="Optional">
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

                <FormField label="Password" required hint="Min 8 characters">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full px-3.5 py-2.5 pr-10 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormField>

                <FormField label="Confirm Password" required>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-xl text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

                <p className="text-[11px] text-charcoal-muted leading-relaxed pt-1">
                  By registering, you acknowledge that acquisitions, bespoke commissions, and certificates are governed by our{' '}
                  <Link href="/terms" className="underline hover:text-charcoal">Terms</Link> and{' '}
                  <Link href="/privacy" className="underline hover:text-charcoal">Privacy Policy</Link>.
                </p>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center flex items-center gap-2 rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Collector Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="border-t border-canvas-border pt-6 text-center text-xs text-charcoal-muted">
                <span>Already have an account? </span>
                <Link href="/login" className="text-charcoal font-medium hover:underline">
                  Sign In to Collection
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
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
      phone,
    });
    setIsSubmitting(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Registration failed');
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
          <span className="text-[10px] uppercase tracking-gallery text-canvas-muted font-semibold">
            Private Patronage
          </span>
          <h2 className="font-serif text-3xl font-light leading-snug">
            “Art is not decoration. It is an enduring emotional presence in your architecture.”
          </h2>
          <p className="text-xs text-canvas-muted font-light">
            Darey’s Artrealm Collector Network
          </p>
        </div>
      </div>

      {/* RIGHT: REGISTER FORM */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 pt-32 lg:pt-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block mb-1">
              New Collector
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Create Your Collector Account
            </h1>
            <p className="text-xs text-charcoal-muted mt-2 font-light leading-relaxed">
              Consolidate your acquired originals, follow commissioned works in real time, and archive verified provenance.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" required>
                <input
                  type="text"
                  placeholder="Elena"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </FormField>

              <FormField label="Last Name" required>
                <input
                  type="text"
                  placeholder="Rostova"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </FormField>
            </div>

            <FormField label="Email Address" required>
              <input
                type="email"
                placeholder="collector@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Phone / WhatsApp" hint="Optional">
              <input
                type="tel"
                placeholder="+44 7700 900142"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Password" required hint="Min 6 characters">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-1"
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
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full justify-center flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
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
            <span>Already have a collector account? </span>
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

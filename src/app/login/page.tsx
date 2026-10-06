'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowRight, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to /account
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/account');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT: ART-DIRECTED VISUAL */}
      <div className="hidden lg:block lg:col-span-6 relative bg-canvas-muted overflow-hidden">
        <Image
          src="/artworks/hero.jpeg"
          alt="Darey Studio Monumental Canvas"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-canvas space-y-3">
          <span className="text-[10px] uppercase tracking-gallery text-canvas-muted font-semibold">
            The Collector Sanctuary
          </span>
          <h2 className="font-serif text-3xl font-light leading-snug">
            “To acquire art is to welcome an enduring soul into your sanctuary.”
          </h2>
          <p className="text-xs text-canvas-muted font-light">
            Darey’s Artrealm Collector Experience
          </p>
        </div>
      </div>

      {/* RIGHT: CALM LOGIN FORM */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 pt-32 lg:pt-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block mb-1">
              Private Access
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
              Sign In to Your Collection
            </h1>
            <p className="text-xs text-charcoal-muted mt-2 font-light leading-relaxed">
              Access your acquired artworks, track active commissions, and view your Certificates of Authenticity.
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <div className="p-4 bg-canvas-subtle border border-canvas-border rounded-sm flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-charcoal flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Demo Collector Access
              </p>
              <p className="text-[11px] text-charcoal-muted font-light">
                Sign in instantly as Elena Rostova to test the collector experience.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoSignIn}
              className="shrink-0"
            >
              Enter Demo
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email Address" required>
              <input
                type="email"
                placeholder="collector@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Password" required>
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                href="/forgot-password"
                className="text-charcoal-muted hover:text-charcoal transition-colors underline"
              >
                Forgot your password?
              </Link>
            </div>

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
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="border-t border-canvas-border pt-6 text-center text-xs text-charcoal-muted">
            <span>Don&apos;t have an account yet? </span>
            <Link href="/register" className="text-accent hover:underline font-medium">
              Register as Collector
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

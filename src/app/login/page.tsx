'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowRight, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeRedirectPath } from '@/lib/supabase/middleware';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const errorParam = searchParams.get('error');

  const { login, isAuthenticated, isAdmin, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'auth_callback_failed' ? 'The authentication link has expired or is invalid.' : null
  );

  // If already logged in, redirect appropriately
  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = sanitizeRedirectPath(nextParam, isAdmin ? '/studio' : '/account');
      router.push(destination);
    }
  }, [isAuthenticated, isAdmin, nextParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const destination = sanitizeRedirectPath(nextParam, '/account');
      router.push(destination);
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
          PRIVATE ACCESS
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-charcoal font-medium">
          Sign In to Your Collection
        </h1>
        <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
          Access your acquired artworks, track active commissions, and view your Certificates of Authenticity.
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

        <FormField label="Password" required>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
            className="w-full justify-center flex items-center gap-2 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
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
        <Link href="/register" className="text-charcoal font-medium hover:underline">
          Register as Collector
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          <span className="gallery-plaque text-[0.625rem] text-canvas-muted block">
            THE COLLECTOR SANCTUARY
          </span>
          <h2 className="font-display text-3xl font-light leading-snug">
            “To acquire art is to welcome an enduring soul into your sanctuary.”
          </h2>
          <p className="text-xs text-canvas-muted font-light">
            Darey’s Artrealm Collector Experience
          </p>
        </div>
      </div>

      {/* RIGHT: CALM LOGIN FORM */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 pt-32 lg:pt-16">
        <Suspense fallback={
          <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

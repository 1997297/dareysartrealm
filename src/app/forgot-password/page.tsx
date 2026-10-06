'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setIsSent(true);
    } else {
      setError(result.error || 'Unable to initiate password reset.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-32 pb-20 flex items-center justify-center">
      <Container size="editorial">
        <div className="max-w-md mx-auto p-8 sm:p-10 border border-canvas-border rounded-2xl bg-canvas shadow-subtle space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-charcoal transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          {!isConfigured && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1 text-amber-900">
              <p className="font-medium flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Supabase Configuration Required
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Password recovery requires a connected Supabase project. Configure credentials in <code className="font-mono bg-amber-500/20 px-1 py-0.5 rounded">.env.local</code>.
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 text-red-700 text-xs rounded-xl border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSent ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-charcoal font-medium">
                Check Your Inbox
              </h1>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                A secure password recovery transmission has been dispatched to <strong className="text-charcoal">{email}</strong>. Please follow the link in your email to reset your access.
              </p>
              <div className="pt-2">
                <Button href="/login" variant="outline" size="md">
                  Return to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
                  ACCOUNT RECOVERY
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-charcoal font-medium">
                  Reset Password
                </h1>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Enter the email associated with your collector account and we will dispatch instructions to restore your access.
                </p>
              </div>

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
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message || 'Unable to update password. Your recovery link may have expired.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/account');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-32 pb-20 flex items-center justify-center">
      <Container size="editorial">
        <div className="max-w-md mx-auto p-8 sm:p-10 border border-canvas-border rounded-2xl bg-canvas shadow-subtle space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="font-display text-2xl text-charcoal font-medium">
                Password Updated
              </h1>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Your collector account credentials have been securely updated. Redirecting to your private portal...
              </p>
              <div className="pt-2">
                <Button href="/account" variant="primary" size="md">
                  Continue to Collection
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
                  SECURITY &amp; RECOVERY
                </span>
                <h1 className="font-display text-2xl sm:text-3xl text-charcoal font-medium">
                  Set New Password
                </h1>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                  Please choose a strong, secure password for your Darey’s Artrealm collector account.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 text-xs rounded-lg border border-red-500/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="New Password" required>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-3.5 py-2.5 pr-10 bg-canvas border border-canvas-border rounded-lg text-sm text-charcoal focus:border-charcoal focus:outline-none"
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

                <FormField label="Confirm New Password" required>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-lg text-sm text-charcoal focus:border-charcoal focus:outline-none"
                  />
                </FormField>

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
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    'Update Password'
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

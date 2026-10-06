'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Check, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-32 pb-20 flex items-center justify-center">
      <Container size="editorial">
        <div className="max-w-md mx-auto p-8 sm:p-10 border border-canvas-border rounded-sm bg-canvas shadow-sm space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-gallery text-charcoal-muted hover:text-charcoal transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-charcoal text-canvas flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-3xl text-charcoal font-medium">
                Check Your Inbox
              </h1>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                A password reset transmission has been simulated for <strong className="text-charcoal">{email}</strong>. In production, a secure single-use recovery link will arrive in your inbox.
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
                <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block mb-1">
                  Account Recovery
                </span>
                <h1 className="font-serif text-3xl text-charcoal font-medium">
                  Reset Password
                </h1>
                <p className="text-xs text-charcoal-muted mt-1 font-light leading-relaxed">
                  Enter the email associated with your collector account and we will send instructions to reset your access.
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
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
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

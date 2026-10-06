'use client';

import React, { useState, useEffect } from 'react';
import { User, Check, Loader2, MapPin, Mail, Phone, AlertCircle } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || '');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'whatsapp' | 'phone'>(
    user?.preferredContactMethod || 'email'
  );

  // Address
  const [addressLine1, setAddressLine1] = useState(user?.defaultAddress?.addressLine1 || '');
  const [city, setCity] = useState(user?.defaultAddress?.city || '');
  const [stateRegion, setStateRegion] = useState(user?.defaultAddress?.stateRegion || '');
  const [postalCode, setPostalCode] = useState(user?.defaultAddress?.postalCode || '');
  const [deliveryNotes, setDeliveryNotes] = useState(user?.defaultAddress?.deliveryNotes || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone || '');
      setCountry(user.country || '');
      setPreferredContactMethod(user.preferredContactMethod || 'email');

      if (user.defaultAddress) {
        setAddressLine1(user.defaultAddress.addressLine1 || '');
        setCity(user.defaultAddress.city || '');
        setStateRegion(user.defaultAddress.stateRegion || '');
        setPostalCode(user.defaultAddress.postalCode || '');
        setDeliveryNotes(user.defaultAddress.deliveryNotes || '');
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setError(null);

    const res = await updateProfile({
      firstName,
      lastName,
      email,
      phone,
      country,
      preferredContactMethod,
      defaultAddress: {
        fullName: `${firstName} ${lastName}`,
        email,
        phone,
        addressLine1,
        city,
        stateRegion,
        postalCode,
        country,
        deliveryNotes,
      },
    });

    setIsSaving(false);

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <AccountShell
      title="Collector Profile"
      subtitle="Manage your personal provenance record and default white-glove delivery specifications."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-700 text-xs rounded-xl border border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Personal Details */}
        <div className="p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm space-y-6">
          <div className="flex items-center justify-between border-b border-canvas-border pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Identity & Provenance
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-medium">
                Personal Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Last Name" required>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Email Address" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Phone / WhatsApp" hint="For freight coordination">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900142"
                className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Preferred Contact Channel">
            <div className="flex gap-4 pt-1">
              {[
                { id: 'email', label: 'Email' },
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'phone', label: 'Phone Call' },
              ].map((c) => (
                <label key={c.id} className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="radio"
                    name="contactChannel"
                    checked={preferredContactMethod === c.id}
                    onChange={() => setPreferredContactMethod(c.id as any)}
                    className="accent-charcoal"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </FormField>
        </div>

        {/* Default Delivery Address */}
        <div className="p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm space-y-6">
          <div className="flex items-center justify-between border-b border-canvas-border pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Default Logistics
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-medium">
                Default Delivery Address
              </h3>
            </div>
          </div>

          <FormField label="Country / Territory">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. United Kingdom, Nigeria, United States"
              className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </FormField>

          <FormField label="Street Address">
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. 14 Cadogan Square"
              className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="City">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. City"
                className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="State / Region">
              <input
                type="text"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
                placeholder="e.g. State or Region"
                className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>

            <FormField label="Postal Code">
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="SW1X 0JW"
                className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
              />
            </FormField>
          </div>

          <FormField label="Delivery Access Notes" hint="Porter, elevator clearance, gate codes">
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Building has porter service 8am–6pm"
              className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </FormField>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs text-accent font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Profile updates saved to your private record.</span>
            </span>
          ) : (
            <span className="text-xs text-charcoal-muted font-light">
              Changes persist locally across your browser sessions.
            </span>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Profile Changes'
            )}
          </Button>
        </div>
      </form>
    </AccountShell>
  );
}

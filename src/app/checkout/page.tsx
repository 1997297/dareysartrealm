'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  CreditCard,
  Building,
  Sparkles,
  AlertCircle,
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/forms/FormField';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import {
  PaymentMethod,
  DeliveryMethod,
  ShippingAddress,
} from '@/types/commerce';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';

const CHECKOUT_STEPS = [
  'Collector',
  'Delivery',
  'Payment',
  'Review & Confirm',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart, validateCartAvailability, isMounted } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationFailure, setSimulationFailure] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Form State
  const [collectorInfo, setCollectorInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState<ShippingAddress>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: user?.defaultAddress?.addressLine1 || '',
    addressLine2: user?.defaultAddress?.addressLine2 || '',
    city: user?.defaultAddress?.city || '',
    stateRegion: user?.defaultAddress?.stateRegion || '',
    postalCode: user?.defaultAddress?.postalCode || '',
    country: user?.country || 'United Kingdom',
    deliveryNotes: user?.defaultAddress?.deliveryNotes || '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('insured_courier');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [testSimulateFailure, setTestSimulateFailure] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync with authenticated user profile when available
  useEffect(() => {
    if (user) {
      setCollectorInfo((prev) => ({
        firstName: prev.firstName || user.firstName,
        lastName: prev.lastName || user.lastName,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
      }));

      setDeliveryInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName} ${user.lastName}`,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || '',
        country: prev.country || user.country || 'United Kingdom',
      }));
    }
  }, [user]);

  // Check cart availability on mount
  useEffect(() => {
    if (isMounted && items.length > 0) {
      const validation = validateCartAvailability();
      if (!validation.valid) {
        alert(
          `Note: The following piece(s) were no longer available and were removed: ${validation.removedTitles.join(
            ', '
          )}`
        );
      }
    }
  }, [isMounted, items.length, validateCartAvailability]);

  // If cart is empty and mounted, allow redirection or empty state
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-canvas text-charcoal pt-36 pb-20">
        <Container size="editorial" className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-canvas-subtle border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
            <Lock className="w-6 h-6 stroke-1" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light">
            No Artwork Selected for Acquisition
          </h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto font-light leading-relaxed">
            Your acquisition selection is currently empty. Please choose an available artwork to proceed with checkout.
          </p>
          <div className="pt-2">
            <Button href="/artworks" variant="primary" size="md">
              Explore Available Artworks
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!collectorInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!collectorInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!collectorInfo.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collectorInfo.email)) {
        newErrors.email = 'Please provide a valid email';
      }
    } else if (step === 2) {
      if (!deliveryInfo.addressLine1.trim()) newErrors.addressLine1 = 'Street address is required';
      if (!deliveryInfo.city.trim()) newErrors.city = 'City is required';
      if (!deliveryInfo.country.trim()) newErrors.country = 'Country is required';
      if (!deliveryInfo.phone.trim()) newErrors.phone = 'Phone number is required for courier coordination';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCompleteAcquisition = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);
    setSimulationFailure(false);

    try {
      // If developer chose to simulate failure
      if (testSimulateFailure) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsProcessing(false);
        setSimulationFailure(true);
        window.scrollTo({ top: 200, behavior: 'smooth' });
        return;
      }

      const orderPayload = {
        items,
        collector: {
          firstName: collectorInfo.firstName.trim(),
          lastName: collectorInfo.lastName.trim(),
          email: collectorInfo.email.trim(),
          phone: collectorInfo.phone.trim(),
          userId: user?.id,
        },
        shippingAddress: {
          ...deliveryInfo,
          fullName: `${collectorInfo.firstName} ${collectorInfo.lastName}`,
          email: collectorInfo.email,
        },
        deliveryMethod,
        shippingCost: 0,
        totalAmount: subtotal,
        currency: items[0]?.artwork.currency || 'USD',
        status: 'confirmed' as const,
        paymentStatus: 'simulated_paid' as const,
        paymentMethod,
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // Clear the acquired items from cart
      clearCart();

      // Redirect to celebratory order confirmation page
      router.push(`/order/${createdOrder.id}`);
    } catch (err) {
      setIsProcessing(false);
      setSimulationFailure(true);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-24 pb-20 md:pt-32 md:pb-28">
      <Container size="default">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between border-b border-canvas-border pb-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-gallery text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Selection</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-charcoal-muted">
            <Lock className="w-3.5 h-3.5 text-accent" />
            <span>Encrypted Simulation Environment</span>
          </div>
        </div>

        {/* MOBILE COLLAPSIBLE ARTWORK SUMMARY */}
        <div className="lg:hidden mb-8 border border-canvas-border rounded-sm bg-canvas-subtle p-4">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-charcoal font-medium">
                Artwork Selection ({itemCount})
              </span>
              <span className="text-xs text-accent font-semibold">
                {formatPrice(subtotal, items[0]?.artwork.currency || 'USD')}
              </span>
            </div>
            {mobileSummaryOpen ? (
              <ChevronUp className="w-4 h-4 text-charcoal" />
            ) : (
              <ChevronDown className="w-4 h-4 text-charcoal" />
            )}
          </button>

          {mobileSummaryOpen && (
            <div className="pt-4 mt-4 border-t border-canvas-border space-y-3">
              {items.map(({ artwork }) => (
                <div key={artwork.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-14 bg-canvas border border-canvas-border rounded-xs overflow-hidden shrink-0">
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm text-charcoal truncate font-medium">
                      {artwork.title}
                    </p>
                    <p className="text-[11px] text-charcoal-muted truncate">
                      {formatPrice(artwork.price || 0, artwork.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MAIN CHECKOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: 4-STEP TRANSACTION FORM */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP PROGRESS BAR */}
            <div className="border border-canvas-border rounded-sm p-4 bg-canvas-subtle/50">
              <div className="grid grid-cols-4 gap-2">
                {CHECKOUT_STEPS.map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isCurrent = stepNum === currentStep;
                  const isDone = stepNum < currentStep;

                  return (
                    <div key={stepName} className="space-y-1">
                      <div
                        className={`h-1 w-full rounded-full transition-colors ${
                          isDone
                            ? 'bg-accent'
                            : isCurrent
                            ? 'bg-charcoal'
                            : 'bg-canvas-muted'
                        }`}
                      />
                      <p
                        className={`text-[10px] uppercase tracking-gallery truncate ${
                          isCurrent
                            ? 'text-charcoal font-semibold'
                            : isDone
                            ? 'text-accent'
                            : 'text-charcoal-muted'
                        }`}
                      >
                        0{stepNum} {stepName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAILURE MESSAGE ALERT */}
            {simulationFailure && (
              <div className="p-5 bg-red-50/90 border border-red-200 rounded-sm text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span>The acquisition wasn’t completed.</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed font-light">
                  No payment was processed. Your artwork selection and entered delivery details have been preserved. You can try again below.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestSimulateFailure(false);
                      setSimulationFailure(false);
                    }}
                    className="text-xs underline text-red-800 font-medium"
                  >
                    Reset Failure Simulation & Retry
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: COLLECTOR */}
            {currentStep === 1 && (
              <div className="p-6 sm:p-8 border border-canvas-border rounded-sm bg-canvas space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                    Step 01
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                    Collector Information
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light">
                    The name that will be recorded on the official Certificate of Authenticity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="First Name" required error={errors.firstName}>
                    <input
                      type="text"
                      placeholder="Elena"
                      value={collectorInfo.firstName}
                      onChange={(e) =>
                        setCollectorInfo({ ...collectorInfo, firstName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Last Name" required error={errors.lastName}>
                    <input
                      type="text"
                      placeholder="Rostova"
                      value={collectorInfo.lastName}
                      onChange={(e) =>
                        setCollectorInfo({ ...collectorInfo, lastName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Email Address" required error={errors.email}>
                    <input
                      type="email"
                      placeholder="collector@domain.com"
                      value={collectorInfo.email}
                      onChange={(e) =>
                        setCollectorInfo({ ...collectorInfo, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Phone / WhatsApp" hint="For freight coordination">
                    <input
                      type="tel"
                      placeholder="+44 7700 900142"
                      value={collectorInfo.phone}
                      onChange={(e) =>
                        setCollectorInfo({ ...collectorInfo, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>

                {isAuthenticated && (
                  <div className="p-3 bg-canvas-subtle border border-canvas-border rounded-sm text-xs text-charcoal-muted flex items-center justify-between">
                    <span>Logged in as <strong>{user?.email}</strong></span>
                    <span className="text-[10px] uppercase tracking-gallery text-accent font-semibold">
                      Collector Verified
                    </span>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="flex items-center gap-1.5"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY */}
            {currentStep === 2 && (
              <div className="p-6 sm:p-8 border border-canvas-border rounded-sm bg-canvas space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                    Step 02
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                    Delivery Destination
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light">
                    Every piece is conditioned in custom wooden crates for international transport.
                  </p>
                </div>

                {/* Delivery Method Options */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-gallery font-medium text-charcoal">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'insured_courier',
                        title: 'Fine Art Courier',
                        desc: 'Insured climate-controlled freight to your doorstep.',
                      },
                      {
                        id: 'studio_pickup',
                        title: 'Studio Collection',
                        desc: 'Pick up in person at the studio (By appointment).',
                      },
                      {
                        id: 'curatorial_installation',
                        title: 'Curatorial White-Glove',
                        desc: 'Specialized hanging & lighting consultation.',
                      },
                    ].map((m) => {
                      const isSelected = deliveryMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDeliveryMethod(m.id as DeliveryMethod)}
                          className={`p-3.5 text-left border rounded-sm transition-all ${
                            isSelected
                              ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal'
                              : 'border-canvas-border hover:border-charcoal/40 bg-canvas'
                          }`}
                        >
                          <p className="font-serif text-sm font-medium text-charcoal">{m.title}</p>
                          <p className="text-[10px] text-charcoal-muted mt-1 leading-relaxed">{m.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <FormField label="Country / Territory" required error={errors.country}>
                    <input
                      type="text"
                      placeholder="United Kingdom, Nigeria, United States..."
                      value={deliveryInfo.country}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, country: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Street Address" required error={errors.addressLine1}>
                    <input
                      type="text"
                      placeholder="14 Cadogan Square"
                      value={deliveryInfo.addressLine1}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, addressLine1: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Apartment, suite, or unit (optional)">
                    <input
                      type="text"
                      placeholder="Flat 3B"
                      value={deliveryInfo.addressLine2 || ''}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, addressLine2: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="City" required error={errors.city}>
                      <input
                        type="text"
                        placeholder="e.g. City"
                        value={deliveryInfo.city}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                        }
                        className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                      />
                    </FormField>

                    <FormField label="State / Region">
                      <input
                        type="text"
                        placeholder="e.g. State or Region"
                        value={deliveryInfo.stateRegion}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, stateRegion: e.target.value })
                        }
                        className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                      />
                    </FormField>

                    <FormField label="Postal Code">
                      <input
                        type="text"
                        placeholder="SW1X 0JW"
                        value={deliveryInfo.postalCode || ''}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })
                        }
                        className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                      />
                    </FormField>
                  </div>

                  <FormField label="Delivery Phone" required error={errors.phone}>
                    <input
                      type="tel"
                      placeholder="+44 7700 900142"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>

                  <FormField label="Special Delivery Instructions" hint="Gate code, porter access, stairwell dimensions">
                    <textarea
                      rows={2}
                      placeholder="e.g. Porter accepts packages between 8am and 6pm; lift dimensions fit 160cm."
                      value={deliveryInfo.deliveryNotes || ''}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, deliveryNotes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-canvas border border-canvas-border rounded-sm text-sm text-charcoal focus:border-charcoal focus:outline-none"
                    />
                  </FormField>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-canvas-border">
                  <Button type="button" variant="outline" size="md" onClick={handlePrev}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" size="md" onClick={handleNext}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {currentStep === 3 && (
              <div className="p-6 sm:p-8 border border-canvas-border rounded-sm bg-canvas space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                    Step 03
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                    Payment Method
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light">
                    Select your preferred acquisition arrangement. (Simulated development environment).
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'card',
                      title: 'Direct Card Transaction (Simulated)',
                      desc: 'Instant acquisition confirmation via mock credit/debit gateway. Zero real card details collected.',
                      icon: CreditCard,
                    },
                    {
                      id: 'bank_transfer',
                      title: 'Fine Art Wire / Bank Transfer',
                      desc: 'Dedicated studio invoice with IBAN and SWIFT details dispatched immediately to your email.',
                      icon: Building,
                    },
                    {
                      id: 'studio_arrangement',
                      title: 'Private Studio Escrow & Two-Part Acquisition',
                      desc: '50% initial acquisition deposit, with balance cleared prior to final customs dispatch.',
                      icon: Sparkles,
                    },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    const Icon = method.icon;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        className={`w-full p-4 text-left border rounded-sm transition-all flex items-start gap-4 ${
                          isSelected
                            ? 'border-charcoal bg-canvas-subtle ring-1 ring-charcoal'
                            : 'border-canvas-border hover:border-charcoal/40 bg-canvas'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-charcoal text-canvas border-charcoal'
                              : 'bg-canvas-subtle text-charcoal border-canvas-border'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-base text-charcoal font-medium">
                            {method.title}
                          </p>
                          <p className="text-xs text-charcoal-muted font-light mt-0.5 leading-relaxed">
                            {method.desc}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? 'border-charcoal bg-charcoal text-canvas'
                              : 'border-canvas-border'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Developer Testing Toggle for Simulated Failure */}
                <div className="p-3 bg-canvas-muted/40 border border-canvas-border rounded-sm text-xs flex items-center justify-between">
                  <span className="text-charcoal-muted">
                    Test Mode: Simulate payment failure scenario
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testSimulateFailure}
                      onChange={(e) => setTestSimulateFailure(e.target.checked)}
                      className="accent-charcoal"
                    />
                    <span className="text-[11px] font-medium text-charcoal">
                      Simulate Failure
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-canvas-border">
                  <Button type="button" variant="outline" size="md" onClick={handlePrev}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" size="md" onClick={handleNext}>
                    Review Acquisition
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {currentStep === 4 && (
              <div className="p-6 sm:p-8 border border-canvas-border rounded-sm bg-canvas space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                    Step 04
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                    Review Your Acquisition
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1 font-light">
                    Verify all collector specifications before completing your acquisition.
                  </p>
                </div>

                <div className="divide-y divide-canvas-border border border-canvas-border rounded-sm bg-canvas text-xs">
                  {/* Collector Section */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-muted block">
                        Collector & Certificate Name
                      </span>
                      <p className="font-medium text-charcoal text-sm">
                        {collectorInfo.firstName} {collectorInfo.lastName}
                      </p>
                      <p className="text-charcoal-muted font-light">
                        {collectorInfo.email} {collectorInfo.phone && `• ${collectorInfo.phone}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-accent uppercase tracking-gallery text-[11px] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Delivery Destination */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-muted block">
                        Delivery Destination & Method
                      </span>
                      <p className="font-medium text-charcoal text-sm capitalize">
                        {deliveryMethod.replace('_', ' ')}
                      </p>
                      <p className="text-charcoal-muted font-light">
                        {deliveryInfo.addressLine1}
                        {deliveryInfo.addressLine2 ? `, ${deliveryInfo.addressLine2}` : ''}
                      </p>
                      <p className="text-charcoal-muted font-light">
                        {deliveryInfo.city}, {deliveryInfo.country} {deliveryInfo.postalCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-accent uppercase tracking-gallery text-[11px] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-muted block">
                        Selected Payment Mode
                      </span>
                      <p className="font-medium text-charcoal text-sm capitalize">
                        {paymentMethod === 'card'
                          ? 'Direct Card Transaction (Simulated)'
                          : paymentMethod === 'bank_transfer'
                          ? 'Fine Art Wire / Bank Transfer'
                          : 'Studio Private Escrow'}
                      </p>
                      <p className="text-charcoal-muted font-light">
                        Development sandbox. Zero real funds charged.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-accent uppercase tracking-gallery text-[11px] font-semibold hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Final Transaction CTA */}
                <div className="space-y-3 pt-4 border-t border-canvas-border">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={isProcessing}
                    onClick={handleCompleteAcquisition}
                    className="w-full justify-center flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Securing Your Piece...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Complete Acquisition</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isProcessing}
                      onClick={handlePrev}
                    >
                      Back
                    </Button>
                    <p className="text-[11px] text-charcoal-muted font-light">
                      By completing, you confirm reservation of this unique original work.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DESKTOP ARTWORK SUMMARY */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-sm space-y-6">
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Acquisition Summary
              </span>

              {items.map(({ artwork }) => (
                <div key={artwork.id} className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-canvas-border bg-canvas shadow-xs">
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-charcoal font-medium">
                      {artwork.title} ({artwork.year})
                    </h3>
                    <p className="text-xs text-charcoal-muted font-light">
                      {artwork.medium}
                    </p>
                    <p className="text-xs text-charcoal-muted/80">
                      {formatDimensionsWithInches(artwork.width, artwork.height).cm}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-canvas-border flex justify-between items-center">
                    <span className="text-xs text-charcoal-muted uppercase tracking-gallery">
                      Original Value
                    </span>
                    <span className="font-serif text-xl font-medium text-charcoal">
                      {formatPrice(artwork.price || 0, artwork.currency)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="border-t border-canvas-border pt-4 space-y-2 text-xs text-charcoal-muted">
                <div className="flex justify-between items-center">
                  <span>Custom Timber Crating</span>
                  <span className="font-medium text-accent">Complimentary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Certificate of Authenticity</span>
                  <span className="font-medium text-accent">Wax-Sealed Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fine Art Freight Delivery</span>
                  <span className="font-medium text-charcoal">Studio Covered</span>
                </div>

                <div className="border-t border-canvas-border pt-4 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-gallery font-semibold text-charcoal">
                    Total Due
                  </span>
                  <span className="font-serif text-3xl font-medium text-charcoal">
                    {formatPrice(subtotal, items[0]?.artwork.currency || 'USD')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-canvas border border-canvas-border rounded-sm flex items-center gap-3 text-xs text-charcoal-muted">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
              <span>Full international fine-art transport insurance included on all acquisitions.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

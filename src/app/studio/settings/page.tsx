'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Settings, ShieldCheck, User } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import { StudioSettingsData } from '@/types/studio';
import { MOCK_ADMIN_USER } from '@/data/mockStudioData';

export default function StudioSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'general' | 'artwork' | 'commerce' | 'commissions' | 'services' | 'contact' | 'notifications' | 'account'
  >('general');

  const [settings, setSettings] = useState<StudioSettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const s = await settingsService.getSettings();
      setSettings(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function showFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const updated = await settingsService.updateSettings(settings);
    setSettings(updated);
    setSaving(false);
    showFeedback('Studio operational settings saved.');
  }

  if (loading || !settings) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Studio Configuration...
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'artwork', label: 'Artworks' },
    { id: 'commerce', label: 'Commerce & Crating' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact & Social' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'account', label: 'Admin Account' },
  ] as const;

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            STUDIO PARAMETERS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Studio Settings & Policies
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Configure currency defaults, freight crating policies, and commission intake thresholds.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-canvas-border pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-charcoal text-canvas shadow-subtle'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSave}
        className="bg-canvas-subtle border border-canvas-border/80 rounded-2xl p-6 shadow-subtle max-w-3xl space-y-5"
      >
        {/* TAB: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Studio Identity & Regional Parameters
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                Studio & Gallery Brand
              </label>
              <input
                type="text"
                value={settings.general.studioName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, studioName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                Curatorial Tagline
              </label>
              <input
                type="text"
                value={settings.general.tagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, tagline: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Default Display Currency
                </label>
                <select
                  value={settings.general.defaultCurrency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, defaultCurrency: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Studio Timezone
                </label>
                <input
                  type="text"
                  value={settings.general.timezone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: ARTWORK */}
        {activeTab === 'artwork' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Catalogue & Registration Defaults
            </h2>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                Catalogue ID Prefix
              </label>
              <input
                type="text"
                value={settings.artwork.idPrefix}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    artwork: { ...settings.artwork, idPrefix: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Measurement Units
                </label>
                <select
                  value={settings.artwork.defaultUnits}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      artwork: { ...settings.artwork, defaultUnits: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="inches">Inches (in)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Default Availability
                </label>
                <select
                  value={settings.artwork.defaultAvailability}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      artwork: { ...settings.artwork, defaultAvailability: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB: COMMERCE & CRATING */}
        {activeTab === 'commerce' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Acquisition Logistics & Fine Art Freight
            </h2>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.commerce.insuranceEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commerce: { ...settings.commerce, insuranceEnabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-charcoal">All-Risk Fine Art Transit Insurance</span>
                  <p className="text-[0.6875rem] text-charcoal-muted">Automatically include wall-to-wall insurance coverage on all dispatched crates.</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.commerce.whiteGloveCourierOption}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commerce: { ...settings.commerce, whiteGloveCourierOption: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <div>
                  <span className="text-xs font-medium text-charcoal">White-Glove Courier Handover Default</span>
                  <p className="text-[0.6875rem] text-charcoal-muted">Coordinate dedicated personal art handlers for unpacking and condition reporting on delivery.</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                Direct Wire Transfer Instructions Template
              </label>
              <textarea
                rows={3}
                value={settings.commerce.directBankTransferInstructions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    commerce: {
                      ...settings.commerce,
                      directBankTransferInstructions: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB: COMMISSIONS */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Bespoke Commission Rules
            </h2>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
              <input
                type="checkbox"
                checked={settings.commissions.commissionsOpen}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    commissions: {
                      ...settings.commissions,
                      commissionsOpen: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-charcoal focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-charcoal">Commissions Intake Open</span>
                <p className="text-[0.6875rem] text-charcoal-muted">When enabled, the public commission enquiry form accepts new briefs.</p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Minimum Deposit Percentage (%)
                </label>
                <input
                  type="number"
                  value={settings.commissions.minimumDepositPercentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commissions: {
                        ...settings.commissions,
                        minimumDepositPercentage: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Standard Lead Time (Weeks)
                </label>
                <input
                  type="number"
                  value={settings.commissions.standardLeadTimeWeeks}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commissions: {
                        ...settings.commissions,
                        standardLeadTimeWeeks: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                Intake Acceptance Notice Text
              </label>
              <textarea
                rows={2}
                value={settings.commissions.acceptanceNoticeText}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    commissions: {
                      ...settings.commissions,
                      acceptanceNoticeText: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Active Studio Services
            </h2>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.services.customMuralsActive}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      services: { ...settings.services, customMuralsActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">Architectural Murals & Wall Reliefs Active</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.services.siteVisitsActive}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      services: { ...settings.services, siteVisitsActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">On-Site Architectural Spatial Assessments Active</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.services.architecturalConsultingActive}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      services: {
                        ...settings.services,
                        architecturalConsultingActive: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">Curatorial Art Consulting & Sourcing Active</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB: CONTACT & SOCIAL */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Contact Handles & Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Public Inquiries Email
                </label>
                <input
                  type="email"
                  value={settings.contact.publicEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, publicEmail: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Studio Location Summary
                </label>
                <input
                  type="text"
                  value={settings.contact.studioLocation}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, studioLocation: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settings.contact.instagramHandle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, instagramHandle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  X (Twitter) Handle
                </label>
                <input
                  type="text"
                  value={settings.contact.xHandle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, xHandle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={settings.contact.linkedInHandle}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, linkedInHandle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Studio Notification Routing
            </h2>

            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyNewOrder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifyNewOrder: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">Notify immediately on new acquisition order</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyNewEnquiry}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifyNewEnquiry: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">Notify on new collector enquiry message</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.notifyCommissionRequest}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        notifyCommissionRequest: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-charcoal focus:ring-0"
                />
                <span className="text-xs font-medium text-charcoal">Notify on bespoke commission brief submission</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB: ACCOUNT */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal pb-2 border-b border-canvas-border">
              Administrator Profile & Mock Authorization
            </h2>

            <div className="p-4 rounded-xl bg-canvas border border-canvas-border flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-stone-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MOCK_ADMIN_USER.avatarUrl}
                  alt={MOCK_ADMIN_USER.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-display text-base font-semibold text-charcoal">
                  {MOCK_ADMIN_USER.name}
                </h3>
                <p className="text-xs text-charcoal-muted">{MOCK_ADMIN_USER.email}</p>
                <p className="text-[0.6875rem] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-emerald-200">
                  {MOCK_ADMIN_USER.roleTitle} (Role: {MOCK_ADMIN_USER.role})
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
              Currently operating under Phase 5 simulated authorization. Role assignment, MFA authentication, and server-side RBAC will be enforced in production security hardening.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-canvas-border">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}

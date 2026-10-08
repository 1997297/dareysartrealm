'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { contentService } from '@/services/contentService';
import {
  CMSHomepageContent,
  CMSAboutContent,
  CMSContactContent,
} from '@/types/studio';

export default function StudioPagesCMSPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'about' | 'contact'>('homepage');

  // Content states
  const [homepage, setHomepage] = useState<CMSHomepageContent | null>(null);
  const [about, setAbout] = useState<CMSAboutContent | null>(null);
  const [contact, setContact] = useState<CMSContactContent | null>(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      const [h, a, c] = await Promise.all([
        contentService.getHomepage(),
        contentService.getAbout(),
        contentService.getContact(),
      ]);
      setHomepage(h);
      setAbout(a);
      setContact(c);
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

  async function handleSaveHomepage(e: React.FormEvent) {
    e.preventDefault();
    if (!homepage) return;
    setSaving(true);
    const updated = await contentService.updateHomepage(homepage);
    setHomepage(updated);
    setSaving(false);
    showFeedback('Homepage editorial copy updated.');
  }

  async function handleSaveAbout(e: React.FormEvent) {
    e.preventDefault();
    if (!about) return;
    setSaving(true);
    const updated = await contentService.updateAbout(about);
    setAbout(updated);
    setSaving(false);
    showFeedback('About page curatorial copy updated.');
  }

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contact) return;
    setSaving(true);
    const updated = await contentService.updateContact(contact);
    setContact(updated);
    setSaving(false);
    showFeedback('Contact & Atelier logistics updated.');
  }

  if (loading || !homepage || !about || !contact) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Curatorial Copy...
        </p>
      </div>
    );
  }

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
            EDITORIAL CMS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Website Content & Curatorial Copy
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Refine manifesto quotes, artist narratives, and inquiry contact protocols across public views.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-canvas-border pb-2">
        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${
            activeTab === 'homepage'
              ? 'bg-charcoal text-canvas shadow-subtle'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
          }`}
        >
          Homepage Copy
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-charcoal text-canvas shadow-subtle'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
          }`}
        >
          About & Manifesto
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-colors ${
            activeTab === 'contact'
              ? 'bg-charcoal text-canvas shadow-subtle'
              : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
          }`}
        >
          Contact & Private Viewing
        </button>
      </div>

      {/* TAB 1: HOMEPAGE CMS */}
      {activeTab === 'homepage' && (
        <form
          onSubmit={handleSaveHomepage}
          className="bg-canvas-subtle border border-canvas-border/80 rounded-2xl p-6 shadow-subtle space-y-5 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Homepage Narrative Sections
            </h2>
            <span className="text-[0.6875rem] font-mono text-charcoal-subtle">
              Last saved: {new Date(homepage.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Hero Heading
            </label>
            <input
              type="text"
              value={homepage.heroHeading}
              onChange={(e) => setHomepage({ ...homepage, heroHeading: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Hero Supporting Statement
            </label>
            <textarea
              rows={2}
              value={homepage.heroSupportingText}
              onChange={(e) => setHomepage({ ...homepage, heroSupportingText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Manifesto Quote
              </label>
              <textarea
                rows={3}
                value={homepage.manifestoQuote}
                onChange={(e) => setHomepage({ ...homepage, manifestoQuote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Manifesto Body
              </label>
              <textarea
                rows={3}
                value={homepage.manifestoBody}
                onChange={(e) => setHomepage({ ...homepage, manifestoBody: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>
          </div>

          {/* Stacked Artwork Cards Selection */}
          <div className="p-4 rounded-xl border border-canvas-border bg-canvas space-y-3">
            <div>
              <p className="text-xs font-mono uppercase text-charcoal font-semibold">
                Manifesto Stacked Artwork Cards (3 Prints)
              </p>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Configure the three overlapping artwork images displayed diagonally in the &ldquo;Art made to be felt&rdquo; section.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Card 1 (Front / Prominent)
                </label>
                <input
                  type="text"
                  value={homepage.manifestoStackedImages?.[0] || '/artworks/pic5.jpeg'}
                  onChange={(e) => {
                    const current = homepage.manifestoStackedImages || ['/artworks/pic5.jpeg', '/artworks/pic2.jpeg', '/artworks/pic7.jpeg'];
                    const next = [...current];
                    next[0] = e.target.value;
                    setHomepage({ ...homepage, manifestoStackedImages: next });
                  }}
                  placeholder="/artworks/pic5.jpeg"
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-canvas-border bg-canvas-subtle text-charcoal"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Card 2 (Middle)
                </label>
                <input
                  type="text"
                  value={homepage.manifestoStackedImages?.[1] || '/artworks/pic1.jpeg'}
                  onChange={(e) => {
                    const current = homepage.manifestoStackedImages || ['/artworks/pic5.jpeg', '/artworks/pic1.jpeg', '/artworks/pic7.jpeg'];
                    const next = [...current];
                    next[1] = e.target.value;
                    setHomepage({ ...homepage, manifestoStackedImages: next });
                  }}
                  placeholder="/artworks/pic1.jpeg"
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-canvas-border bg-canvas-subtle text-charcoal"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Card 3 (Back)
                </label>
                <input
                  type="text"
                  value={homepage.manifestoStackedImages?.[2] || '/artworks/pic7.jpeg'}
                  onChange={(e) => {
                    const current = homepage.manifestoStackedImages || ['/artworks/pic5.jpeg', '/artworks/pic1.jpeg', '/artworks/pic7.jpeg'];
                    const next = [...current];
                    next[2] = e.target.value;
                    setHomepage({ ...homepage, manifestoStackedImages: next });
                  }}
                  placeholder="/artworks/pic7.jpeg"
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-canvas-border bg-canvas-subtle text-charcoal"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Artist Introduction Title
              </label>
              <input
                type="text"
                value={homepage.artistIntroTitle}
                onChange={(e) => setHomepage({ ...homepage, artistIntroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Artist Introduction Body
              </label>
              <textarea
                rows={2}
                value={homepage.artistIntroBody}
                onChange={(e) => setHomepage({ ...homepage, artistIntroBody: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-canvas-border">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Homepage Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT CMS */}
      {activeTab === 'about' && (
        <form
          onSubmit={handleSaveAbout}
          className="bg-canvas-subtle border border-canvas-border/80 rounded-2xl p-6 shadow-subtle space-y-5 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Artist Biography & Studio Narrative
            </h2>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Artist Biography
            </label>
            <textarea
              rows={4}
              value={about.artistBiography}
              onChange={(e) => setAbout({ ...about, artistBiography: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Curatorial Statement
            </label>
            <textarea
              rows={3}
              value={about.curatorialStatement}
              onChange={(e) => setAbout({ ...about, curatorialStatement: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Studio Philosophy
            </label>
            <textarea
              rows={3}
              value={about.studioPhilosophy}
              onChange={(e) => setAbout({ ...about, studioPhilosophy: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Process Narrative (Belgian Linen & Earth Minerals)
            </label>
            <textarea
              rows={3}
              value={about.processNarrative}
              onChange={(e) => setAbout({ ...about, processNarrative: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-canvas-border">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save About Page</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CONTACT CMS */}
      {activeTab === 'contact' && (
        <form
          onSubmit={handleSaveContact}
          className="bg-canvas-subtle border border-canvas-border/80 rounded-2xl p-6 shadow-subtle space-y-5 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-canvas-border">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Contact Protocols & Private Viewing Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Principal Studio Email
              </label>
              <input
                type="email"
                value={contact.studioEmail}
                onChange={(e) => setContact({ ...contact, studioEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Curatorial / Press Email
              </label>
              <input
                type="email"
                value={contact.pressEmail}
                onChange={(e) => setContact({ ...contact, pressEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Telephone
              </label>
              <input
                type="text"
                value={contact.telephone}
                onChange={(e) => setContact({ ...contact, telephone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                WhatsApp Direct Link
              </label>
              <input
                type="text"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Atelier Location Note
            </label>
            <input
              type="text"
              value={contact.locationNote}
              onChange={(e) => setContact({ ...contact, locationNote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Viewing Appointment Hours Note
            </label>
            <input
              type="text"
              value={contact.hoursNote}
              onChange={(e) => setContact({ ...contact, hoursNote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-canvas-border">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

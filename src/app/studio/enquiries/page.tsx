'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Search,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  User,
  Mail,
  MapPin,
  Palette,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { enquiryService } from '@/services/enquiryService';
import { EnquiryThread, EnquiryCategory, EnquiryStatus } from '@/types/studio';

export default function StudioEnquiriesPage() {
  const [threads, setThreads] = useState<EnquiryThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<EnquiryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadThreads() {
    try {
      setLoading(true);
      const all = await enquiryService.getAll();
      setThreads(all);
      if (all.length > 0 && !selectedThreadId) {
        setSelectedThreadId(all[0].id);
      }
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

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0] || null;

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    const updated = await enquiryService.reply(selectedThread.id, replyText.trim());
    if (updated) {
      setThreads((prev) => prev.map((t) => (t.id === selectedThread.id ? updated : t)));
      setReplyText('');
      showFeedback('Reply dispatched to client.');
    }
  }

  async function handleStatusChange(status: EnquiryStatus) {
    if (!selectedThread) return;
    const updated = await enquiryService.updateStatus(selectedThread.id, status);
    if (updated) {
      setThreads((prev) => prev.map((t) => (t.id === selectedThread.id ? updated : t)));
      showFeedback(`Status marked as ${status}.`);
    }
  }

  async function handleAddInternalNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedThread || !internalNoteText.trim()) return;

    const updated = await enquiryService.addInternalNote(selectedThread.id, internalNoteText.trim());
    if (updated) {
      setThreads((prev) => prev.map((t) => (t.id === selectedThread.id ? updated : t)));
      setInternalNoteText('');
      showFeedback('Confidential studio note archived.');
    }
  }

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.clientName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.clientEmail.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            COLLECTOR COMMUNICATIONS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Enquiry Inbox
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Private acquisition queries, international crating logistics, and private viewing appointments.
          </p>
        </div>
      </div>

      {/* 3-Pane Inbox Container */}
      <div className="bg-canvas rounded-2xl border border-canvas-border shadow-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px] h-[calc(100vh-210px)]">
        {/* PANE 1: Conversation List (4 cols) */}
        <div className="lg:col-span-4 border-r border-canvas-border flex flex-col bg-canvas-subtle">
          {/* Search & Category Filter */}
          <div className="p-3 border-b border-canvas-border space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none text-[0.6875rem] font-mono uppercase">
              {(['all', 'artwork', 'commission', 'service', 'general'] as EnquiryCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-charcoal text-canvas font-bold'
                        : 'bg-canvas text-charcoal-muted hover:text-charcoal border border-canvas-border'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-canvas-border/60 scrollbar-thin">
            {loading ? (
              <div className="py-12 text-center text-xs text-charcoal-subtle">
                Loading conversations...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="py-12 text-center text-xs text-charcoal-subtle">
                No conversations match criteria.
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = thread.id === selectedThread?.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      if (thread.unread) {
                        enquiryService.toggleRead(thread.id, true);
                        setThreads((prev) =>
                          prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
                        );
                      }
                    }}
                    className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'bg-canvas border-l-4 border-l-charcoal shadow-subtle'
                        : thread.unread
                        ? 'bg-canvas/80 font-medium'
                        : 'hover:bg-canvas/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[0.625rem] font-mono text-charcoal-subtle">
                      <span className="font-semibold text-charcoal truncate max-w-[140px]">
                        {thread.clientName}
                      </span>
                      <span>{thread.lastMessageTime}</span>
                    </div>

                    <p className="font-medium text-charcoal truncate leading-snug">
                      {thread.subject}
                    </p>

                    <p className="text-charcoal-muted line-clamp-1 leading-snug text-[0.6875rem]">
                      {thread.lastMessage}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[0.5625rem] font-mono uppercase text-charcoal-subtle">
                        {thread.category}
                      </span>
                      <StatusBadge status={thread.status} size="sm" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANE 2: Message Thread & Composer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-canvas border-r border-canvas-border">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-canvas-border flex items-center justify-between bg-canvas sticky top-0 z-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6875rem] font-mono text-charcoal-subtle">
                      {selectedThread.id}
                    </span>
                    <StatusBadge status={selectedThread.status} size="sm" />
                  </div>
                  <h2 className="font-display text-base font-semibold text-charcoal truncate mt-0.5">
                    {selectedThread.subject}
                  </h2>
                </div>

                {/* Status Dropdown */}
                <select
                  value={selectedThread.status}
                  onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                  className="px-2.5 py-1 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="responded">Responded</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {selectedThread.messages.map((msg) => {
                  const isDarey = msg.sender === 'darey';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDarey ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[0.625rem] font-mono text-charcoal-subtle mb-1">
                        <span className="font-semibold text-charcoal">{msg.senderName}</span>
                        <span>&bull;</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isDarey
                            ? 'bg-charcoal text-canvas rounded-tr-none shadow-subtle'
                            : 'bg-canvas-subtle text-charcoal border border-canvas-border/80 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-canvas-border flex gap-2 bg-canvas">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedThread.clientName}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50 shrink-0 self-end"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-charcoal-subtle">
              Select an enquiry conversation to begin.
            </div>
          )}
        </div>

        {/* PANE 3: Contextual Artwork / Client Dossier (3 cols) */}
        <div className="lg:col-span-3 bg-canvas-subtle p-4 overflow-y-auto space-y-5 scrollbar-thin">
          {selectedThread ? (
            <>
              {/* Client Info */}
              <div className="space-y-2">
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block">
                  Client Profile
                </span>
                <div className="p-3 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1">
                  <p className="font-semibold text-charcoal">{selectedThread.clientName}</p>
                  <p className="text-charcoal-muted text-[0.6875rem]">{selectedThread.clientEmail}</p>
                  {selectedThread.clientPhone && (
                    <p className="text-charcoal-muted text-[0.6875rem]">{selectedThread.clientPhone}</p>
                  )}
                  {selectedThread.clientLocation && (
                    <p className="text-charcoal-subtle text-[0.6875rem] pt-1">
                      {selectedThread.clientLocation}
                    </p>
                  )}
                </div>
              </div>

              {/* Artwork Context (if applicable) */}
              {selectedThread.artworkContext && (
                <div className="space-y-2">
                  <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block">
                    Associated Artwork
                  </span>
                  <div className="p-3 rounded-xl bg-canvas border border-canvas-border text-xs space-y-2">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedThread.artworkContext.imageUrl}
                        alt={selectedThread.artworkContext.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">
                        {selectedThread.artworkContext.title}
                      </p>
                      <p className="text-[0.6875rem] text-charcoal-subtle font-mono">
                        {selectedThread.artworkContext.artworkId} &bull; $
                        {selectedThread.artworkContext.price?.toLocaleString()}{' '}
                        {selectedThread.artworkContext.currency}
                      </p>
                    </div>
                    <Link
                      href={`/studio/artworks/${selectedThread.artworkContext.id}`}
                      className="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-charcoal hover:underline"
                    >
                      <span>Catalogue Record</span>
                      <ExternalLink className="w-3 h-3 text-charcoal-subtle" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Commission Context (if applicable) */}
              {selectedThread.commissionContext && (
                <div className="space-y-2">
                  <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block">
                    Commission Scope
                  </span>
                  <div className="p-3 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1">
                    <p className="font-medium text-charcoal">
                      Type: {selectedThread.commissionContext.preferredType || 'Custom'}
                    </p>
                    <p className="text-charcoal-muted">
                      Budget: {selectedThread.commissionContext.budget}
                    </p>
                    <p className="text-charcoal-muted">
                      Timeline: {selectedThread.commissionContext.timeline}
                    </p>
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div className="space-y-2">
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block">
                  Confidential Studio Notes
                </span>
                <div className="space-y-2">
                  {selectedThread.internalNotes?.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-canvas border border-canvas-border text-[0.6875rem] space-y-0.5"
                    >
                      <span className="font-semibold text-charcoal block">{n.author}:</span>
                      <p className="text-charcoal-muted leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddInternalNote} className="space-y-1.5 pt-1">
                  <input
                    type="text"
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Add studio note..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!internalNoteText.trim()}
                    className="w-full py-1 rounded-lg bg-charcoal text-canvas text-[0.6875rem] font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

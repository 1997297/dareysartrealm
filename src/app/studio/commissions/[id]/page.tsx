'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Upload,
  Check,
  CheckCircle2,
  ChevronRight,
  Send,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { commissionService } from '@/services/commissionService';
import { collectorService } from '@/services/collectorService';
import {
  CollectorCommission,
  CommissionTrackingStage,
  CommissionProgressImage,
  CollectorMessageThread,
} from '@/types/collector';

const ALL_STAGES: CommissionTrackingStage[] = [
  'REQUEST RECEIVED',
  'REVIEWING',
  'CONSULTATION',
  'STUDY SKETCHES',
  'IN CREATION',
  'PREVIEW',
  'FINAL APPROVAL',
  'BALANCE DUE',
  'PACKAGING & PROVENANCE',
  'DELIVERED',
];

export default function StudioCommissionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [commission, setCommission] = useState<CollectorCommission | null>(null);
  const [messagesThread, setMessagesThread] = useState<CollectorMessageThread | null>(null);
  const [loading, setLoading] = useState(true);

  // Quote form state
  const [quotedAmount, setQuotedAmount] = useState<number>(0);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [balanceRemaining, setBalanceRemaining] = useState<number>(0);
  const [nextStep, setNextStep] = useState<string>('');

  // Message reply
  const [replyText, setReplyText] = useState('');

  // WIP Photo Modal
  const [wipModalOpen, setWipModalOpen] = useState(false);
  const [wipCaption, setWipCaption] = useState('');
  const [wipStage, setWipStage] = useState('In Creation');

  // Feedback toast
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadCommission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadCommission() {
    if (!id) return;
    try {
      setLoading(true);
      const [comm, threads] = await Promise.all([
        commissionService.getById(id),
        collectorService.getMessages(),
      ]);
      if (comm) {
        setCommission(comm);
        setQuotedAmount(comm.paymentSummary?.quotedAmount || 0);
        setDepositPaid(comm.paymentSummary?.depositPaid || false);
        setBalanceRemaining(comm.paymentSummary?.balanceRemaining || 0);
        setNextStep(comm.nextStep || '');

        // Find associated messages thread if any
        const matchThread = threads.find((t) => t.contextTitle.includes(comm.title) || t.id.includes(comm.id));
        setMessagesThread(matchThread || threads[0] || null);
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

  async function handleStageChange(newStage: CommissionTrackingStage) {
    if (!commission) return;
    const stageIndex = ALL_STAGES.indexOf(newStage) + 1;
    const updated = await commissionService.updateStage(commission.id, newStage, stageIndex, nextStep);
    if (updated) {
      setCommission(updated);
      showFeedback(`Commission advanced to stage: ${newStage}`);
    }
  }

  async function handleSaveQuote() {
    if (!commission) return;
    const updated = await commissionService.updateQuote(
      commission.id,
      quotedAmount,
      depositPaid,
      balanceRemaining,
      'USD'
    );
    if (updated) {
      setCommission(updated);
      showFeedback('Commission budget & quote updated.');
    }
  }

  async function handleAddWIPImage(e: React.FormEvent) {
    e.preventDefault();
    if (!commission || !wipCaption.trim()) return;

    const sampleImages = [
      '/artworks/pic7.jpeg',
      '/artworks/hero.jpeg',
      '/artworks/pic8.jpeg',
      '/artworks/pic6.jpeg',
    ];
    const pick = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const updated = await commissionService.addProgressImage(commission.id, {
      url: pick,
      caption: wipCaption.trim(),
      stage: wipStage,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    });

    if (updated) {
      setCommission(updated);
      setWipModalOpen(false);
      setWipCaption('');
      showFeedback('Work-in-progress photograph published to client portal.');
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !messagesThread) return;

    const updated = await collectorService.sendMessage(
      messagesThread.id,
      replyText.trim(),
      'Darey'
    );
    if (updated) {
      setMessagesThread(updated);
      setReplyText('');
      showFeedback('Message dispatched to client.');
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Commission Workspace...
        </p>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Commission Record Not Found
        </h2>
        <Link
          href="/studio/commissions"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Pipeline</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/commissions"
            className="p-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-mono text-charcoal-subtle uppercase">
                {commission.id}
              </span>
              <StatusBadge status={commission.currentStage} size="sm" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight mt-0.5">
              {commission.title}
            </h1>
          </div>
        </div>

        {/* Stage Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-charcoal-subtle hidden sm:inline">
            Stage:
          </span>
          <select
            value={commission.currentStage}
            onChange={(e) => handleStageChange(e.target.value as CommissionTrackingStage)}
            className="px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal focus:outline-none shadow-subtle"
          >
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Brief, Financials & WIP Photos (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Concept Brief */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Commission Brief & Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-3 rounded-xl bg-canvas border border-canvas-border">
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block mb-1">
                  Medium / Palette
                </span>
                <span className="font-medium text-charcoal">{commission.artworkType}</span>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-canvas-border">
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block mb-1">
                  Dimensions
                </span>
                <span className="font-medium text-charcoal">{commission.dimensions}</span>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-canvas-border">
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle block mb-1">
                  Target Completion
                </span>
                <span className="font-medium text-charcoal">{commission.estimatedCompletion}</span>
              </div>
            </div>

            <div>
              <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle block mb-1.5">
                Client Concept Narrative
              </span>
              <p className="text-xs text-charcoal-muted leading-relaxed p-4 rounded-xl bg-canvas border border-canvas-border">
                {commission.brief}
              </p>
            </div>

            <div>
              <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle block mb-1.5">
                Next Operational Step
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nextStep}
                  onChange={(e) => setNextStep(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
                />
                <button
                  onClick={() => handleStageChange(commission.currentStage)}
                  className="px-3 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors"
                >
                  Save Next Step
                </button>
              </div>
            </div>
          </div>

          {/* Quote & Financial Ledger */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-charcoal">
                Quote & Financial Settlement
              </h2>
              <span className="text-xs text-charcoal-subtle font-mono">50% Standard Deposit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Quoted Total ($ USD)
                </label>
                <input
                  type="number"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Balance Remaining ($ USD)
                </label>
                <input
                  type="number"
                  value={balanceRemaining}
                  onChange={(e) => setBalanceRemaining(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal focus:outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-canvas border border-canvas-border cursor-pointer">
                  <input
                    type="checkbox"
                    checked={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.checked)}
                    className="w-4 h-4 rounded text-charcoal focus:ring-0"
                  />
                  <span className="text-xs font-medium text-charcoal">Deposit Verified</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveQuote}
                className="px-3.5 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle"
              >
                Update Financial Ledger
              </button>
            </div>
          </div>

          {/* Work-in-Progress (WIP) Photo Updates */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-charcoal">
                  Work-in-Progress Visual Logs ({commission.progressImages?.length || 0})
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Curated process captures shared with the collector to celebrate the creation journey.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWipModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Process Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commission.progressImages?.map((wip) => (
                <div
                  key={wip.id}
                  className="rounded-xl overflow-hidden border border-canvas-border bg-canvas shadow-subtle group"
                >
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={wip.url}
                      alt={wip.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[0.625rem] font-mono bg-stone-900/80 text-stone-100 backdrop-blur-sm">
                      {wip.stage}
                    </span>
                  </div>
                  <div className="p-3 text-xs space-y-1">
                    <p className="font-medium text-charcoal">{wip.caption}</p>
                    <p className="text-[0.6875rem] text-charcoal-subtle font-mono">{wip.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Collector Dialogue / Chat (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col h-[640px]">
            <div className="pb-3 border-b border-canvas-border flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-charcoal">
                  Collector Dialogue
                </h2>
                <p className="text-xs text-charcoal-muted">
                  Direct private communication channel
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                Connected
              </span>
            </div>

            {/* Messages Thread Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
              {messagesThread?.messages.map((msg) => {
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
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-subtle ${
                        isDarey
                          ? 'bg-charcoal text-canvas rounded-tr-none'
                          : 'bg-canvas text-charcoal border border-canvas-border rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-canvas-border flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Compose response to collector..."
                className="flex-1 px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-3.5 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Add WIP Process Photo Modal */}
      {wipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => setWipModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Add Work-in-Progress Photograph
            </h3>

            <form onSubmit={handleAddWIPImage} className="space-y-4">
              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Creation Stage
                </label>
                <select
                  value={wipStage}
                  onChange={(e) => setWipStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal"
                >
                  <option value="Concept Studies">Concept Studies</option>
                  <option value="Substrate Priming">Substrate Priming</option>
                  <option value="In Creation">In Creation (Impasto / Oil)</option>
                  <option value="Varnish & Inspection">Varnish & Inspection</option>
                  <option value="Archival Crating">Archival Crating</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Process Note / Caption
                </label>
                <textarea
                  rows={3}
                  value={wipCaption}
                  onChange={(e) => setWipCaption(e.target.value)}
                  placeholder="e.g. Third layer of pumice-knife work setting under morning daylight..."
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWipModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-charcoal-muted hover:text-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle"
                >
                  Publish Process Capture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

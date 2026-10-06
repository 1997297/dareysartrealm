'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Send,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { serviceRequestService } from '@/services/serviceRequestService';
import { ServiceRequestRecord } from '@/data/mockStudioData';

export default function StudioServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestRecord | null>(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setLoading(true);
      const all = await serviceRequestService.getAll();
      setRequests(all);
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

  async function handleStatusChange(id: string, newStatus: ServiceRequestRecord['status']) {
    const updated = await serviceRequestService.updateStatus(id, newStatus);
    if (updated) {
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRequest?.id === id) {
        setSelectedRequest(updated);
      }
      showFeedback(`Request status updated to ${newStatus}.`);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRequest || !newNote.trim()) return;

    const updated = await serviceRequestService.addInternalNote(selectedRequest.id, newNote.trim());
    if (updated) {
      setRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? updated : r)));
      setSelectedRequest(updated);
      setNewNote('');
      showFeedback('Internal note added.');
    }
  }

  const filtered = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.clientName.toLowerCase().includes(q) ||
        r.serviceTitle.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.organization && r.organization.toLowerCase().includes(q));
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            PROPOSALS & INTAKE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Service Requests & Murals
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Architectural commissions, site-specific installations, and executive art programmes.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, organization, location, or project title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-canvas-border bg-canvas text-charcoal placeholder:text-charcoal-subtle text-xs font-sans focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-charcoal-subtle hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-canvas-border/60">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle mr-1">
            Status:
          </span>
          {['all', 'new', 'reviewing', 'site_visit_scheduled', 'proposal_sent', 'contracted'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-mono uppercase transition-colors ${
                  statusFilter === st
                    ? 'bg-charcoal text-canvas font-bold'
                    : 'bg-canvas text-charcoal-muted hover:text-charcoal border border-canvas-border'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No service proposals found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Client / Practice</th>
                <th className="py-3 px-4">Service Scope</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Est. Budget</th>
                <th className="py-3 px-4">Target Timeline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-charcoal">{req.clientName}</p>
                    <p className="text-[0.6875rem] text-charcoal-muted">
                      {req.organization || req.spaceType}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal">{req.serviceTitle}</p>
                    {req.wallDimensions && (
                      <p className="text-[0.6875rem] text-charcoal-subtle font-mono">
                        {req.wallDimensions}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {req.location}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {req.estimatedBudget}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {req.targetTimeline}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-3 py-1.5 rounded-lg border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
                    >
                      Inspect Brief
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Inspection Drawer / Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="relative w-full max-w-2xl bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <div>
                <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                  {selectedRequest.id} &bull; {selectedRequest.spaceType}
                </span>
                <h2 className="font-display text-xl font-semibold text-charcoal mt-0.5">
                  {selectedRequest.serviceTitle}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-charcoal-subtle hover:text-charcoal rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client & Logistics Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-canvas-subtle border border-canvas-border space-y-1">
                <span className="font-mono text-[0.625rem] text-charcoal-subtle uppercase">
                  Client & Organization
                </span>
                <p className="font-semibold text-charcoal text-sm">{selectedRequest.clientName}</p>
                <p className="text-charcoal-muted">{selectedRequest.clientEmail}</p>
                {selectedRequest.clientPhone && (
                  <p className="text-charcoal-muted">{selectedRequest.clientPhone}</p>
                )}
                {selectedRequest.organization && (
                  <p className="text-charcoal font-medium pt-1">{selectedRequest.organization}</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-canvas-subtle border border-canvas-border space-y-1">
                <span className="font-mono text-[0.625rem] text-charcoal-subtle uppercase">
                  Location & Scale
                </span>
                <p className="font-semibold text-charcoal text-sm">{selectedRequest.location}</p>
                <p className="text-charcoal-muted font-mono">
                  Scale: {selectedRequest.wallDimensions || 'To be evaluated'}
                </p>
                <p className="text-charcoal-muted font-mono">
                  Budget: {selectedRequest.estimatedBudget}
                </p>
                <p className="text-charcoal-muted font-mono">
                  Timeline: {selectedRequest.targetTimeline}
                </p>
              </div>
            </div>

            {/* Project Narrative */}
            <div>
              <span className="text-xs font-mono uppercase text-charcoal-subtle block mb-1">
                Project Narrative & Spatial Vision
              </span>
              <p className="text-xs text-charcoal-muted leading-relaxed p-4 rounded-xl bg-canvas-subtle border border-canvas-border">
                {selectedRequest.description}
              </p>
            </div>

            {/* Status Manager */}
            <div className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-charcoal">Engagement Lifecycle Stage</p>
                <p className="text-[0.6875rem] text-charcoal-muted">
                  Update status as site assessment or proposal progresses.
                </p>
              </div>
              <select
                value={selectedRequest.status}
                onChange={(e) =>
                  handleStatusChange(selectedRequest.id, e.target.value as any)
                }
                className="px-3 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal focus:outline-none"
              >
                <option value="new">New Proposal</option>
                <option value="reviewing">Under Review</option>
                <option value="site_visit_scheduled">Site Visit Scheduled</option>
                <option value="proposal_sent">Formal Proposal Sent</option>
                <option value="contracted">Contracted / Work Commenced</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Internal Notes */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-charcoal-subtle block">
                Internal Studio Assessment Notes
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedRequest.internalNotes?.map((note, idx) => (
                  <p
                    key={idx}
                    className="p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border text-xs text-charcoal-muted leading-relaxed"
                  >
                    {note}
                  </p>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add confidential studio note regarding engineering, scaffolding, or fees..."
                  className="flex-1 px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                >
                  Add Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

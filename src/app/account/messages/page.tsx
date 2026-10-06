'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send, MessageSquare, Sparkles, CheckCircle2, User, Loader2 } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { CollectorMessageThread } from '@/types/collector';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function AccountMessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<CollectorMessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectorService.getMessages().then((data) => {
      setThreads(data);
      if (data.length > 0) {
        setActiveThreadId(data[0].id);
      }
      setIsLoading(false);
    });
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    setIsSending(true);
    const updated = await collectorService.sendMessage(
      activeThread.id,
      replyText,
      `${user?.firstName || 'Elena'} ${user?.lastName || 'Rostova'}`
    );

    if (updated) {
      setThreads((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setReplyText('');
    }
    setIsSending(false);
  };

  return (
    <AccountShell
      title="Studio Dialogue"
      subtitle="Direct communications with Darey concerning your acquisitions, commissions, and spatial inquiries."
    >
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="p-12 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
            <MessageSquare className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="font-serif text-2xl text-charcoal font-light">
            No studio conversations open.
          </h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
            When you inquire about an artwork or initiate a commission brief, your direct studio thread will appear here.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="primary" size="md">
              Send Studio Note
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 border border-canvas-border rounded-sm bg-canvas overflow-hidden min-h-[550px]">
          {/* LEFT: THREADS LIST */}
          <div className="md:col-span-4 border-r border-canvas-border bg-canvas-subtle/40 divide-y divide-canvas-border overflow-y-auto">
            <div className="p-4 border-b border-canvas-border">
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Conversations ({threads.length})
              </span>
            </div>

            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;

              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 text-left transition-colors flex gap-3 items-start ${
                    isSelected
                      ? 'bg-canvas shadow-xs border-l-2 border-charcoal'
                      : 'hover:bg-canvas-subtle'
                  }`}
                >
                  {thread.contextImageUrl ? (
                    <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-canvas-border shrink-0">
                      <Image
                        src={thread.contextImageUrl}
                        alt={thread.contextTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xs bg-canvas-muted flex items-center justify-center text-charcoal-muted shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-serif text-sm text-charcoal font-medium truncate">
                      {thread.subject}
                    </p>
                    <p className="text-xs text-charcoal-muted truncate font-light">
                      {thread.lastMessage}
                    </p>
                    <span className="text-[10px] text-charcoal-muted/70 block pt-0.5 font-mono">
                      {new Date(thread.updatedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: ACTIVE CONVERSATION THREAD */}
          {activeThread && (
            <div className="md:col-span-8 flex flex-col justify-between bg-canvas">
              {/* Thread Header */}
              <div className="p-4 sm:p-5 border-b border-canvas-border flex items-center justify-between bg-canvas-subtle/30">
                <div>
                  <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                    {activeThread.contextType} • {activeThread.contextTitle}
                  </span>
                  <h3 className="font-serif text-lg text-charcoal font-medium">
                    {activeThread.subject}
                  </h3>
                </div>
              </div>

              {/* Messages Body */}
              <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[420px]">
                {activeThread.messages.map((msg) => {
                  const isDarey = msg.sender === 'darey';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDarey ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-charcoal-muted">
                        <span className="font-medium text-charcoal">
                          {isDarey ? 'Darey (Studio)' : msg.senderName}
                        </span>
                        <span>•</span>
                        <span className="text-[10px]">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-md p-4 rounded-sm text-xs leading-relaxed font-light ${
                          isDarey
                            ? 'bg-canvas-subtle border border-canvas-border text-charcoal'
                            : 'bg-charcoal text-canvas'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-canvas-border bg-canvas-subtle/20 flex gap-3"
              >
                <input
                  type="text"
                  placeholder="Reply to Darey..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-canvas border border-canvas-border rounded-sm text-xs text-charcoal focus:border-charcoal focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSending || !replyText.trim()}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      )}
    </AccountShell>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  LightbulbIcon,
  Trash2Icon,
  Loader2Icon,
  PhoneCallIcon,
  MailIcon,
  CopyIcon,
  CheckIcon,
  RotateCwIcon,
} from 'lucide-react';

interface EventSuggestion {
  id: string;
  idea: string;
  contact?: string;
  createdAt: string;
}

export function EventSuggestionsManager() {
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/event-suggestions', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load event suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/event-suggestions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
        setNotice('Suggestion deleted successfully.');
        setConfirmingId(null);
        setTimeout(() => setNotice(''), 3000);
      } else {
        setNotice('Failed to delete suggestion.');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setNotice('Error deleting suggestion.');
      setTimeout(() => setNotice(''), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-xl font-bold text-ink">Event Suggestions</h2>
            {!loading && (
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-vermilion/10 text-vermilion rounded-full">
                {suggestions.length}
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Community-submitted event ideas and requests from the Events page.
          </p>
        </div>

        <button
          onClick={loadSuggestions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border border-paper-muted rounded hover:bg-paper-light text-ink transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
          title="Refresh suggestions"
        >
          <RotateCwIcon size={12} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
          {notice}
        </div>
      )}

      {/* Content */}
      <div className="border border-paper-muted rounded-sm bg-paper overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-ink-muted font-mono">
            <Loader2Icon size={18} className="animate-spin inline-block mr-2 text-vermilion" />
            Loading event suggestions...
          </div>
        ) : suggestions.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-paper-light flex items-center justify-center text-ink-light mb-3">
              <LightbulbIcon size={24} />
            </div>
            <h3 className="font-headline text-sm font-bold text-ink">No suggestions received yet</h3>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              When students or visitors click &quot;Suggest Us&quot; on the Events page, their submissions will be collected here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-paper-muted">
            {suggestions.map((item) => {
              const isEmail = item.contact && item.contact.includes('@');
              const isPhone = item.contact && /[\d\+\-\(\)]{6,}/.test(item.contact);

              return (
                <div
                  key={item.id}
                  className="p-5 hover:bg-paper-light/40 transition-colors space-y-3"
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-vermilion/10 text-vermilion flex items-center justify-center shrink-0">
                        <LightbulbIcon size={14} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-ink-light">
                          {formatDate(item.createdAt)}
                        </span>
                        <span className="text-paper-muted">·</span>
                        <span className="font-mono text-[10px] text-ink-light select-all">
                          {item.id}
                        </span>
                      </div>
                    </div>

                    {confirmingId === item.id ? (
                      <div className="flex items-center gap-1.5 bg-paper-light border border-red-200 dark:border-red-900/50 px-2 py-1 rounded animate-fade-in">
                        <span className="text-[11px] font-mono text-vermilion font-medium">Delete?</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-2 py-0.5 bg-[#C2410C] hover:bg-[#EA580C] text-white text-[10px] font-mono font-medium rounded transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {deletingId === item.id ? (
                            <Loader2Icon size={11} className="animate-spin inline-block" />
                          ) : (
                            'Yes'
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          disabled={deletingId === item.id}
                          className="px-2 py-0.5 border border-paper-muted hover:bg-paper text-ink-muted text-[10px] font-mono rounded transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(item.id)}
                        className="p-1.5 text-ink-light hover:text-vermilion hover:bg-vermilion/5 rounded transition-colors cursor-pointer"
                        title="Delete suggestion"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    )}
                  </div>

                  {/* Suggestion Text */}
                  <div className="bg-paper-light/70 border border-paper-muted/80 rounded-lg p-3.5 text-xs text-ink leading-relaxed whitespace-pre-wrap font-sans">
                    {item.idea}
                  </div>

                  {/* Contact Info Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    {item.contact ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[11px] border border-amber-500/20">
                          {isEmail ? <MailIcon size={12} /> : <PhoneCallIcon size={12} />}
                          <span className="font-medium select-all">{item.contact}</span>
                        </span>

                        <button
                          onClick={() => handleCopy(item.contact!, item.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-ink-muted hover:text-ink hover:bg-paper-light rounded border border-paper-muted transition-colors cursor-pointer"
                          title="Copy contact"
                        >
                          {copiedId === item.id ? (
                            <>
                              <CheckIcon size={11} className="text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {isEmail && (
                          <a
                            href={`mailto:${item.contact}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-vermilion hover:underline"
                          >
                            Send Email →
                          </a>
                        )}

                        {isPhone && (
                          <a
                            href={`tel:${item.contact.replace(/[^\d\+]/g, '')}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-vermilion hover:underline"
                          >
                            Call →
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-ink-light italic">
                        No contact details provided (anonymous)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

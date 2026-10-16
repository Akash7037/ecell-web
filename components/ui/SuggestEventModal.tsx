'use client';

import { useState, useEffect, useRef } from 'react';
import { XIcon, Loader2Icon, CheckCircle2Icon } from 'lucide-react';

interface SuggestEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestEventModal({ isOpen, onClose }: SuggestEventModalProps) {
  const [idea, setIdea] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError('');
      setTimeout(() => textareaRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please enter your event idea.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/event-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: idea.trim(),
          contact: contact.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit suggestion');
      }

      setSubmitted(true);
      setIdea('');
      setContact('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-paper border border-paper-muted rounded-lg shadow-xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-ink-muted hover:text-ink transition-colors"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2Icon size={32} className="mx-auto text-emerald-600" />
            <h3 className="font-headline text-lg font-bold text-ink">Suggestion Received</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Thank you! Your idea has been submitted to the E-Cell team.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => setSubmitted(false)}
                className="px-3.5 py-2 text-xs font-medium border border-paper-muted text-ink-muted hover:text-ink rounded transition-colors"
              >
                Suggest Another
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium bg-ink text-paper hover:bg-ink/90 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-headline text-lg font-bold text-ink mb-4">
              Suggest an Event
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  ref={textareaRef}
                  required
                  rows={4}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="What event, workshop, or competition would you like us to host?"
                  className="w-full bg-paper-light border border-paper-muted rounded-md p-3 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors leading-relaxed resize-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Your phone number or email (optional)"
                  className="w-full bg-paper-light border border-paper-muted rounded-md px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors"
                />
              </div>

              {error && (
                <div className="p-2 text-xs text-vermilion bg-red-50 border border-red-200 rounded">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium border border-paper-muted text-ink-muted hover:text-ink rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-ink text-paper hover:bg-ink/90 rounded disabled:opacity-50 transition-colors"
                >
                  {submitting && <Loader2Icon size={12} className="animate-spin" />}
                  <span>{submitting ? 'Submitting...' : 'Submit Suggestion'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export function SuggestEventButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-ink hover:bg-ink/90 text-paper text-xs font-mono font-medium rounded-sm shadow-xs transition-colors cursor-pointer select-none active:scale-98"
      >
        Suggest Us
      </button>

      <SuggestEventModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

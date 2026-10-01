'use client';

import { useState } from 'react';
import { MailIcon, CheckCircle2Icon, Loader2Icon, ArrowRightIcon } from 'lucide-react';
import { SectionLabel } from '@/components/ui/Atoms';

interface SubscribeSectionProps {
  variant?: 'card' | 'inline' | 'section';
}

export function SubscribeSection({ variant = 'section' }: SubscribeSectionProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || "You're subscribed! We'll email you when new events are announced.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'card') {
    return (
      <div className="border border-paper-muted bg-paper-dim rounded-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2 text-vermilion">
          <MailIcon size={14} />
          <SectionLabel>Event Alerts</SectionLabel>
        </div>
        <h3 className="font-headline text-lg font-bold text-ink mb-1.5">
          Get notified for upcoming events
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed mb-4 max-w-md">
          Receive a concise email notice when prototype registrations and innovation summits open.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 border border-paper-muted bg-paper rounded-sm px-3.5 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-1.5 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors shrink-0 disabled:opacity-50"
          >
            {loading ? <Loader2Icon size={12} className="animate-spin" /> : 'Notify Me'}
          </button>
        </form>
        {status === 'success' && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
            <CheckCircle2Icon size={13} /> {message}
          </p>
        )}
        {status === 'error' && (
          <p className="mt-3 text-xs text-vermilion font-mono">
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="bg-paper-dim border-t border-paper-muted py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <SectionLabel>Dispatch</SectionLabel>
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-ink mb-3">
            Never miss an event announcement.
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            Get direct alerts for Project Expo '26 registration dates, hackathons, and investor rounds. No spam, only calendar updates.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border border-paper-muted bg-paper rounded-sm px-4 py-2.5 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors duration-150"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-5 py-2.5 rounded-sm hover:bg-ink/80 transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <Loader2Icon size={13} className="animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRightIcon size={12} />
                </>
              )}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
              <CheckCircle2Icon size={14} /> {message}
            </p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-xs text-vermilion font-mono">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
export default SubscribeSection;

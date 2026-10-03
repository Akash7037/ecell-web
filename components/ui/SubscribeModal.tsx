'use client';

import { useState, useEffect } from 'react';
import { XIcon, Loader2Icon, CheckCircle2Icon } from 'lucide-react';

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already subscribed
    const isSubscribed = localStorage.getItem('ecell_subscribed') === 'true';
    if (isSubscribed) return;

    // Check if recently dismissed within the last 5 days
    const dismissedTime = localStorage.getItem('ecell_subscribe_dismissed');
    if (dismissedTime) {
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(dismissedTime, 10) < fiveDaysMs) {
        return;
      }
    }

    // Trigger popup after 5 seconds of active browsing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecell_subscribe_dismissed', Date.now().toString());
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ecell_subscribed', 'true');
        }
        setTimeout(() => {
          setIsOpen(false);
        }, 2200);
      } else {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Simple, clean modal container */}
      <div
        className="relative w-full max-w-sm bg-white border border-[#E5E2DA] rounded-lg p-6 shadow-lg z-10"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 p-1 text-[#78716C] hover:text-[#1C1917] transition-colors"
          aria-label="Close"
        >
          <XIcon size={16} />
        </button>

        {success ? (
          <div className="py-4 text-center space-y-2">
            <CheckCircle2Icon size={24} className="text-emerald-600 mx-auto" />
            <h3 className="text-base font-semibold text-[#1C1917]">Subscribed!</h3>
            <p className="text-xs text-[#57534E]">
              You will receive updates about upcoming events.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-[#1C1917]">
                Subscribe for Updates
              </h3>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                Subscribe to get updates about events and announcements.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D6D3D1] rounded text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C]"
                />
                {errorMsg && (
                  <p className="text-[11px] text-red-600 mt-1">{errorMsg}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-medium py-2 px-3 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2Icon size={13} className="animate-spin text-white" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs text-[#78716C] hover:text-[#1C1917] py-2 px-3 border border-[#D6D3D1] rounded hover:bg-[#F5F5F4] transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

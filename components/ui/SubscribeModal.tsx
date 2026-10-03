'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, BellIcon, CheckCircle2Icon, Loader2Icon } from 'lucide-react';

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Only run on client
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
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl sm:rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden z-10"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#268B8C]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F5F4] rounded-full transition-colors"
              aria-label="Close subscription popup"
            >
              <XIcon size={18} />
            </button>

            {success ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2Icon size={24} />
                </div>
                <h3 className="font-headline text-xl font-bold text-[#1C1917]">
                  You're on the list!
                </h3>
                <p className="text-xs sm:text-sm text-[#57534E] max-w-xs mx-auto">
                  We'll send you timely alerts for Project Expo '26, hackathons, and founder summits.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center shrink-0 border border-[#FED7AA]">
                    <BellIcon size={18} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#C2410C] font-semibold block">
                      Dispatch &bull; E-Cell VSBCETC
                    </span>
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-[#1C1917] leading-tight">
                      Never miss an event update
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Get direct alerts when registration opens for <strong>Project Expo '26</strong>, 48-hr hackathons, and pitch stages. No spam, only calendar updates.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your college or personal email"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E7E5E4] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] transition-all shadow-xs"
                    />
                    {errorMsg && (
                      <p className="text-xs text-red-600 mt-1.5">{errorMsg}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors shadow-xs disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2Icon size={14} className="animate-spin text-white" />
                      ) : (
                        'Subscribe for Updates'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs text-[#78716C] hover:text-[#1C1917] py-2.5 px-3 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] transition-colors"
                    >
                      Later
                    </button>
                  </div>
                </form>

                <p className="text-[10px] text-[#A8A29E] text-center font-mono">
                  You can unsubscribe anytime with 1 click.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

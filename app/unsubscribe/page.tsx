'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2Icon, AlertCircleIcon, Loader2Icon, MailXIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ecell_subscribed');
        }
      } else {
        setErrorMsg(data.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-xl mx-auto px-6 py-20 flex-1 flex flex-col justify-center">
        <div className="bg-white border border-[#E7E5E4] rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#C2410C]" />

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2Icon size={28} />
              </div>
              <h1 className="font-headline text-2xl font-bold text-[#1C1917]">
                You're Unsubscribed
              </h1>
              <p className="text-sm text-[#57534E] leading-relaxed max-w-sm mx-auto">
                <span className="font-mono font-medium text-[#1C1917]">{email}</span> will no longer receive event notifications or newsletter dispatches from E-Cell VSBCETC.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-block bg-[#1C1917] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded-lg hover:bg-[#333] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#FFF7ED] text-[#C2410C] flex items-center justify-center shrink-0 border border-[#FED7AA]">
                  <MailXIcon size={20} />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C2410C] font-semibold block">
                    Manage Preferences
                  </span>
                  <h1 className="font-headline text-xl sm:text-2xl font-bold text-[#1C1917]">
                    Unsubscribe from Updates
                  </h1>
                </div>
              </div>

              <p className="text-sm text-[#57534E] leading-relaxed">
                Confirm your email below to stop receiving event announcements, Project Expo notifications, and hackathon schedules.
              </p>

              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to unsubscribe"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#E7E5E4] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#C2410C] focus:bg-white transition-all shadow-xs"
                  />
                  {errorMsg && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircleIcon size={14} /> {errorMsg}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-6 rounded-lg transition-colors shadow-xs disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2Icon size={14} className="animate-spin text-white" />
                    ) : (
                      'Confirm Unsubscribe'
                    )}
                  </button>
                  <Link
                    href="/"
                    className="w-full sm:w-auto text-center text-xs text-[#78716C] hover:text-[#1C1917] py-2.5 px-4 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F4] transition-colors"
                  >
                    Cancel & Keep Subscription
                  </Link>
                </div>
              </form>

              <p className="text-xs text-[#A8A29E] pt-2 border-t border-[#E7E5E4]">
                Accidentally unsubscribed? You can always re-subscribe anytime from the E-Cell website.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-sm font-mono text-[#78716C]">
          Loading preferences...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}

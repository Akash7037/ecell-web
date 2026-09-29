'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, Plus, Trash2, Clock, CheckCircle2, AlertCircle, 
  MapPin, Sparkles, RefreshCw, Edit3, Save, LogOut, ArrowLeft, Shield,
  X, ExternalLink, ChevronDown
} from 'lucide-react';
import type { Event, Member } from '@/types';
import { events as initialEvents, members as initialMembers } from '@/data/seed';
import Link from 'next/link';

const WINGS = [
  'Core Leadership',
  'Technical & Hardware Sandbox',
  'Corporate & Venture Relations',
  'Incubation & IP Cell',
  'Media & Design Foundry',
];

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [membersList, setMembersList] = useState<Member[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<'events' | 'members'>('events');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [heroBgEnabled, setHeroBgEnabled] = useState(true);
  const [bgToggling, setBgToggling] = useState(false);

  // Event form state
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '', subtitle: '', description: '',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    location: 'VSBCETC, Coimbatore',
    feeType: 'Free' as 'Free' | 'Paid',
    amountPerTeam: '',
    registrationUrl: '',
    tag: 'EVENT',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  });

  // Member form state
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '', role: '', department: '', bio: '', wing: 'Core Leadership',
    image: '', year: 3, portfolio: '',
    linkedin: '', github: '', twitter: '', instagram: '',
    quote: '', ecellPerspective: '', currentProject: '', whyEcell: '', keyMetric: '',
  });

  // Auth check
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then(r => {
        if (r.ok) setAuthenticated(true);
        else window.location.href = '/admin/login';
      })
      .catch(() => window.location.href = '/admin/login')
      .finally(() => setAuthChecking(false));
  }, []);

  // Fetch data
  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/events').then(r => r.json()).then(d => { if (Array.isArray(d)) setEventsList(d); }).catch(() => {});
    fetch('/api/members').then(r => r.json()).then(d => { if (Array.isArray(d)) setMembersList(d); }).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => { if (typeof d.heroDynamicBackground === 'boolean') setHeroBgEnabled(d.heroDynamicBackground); }).catch(() => {});
  }, [authenticated]);

  const handleToggleHeroBg = async () => {
    setBgToggling(true);
    try {
      const nextVal = !heroBgEnabled;
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroDynamicBackground: nextVal }),
        credentials: 'same-origin',
      });
      if (res.ok) {
        setHeroBgEnabled(nextVal);
        showMsg(`Hero dynamic background turned ${nextVal ? 'ON (Active)' : 'OFF (Disabled)'}.`, 'success');
      } else {
        showMsg('Failed to update background setting', 'error');
      }
    } catch {
      showMsg('Network error updating setting', 'error');
    } finally {
      setBgToggling(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/admin/login';
  };

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // ─── Event CRUD ───
  const resetEventForm = () => {
    setEventForm({
      title: '', subtitle: '', description: '',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      location: 'VSBCETC, Coimbatore', feeType: 'Free', amountPerTeam: '',
      registrationUrl: '', tag: 'EVENT',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    });
    setEditingEventId(null);
    setIsAddingEvent(false);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) { showMsg('Title and date required.', 'error'); return; }

    const payload = {
      ...eventForm,
      date: new Date(eventForm.date).toISOString(),
      amountPerTeam: eventForm.feeType === 'Paid' ? eventForm.amountPerTeam : 'Free Entry',
    };

    try {
      if (editingEventId) {
        const res = await fetch('/api/events', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingEventId, ...payload }) });
        if (res.ok) { setEventsList(prev => prev.map(ev => ev.id === editingEventId ? { ...ev, ...payload } : ev)); showMsg('Event updated.', 'success'); resetEventForm(); }
        else showMsg('Failed to update.', 'error');
      } else {
        const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { const created = await res.json(); setEventsList(prev => [created, ...prev]); showMsg('Event created.', 'success'); resetEventForm(); }
        else showMsg('Failed to create.', 'error');
      }
    } catch { showMsg('Network error.', 'error'); }
  };

  const handleEditEvent = (event: Event) => {
    setEventForm({
      title: event.title, subtitle: event.subtitle, description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16), location: event.location,
      feeType: event.feeType || 'Free', amountPerTeam: event.amountPerTeam || '',
      registrationUrl: event.registrationUrl || '', tag: event.tag || 'EVENT',
      image: event.image,
    });
    setEditingEventId(event.id);
    setIsAddingEvent(true);
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) { setEventsList(prev => prev.filter(ev => ev.id !== id)); showMsg(`Deleted "${title}".`, 'success'); }
      else showMsg('Failed to delete.', 'error');
    } catch { showMsg('Network error.', 'error'); }
  };

  // ─── Member CRUD ───
  const resetMemberForm = () => {
    setMemberForm({ name: '', role: '', department: '', bio: '', wing: 'Core Leadership', image: '', year: 3, portfolio: '', linkedin: '', github: '', twitter: '', instagram: '', quote: '', ecellPerspective: '', currentProject: '', whyEcell: '', keyMetric: '' });
    setEditingMemberId(null);
    setIsAddingMember(false);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.role) { showMsg('Name and role required.', 'error'); return; }

    const payload = {
      name: memberForm.name, role: memberForm.role, department: memberForm.department,
      bio: memberForm.bio, wing: memberForm.wing, image: memberForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      year: memberForm.year, portfolio: memberForm.portfolio || undefined,
      socials: { linkedin: memberForm.linkedin || undefined, github: memberForm.github || undefined, twitter: memberForm.twitter || undefined, instagram: memberForm.instagram || undefined },
      contributions: [], featured: false,
      quote: memberForm.quote || undefined, ecellPerspective: memberForm.ecellPerspective || undefined,
      currentProject: memberForm.currentProject || undefined, whyEcell: memberForm.whyEcell || undefined,
      keyMetric: memberForm.keyMetric || undefined,
    };

    try {
      if (editingMemberId) {
        const res = await fetch('/api/members', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingMemberId, ...payload }) });
        if (res.ok) { setMembersList(prev => prev.map(m => m.id === editingMemberId ? { ...m, ...payload, id: editingMemberId } as Member : m)); showMsg('Member updated.', 'success'); resetMemberForm(); }
        else showMsg('Failed to update.', 'error');
      } else {
        const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) { const created = await res.json(); setMembersList(prev => [...prev, created]); showMsg('Member added.', 'success'); resetMemberForm(); }
        else showMsg('Failed to add.', 'error');
      }
    } catch { showMsg('Network error.', 'error'); }
  };

  const handleEditMember = (m: Member) => {
    setMemberForm({
      name: m.name, role: m.role, department: m.department, bio: m.bio,
      wing: m.wing || 'Core Leadership', image: m.image, year: m.year,
      portfolio: m.portfolio || '', linkedin: m.socials.linkedin || '',
      github: m.socials.github || '', twitter: m.socials.twitter || '',
      instagram: m.socials.instagram || '', quote: m.quote || '',
      ecellPerspective: m.ecellPerspective || '', currentProject: m.currentProject || '',
      whyEcell: m.whyEcell || '', keyMetric: m.keyMetric || '',
    });
    setEditingMemberId(m.id);
    setIsAddingMember(true);
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the team?`)) return;
    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) { setMembersList(prev => prev.filter(m => m.id !== id)); showMsg(`Removed "${name}".`, 'success'); }
      else showMsg('Failed to remove.', 'error');
    } catch { showMsg('Network error.', 'error'); }
  };

  // Loading / Auth gate
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-pulse text-white/30 text-sm font-mono">Verifying access...</div>
      </div>
    );
  }

  if (!authenticated) return null;

  const now = Date.now();
  const upcomingCount = eventsList.filter(e => new Date(e.date).getTime() >= now && !e.isPast).length;
  const pastCount = eventsList.filter(e => new Date(e.date).getTime() < now || e.isPast).length;

  const inputClass = "w-full px-4 py-2.5 bg-[#0f0f18] rounded-xl border border-white/10 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-vermilion/50 focus:ring-1 focus:ring-vermilion/20 transition-all";
  const labelClass = "text-[11px] font-mono font-semibold text-white/40 uppercase tracking-wider block mb-1.5";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white/90">

      {/* ═══════ TOP HEADER ═══════ */}
      <header className="border-b border-white/[0.06] bg-[#0e0e16] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white/60" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <span className="text-sm font-bold text-white/80 block leading-tight">E-Cell Admin</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-vermilion/80">VSBCETC</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick Hero Dynamic Background Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className={`w-2 h-2 rounded-full ${heroBgEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
              <span className="text-[11px] font-mono text-white/50 hidden sm:inline">Hero Dynamic BG:</span>
              <button
                onClick={handleToggleHeroBg}
                disabled={bgToggling}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                  heroBgEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-white/10 text-white/40 border border-white/10 hover:bg-white/15'
                }`}
                title="Turn Hero Section Dynamic Background ON/OFF"
              >
                {bgToggling ? '...' : heroBgEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* ═══════ METRICS ═══════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Events', value: eventsList.length, color: 'text-white/80' },
            { label: 'Upcoming', value: upcomingCount, color: 'text-emerald-400' },
            { label: 'Archived', value: pastCount, color: 'text-white/50' },
            { label: 'Team', value: membersList.length, color: 'text-white/80' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
              <span className="text-[10px] font-mono text-white/30 uppercase">{s.label}</span>
              <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ═══════ ALERT ═══════ */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className={`p-3.5 rounded-xl border mb-6 flex items-center justify-between ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage(null)} className="text-white/30 hover:text-white/60"><X className="w-3.5 h-3.5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ APPEARANCE & HERO BACKGROUND CONTROLLER ═══════ */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-vermilion/10 border border-vermilion/20 flex items-center justify-center text-vermilion shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white/90">Hero Section Dynamic Canvas</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${heroBgEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/40'}`}>
                  {heroBgEnabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-white/40 font-light mt-0.5">
                Floating ember particles and interactive constellation lines responding dynamically to user mouse movement.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleHeroBg}
            disabled={bgToggling}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-sm shrink-0 flex items-center gap-2 self-start sm:self-auto ${
              heroBgEnabled
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${bgToggling ? 'animate-spin' : ''}`} />
            <span>{bgToggling ? 'Saving...' : heroBgEnabled ? 'Turn OFF Background' : 'Turn ON Background'}</span>
          </button>
        </div>

        {/* ═══════ TABS ═══════ */}
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'events' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />Events
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'members' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <Users className="w-3.5 h-3.5 inline mr-1.5" />Team ({membersList.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'events') { resetEventForm(); setIsAddingEvent(true); }
              else { resetMemberForm(); setIsAddingMember(true); }
            }}
            className="px-4 py-2 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion/80 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'events' ? 'Add Event' : 'Add Member'}</span>
          </button>
        </div>

        {/* ═══════ EVENTS TAB ═══════ */}
        {activeTab === 'events' && (
          <div>
            {/* Event Form */}
            <AnimatePresence>
              {isAddingEvent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-bold text-white/80">{editingEventId ? 'Edit Event' : 'New Event'}</h3>
                      <button onClick={resetEventForm} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Event Title *</label>
                        <input type="text" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className={inputClass} placeholder="e.g. Project Expo '26" />
                      </div>
                      <div>
                        <label className={labelClass}>Short Description</label>
                        <input type="text" value={eventForm.subtitle} onChange={e => setEventForm({...eventForm, subtitle: e.target.value})} className={inputClass} placeholder="Brief one-liner" />
                      </div>
                      <div>
                        <label className={labelClass}>Date & Time *</label>
                        <input type="datetime-local" required value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Location</label>
                        <input type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Fee Type</label>
                        <select value={eventForm.feeType} onChange={e => setEventForm({...eventForm, feeType: e.target.value as 'Free' | 'Paid'})} className={inputClass}>
                          <option value="Free">Free</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                      {eventForm.feeType === 'Paid' && (
                        <div>
                          <label className={labelClass}>Amount</label>
                          <input type="text" value={eventForm.amountPerTeam} onChange={e => setEventForm({...eventForm, amountPerTeam: e.target.value})} className={inputClass} placeholder="e.g. ₹250 / Team" />
                        </div>
                      )}
                      <div>
                        <label className={labelClass}>Registration URL (External)</label>
                        <input type="url" value={eventForm.registrationUrl} onChange={e => setEventForm({...eventForm, registrationUrl: e.target.value})} className={inputClass} placeholder="https://forms.gle/..." />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Full Description</label>
                        <textarea rows={2} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className={inputClass} placeholder="Details about the event..." />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                        <button type="button" onClick={resetEventForm} className="px-4 py-2 rounded-full border border-white/10 text-xs text-white/50 hover:text-white/80">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion/80 flex items-center gap-1.5">
                          <Save className="w-3.5 h-3.5" />{editingEventId ? 'Update' : 'Create'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Event List */}
            <div className="space-y-2">
              {eventsList.map(event => {
                const isPast = new Date(event.date).getTime() < now || event.isPast;
                return (
                  <div key={event.id} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.05] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isPast ? 'bg-white/5 text-white/40' : 'bg-emerald-500/15 text-emerald-400'}`}>
                          {isPast ? 'PAST' : 'UPCOMING'}
                        </span>
                        <span className="text-[11px] font-mono text-white/30">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {event.feeType && (
                          <span className={`text-[10px] font-semibold ${event.feeType === 'Free' ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
                            • {event.feeType === 'Free' ? 'Free' : event.amountPerTeam || 'Paid'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white/80">{event.title}</h4>
                      <p className="text-xs text-white/30 line-clamp-1 mt-0.5">{event.subtitle || event.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleEditEvent(event)} className="px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center gap-1">
                        <Edit3 className="w-3 h-3" />Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id, event.title)} className="px-3 py-1.5 rounded-lg border border-rose-500/20 text-[11px] text-rose-400/60 hover:bg-rose-500/10 hover:text-rose-400 transition-all flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ MEMBERS TAB ═══════ */}
        {activeTab === 'members' && (
          <div>
            {/* Member Form */}
            <AnimatePresence>
              {isAddingMember && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
                  <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-bold text-white/80">{editingMemberId ? 'Edit Member' : 'Add Member'}</h3>
                      <button onClick={resetMemberForm} className="text-white/30 hover:text-white/60"><X className="w-4 h-4" /></button>
                    </div>
                    <form onSubmit={handleSaveMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input type="text" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className={inputClass} placeholder="e.g. Kaviarasan S." />
                      </div>
                      <div>
                        <label className={labelClass}>Role *</label>
                        <input type="text" required value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className={inputClass} placeholder="e.g. Student President" />
                      </div>
                      <div>
                        <label className={labelClass}>Wing</label>
                        <select value={memberForm.wing} onChange={e => setMemberForm({...memberForm, wing: e.target.value})} className={inputClass}>
                          {WINGS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Department</label>
                        <input type="text" value={memberForm.department} onChange={e => setMemberForm({...memberForm, department: e.target.value})} className={inputClass} placeholder="e.g. Computer Science" />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <select value={memberForm.year} onChange={e => setMemberForm({...memberForm, year: parseInt(e.target.value)})} className={inputClass}>
                          {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Photo URL</label>
                        <input type="url" value={memberForm.image} onChange={e => setMemberForm({...memberForm, image: e.target.value})} className={inputClass} placeholder="https://..." />
                      </div>
                      <div>
                        <label className={labelClass}>Portfolio URL</label>
                        <input type="url" value={memberForm.portfolio} onChange={e => setMemberForm({...memberForm, portfolio: e.target.value})} className={inputClass} placeholder="https://portfolio.dev/..." />
                      </div>
                      <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input type="url" value={memberForm.linkedin} onChange={e => setMemberForm({...memberForm, linkedin: e.target.value})} className={inputClass} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div>
                        <label className={labelClass}>GitHub</label>
                        <input type="url" value={memberForm.github} onChange={e => setMemberForm({...memberForm, github: e.target.value})} className={inputClass} placeholder="https://github.com/..." />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Short Bio</label>
                        <textarea rows={2} value={memberForm.bio} onChange={e => setMemberForm({...memberForm, bio: e.target.value})} className={inputClass} placeholder="Brief description..." />
                      </div>
                      <div>
                        <label className={labelClass}>Quote</label>
                        <input type="text" value={memberForm.quote} onChange={e => setMemberForm({...memberForm, quote: e.target.value})} className={inputClass} placeholder="Personal motto..." />
                      </div>
                      <div>
                        <label className={labelClass}>Key Metric</label>
                        <input type="text" value={memberForm.keyMetric} onChange={e => setMemberForm({...memberForm, keyMetric: e.target.value})} className={inputClass} placeholder="e.g. 12 Patents Filed" />
                      </div>
                      <div>
                        <label className={labelClass}>Current Project</label>
                        <input type="text" value={memberForm.currentProject} onChange={e => setMemberForm({...memberForm, currentProject: e.target.value})} className={inputClass} placeholder="Active blueprint..." />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                        <button type="button" onClick={resetMemberForm} className="px-4 py-2 rounded-full border border-white/10 text-xs text-white/50 hover:text-white/80">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion/80 flex items-center gap-1.5">
                          <Save className="w-3.5 h-3.5" />{editingMemberId ? 'Update Member' : 'Add Member'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Members List */}
            <div className="space-y-2">
              {membersList.map(member => (
                <div key={member.id} className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-white/5 shrink-0 border border-white/10">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white/80 truncate">{member.name}</h4>
                      <span className="text-[10px] font-mono text-vermilion/70 shrink-0">{member.wing || 'Team'}</span>
                    </div>
                    <p className="text-xs text-white/40">{member.role} · {member.department}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {member.portfolio && (
                      <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-white/40 hover:text-white transition-all" title="Portfolio">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button onClick={() => handleEditMember(member)} className="px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white/50 hover:text-white hover:border-white/20 transition-all flex items-center gap-1">
                      <Edit3 className="w-3 h-3" />Edit
                    </button>
                    <button onClick={() => handleDeleteMember(member.id, member.name)} className="px-3 py-1.5 rounded-lg border border-rose-500/20 text-[11px] text-rose-400/60 hover:bg-rose-500/10 hover:text-rose-400 transition-all flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

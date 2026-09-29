'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Tag, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  Sliders,
  Save,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import type { Event, Member } from '@/types';
import { events as initialEvents, members as initialMembers } from '@/data/seed';
import { defaultExpoConfig, ExpoConfig } from '@/lib/expoConfig';

export function AdminDashboard() {
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [membersList, setMembersList] = useState<Member[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<'events' | 'expo' | 'members'>('events');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dynamic Project Expo Config State
  const [expoConfig, setExpoConfig] = useState<ExpoConfig>(defaultExpoConfig);
  const [savingExpo, setSavingExpo] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    description: '',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    location: 'Main Auditorium & Innovation Labs, VSBCETC, Coimbatore',
    tag: 'PROJECT EXPO',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    registrationUrl: '/contact#pitch',
  });

  // Fetch events from API
  const refreshEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setEventsList(data);
        }
      }
    } catch {}
  };

  // Fetch Expo Config from API
  const fetchExpoConfig = async () => {
    try {
      const res = await fetch('/api/expo');
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          setExpoConfig(data);
        }
      }
    } catch {}
  };

  useEffect(() => {
    refreshEvents();
    fetchExpoConfig();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description || !newEvent.date) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          date: new Date(newEvent.date).toISOString(),
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setEventsList([created, ...eventsList]);
        setIsAddingEvent(false);
        setMessage({ text: 'Event published successfully! If the date is in the past, it automatically moves to Past Events.', type: 'success' });
        setNewEvent({
          title: '',
          subtitle: '',
          description: '',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          location: 'Main Auditorium & Innovation Labs, VSBCETC, Coimbatore',
          tag: 'PROJECT EXPO',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
          registrationUrl: '/contact#pitch',
        });
      } else {
        setMessage({ text: 'Failed to create event. Please try again.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setEventsList((prev) => prev.filter((item) => item.id !== id));
        setMessage({ text: `Deleted "${title}" successfully.`, type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete event.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Failed to delete event.', type: 'error' });
    }
  };

  const handleSaveExpoConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingExpo(true);
    try {
      const res = await fetch('/api/expo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expoConfig),
      });

      if (res.ok) {
        setMessage({ text: 'Project Expo configuration saved! Live site is updated immediately.', type: 'success' });
      } else {
        setMessage({ text: 'Failed to save Expo configuration.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error connecting to server.', type: 'error' });
    } finally {
      setSavingExpo(false);
    }
  };

  const handleTrackChange = (index: number, field: string, value: string) => {
    const updatedTracks = [...expoConfig.tracks];
    updatedTracks[index] = { ...updatedTracks[index], [field]: value };
    setExpoConfig({ ...expoConfig, tracks: updatedTracks });
  };

  const now = Date.now();
  const upcomingCount = eventsList.filter((e) => new Date(e.date).getTime() >= now && !e.isPast).length;
  const pastCount = eventsList.filter((e) => new Date(e.date).getTime() < now || e.isPast).length;

  return (
    <div className="w-full text-slate-900">
      
      {/* ═══════ TOP METRICS OVERVIEW CARDS (HIGH CONTRAST) ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>TOTAL EVENTS</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-headline text-3xl font-bold text-slate-900">
            {eventsList.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">In database registry</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs bg-emerald-50/30">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
            <span>UPCOMING LIVE</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-headline text-3xl font-bold text-emerald-700">
            {upcomingCount}
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Open for registration</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            <span>AUTO-ARCHIVED PAST</span>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-headline text-3xl font-bold text-slate-800">
            {pastCount}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Date passed &rarr; auto past</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>ACTIVE TEAM</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-headline text-3xl font-bold text-slate-900">
            {membersList.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">VSBCETC Operators</span>
        </div>

      </div>

      {/* Alert Notification */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border mb-6 flex items-center justify-between shadow-xs ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                : 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline ml-4"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HIGH-CONTRAST TAB CONTROLS ═══════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200">
        
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 border border-slate-300">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Events &amp; Past Archive
          </button>
          <button
            onClick={() => setActiveTab('expo')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'expo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-vermilion" />
            <span>Configure Project Expo '26</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team Roster ({membersList.length})
          </button>
        </div>

        {activeTab === 'events' && (
          <button
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-vermilion transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingEvent ? 'Close Event Form' : 'Add New Event'}</span>
          </button>
        )}

      </div>

      {/* ═══════ TAB 1: ADD EVENT FORM (HIGH CONTRAST) ═══════ */}
      <AnimatePresence>
        {isAddingEvent && activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-vermilion" />
                  <h3 className="font-headline text-lg font-bold text-slate-900">
                    Publish New Event to VSBCETC Portal
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Auto-classifies into Past Events once event date passes
                </span>
              </div>

              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROJECT EXPO '26"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Subtitle / Theme
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Inter-Collegiate Engineering Prototype Summit"
                    value={newEvent.subtitle}
                    onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Date &amp; Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Dates in the future stay in "Upcoming". Once this timestamp passes, it automatically moves to "Past Events".
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Campus Location (Coimbatore) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Auditorium & Innovation Labs, VSBCETC, Coimbatore"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Category Tag
                  </label>
                  <select
                    value={newEvent.tag}
                    onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-sm"
                  >
                    <option value="PROJECT EXPO">PROJECT EXPO</option>
                    <option value="FLAGSHIP SUMMIT">FLAGSHIP SUMMIT</option>
                    <option value="HARDWARE HACKATHON">HARDWARE HACKATHON</option>
                    <option value="PATENT WORKSHOP">PATENT WORKSHOP</option>
                    <option value="ANGEL DEMO DAY">ANGEL DEMO DAY</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide overview, participation rules, tracks, prize money, or problem statements..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion transition-colors text-sm"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddingEvent(false)}
                    className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-vermilion transition-colors shadow-sm"
                  >
                    {loading ? 'Publishing...' : 'Save & Publish Event →'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ TAB 1: EVENTS LIST VIEW ═══════ */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2">
            <span className="font-semibold uppercase">SHOWING {eventsList.length} REGISTERED EVENTS</span>
            <button
              onClick={refreshEvents}
              className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNC LIVE</span>
            </button>
          </div>

          <div className="space-y-3">
            {eventsList.map((event) => {
              const isEventPast = new Date(event.date).getTime() < now || event.isPast;
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 hidden sm:block border border-slate-200">
                      <img
                        src={event.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isEventPast
                              ? 'bg-slate-100 text-slate-700 border border-slate-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isEventPast ? 'PAST EVENT' : 'UPCOMING / ACTIVE'}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {event.tag && (
                          <span className="text-[11px] font-mono font-medium text-vermilion">
                            • {event.tag}
                          </span>
                        )}
                      </div>

                      <h4 className="font-headline text-base font-bold text-slate-900">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 max-w-xl mt-0.5">
                        {event.description}
                      </p>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        📍 {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ TAB 2: EDITABLE PROJECT EXPO CONFIGURATION ═══════ */}
      {activeTab === 'expo' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vermilion mb-1">
                <Sliders className="w-4 h-4" />
                <span>DYNAMIC HOMEPAGE DOSSIER</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-slate-900">
                Configure Project Expo '26 Content
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                All changes saved here will immediately appear live on the Homepage Project Expo section.
              </p>
            </div>

            <button
              onClick={handleSaveExpoConfig}
              disabled={savingExpo}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-vermilion transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingExpo ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveExpoConfig} className="space-y-8">
            
            {/* General Expo Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                  Expo Title
                </label>
                <input
                  type="text"
                  required
                  value={expoConfig.title}
                  onChange={(e) => setExpoConfig({ ...expoConfig, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium text-slate-900 focus:bg-white focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                  Date Status / Dates Announced
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dates Announcing Soon or March 28-29, 2026"
                  value={expoConfig.dateStatus}
                  onChange={(e) => setExpoConfig({ ...expoConfig, dateStatus: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium text-slate-900 focus:bg-white focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                  Location (Campus)
                </label>
                <input
                  type="text"
                  required
                  value={expoConfig.location}
                  onChange={(e) => setExpoConfig({ ...expoConfig, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium text-slate-900 focus:bg-white focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                  Prize Pool / Incubation Grants
                </label>
                <input
                  type="text"
                  required
                  value={expoConfig.prizePool}
                  onChange={(e) => setExpoConfig({ ...expoConfig, prizePool: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium text-slate-900 focus:bg-white focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-800 uppercase block mb-1.5">
                  Detailed Summit Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={expoConfig.description}
                  onChange={(e) => setExpoConfig({ ...expoConfig, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-300 font-medium text-slate-900 focus:bg-white focus:border-vermilion focus:ring-1 focus:ring-vermilion transition-colors text-sm"
                />
              </div>
            </div>

            {/* 4 Competition Tracks Customizer */}
            <div className="pt-6 border-t border-slate-200">
              <h4 className="font-headline text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-vermilion" />
                <span>Customize The 4 Competition Tracks</span>
              </h4>

              <div className="space-y-6">
                {expoConfig.tracks.map((track, i) => (
                  <div key={track.code} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-vermilion">
                        TRACK {track.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Track Name
                        </label>
                        <input
                          type="text"
                          value={track.name}
                          onChange={(e) => handleTrackChange(i, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-vermilion"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Tagline / Summary
                        </label>
                        <input
                          type="text"
                          value={track.tagline}
                          onChange={(e) => handleTrackChange(i, 'tagline', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-vermilion"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={track.description}
                          onChange={(e) => handleTrackChange(i, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-vermilion"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Dedicated Lab Tools / Testbenches
                        </label>
                        <input
                          type="text"
                          value={track.labTools}
                          onChange={(e) => handleTrackChange(i, 'labTools', e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-vermilion"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingExpo}
                className="px-8 py-3 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-vermilion transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{savingExpo ? 'Saving...' : 'Save & Publish to Live Homepage'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ═══════ TAB 3: TEAM MEMBERS LIST ═══════ */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2">
            <span className="font-semibold uppercase">SHOWING {membersList.length} OPERATORS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {membersList.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-vermilion uppercase font-bold block">
                    {member.wing || 'Team Member'}
                  </span>
                  <h4 className="font-headline text-base font-bold text-slate-900 truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {member.department}
                  </p>
                  {member.quote && (
                    <p className="text-xs italic text-slate-600 mt-2 line-clamp-2 border-l border-vermilion pl-2">
                      "{member.quote}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

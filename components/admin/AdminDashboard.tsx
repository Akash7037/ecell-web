'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CalendarIcon,
  UsersIcon,
  SettingsIcon,
  MailIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  CheckCircle2Icon,
  Loader2Icon,
  SendIcon,
  UploadIcon,
  GripVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { isEventConcluded } from '@/lib/eventUtils';

// ─── Types ───────────────────────────────────────────────
interface AdminEvent {
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  isFree: boolean;
  date: string;
  time: string;
  location?: string;
  registrationUrl?: string;
  imageUrl?: string;
  gallery?: string[];
  isConcluded?: boolean;
}

interface AdminMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  portfolioUrl?: string;
}

// ─── Admin Dashboard ─────────────────────────────────────
type Tab = 'events' | 'team' | 'subscribers' | 'settings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('events');

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'team', label: 'Team', icon: UsersIcon },
    { id: 'subscribers', label: 'Subscribers', icon: MailIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="border-b border-paper-muted bg-paper sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink-light">
              E-Cell VSBCETC
            </p>
            <h1 className="font-headline text-lg font-bold text-ink">Admin Panel</h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('ecell_admin_auth');
              window.location.reload();
            }}
            className="text-xs text-ink-light hover:text-ink transition-colors font-mono"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-paper-muted bg-paper">
        <div className="mx-auto max-w-5xl px-6">
          <nav className="flex gap-6" aria-label="Admin tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px focus:outline-none ${
                  activeTab === id
                    ? 'border-vermilion text-ink'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {activeTab === 'events' && <EventsManager />}
        {activeTab === 'team' && <TeamManager />}
        {activeTab === 'subscribers' && <SubscribersManager />}
        {activeTab === 'settings' && <SiteSettings />}
      </div>
    </div>
  );
}

// ─── Events Manager ───────────────────────────────────────
function EventsManager() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [adding, setAdding] = useState(false);

  const empty: Omit<AdminEvent, 'id'> = {
    name: '',
    shortDescription: '',
    description: '',
    isFree: true,
    date: '',
    time: '',
    location: '',
    registrationUrl: '',
    imageUrl: '',
    gallery: [],
  };
  const [form, setForm] = useState(empty);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'concluded'>('all');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const flashNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  const persistOrder = async (orderedList: AdminEvent[]) => {
    setReordering(true);
    try {
      const orderedIds = orderedList.map((e) => e.id);
      const res = await fetch('/api/events/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        flashNotice('Events queue order saved & updated live');
      } else {
        console.error('Failed to save events order');
      }
    } catch (err) {
      console.error('Reorder error:', err);
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...events];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setEvents(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
    persistOrder(updated);
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const updated = [...events];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setEvents(updated);
    persistOrder(updated);
  };

  const openAdd = () => {
    setForm(empty);
    setAdding(true);
    setEditing(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };
  const openEdit = (ev: AdminEvent) => {
    setForm(ev);
    setEditing(ev);
    setAdding(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };
  const close = () => { setAdding(false); setEditing(null); };

  const save = async () => {
    if (!form.name.trim() || !form.date.trim()) return;
    setSaving(true);
    try {
      const payload = editing ? { ...form, id: editing.id } : form;
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedEvent: AdminEvent = await res.json();
        if (editing) {
          setEvents((prev) => prev.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
          flashNotice('Event updated successfully');
        } else {
          setEvents((prev) => [savedEvent, ...prev.filter((e) => e.id !== savedEvent.id)]);
          flashNotice('Event created successfully (showing at top)');
        }
        close();
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        flashNotice('Event deleted');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const broadcastEvent = async (ev: AdminEvent) => {
    if (!confirm(`Broadcast email notification for "${ev.name}" to all newsletter subscribers via Brevo SMTP?`)) {
      return;
    }
    setBroadcastingId(ev.id);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: ev }),
      });
      const data = await res.json();
      if (res.ok) {
        flashNotice(`Dispatched notification to ${data.sentCount} subscriber(s)! (Check Spam/Junk folder if not in Inbox)`);
      } else {
        alert(data.error || 'Failed to broadcast notification.');
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      alert('Error broadcasting email. Check SMTP settings.');
    } finally {
      setBroadcastingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Events</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {reordering && (
            <span className="flex items-center gap-1.5 text-xs text-vermilion font-mono animate-pulse">
              <Loader2Icon size={13} className="animate-spin" /> Saving order...
            </span>
          )}
          {notice && !reordering && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
              <CheckCircle2Icon size={14} />
              {notice}
            </span>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors"
          >
            <PlusIcon size={12} /> Add Event
          </button>
        </div>
      </div>

      {/* Helpful queue reorder explanation card */}
      <div className="flex items-center justify-between gap-3 mb-6 p-3 bg-paper-dim border border-paper-muted rounded-sm text-xs text-ink-muted">
        <div className="flex items-center gap-2.5">
          <GripVerticalIcon size={16} className="text-ink-light shrink-0" />
          <span>
            <strong className="text-ink font-semibold">Queue Order:</strong> Drag &amp; drop cards or use the <span className="font-mono bg-paper px-1 py-0.5 rounded border border-paper-muted">↑</span> <span className="font-mono bg-paper px-1 py-0.5 rounded border border-paper-muted">↓</span> arrows to reorder which events display first on the homepage and events page (like Spotify queue).
          </span>
        </div>
      </div>

      {(adding || editing) && (
        <div ref={formRef} className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim">
          <h3 className="font-semibold text-sm text-ink mb-4 flex items-center justify-between">
            <span>{adding ? 'New Event' : `Editing Event: ${editing?.name}`}</span>
            {editing && (
              <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm ${isEventConcluded(form) ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {isEventConcluded(form) ? 'Concluded / Outdated' : 'Upcoming / Scheduled'}
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Event Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <AdminInput label="Venue / Location" value={form.location ?? ''} onChange={(v) => setForm((f) => ({ ...f, location: v }))} placeholder="e.g. VSBCETC Coimbatore" />
            <AdminInput label="Date *" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} placeholder="e.g. March 15, 2026 or Dates Announcing Soon" />
            <AdminInput label="Time" value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} placeholder="e.g. 9:00 AM – 5:00 PM or TBA" />
            <div className="sm:col-span-2">
              <AdminInput label="Registration URL (optional)" value={form.registrationUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, registrationUrl: v }))} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <AdminInput label="Short Summary (shown in event list)" value={form.shortDescription} onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
                Full Description (shown inside modal popup)
              </label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Full event details, problem statements, prototyping rules..."
                className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <ImageUploadField
              label="Main Event Header / Cover Photo (shown in modal)"
              value={form.imageUrl ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
            />
            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
                Archive Gallery Photos (Only shown for concluded/past events)
              </label>
              <input
                type="text"
                value={(form.gallery || []).join(', ')}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    gallery: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="https://images.unsplash.com/..., https://..."
                className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink font-mono"
              />
              <span className="text-[11px] text-ink-light mt-1 block">
                Photos from the actual event. These are only displayed once the event concludes. New / upcoming events only show the Header / Cover photo above.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:col-span-2 pt-2 border-t border-paper-muted">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={form.isFree}
                  onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))}
                  className="accent-vermilion w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isFree" className="text-sm text-ink cursor-pointer select-none">Free event</label>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="isConcludedManual"
                  checked={isEventConcluded(form)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setForm((f) => {
                      let newDate = f.date;
                      if (isChecked && !newDate.toLowerCase().includes('completed') && !newDate.toLowerCase().includes('concluded')) {
                        newDate = newDate ? `${newDate} · Concluded` : 'Completed · Archived';
                      } else if (!isChecked) {
                        newDate = newDate.replace(/\s*·\s*(?:Concluded|Completed|Archived)/gi, '').replace(/\b(?:Completed|Archived|Concluded)\b/gi, '').trim();
                        if (!newDate) newDate = 'Dates Announcing Soon';
                      }
                      return { ...f, date: newDate };
                    });
                  }}
                  className="accent-amber-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isConcludedManual" className="text-sm text-ink cursor-pointer select-none">
                  Mark as Concluded / Completed (or auto-concludes when scheduled date/time finishes)
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-5 py-2 rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2Icon size={12} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={close} className="text-xs text-ink-muted hover:text-ink px-4 py-2 border border-paper-muted rounded-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs for Events */}
      {!loading && events.length > 0 && (
        <div className="flex items-center gap-2 mb-4 border-b border-paper-muted pb-3">
          <button
            onClick={() => setEventFilter('all')}
            className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors ${
              eventFilter === 'all'
                ? 'bg-ink text-paper-DEFAULT font-semibold'
                : 'text-ink-muted hover:text-ink bg-paper-dim border border-paper-muted'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setEventFilter('upcoming')}
            className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors ${
              eventFilter === 'upcoming'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-ink-muted hover:text-ink bg-paper-dim border border-paper-muted'
            }`}
          >
            Upcoming ({events.filter((e) => !isEventConcluded(e)).length})
          </button>
          <button
            onClick={() => setEventFilter('concluded')}
            className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors ${
              eventFilter === 'concluded'
                ? 'bg-amber-700 text-white font-semibold'
                : 'text-ink-muted hover:text-ink bg-paper-dim border border-paper-muted'
            }`}
          >
            Concluded / Outdated ({events.filter((e) => isEventConcluded(e)).length})
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex items-center justify-center text-xs text-ink-light gap-2">
          <Loader2Icon size={16} className="animate-spin" /> Loading events...
        </div>
      ) : events.length === 0 ? (
        <p className="py-12 text-sm text-ink-light">No events found. Click "Add Event" to create one.</p>
      ) : events.filter((e) => {
          if (eventFilter === 'upcoming') return !isEventConcluded(e);
          if (eventFilter === 'concluded') return isEventConcluded(e);
          return true;
        }).length === 0 ? (
        <p className="py-12 text-sm text-ink-light">No events found under "{eventFilter}" category.</p>
      ) : (
        <div className="divide-y divide-paper-muted border border-paper-muted rounded-sm overflow-hidden bg-paper">
          {events
            .filter((e) => {
              if (eventFilter === 'upcoming') return !isEventConcluded(e);
              if (eventFilter === 'concluded') return isEventConcluded(e);
              return true;
            })
            .map((ev) => {
              const concluded = isEventConcluded(ev);
              const realIndex = events.findIndex((e) => e.id === ev.id);
              const isDragging = draggedIdx === realIndex;
              const isOver = dragOverIdx === realIndex && draggedIdx !== realIndex;

              return (
                <div
                  key={ev.id}
                  draggable={!adding && !editing && eventFilter === 'all'}
                  onDragStart={(e) => handleDragStart(e, realIndex)}
                  onDragOver={(e) => handleDragOver(e, realIndex)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, realIndex)}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-3.5 transition-all duration-150 select-none ${
                    isDragging
                      ? 'opacity-30 bg-paper-muted border-dashed border-2 border-vermilion scale-[0.99]'
                      : isOver
                      ? 'bg-vermilion/10 border-t-2 border-vermilion'
                      : 'hover:bg-paper-dim/80 bg-paper'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Left Controls: Queue Number, Drag Handle, Arrow Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[11px] font-bold text-ink-light/80 w-5 text-center">
                        {realIndex + 1}
                      </span>

                      <div
                        title={eventFilter === 'all' ? 'Drag to reorder' : 'Switch to All Events to reorder'}
                        className={`p-1 rounded transition-colors ${
                          eventFilter === 'all'
                            ? 'cursor-grab active:cursor-grabbing text-ink-light hover:text-ink hover:bg-paper-muted'
                            : 'opacity-30 cursor-not-allowed text-ink-light'
                        }`}
                      >
                        <GripVerticalIcon size={16} />
                      </div>

                      <div className="flex flex-col -space-y-0.5 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={realIndex === 0 || eventFilter !== 'all'}
                          onClick={() => moveEvent(realIndex, 'up')}
                          title="Move up in queue"
                          className="p-0.5 text-ink-light hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronUpIcon size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={realIndex === events.length - 1 || eventFilter !== 'all'}
                          onClick={() => moveEvent(realIndex, 'down')}
                          title="Move down in queue"
                          className="p-0.5 text-ink-light hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ChevronDownIcon size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Event Thumbnail */}
                    <div className="w-12 h-12 rounded-sm bg-paper-muted flex items-center justify-center shrink-0 overflow-hidden border border-paper-muted">
                      {ev.imageUrl ? (
                        <img src={ev.imageUrl} alt={ev.name} className="w-full h-full object-cover" />
                      ) : (
                        <CalendarIcon size={18} className="text-ink-light" />
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${ev.isFree ? 'bg-paper-muted text-ink-muted' : 'bg-vermilion/10 text-vermilion'}`}>
                          {ev.isFree ? 'Free' : 'Paid'}
                        </span>
                        <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${concluded ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {concluded ? 'Concluded / Past' : 'Upcoming / Scheduled'}
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-ink truncate">{ev.name}</p>
                      <p className="text-xs text-ink-muted mt-0.5 truncate">{ev.shortDescription}</p>
                      <p className="text-xs text-ink-light mt-1 font-mono">{ev.date} · {ev.time}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => broadcastEvent(ev)}
                      disabled={broadcastingId === ev.id}
                      title="Notify subscribers via Brevo email"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-ink border border-paper-muted hover:border-vermilion hover:text-vermilion transition-colors rounded-sm"
                    >
                      {broadcastingId === ev.id ? (
                        <Loader2Icon size={12} className="animate-spin text-vermilion" />
                      ) : (
                        <SendIcon size={12} />
                      )}
                      <span>{broadcastingId === ev.id ? 'Sending...' : 'Notify Email'}</span>
                    </button>
                    <button onClick={() => openEdit(ev)} aria-label="Edit" className="p-2 text-ink-muted hover:text-ink transition-colors rounded-sm hover:bg-paper-muted">
                      <PencilIcon size={14} />
                    </button>
                    <button onClick={() => remove(ev.id)} aria-label="Delete" className="p-2 text-ink-muted hover:text-vermilion transition-colors rounded-sm hover:bg-vermilion/10">
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ─── Team Manager ─────────────────────────────────────────
function TeamManager() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<AdminMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const empty: Omit<AdminMember, 'id'> = { name: '', role: '', avatarUrl: '', portfolioUrl: '' };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const flashNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const openAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const openEdit = (m: AdminMember) => { setForm(m); setEditing(m); setAdding(false); };
  const close = () => { setAdding(false); setEditing(null); };

  const persistOrder = async (orderedList: AdminMember[]) => {
    setReordering(true);
    try {
      const orderedIds = orderedList.map((m) => m.id);
      const res = await fetch('/api/members/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        flashNotice('Queue order saved & updated live');
      } else {
        console.error('Failed to save order');
      }
    } catch (err) {
      console.error('Reorder error:', err);
    } finally {
      setReordering(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...members];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setMembers(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
    persistOrder(updated);
  };

  const moveMember = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= members.length) return;

    const updated = [...members];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setMembers(updated);
    persistOrder(updated);
  };

  const save = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    setSaving(true);
    try {
      const payload = editing ? { ...form, id: editing.id } : form;
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedMember: AdminMember = await res.json();
        if (editing) {
          setMembers((prev) => prev.map((m) => (m.id === savedMember.id ? savedMember : m)));
          flashNotice('Member updated successfully');
        } else {
          setMembers((prev) => [...prev.filter((m) => m.id !== savedMember.id), savedMember]);
          flashNotice('Member added to the end of the team list');
        }
        close();
      }
    } catch (err) {
      console.error('Failed to save member:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        flashNotice('Member deleted');
      }
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Team</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${members.length} member${members.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {reordering && (
            <span className="flex items-center gap-1.5 text-xs text-vermilion font-mono animate-pulse">
              <Loader2Icon size={13} className="animate-spin" /> Saving order...
            </span>
          )}
          {notice && !reordering && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
              <CheckCircle2Icon size={14} />
              {notice}
            </span>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors"
          >
            <PlusIcon size={12} /> Add Member
          </button>
        </div>
      </div>

      {/* Helpful queue reorder explanation card */}
      <div className="flex items-center justify-between gap-3 mb-6 p-3 bg-paper-dim border border-paper-muted rounded-sm text-xs text-ink-muted">
        <div className="flex items-center gap-2.5">
          <GripVerticalIcon size={16} className="text-ink-light shrink-0" />
          <span>
            <strong className="text-ink font-semibold">Queue Order:</strong> Drag &amp; drop items or use the <span className="font-mono bg-paper px-1 py-0.5 rounded border border-paper-muted">↑</span> <span className="font-mono bg-paper px-1 py-0.5 rounded border border-paper-muted">↓</span> arrows to reorder members (like Spotify queue). Order updates live across the site.
          </span>
        </div>
      </div>

      {(adding || editing) && (
        <div className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim">
          <h3 className="font-semibold text-sm text-ink mb-4">
            {adding ? 'New Member' : 'Edit Member'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Full Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <AdminInput label="Role / Title *" value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} />
            <ImageUploadField
              value={form.avatarUrl ?? ''}
              onChange={(v) => setForm((f) => ({ ...f, avatarUrl: v }))}
            />
            <div className="sm:col-span-2">
              <AdminInput label="Portfolio / LinkedIn URL (optional)" value={form.portfolioUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, portfolioUrl: v }))} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-5 py-2 rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2Icon size={12} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={close} className="text-xs text-ink-muted hover:text-ink px-4 py-2 border border-paper-muted rounded-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex items-center justify-center text-xs text-ink-light gap-2">
          <Loader2Icon size={16} className="animate-spin" /> Loading team members...
        </div>
      ) : members.length === 0 ? (
        <p className="py-12 text-sm text-ink-light">No members found. Click "Add Member" to add one.</p>
      ) : (
        <div className="divide-y divide-paper-muted border border-paper-muted rounded-sm overflow-hidden bg-paper">
          {members.map((m, index) => {
            const isDragging = draggedIdx === index;
            const isOver = dragOverIdx === index && draggedIdx !== index;

            return (
              <div
                key={m.id}
                draggable={!adding && !editing}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                className={`group flex items-center justify-between gap-3 py-3 px-3.5 transition-all duration-150 select-none ${
                  isDragging
                    ? 'opacity-30 bg-paper-muted border-dashed border-2 border-vermilion scale-[0.99]'
                    : isOver
                    ? 'bg-vermilion/10 border-t-2 border-vermilion'
                    : 'hover:bg-paper-dim/80 bg-paper'
                }`}
              >
                {/* Left Controls: Queue Number, Drag Handle, Arrow Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] font-bold text-ink-light/80 w-5 text-center">
                    {index + 1}
                  </span>

                  <div
                    title="Drag to reorder"
                    className="p-1 rounded cursor-grab active:cursor-grabbing text-ink-light hover:text-ink hover:bg-paper-muted transition-colors"
                  >
                    <GripVerticalIcon size={16} />
                  </div>

                  <div className="flex flex-col -space-y-0.5 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveMember(index, 'up')}
                      title="Move up"
                      className="p-0.5 text-ink-light hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronUpIcon size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={index === members.length - 1}
                      onClick={() => moveMember(index, 'down')}
                      title="Move down"
                      className="p-0.5 text-ink-light hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ChevronDownIcon size={12} />
                    </button>
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-sm bg-paper-muted flex items-center justify-center shrink-0 overflow-hidden border border-paper-muted">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <span className="font-headline text-xs font-bold text-ink-muted">{m.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate leading-tight">{m.name}</p>
                    <p className="text-xs text-ink-muted font-mono truncate mt-0.5">{m.role}</p>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(m)}
                    aria-label="Edit"
                    title="Edit member"
                    className="p-2 text-ink-muted hover:text-ink transition-colors rounded-sm hover:bg-paper-muted"
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    aria-label="Delete"
                    title="Delete member"
                    className="p-2 text-ink-muted hover:text-vermilion transition-colors rounded-sm hover:bg-vermilion/10"
                  >
                    <Trash2Icon size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Subscribers Manager ──────────────────────────────────
function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('E-Cell VSBCETC');
  const [savingSender, setSavingSender] = useState(false);
  const [testing, setTesting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/subscribe')
      .then((r) => r.json())
      .then((data) => {
        setSubscribers(data.subscribers || []);
      })
      .catch((err) => console.error('Failed to load subscribers:', err))
      .finally(() => setLoading(false));

    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.brevoSenderEmail) setSenderEmail(data.brevoSenderEmail);
        if (data.brevoSenderName) setSenderName(data.brevoSenderName);
      })
      .catch((err) => console.error('Failed to load settings:', err));
  }, []);

  const saveSenderConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSender(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brevoSenderEmail: senderEmail.trim(),
          brevoSenderName: senderName.trim(),
        }),
      });
      if (res.ok) {
        setNotice('Sender email saved successfully!');
        setTimeout(() => setNotice(''), 4000);
      } else {
        alert('Failed to save sender settings.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving sender.');
    } finally {
      setSavingSender(false);
    }
  };

  const sendTestBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) return;

    setTesting(true);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testRecipient: testEmail.trim(),
          senderEmail: senderEmail.trim() || undefined,
          senderName: senderName.trim() || undefined,
          event: {
            id: 'test-event',
            name: "Project Expo '26 (Sample Notification)",
            shortDescription: 'Inter-Collegiate Prototype and Hardware Innovation Summit at VSBCETC Coimbatore.',
            date: 'March 15, 2026',
            time: '9:00 AM – 5:00 PM',
            isFree: false,
            registrationUrl: 'https://ecell-vsbcetc.vercel.app/events',
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice(`Test sent to ${testEmail}! (Check Inbox & Spam)`);
        if (data.warning) {
          alert(data.warning);
        }
        setTimeout(() => setNotice(''), 6000);
      } else {
        alert(data.error || 'Failed to send sample broadcast.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while testing broadcast.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Subscribers & Email Relay</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${subscribers.length} registered subscriber${subscribers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {notice && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
            <CheckCircle2Icon size={14} />
            {notice}
          </span>
        )}
      </div>

      {/* Google SMTP Configuration & Relay Status */}
      <div className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-ink">Google SMTP Configuration</h3>
            <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
              Gmail Active & Verified
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
            Connected to <code className="font-mono text-ink">smtp.gmail.com:587</code> via <code className="font-mono text-ink">ecell.vsbcetc@gmail.com</code> with Google App Passwords and sequential delay for rate-limit protection.
          </p>
        </div>

        <form onSubmit={saveSenderConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
              Sender Email Address *
            </label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="ecell.vsbcetc@gmail.com"
              className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink font-mono"
              required
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
              Sender Display Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="E-Cell VSBCETC"
              className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={savingSender}
              className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {savingSender ? <Loader2Icon size={12} className="animate-spin" /> : null}
              {savingSender ? 'Saving...' : 'Save Sender Email'}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-paper-muted">
          <h3 className="font-semibold text-sm text-ink mb-1">Send Test Email</h3>
          <p className="text-xs text-ink-muted mb-3">
            Send a sample event notification directly to your personal email to verify real-time inbox receipt.
          </p>
          <form onSubmit={sendTestBroadcast} className="flex gap-2.5 max-w-md">
            <input
              type="email"
              placeholder="Your email address (e.g. user@gmail.com)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1 border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink"
              required
            />
            <button
              type="submit"
              disabled={testing}
              className="flex items-center gap-1.5 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50 shrink-0"
            >
              {testing ? <Loader2Icon size={12} className="animate-spin" /> : <SendIcon size={12} />}
              {testing ? 'Sending...' : 'Send Test to Inbox'}
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center text-xs text-ink-light gap-2">
          <Loader2Icon size={16} className="animate-spin" /> Loading subscriber list...
        </div>
      ) : subscribers.length === 0 ? (
        <p className="py-8 text-sm text-ink-light">No subscribers yet. Users can subscribe on the homepage or events page.</p>
      ) : (
        <div className="divide-y divide-paper-muted">
          {subscribers.map((email, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <span className="font-mono text-xs text-ink">{email}</span>
              <span className="text-[10px] uppercase font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Site Settings ────────────────────────────────────────
function SiteSettings() {
  const [bgEnabled, setBgEnabled] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.02);
  const [mottoQuote, setMottoQuote] = useState('');
  const [mottoAuthor, setMottoAuthor] = useState('');
  const [mottoRole, setMottoRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMotto, setSavingMotto] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.heroDynamicBackground === 'boolean') {
          setBgEnabled(data.heroDynamicBackground);
        }
        if (typeof data.heroWatermarkEnabled === 'boolean') {
          setWatermarkEnabled(data.heroWatermarkEnabled);
        }
        if (typeof data.heroWatermarkOpacity === 'number') {
          setWatermarkOpacity(data.heroWatermarkOpacity);
        }
        if (data.mottoQuote) setMottoQuote(data.mottoQuote);
        if (data.mottoAuthor) setMottoAuthor(data.mottoAuthor);
        if (data.mottoRole) setMottoRole(data.mottoRole);
      })
      .catch((err) => console.error('Error fetching settings:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleBg = async () => {
    const nextVal = !bgEnabled;
    setBgEnabled(nextVal);
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroDynamicBackground: nextVal }),
      });
      if (res.ok) {
        setNotice('Setting saved');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleWatermark = async () => {
    const nextVal = !watermarkEnabled;
    setWatermarkEnabled(nextVal);
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroWatermarkEnabled: nextVal }),
      });
      if (res.ok) {
        setNotice('Hero watermark saved');
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update watermark:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateOpacity = async (val: number) => {
    setWatermarkOpacity(val);
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroWatermarkOpacity: val }),
      });
      if (res.ok) {
        setNotice(`Watermark opacity set to ${(val * 100).toFixed(1)}%`);
        setTimeout(() => setNotice(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update opacity:', err);
    } finally {
      setSaving(false);
    }
  };

  const saveMotto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMotto(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mottoQuote: mottoQuote.trim(),
          mottoAuthor: mottoAuthor.trim(),
          mottoRole: mottoRole.trim(),
        }),
      });
      if (res.ok) {
        setNotice('Motto & quote updated successfully!');
        setTimeout(() => setNotice(''), 3500);
      } else {
        alert('Failed to save motto.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating motto.');
    } finally {
      setSavingMotto(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Site Settings & Motto</h2>
          <p className="text-xs text-ink-muted mt-1">Configure global display options and homepage motto</p>
        </div>
        {notice && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
            <CheckCircle2Icon size={14} />
            {notice}
          </span>
        )}
      </div>

      {/* Motto / Institutional Creed Editor */}
      <div className="border border-paper-muted rounded-sm p-6 bg-paper-dim space-y-4">
        <div>
          <h3 className="font-semibold text-sm text-ink">Homepage Motto & Quote Section</h3>
          <p className="text-xs text-ink-muted mt-1">
            Displayed on the black statement banner directly under the Events section.
          </p>
        </div>

        <form onSubmit={saveMotto} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
              Quote / Message Text *
            </label>
            <textarea
              value={mottoQuote}
              onChange={(e) => setMottoQuote(e.target.value)}
              rows={3}
              placeholder="Ideas today, impact tomorrow..."
              className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
                Author / Attribution
              </label>
              <input
                type="text"
                value={mottoAuthor}
                onChange={(e) => setMottoAuthor(e.target.value)}
                placeholder="E-Cell Council & Prototyping Sandbox"
                className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
                Role / Department Subtitle
              </label>
              <input
                type="text"
                value={mottoRole}
                onChange={(e) => setMottoRole(e.target.value)}
                placeholder="VSB College of Engineering & Technical Campus · Coimbatore"
                className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingMotto}
              className="flex items-center gap-2 bg-ink text-paper-DEFAULT text-xs font-semibold px-4 py-2 rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {savingMotto ? <Loader2Icon size={12} className="animate-spin" /> : null}
              {savingMotto ? 'Saving...' : 'Save Motto & Quote'}
            </button>
          </div>
        </form>
      </div>

      {/* General Settings */}
      <div className="divide-y divide-paper-muted border-t border-paper-muted pt-6">
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-ink">Hero Background Animation</p>
            <p className="text-xs text-ink-muted mt-0.5">Toggle dynamic visual canvas aura on the homepage hero</p>
          </div>
          <button
            onClick={toggleBg}
            disabled={loading || saving}
            role="switch"
            aria-checked={bgEnabled}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              bgEnabled ? 'bg-ink' : 'bg-paper-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-paper-DEFAULT shadow transition-transform duration-200 ${
                bgEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Hero Watermark Toggle */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-medium text-ink">Hero Background Watermark Photo</p>
            <p className="text-xs text-ink-muted mt-0.5">Enable or disable the faint student team photo watermark behind hero text</p>
          </div>
          <button
            onClick={toggleWatermark}
            disabled={loading || saving}
            role="switch"
            aria-checked={watermarkEnabled}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermilion ${
              watermarkEnabled ? 'bg-ink' : 'bg-paper-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-paper-DEFAULT shadow transition-transform duration-200 ${
                watermarkEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Watermark Opacity Slider */}
        {watermarkEnabled && (
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Watermark Background Opacity</p>
                <p className="text-xs text-ink-muted mt-0.5">Control how visible the background photo is (recommended: 6% - 12%)</p>
              </div>
              <span className="font-mono text-xs font-semibold text-ink bg-paper-muted/50 px-2.5 py-1 rounded-sm">
                {(watermarkOpacity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-ink-light">1%</span>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={watermarkOpacity}
                onChange={(e) => updateOpacity(parseFloat(e.target.value))}
                className="w-full accent-ink cursor-pointer"
              />
              <span className="text-[11px] font-mono text-ink-light">25%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Input ─────────────────────────────────────────
function AdminInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-paper-muted bg-paper rounded-sm px-3 py-2 text-sm text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors duration-150"
      />
    </div>
  );
}

// ─── Image Upload Field ───────────────────────────────────
function ImageUploadField({
  value,
  onChange,
  label = 'Member Photo / Avatar',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // First attempt: Server file upload via /api/upload
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
          setUploading(false);
          return;
        }
      }

      // Fallback: Client-side compressed Web-optimized Base64 Data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 500;
          let w = img.width;
          let h = img.height;
          if (w > h && w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            onChange(dataUrl);
          }
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploading(false);
    }
  };

  return (
    <div className="sm:col-span-2">
      <label className="block font-mono text-[10px] tracking-widest uppercase text-ink-light mb-1.5">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 bg-paper rounded-sm border border-paper-muted">
        {/* Preview Thumbnail */}
        <div className="w-14 h-14 rounded-sm bg-paper-muted border border-paper-muted flex items-center justify-center shrink-0 overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover grayscale" />
          ) : (
            <UsersIcon size={22} className="text-ink-light" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 bg-ink text-paper-DEFAULT text-xs font-semibold rounded-sm hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2Icon size={12} className="animate-spin" /> : <UploadIcon size={12} />}
              {uploading ? 'Processing Image...' : 'Upload Photo File'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-ink-muted hover:text-vermilion transition-colors px-2 py-1"
              >
                Clear Photo
              </button>
            )}
            <span className="text-[11px] text-ink-light">JPG, PNG, or WebP</span>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an image URL (https://...)"
            className="w-full border border-paper-muted bg-paper-dim rounded-sm px-3 py-1.5 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors font-mono"
          />
        </div>
      </div>
    </div>
  );
}

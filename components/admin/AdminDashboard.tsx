'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────
interface AdminEvent {
  id: string;
  name: string;
  shortDescription: string;
  isFree: boolean;
  date: string;
  time: string;
  registrationUrl?: string;
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
    isFree: true,
    date: '',
    time: '',
    registrationUrl: '',
  };
  const [form, setForm] = useState(empty);

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

  const flashNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  const openAdd = () => { setForm(empty); setAdding(true); setEditing(null); };
  const openEdit = (ev: AdminEvent) => { setForm(ev); setEditing(ev); setAdding(false); };
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
          setEvents((prev) => [...prev, savedEvent]);
          flashNotice('Event created successfully');
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
        flashNotice(`Success: ${data.message || 'Notification broadcast sent.'}`);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Events</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {notice && (
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

      {(adding || editing) && (
        <div className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim">
          <h3 className="font-semibold text-sm text-ink mb-4">
            {adding ? 'New Event' : 'Edit Event'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Event Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <AdminInput label="Date *" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} placeholder="e.g. March 15, 2026 or Dates Announcing Soon" />
            <AdminInput label="Time" value={form.time} onChange={(v) => setForm((f) => ({ ...f, time: v }))} placeholder="e.g. 9:00 AM – 5:00 PM or TBA" />
            <AdminInput label="Registration URL (optional)" value={form.registrationUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, registrationUrl: v }))} />
            <div className="sm:col-span-2">
              <AdminInput label="Short Description" value={form.shortDescription} onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))} />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFree"
                checked={form.isFree}
                onChange={(e) => setForm((f) => ({ ...f, isFree: e.target.checked }))}
                className="accent-vermilion w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isFree" className="text-sm text-ink cursor-pointer select-none">Free event</label>
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
          <Loader2Icon size={16} className="animate-spin" /> Loading events...
        </div>
      ) : events.length === 0 ? (
        <p className="py-12 text-sm text-ink-light">No events found. Click "Add Event" to create one.</p>
      ) : (
        <div className="divide-y divide-paper-muted">
          {events.map((ev) => (
            <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm ${ev.isFree ? 'bg-paper-muted text-ink-muted' : 'bg-vermilion/10 text-vermilion'}`}>
                    {ev.isFree ? 'Free' : 'Paid'}
                  </span>
                </div>
                <p className="font-semibold text-sm text-ink">{ev.name}</p>
                <p className="text-xs text-ink-muted mt-0.5">{ev.shortDescription}</p>
                <p className="text-xs text-ink-light mt-1 font-mono">{ev.date} · {ev.time}</p>
              </div>
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
          ))}
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
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState<AdminMember | null>(null);
  const [adding, setAdding] = useState(false);
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
          setMembers((prev) => [...prev, savedMember]);
          flashNotice('Member created successfully');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline text-xl font-bold text-ink">Team</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${members.length} member${members.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {notice && (
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

      {(adding || editing) && (
        <div className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim">
          <h3 className="font-semibold text-sm text-ink mb-4">
            {adding ? 'New Member' : 'Edit Member'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Full Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <AdminInput label="Role / Title *" value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} />
            <AdminInput label="Avatar Image URL (optional)" value={form.avatarUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, avatarUrl: v }))} placeholder="https://..." />
            <AdminInput label="Portfolio / LinkedIn URL (optional)" value={form.portfolioUrl ?? ''} onChange={(v) => setForm((f) => ({ ...f, portfolioUrl: v }))} placeholder="https://..." />
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
        <div className="divide-y divide-paper-muted">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-sm bg-paper-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover grayscale" />
                  ) : (
                    <span className="font-headline text-xs font-bold text-ink-muted">{m.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{m.name}</p>
                  <p className="text-xs text-ink-muted font-mono truncate">{m.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(m)} aria-label="Edit" className="p-2 text-ink-muted hover:text-ink transition-colors rounded-sm hover:bg-paper-muted">
                  <PencilIcon size={14} />
                </button>
                <button onClick={() => remove(m.id)} aria-label="Delete" className="p-2 text-ink-muted hover:text-vermilion transition-colors rounded-sm hover:bg-vermilion/10">
                  <Trash2Icon size={14} />
                </button>
              </div>
            </div>
          ))}
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
  }, []);

  const sendTestBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) return;

    setTesting(true);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        setNotice('Sample email broadcast sent successfully via Brevo SMTP!');
        setTimeout(() => setNotice(''), 4000);
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
          <h2 className="font-headline text-xl font-bold text-ink">Subscribers</h2>
          <p className="text-xs text-ink-muted mt-1">
            {loading ? 'Loading...' : `${subscribers.length} registered email${subscribers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {notice && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
            <CheckCircle2Icon size={14} />
            {notice}
          </span>
        )}
      </div>

      <div className="mb-8 border border-paper-muted rounded-sm p-6 bg-paper-dim">
        <h3 className="font-semibold text-sm text-ink mb-1.5">Brevo SMTP Status</h3>
        <p className="text-xs text-ink-muted mb-4">
          Connected to <code className="font-mono text-ink">smtp-relay.brevo.com:587</code> via account <code className="font-mono text-ink">b58da7001@smtp-brevo.com</code>.
        </p>
        <form onSubmit={sendTestBroadcast} className="flex gap-2.5 max-w-md">
          <input
            type="email"
            placeholder="Recipient email address for sample"
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
            {testing ? 'Sending...' : 'Send Test Notice'}
          </button>
        </form>
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.heroDynamicBackground === 'boolean') {
          setBgEnabled(data.heroDynamicBackground);
        }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-xl font-bold text-ink">Site Settings</h2>
        {notice && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono">
            <CheckCircle2Icon size={14} />
            {notice}
          </span>
        )}
      </div>
      <div className="divide-y divide-paper-muted">
        <div className="flex items-center justify-between py-5">
          <div>
            <p className="text-sm font-medium text-ink">Animated Background</p>
            <p className="text-xs text-ink-muted mt-0.5">Toggle the visual canvas animation on the homepage hero</p>
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

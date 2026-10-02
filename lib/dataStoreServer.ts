import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { members as seedMembers } from '@/data/seed';

export interface StoredEvent {
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

export interface StoredMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  portfolioUrl?: string;
}

// ─── Default Seeds ─────────────────────────────────────────────────────────────
const defaultEvents: StoredEvent[] = [
  {
    id: 'expo-26',
    name: "Project Expo '26",
    shortDescription: "Flagship Inter-Collegiate Engineering Prototype & Innovation Summit",
    description: "Flagship hardware prototype competition hosted at VSBCETC Coimbatore. Teams present functional engineering prototypes before angel syndicates and patent mentors.",
    isFree: false,
    date: "Dates Announcing Soon",
    time: "9:00 AM – 5:00 PM",
    location: "Central Auditorium & Innovation Labs, VSBCETC Coimbatore",
    registrationUrl: "https://forms.gle/vsbcetc-expo-26-registration",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
  },
  {
    id: 'evt-hackathon',
    name: "Hardware & IoT Hackathon",
    shortDescription: "48-Hour Rapid Embedded Prototyping Sprint where student teams build working IoT devices and sensor rigs.",
    description: "Intense 48-hour hardware design sprint where student teams build working IoT devices, sensors, and microcontroller rigs.",
    isFree: true,
    date: "Completed · Archived",
    time: "48 Hours",
    location: "IoT & Mechatronics Foundry Labs, VSBCETC Coimbatore",
    registrationUrl: "",
    imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

const defaultMembers: StoredMember[] = seedMembers.map((m) => ({
  id: m.id,
  name: m.name,
  role: m.role,
  avatarUrl: m.image,
  portfolioUrl: m.socials?.linkedin || m.portfolio || '',
}));

// ─── Local JSON Store Paths ───────────────────────────────────────────────────
const eventsFilePath = path.join(process.cwd(), 'data', 'events-store.json');
const membersFilePath = path.join(process.cwd(), 'data', 'members-store.json');
const subscribersFilePath = path.join(process.cwd(), 'data', 'subscribers-store.json');

// ─── Supabase Client (Optional Cloud Sync) ────────────────────────────────────
let supabase: SupabaseClient | null = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
    supabase = null;
  }
}

// ─── File System Helpers ───────────────────────────────────────────────────────
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// ─── Events Store ─────────────────────────────────────────────────────────────
export async function getStoredEvents(): Promise<StoredEvent[]> {
  const localEvents: StoredEvent[] = fs.existsSync(eventsFilePath)
    ? readJsonFile<StoredEvent[]>(eventsFilePath, defaultEvents)
    : defaultEvents;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const supaEvents: StoredEvent[] = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          shortDescription: d.short_description || d.shortDescription || '',
          description: d.description || '',
          isFree: d.is_free ?? d.isFree ?? true,
          date: d.date,
          time: d.time,
          location: d.location || '',
          registrationUrl: d.registration_url || d.registrationUrl || '',
          imageUrl: d.image_url || d.imageUrl || '',
          gallery: Array.isArray(d.gallery) ? d.gallery : [],
        }));

        // Check if there are default or file events missing in Supabase (e.g. past/outdated events)
        const supaIds = new Set(supaEvents.map((e) => e.id));
        const missing = localEvents.filter((e) => !supaIds.has(e.id));
        if (missing.length > 0) {
          // Auto-sync missing events into Supabase so they are permanently editable in admin
          for (const ev of missing) {
            try {
              await supabase.from('events').upsert({
                id: ev.id,
                name: ev.name,
                short_description: ev.shortDescription,
                description: ev.description || '',
                is_free: ev.isFree,
                date: ev.date,
                time: ev.time,
                location: ev.location || '',
                registration_url: ev.registrationUrl || '',
                image_url: ev.imageUrl || '',
                gallery: ev.gallery || [],
              });
            } catch (err) {
              console.warn('Error syncing missing event to Supabase:', err);
            }
          }
          return [...supaEvents, ...missing];
        }

        return supaEvents;
      }
    } catch (err) {
      console.warn('Supabase getStoredEvents error, using file store:', err);
    }
  }

  // File fallback
  if (!fs.existsSync(eventsFilePath)) {
    writeJsonFile(eventsFilePath, defaultEvents);
    return defaultEvents;
  }
  return localEvents;
}

export async function saveStoredEvent(event: StoredEvent): Promise<StoredEvent> {
  if (supabase) {
    try {
      await supabase.from('events').upsert({
        id: event.id,
        name: event.name,
        short_description: event.shortDescription,
        description: event.description || '',
        is_free: event.isFree,
        date: event.date,
        time: event.time,
        location: event.location || '',
        registration_url: event.registrationUrl || '',
        image_url: event.imageUrl || '',
        gallery: event.gallery || [],
      });
    } catch (err) {
      console.warn('Supabase saveStoredEvent error, saved to file:', err);
    }
  }

  // Always save to file store — newest events at the top!
  const current = await getStoredEvents();
  const index = current.findIndex((e) => e.id === event.id);
  let updated: StoredEvent[];
  if (index >= 0) {
    updated = current.map((e) => (e.id === event.id ? event : e));
  } else {
    updated = [event, ...current];
  }
  writeJsonFile(eventsFilePath, updated);
  return event;
}

export async function deleteStoredEvent(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteStoredEvent error:', err);
    }
  }

  const current = await getStoredEvents();
  const filtered = current.filter((e) => e.id !== id);
  writeJsonFile(eventsFilePath, filtered);
  return true;
}

// ─── Members Store ─────────────────────────────────────────────────────────────
export async function getStoredMembers(): Promise<StoredMember[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('members').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          avatarUrl: d.avatar_url || d.avatarUrl || '',
          portfolioUrl: d.portfolio_url || d.portfolioUrl || '',
        }));
      }
    } catch (err) {
      console.warn('Supabase getStoredMembers error, using file store:', err);
    }
  }

  // File fallback
  if (!fs.existsSync(membersFilePath)) {
    writeJsonFile(membersFilePath, defaultMembers);
    return defaultMembers;
  }
  return readJsonFile<StoredMember[]>(membersFilePath, defaultMembers);
}

export async function saveStoredMember(member: StoredMember): Promise<StoredMember> {
  if (supabase) {
    try {
      await supabase.from('members').upsert({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar_url: member.avatarUrl || '',
        portfolio_url: member.portfolioUrl || '',
      });
    } catch (err) {
      console.warn('Supabase saveStoredMember error, saved to file:', err);
    }
  }

  const current = await getStoredMembers();
  const index = current.findIndex((m) => m.id === member.id);
  let updated: StoredMember[];
  if (index >= 0) {
    updated = current.map((m) => (m.id === member.id ? member : m));
  } else {
    updated = [...current, member];
  }
  writeJsonFile(membersFilePath, updated);
  return member;
}

export async function deleteStoredMember(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('members').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteStoredMember error:', err);
    }
  }

  const current = await getStoredMembers();
  const filtered = current.filter((m) => m.id !== id);
  writeJsonFile(membersFilePath, filtered);
  return true;
}

// ─── Subscribers Store ─────────────────────────────────────────────────────────
export async function getSubscribers(): Promise<string[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('subscribers').select('email');
      if (!error && data && data.length > 0) {
        return data.map((d: any) => d.email);
      }
    } catch (err) {
      console.warn('Supabase getSubscribers error, using file store:', err);
    }
  }

  return readJsonFile<string[]>(subscribersFilePath, []);
}

export async function addSubscriber(email: string): Promise<{ success: boolean; isNew: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, isNew: false };
  }

  if (supabase) {
    try {
      await supabase.from('subscribers').upsert({ email: cleanEmail });
    } catch (err) {
      console.warn('Supabase addSubscriber error, saving to file:', err);
    }
  }

  const list = readJsonFile<string[]>(subscribersFilePath, []);
  const exists = list.includes(cleanEmail);
  if (!exists) {
    list.push(cleanEmail);
    writeJsonFile(subscribersFilePath, list);
    return { success: true, isNew: true };
  }
  return { success: true, isNew: false };
}

export async function removeSubscriber(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  if (supabase) {
    try {
      await supabase.from('subscribers').delete().eq('email', cleanEmail);
    } catch (err) {
      console.warn('Supabase removeSubscriber error:', err);
    }
  }

  const list = readJsonFile<string[]>(subscribersFilePath, []);
  const filtered = list.filter((e) => e !== cleanEmail);
  writeJsonFile(subscribersFilePath, filtered);
  return true;
}

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
  sortOrder?: number;
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
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        // If Supabase is completely empty (fresh setup), seed with defaultEvents once
        if (data.length === 0) {
          const seeds = fs.existsSync(eventsFilePath)
            ? readJsonFile<StoredEvent[]>(eventsFilePath, defaultEvents)
            : defaultEvents;
          for (const ev of seeds) {
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
              console.warn('Error seeding event to Supabase:', err);
            }
          }
          return seeds;
        }

        // Return current events directly from Supabase
        const eventsList: StoredEvent[] = data.map((d: any) => ({
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

        // Apply custom event queue order from site_settings if available
        try {
          const { data: orderData } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'events_order')
            .maybeSingle();

          if (orderData?.value?.order && Array.isArray(orderData.value.order)) {
            const orderMap = new Map(orderData.value.order.map((id: string, index: number) => [id, index]));
            return [...eventsList].sort((a, b) => {
              const orderA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 9999;
              const orderB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 9999;
              return orderA - orderB;
            });
          }
        } catch (orderErr) {
          console.warn('Could not read events_order from site_settings:', orderErr);
        }

        return eventsList;
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
  return readJsonFile<StoredEvent[]>(eventsFilePath, defaultEvents);
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

  // Save directly to file store without circular getStoredEvents call
  try {
    let current: StoredEvent[] = [];
    if (fs.existsSync(eventsFilePath)) {
      current = readJsonFile<StoredEvent[]>(eventsFilePath, []);
    }
    const index = current.findIndex((e) => e.id === event.id);
    let updated: StoredEvent[];
    if (index >= 0) {
      updated = current.map((e) => (e.id === event.id ? event : e));
    } else {
      updated = [event, ...current];
    }
    writeJsonFile(eventsFilePath, updated);
  } catch (err) {
    console.warn('File store save error:', err);
  }

  return event;
}

export async function deleteStoredEvent(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteStoredEvent error:', error);
      }
    } catch (err) {
      console.warn('Supabase deleteStoredEvent error:', err);
    }
  }

  // Delete directly from local file store without circular getStoredEvents call
  try {
    if (fs.existsSync(eventsFilePath)) {
      const current = readJsonFile<StoredEvent[]>(eventsFilePath, []);
      const filtered = current.filter((e) => e.id !== id);
      writeJsonFile(eventsFilePath, filtered);
    }
  } catch (err) {
    console.warn('File store delete error:', err);
  }

  return true;
}

export async function reorderStoredEvents(orderedIds: string[]): Promise<boolean> {
  if (supabase) {
    try {
      await supabase
        .from('site_settings')
        .upsert({
          key: 'events_order',
          value: { order: orderedIds },
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.warn('Supabase reorderStoredEvents error:', err);
    }
  }

  try {
    let current: StoredEvent[] = [];
    if (fs.existsSync(eventsFilePath)) {
      current = readJsonFile<StoredEvent[]>(eventsFilePath, defaultEvents);
    }
    const eventMap = new Map(current.map((e) => [e.id, e]));
    const reordered: StoredEvent[] = [];

    orderedIds.forEach((id) => {
      const e = eventMap.get(id);
      if (e) {
        reordered.push(e);
        eventMap.delete(id);
      }
    });

    // Append any events not explicitly in orderedIds
    eventMap.forEach((e) => {
      reordered.push(e);
    });

    writeJsonFile(eventsFilePath, reordered);
  } catch (err) {
    console.warn('File store reorderStoredEvents error:', err);
  }

  return true;
}

// ─── Members Store ─────────────────────────────────────────────────────────────
export async function getStoredMembers(): Promise<StoredMember[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          avatarUrl: d.avatar_url || d.avatarUrl || '',
          portfolioUrl: d.portfolio_url || d.portfolioUrl || '',
          sortOrder: d.sort_order ?? 0,
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
  const fileMembers = readJsonFile<StoredMember[]>(membersFilePath, defaultMembers);
  return [...fileMembers].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export async function saveStoredMember(member: StoredMember): Promise<StoredMember> {
  let nextSortOrder = member.sortOrder;

  if (supabase) {
    try {
      if (nextSortOrder === undefined || nextSortOrder === null) {
        // Check if member already has a sort_order
        const { data: existing } = await supabase
          .from('members')
          .select('sort_order')
          .eq('id', member.id)
          .maybeSingle();

        if (existing?.sort_order !== undefined && existing?.sort_order !== null) {
          nextSortOrder = existing.sort_order;
        } else {
          // New member: find max sort_order and append to the end (LAST)
          const { data: maxRows } = await supabase
            .from('members')
            .select('sort_order')
            .order('sort_order', { ascending: false })
            .limit(1);
          const maxOrder = maxRows && maxRows.length > 0 ? (maxRows[0].sort_order || 0) : 0;
          nextSortOrder = maxOrder + 1;
        }
      }

      await supabase.from('members').upsert({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar_url: member.avatarUrl || '',
        portfolio_url: member.portfolioUrl || '',
        sort_order: nextSortOrder,
      });
    } catch (err) {
      console.warn('Supabase saveStoredMember error, saved to file:', err);
    }
  }

  try {
    let current: StoredMember[] = [];
    if (fs.existsSync(membersFilePath)) {
      current = readJsonFile<StoredMember[]>(membersFilePath, defaultMembers);
    }
    const index = current.findIndex((m) => m.id === member.id);
    let updated: StoredMember[];
    if (index >= 0) {
      updated = current.map((m) =>
        m.id === member.id
          ? { ...member, sortOrder: nextSortOrder ?? m.sortOrder }
          : m
      );
    } else {
      const maxOrder = current.reduce((max, m) => Math.max(max, m.sortOrder || 0), 0);
      const assignedOrder = nextSortOrder ?? maxOrder + 1;
      // Add new member to the end of the array (LAST)
      updated = [...current, { ...member, sortOrder: assignedOrder }];
    }
    writeJsonFile(membersFilePath, updated);
  } catch (err) {
    console.warn('File store member save error:', err);
  }

  return { ...member, sortOrder: nextSortOrder };
}

export async function deleteStoredMember(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteStoredMember error:', error);
      }
    } catch (err) {
      console.warn('Supabase deleteStoredMember error:', err);
    }
  }

  try {
    if (fs.existsSync(membersFilePath)) {
      const current = readJsonFile<StoredMember[]>(membersFilePath, []);
      const filtered = current.filter((m) => m.id !== id);
      writeJsonFile(membersFilePath, filtered);
    }
  } catch (err) {
    console.warn('File store member delete error:', err);
  }

  return true;
}

export async function reorderStoredMembers(orderedIds: string[]): Promise<boolean> {
  if (supabase) {
    try {
      const updates = orderedIds.map((id, index) =>
        supabase!.from('members').update({ sort_order: index + 1 }).eq('id', id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.warn('Supabase reorderStoredMembers error:', err);
    }
  }

  try {
    let current: StoredMember[] = [];
    if (fs.existsSync(membersFilePath)) {
      current = readJsonFile<StoredMember[]>(membersFilePath, defaultMembers);
    }
    const memberMap = new Map(current.map((m) => [m.id, m]));
    const reordered: StoredMember[] = [];

    orderedIds.forEach((id, index) => {
      const m = memberMap.get(id);
      if (m) {
        reordered.push({ ...m, sortOrder: index + 1 });
        memberMap.delete(id);
      }
    });

    // Append any members not explicitly in orderedIds to prevent data loss
    memberMap.forEach((m) => {
      reordered.push({ ...m, sortOrder: reordered.length + 1 });
    });

    writeJsonFile(membersFilePath, reordered);
  } catch (err) {
    console.warn('File store reorderStoredMembers error:', err);
  }

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

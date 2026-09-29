import { Pool } from 'pg';
import { members as seedMembers, events as seedEvents, galleryItems as seedGallery } from '@/data/seed';

import fs from 'fs';
import path from 'path';

let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    const isRemote = process.env.DATABASE_URL.includes('render.com') || 
                     process.env.DATABASE_URL.includes('neon.tech') || 
                     process.env.DATABASE_URL.includes('supabase') ||
                     process.env.NODE_ENV === 'production';

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.warn('Database pool warning (non-fatal):', err.message);
    });

    // Auto-create tables if they don't exist
    pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        image TEXT,
        tag VARCHAR(100),
        registration_url TEXT,
        is_active BOOLEAN DEFAULT true,
        is_past BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `).then(() => {
      console.log('Render PostgreSQL: tables verified/created successfully.');
    }).catch((e) => {
      console.warn('Database table verification note:', e.message);
    });
  } catch (e) {
    console.warn('Could not initialize PostgreSQL pool:', e);
    pool = null;
  }
}

// Persistent JSON file fallback when database is not connected
const eventsFilePath = path.join(process.cwd(), 'data', 'events-store.json');

function loadPersistedEvents(): any[] {
  try {
    if (fs.existsSync(eventsFilePath)) {
      const data = fs.readFileSync(eventsFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch {}
  return seedEvents.map((e) => ({
    ...e,
    isPast: new Date(e.date).getTime() < Date.now(),
    isActive: new Date(e.date).getTime() >= Date.now(),
  }));
}

export function savePersistedEvents(events: any[]) {
  try {
    const dir = path.dirname(eventsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), 'utf-8');
  } catch {}
}

let inMemoryEvents: any[] = loadPersistedEvents();
let inMemoryMembers: any[] = [...seedMembers];

export async function query(text: string, params: unknown[] = []) {
  if (!pool) {
    throw new Error('Database not configured');
  }
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.debug(`Query executed: ${text.substring(0, 50)}... (${duration}ms)`);
  return result;
}

export async function getMemberById(id: string) {
  try {
    const result = await query('SELECT * FROM members WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch {
    return inMemoryMembers.find((m) => m.id === id) || null;
  }
}

export async function getAllMembers() {
  try {
    const result = await query('SELECT * FROM members ORDER BY role, year DESC');
    return result.rows;
  } catch {
    return inMemoryMembers;
  }
}

export async function getActiveEvents() {
  try {
    const result = await query(
      'SELECT * FROM events WHERE (date >= NOW() OR is_active = true) ORDER BY date ASC'
    );
    return result.rows.map((e: any) => ({
      ...e,
      isPast: new Date(e.date).getTime() < Date.now(),
      isActive: new Date(e.date).getTime() >= Date.now(),
    }));
  } catch {
    const now = Date.now();
    return inMemoryEvents
      .map((e) => ({
        ...e,
        isPast: new Date(e.date).getTime() < now,
        isActive: new Date(e.date).getTime() >= now,
      }))
      .filter((e) => !e.isPast);
  }
}

export async function getPastEvents() {
  try {
    const result = await query(
      'SELECT * FROM events WHERE date < NOW() ORDER BY date DESC LIMIT 20'
    );
    return result.rows.map((e: any) => ({
      ...e,
      isPast: true,
      isActive: false,
    }));
  } catch {
    const now = Date.now();
    return inMemoryEvents
      .map((e) => ({
        ...e,
        isPast: new Date(e.date).getTime() < now,
        isActive: new Date(e.date).getTime() >= now,
      }))
      .filter((e) => e.isPast);
  }
}

export async function getAllEvents() {
  try {
    const result = await query('SELECT * FROM events ORDER BY date DESC');
    return result.rows.map((e: any) => ({
      ...e,
      isPast: new Date(e.date).getTime() < Date.now(),
      isActive: new Date(e.date).getTime() >= Date.now(),
    }));
  } catch {
    const now = Date.now();
    return inMemoryEvents.map((e) => ({
      ...e,
      isPast: new Date(e.date).getTime() < now,
      isActive: new Date(e.date).getTime() >= now,
    }));
  }
}

export async function getEventById(id: string) {
  try {
    const result = await query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch {
    return inMemoryEvents.find((e) => e.id === id) || null;
  }
}

export async function getGalleryItems(eventId?: string) {
  try {
    if (eventId) {
      const result = await query('SELECT * FROM gallery_items WHERE event_id = $1', [eventId]);
      return result.rows;
    }
    const result = await query('SELECT * FROM gallery_items ORDER BY created_at DESC');
    return result.rows;
  } catch {
    if (eventId) {
      return (seedGallery as any[]).filter((g) => g.eventId === eventId);
    }
    return seedGallery;
  }
}

export async function getBrochures(eventId?: string) {
  try {
    if (eventId) {
      const result = await query('SELECT * FROM brochures WHERE event_id = $1', [eventId]);
      return result.rows;
    }
    const result = await query('SELECT * FROM brochures ORDER BY uploaded_at DESC');
    return result.rows;
  } catch {
    return [
      { id: 'b1', event_id: 'evt-expo-26', title: 'Project Expo 26 Prospectus', file_url: '/brochures/expo-26.pdf' },
    ];
  }
}

export async function insertEvent(event: Record<string, any>) {
  const isPast = new Date(event.date).getTime() < Date.now();
  const fullEvent = {
    id: event.id || 'evt-' + Date.now(),
    title: event.title,
    subtitle: event.subtitle || '',
    description: event.description,
    date: event.date,
    location: event.location,
    image: event.image || event.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    image_url: event.image || event.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    isActive: !isPast,
    isPast: isPast,
    tag: event.tag || (isPast ? 'PAST EVENT' : 'UPCOMING'),
    registrationUrl: event.registrationUrl || '/contact#pitch',
    gallery: event.gallery || [],
  };

  try {
    const result = await query(
      `INSERT INTO events (id, title, subtitle, description, date, location, image_url, is_active, tag)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        fullEvent.id,
        fullEvent.title,
        fullEvent.subtitle,
        fullEvent.description,
        fullEvent.date,
        fullEvent.location,
        fullEvent.image_url,
        fullEvent.isActive,
        fullEvent.tag,
      ]
    );
    inMemoryEvents = [fullEvent, ...inMemoryEvents];
    savePersistedEvents(inMemoryEvents);
    return result.rows[0];
  } catch {
    inMemoryEvents = [fullEvent, ...inMemoryEvents];
    savePersistedEvents(inMemoryEvents);
    return fullEvent;
  }
}

export async function updateEvent(id: string, updates: Record<string, any>) {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const result = await query(`UPDATE events SET ${setClause} WHERE id = $1 RETURNING *`, [...values, id]);
    return result.rows[0];
  } catch {
    inMemoryEvents = inMemoryEvents.map((e) => (e.id === id ? { ...e, ...updates } : e));
    savePersistedEvents(inMemoryEvents);
    return inMemoryEvents.find((e) => e.id === id);
  }
}

export async function deleteEvent(id: string) {
  try {
    await query('DELETE FROM events WHERE id = $1', [id]);
    await query('DELETE FROM gallery_items WHERE event_id = $1', [id]);
    await query('DELETE FROM brochures WHERE event_id = $1', [id]);
  } catch {}
  inMemoryEvents = inMemoryEvents.filter((e) => e.id !== id);
  savePersistedEvents(inMemoryEvents);
}

export async function insertMember(member: Record<string, any>) {
  try {
    const result = await query(
      `INSERT INTO members (id, name, role, department, image_url, bio, socials, contributions, year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [member.id, member.name, member.role, member.department, member.image_url, member.bio, member.socials, member.contributions, member.year]
    );
    inMemoryMembers = [member, ...inMemoryMembers];
    return result.rows[0];
  } catch {
    inMemoryMembers = [member, ...inMemoryMembers];
    return member;
  }
}

export async function upsertMember(id: string, updates: Record<string, any>) {
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const result = await query(`UPDATE members SET ${setClause} WHERE id = $1 RETURNING *`, [...values, id]);
    return result.rows[0] || await getMemberById(id);
  } catch {
    inMemoryMembers = inMemoryMembers.map((m) => (m.id === id ? { ...m, ...updates } : m));
    return inMemoryMembers.find((m) => m.id === id);
  }
}

export async function deleteMember(id: string) {
  try {
    await query('DELETE FROM members WHERE id = $1', [id]);
  } catch {}
  inMemoryMembers = inMemoryMembers.filter((m) => m.id !== id);
}

export async function insertGalleryItem(item: Record<string, any>) {
  try {
    const result = await query(
      `INSERT INTO gallery_items (id, event_id, url, thumbnail_url, alt_text, type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [item.id, item.eventId, item.url, item.thumbnailUrl, item.altText, item.type]
    );
    return result.rows[0];
  } catch {
    return item;
  }
}

export async function insertBrochure(brocure: Record<string, any>) {
  try {
    const result = await query(
      `INSERT INTO brochures (id, event_id, title, file_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [brocure.id, brocure.eventId, brocure.title, brocure.fileUrl]
    );
    return result.rows[0];
  } catch {
    return brocure;
  }
}

export { pool };

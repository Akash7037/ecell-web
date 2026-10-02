import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStoredEvents, saveStoredEvent, deleteStoredEvent, StoredEvent } from '@/lib/dataStoreServer';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET /api/events — returns all events
export async function GET() {
  try {
    const events = await getStoredEvents();
    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events — create or update event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.date) {
      return NextResponse.json(
        { error: 'Event name and date are required' },
        { status: 400 }
      );
    }

    const event: StoredEvent = {
      id: body.id || `evt-${randomBytes(6).toString('hex')}`,
      name: body.name.trim(),
      shortDescription: body.shortDescription || '',
      description: body.description || undefined,
      isFree: body.isFree ?? true,
      date: body.date.trim(),
      time: body.time?.trim() || 'TBA',
      location: body.location?.trim() || undefined,
      registrationUrl: body.registrationUrl?.trim() || undefined,
      imageUrl: body.imageUrl?.trim() || undefined,
      gallery: Array.isArray(body.gallery) ? body.gallery : undefined,
    };

    const saved = await saveStoredEvent(event);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/events', 'page');
      revalidatePath('/admin', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error('Failed to save event:', error);
    return NextResponse.json(
      { error: 'Failed to save event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events — delete event by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await deleteStoredEvent(id);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/events', 'page');
      revalidatePath('/admin', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

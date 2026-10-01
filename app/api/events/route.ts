import { NextRequest, NextResponse } from 'next/server';
import { getStoredEvents, saveStoredEvent, deleteStoredEvent, StoredEvent } from '@/lib/dataStoreServer';
import { randomBytes } from 'crypto';

// GET /api/events — returns all events
export async function GET() {
  try {
    const events = await getStoredEvents();
    return NextResponse.json(events);
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
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

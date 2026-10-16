import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import {
  getStoredEventSuggestions,
  saveStoredEventSuggestion,
  deleteStoredEventSuggestion,
  StoredEventSuggestion,
} from '@/lib/dataStoreServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET /api/event-suggestions — returns all suggestions (newest first)
export async function GET() {
  try {
    const suggestions = await getStoredEventSuggestions();
    return NextResponse.json(suggestions, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to fetch event suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

// POST /api/event-suggestions — submit a new suggestion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.idea || typeof body.idea !== 'string' || !body.idea.trim()) {
      return NextResponse.json({ error: 'Please provide an event idea or suggestion.' }, { status: 400 });
    }

    const suggestion: StoredEventSuggestion = {
      id: `sug-${Date.now()}-${randomBytes(3).toString('hex')}`,
      idea: body.idea.trim(),
      contact: typeof body.contact === 'string' && body.contact.trim() ? body.contact.trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveStoredEventSuggestion(suggestion);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to save suggestion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, suggestion });
  } catch (error) {
    console.error('Failed to submit event suggestion:', error);
    return NextResponse.json({ error: 'Failed to process suggestion' }, { status: 500 });
  }
}

// DELETE /api/event-suggestions?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Suggestion ID is required' }, { status: 400 });
    }

    const deleted = await deleteStoredEventSuggestion(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event suggestion:', error);
    return NextResponse.json({ error: 'Failed to delete suggestion' }, { status: 500 });
  }
}

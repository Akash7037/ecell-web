import { NextRequest, NextResponse } from 'next/server';
import { reorderStoredEvents } from '@/lib/dataStoreServer';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: 'orderedIds must be a non-empty array of event IDs' },
        { status: 400 }
      );
    }

    await reorderStoredEvents(orderedIds);

    // Invalidate Next.js cache so home page and events page immediately show new queue order
    try {
      revalidatePath('/');
      revalidatePath('/events');
    } catch (e) {
      // Ignore cache revalidation errors if running outside server context
    }

    return NextResponse.json({ success: true, count: orderedIds.length });
  } catch (error) {
    console.error('Failed to reorder events:', error);
    return NextResponse.json(
      { error: 'Failed to reorder events' },
      { status: 500 }
    );
  }
}

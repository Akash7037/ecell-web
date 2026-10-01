import { NextRequest, NextResponse } from 'next/server';
import { getStoredEvents, getSubscribers, StoredEvent } from '@/lib/dataStoreServer';
import { sendEventToSubscribers } from '@/lib/emailService';

// POST /api/notify — broadcasts an event to all subscribers via Brevo SMTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let event: StoredEvent | null = null;

    if (body.eventId) {
      const events = await getStoredEvents();
      event = events.find((e) => e.id === body.eventId) || null;
    } else if (body.event) {
      event = body.event;
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Valid event or eventId is required' },
        { status: 400 }
      );
    }

    const subscribers = await getSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        message: 'No active subscribers found to notify.',
      });
    }

    const result = await sendEventToSubscribers(event, subscribers);

    return NextResponse.json({
      success: result.success,
      sentCount: result.sentCount,
      totalSubscribers: subscribers.length,
      errors: result.errors,
      message: `Sent notification to ${result.sentCount} subscriber${result.sentCount !== 1 ? 's' : ''}.`,
    });
  } catch (error) {
    console.error('Failed to notify subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to send event notifications' },
      { status: 500 }
    );
  }
}

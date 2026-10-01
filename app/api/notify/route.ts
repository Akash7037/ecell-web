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

    // Check if testRecipient is provided for instant testing
    const targetRecipients = body.testRecipient
      ? [body.testRecipient]
      : await getSubscribers();

    if (targetRecipients.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        message: 'No active subscribers found to notify.',
      });
    }

    const result = await sendEventToSubscribers(event, targetRecipients, {
      senderEmail: body.senderEmail,
      senderName: body.senderName,
    });

    const isBrevoDefault = result.fromEmailUsed.endsWith('@smtp-brevo.com');

    return NextResponse.json({
      success: result.success,
      sentCount: result.sentCount,
      totalSubscribers: targetRecipients.length,
      fromEmailUsed: result.fromEmailUsed,
      warning: isBrevoDefault
        ? 'Notice: Sending from @smtp-brevo.com is dropped by Brevo unless it is in your Brevo Senders list. Add your registered Brevo email address in Admin > Subscribers for guaranteed delivery.'
        : undefined,
      errors: result.errors,
      message: `Sent notification to ${result.sentCount} recipient${result.sentCount !== 1 ? 's' : ''} from ${result.fromEmailUsed}.`,
    });
  } catch (error) {
    console.error('Failed to notify subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to send event notifications' },
      { status: 500 }
    );
  }
}

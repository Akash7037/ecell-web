import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber, getSubscribers } from '@/lib/dataStoreServer';
import { sendWelcomeEmail } from '@/lib/emailService';

// POST /api/subscribe — subscribe email for event updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    const result = await addSubscriber(email);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Could not process subscription' },
        { status: 400 }
      );
    }

    // If newly subscribed, trigger welcome email asynchronously
    if (result.isNew) {
      sendWelcomeEmail(email.trim().toLowerCase()).catch((err) => {
        console.error('Welcome email sending error:', err);
      });
    }

    return NextResponse.json({
      success: true,
      message: result.isNew ? 'Subscribed successfully. Confirmation email sent.' : 'You are already subscribed.',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// GET /api/subscribe — returns subscriber count and list
export async function GET() {
  try {
    const list = await getSubscribers();
    return NextResponse.json({ count: list.length, subscribers: list });
  } catch (error) {
    console.error('Failed to get subscribers:', error);
    return NextResponse.json({ count: 0, subscribers: [] });
  }
}

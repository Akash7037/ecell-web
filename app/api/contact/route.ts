import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validators';

// POST /api/contact — public contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // In production, this would:
    // 1. Store the message in the database
    // 2. Send an email notification to the admin
    // 3. Send a confirmation email to the sender
    // For now, we log it server-side
    console.log('[Contact Form Submission]', {
      name,
      email,
      subject,
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // TODO: Integrate with email service (nodemailer, resend, etc.)
    // TODO: Store in database contact_submissions table

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you within 24-48 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}

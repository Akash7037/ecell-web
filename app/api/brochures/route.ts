import { NextRequest, NextResponse } from 'next/server';
import { getBrochures, insertBrochure } from '@/lib/db';
import { randomBytes } from 'crypto';

// GET /api/brochures
export async function GET(request: NextRequest) {
  try {
    const eventId = request.nextUrl.searchParams.get('eventId') || undefined;
    const brochures = await getBrochures(eventId);
    return NextResponse.json(brochures);
  } catch (error) {
    console.error('Failed to fetch brochures:', error);
    return NextResponse.json([]);
  }
}

// POST /api/brochures — admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.fileUrl || !body.eventId) {
      return NextResponse.json(
        { error: 'Title, fileUrl, and eventId are required' },
        { status: 400 }
      );
    }

    const brochure = await insertBrochure({
      id: randomBytes(16).toString('hex'),
      eventId: body.eventId,
      title: body.title,
      fileUrl: body.fileUrl,
    });

    return NextResponse.json(brochure, { status: 201 });
  } catch (error) {
    console.error('Failed to add brochure:', error);
    return NextResponse.json(
      { error: 'Failed to add brochure' },
      { status: 500 }
    );
  }
}

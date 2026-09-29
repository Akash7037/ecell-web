import { NextRequest, NextResponse } from 'next/server';
import { getGalleryItems, insertGalleryItem } from '@/lib/db';
import { randomBytes } from 'crypto';

// GET /api/gallery — public
export async function GET(request: NextRequest) {
  try {
    const eventId = request.nextUrl.searchParams.get('eventId') || undefined;
    const items = await getGalleryItems(eventId);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    const { galleryItems } = await import('@/data/seed');
    return NextResponse.json(galleryItems);
  }
}

// POST /api/gallery — admin only
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url || !body.eventId) {
      return NextResponse.json(
        { error: 'URL and eventId are required' },
        { status: 400 }
      );
    }

    const item = await insertGalleryItem({
      id: randomBytes(16).toString('hex'),
      eventId: body.eventId,
      url: body.url,
      thumbnailUrl: body.thumbnailUrl || body.url,
      altText: body.altText || 'Gallery image',
      type: body.type || 'image',
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to add gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to add gallery item' },
      { status: 500 }
    );
  }
}

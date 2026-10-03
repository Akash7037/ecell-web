import { NextRequest, NextResponse } from 'next/server';
import { reorderStoredMembers } from '@/lib/dataStoreServer';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: 'orderedIds must be a non-empty array of member IDs' },
        { status: 400 }
      );
    }

    await reorderStoredMembers(orderedIds);

    // Invalidate Next.js cache so visitors immediately see new sequence
    try {
      revalidatePath('/');
      revalidatePath('/team');
    } catch (e) {
      // Ignore cache revalidation errors if running outside server context
    }

    return NextResponse.json({ success: true, count: orderedIds.length });
  } catch (error) {
    console.error('Failed to reorder members:', error);
    return NextResponse.json(
      { error: 'Failed to reorder members' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getStoredMembers, saveStoredMember, deleteStoredMember, StoredMember } from '@/lib/dataStoreServer';
import { randomBytes } from 'crypto';

// GET /api/members — returns all members
export async function GET() {
  try {
    const members = await getStoredMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

// POST /api/members — create or update member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const member: StoredMember = {
      id: body.id || `m-${randomBytes(6).toString('hex')}`,
      name: body.name.trim(),
      role: body.role.trim(),
      avatarUrl: body.avatarUrl?.trim() || undefined,
      portfolioUrl: body.portfolioUrl?.trim() || undefined,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
    };

    const saved = await saveStoredMember(member);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error('Failed to save member:', error);
    return NextResponse.json(
      { error: 'Failed to save member' },
      { status: 500 }
    );
  }
}

// DELETE /api/members — delete member by ID
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    await deleteStoredMember(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Failed to delete member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}

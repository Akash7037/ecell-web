import { NextRequest, NextResponse } from 'next/server';
import { getAllMembers, insertMember } from '@/lib/db';
import { randomBytes } from 'crypto';

// GET /api/members — public, returns all members
export async function GET() {
  try {
    const members = await getAllMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    // Fallback to seed data
    const { members } = await import('@/data/seed');
    return NextResponse.json(members);
  }
}

// POST /api/members — admin only, create member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.role || !body.department) {
      return NextResponse.json(
        { error: 'Name, role, and department are required' },
        { status: 400 }
      );
    }

    const member = await insertMember({
      id: randomBytes(16).toString('hex'),
      name: body.name,
      role: body.role,
      department: body.department,
      image_url: body.image_url || null,
      bio: body.bio || '',
      socials: JSON.stringify(body.socials || {}),
      contributions: body.contributions || [],
      year: body.year || 1,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}

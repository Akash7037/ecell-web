import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser, verifyPassword, createSession, recordLoginAttempt, isRateLimited } from '@/lib/auth';
import { adminLoginSchema } from '@/lib/validators';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vsb.ac.in';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    let user: any = null;
    let rateLimited = false;

    try {
      rateLimited = await isRateLimited(email);
    } catch {
      rateLimited = false;
    }

    if (rateLimited) {
      return NextResponse.json(
        { error: 'Account temporarily locked. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    try {
      user = await getAdminUser(email);
    } catch {
      // Database offline fallback
      user = null;
    }

    // Database mode
    if (user) {
      if (user.is_locked && user.lock_until && new Date(user.lock_until) > new Date()) {
        return NextResponse.json(
          { error: 'Account temporarily locked. Try again later.' },
          { status: 429 }
        );
      }

      const validPassword = await verifyPassword(password, user.password_hash);
      if (!validPassword) {
        try { await recordLoginAttempt(email, false); } catch {}
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      try { await recordLoginAttempt(email, true); } catch {}
    } else {
      // Offline fallback authentication check
      if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
        user = { id: 'admin-default', email: DEFAULT_ADMIN_EMAIL, role: 'admin' };
      } else {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Session token generation
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    let token = 'offline_session_' + Date.now();
    let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      const session = await createSession(user.id, ipAddress, userAgent, user.email, user.role);
      token = session.token;
      expiresAt = session.expiresAt;
    } catch {
      // Offline mode session token
    }

    const response = NextResponse.json({ success: true, role: user.role });

    response.cookies.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

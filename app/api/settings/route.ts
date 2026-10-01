import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, saveSiteSettings } from '@/lib/siteSettingsServer';

export async function GET() {
  const settings = getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = saveSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

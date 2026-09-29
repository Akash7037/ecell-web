import { NextResponse } from 'next/server';
import { getExpoConfig, saveExpoConfig } from '@/lib/expoConfigServer';
import { defaultExpoConfig } from '@/lib/expoConfig';

export async function GET() {
  try {
    const config = getExpoConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(defaultExpoConfig);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.title) {
      return NextResponse.json({ error: 'Invalid configuration data' }, { status: 400 });
    }

    const success = saveExpoConfig(body);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Expo configuration updated successfully', config: body });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

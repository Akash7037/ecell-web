import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are permitted' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image file size must be under 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? ext : 'jpg';
    const fileName = `media-${Date.now()}-${randomBytes(4).toString('hex')}.${safeExt}`;

    // 1. Try uploading to Supabase Storage (ecell-media bucket)
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { error: uploadError } = await supabase.storage.from('ecell-media').upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

        if (!uploadError) {
          const { data: pubData } = supabase.storage.from('ecell-media').getPublicUrl(fileName);
          if (pubData?.publicUrl) {
            return NextResponse.json({ success: true, url: pubData.publicUrl });
          }
        } else {
          console.warn('Supabase storage upload notice, falling back to local storage:', uploadError.message);
        }
      } catch (err) {
        console.warn('Supabase upload exception:', err);
      }
    }

    // 2. Fallback: Save to local public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'File upload processing failed' }, { status: 500 });
  }
}

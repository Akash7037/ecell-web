import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { SiteSettings, defaultSiteSettings } from './siteSettings';

const filePath = path.join(process.cwd(), 'data', 'site-settings.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;

export function getSiteSettings(): SiteSettings {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return { ...defaultSiteSettings, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading site-settings.json:', err);
  }
  return defaultSiteSettings;
}

export function saveSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  try {
    const current = getSiteSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    // Save to local file
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');

    // Async sync to Supabase site_settings table
    if (supabase) {
      Promise.resolve(
        supabase.from('site_settings').upsert({
          key: 'global',
          value: updated,
          updated_at: new Date().toISOString(),
        })
      ).catch((e: any) => console.warn('Supabase site_settings sync warning:', e?.message));
    }

    return updated;
  } catch (err) {
    console.error('Error writing site-settings.json:', err);
    return { ...defaultSiteSettings, ...settings };
  }
}


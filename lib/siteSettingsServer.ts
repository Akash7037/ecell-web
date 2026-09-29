import fs from 'fs';
import path from 'path';
import { SiteSettings, defaultSiteSettings } from './siteSettings';

const filePath = path.join(process.cwd(), 'data', 'site-settings.json');

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
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error writing site-settings.json:', err);
    return { ...defaultSiteSettings, ...settings };
  }
}

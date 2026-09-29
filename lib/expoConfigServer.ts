import fs from 'fs';
import path from 'path';
import { ExpoConfig, defaultExpoConfig } from './expoConfig';

const filePath = path.join(process.cwd(), 'data', 'expo-config.json');

export function getExpoConfig(): ExpoConfig {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading expo-config.json:', err);
  }
  return defaultExpoConfig;
}

export function saveExpoConfig(config: ExpoConfig): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing expo-config.json:', err);
    return false;
  }
}

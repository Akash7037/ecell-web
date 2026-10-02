/**
 * Event utility functions for parsing dates, checking completion status,
 * and categorizing upcoming vs. past / concluded events.
 */

export interface EventLike {
  id?: string;
  name?: string;
  date?: string;
  time?: string;
  shortDescription?: string;
  description?: string;
  isConcluded?: boolean;
  isPast?: boolean;
}

/**
 * Parses end date and time of an event.
 * Handles:
 * - Specific date strings (e.g. "March 15, 2026", "15 Oct 2026", "2026-10-15")
 * - Date ranges (e.g. "March 10-12, 2025", "10 - 12 March 2025", "Oct 15 - 16, 2024")
 * - Time end ranges (e.g. "9:00 AM – 5:00 PM" -> 5:00 PM)
 * - Returns null for indefinite dates (e.g. "Dates Announcing Soon", "TBA", "Coming Soon")
 * - Returns Epoch Date(0) for explicit completed keywords
 */
export function parseEventEndDate(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const d = dateStr.trim();
  const lower = d.toLowerCase();

  // If announcement text or pending dates, it's upcoming
  if (
    lower.includes('announc') ||
    lower.includes('soon') ||
    lower.includes('tba') ||
    lower.includes('coming') ||
    lower.includes('to be announced')
  ) {
    return null;
  }

  // Keywords that indicate explicitly completed / archived
  if (
    lower.includes('completed') ||
    lower.includes('concluded') ||
    lower.includes('archive') ||
    lower.includes('ended') ||
    lower.includes('finished')
  ) {
    return new Date(0); // Epoch = in the past
  }

  // ISO date format YYYY-MM-DD
  const isoMatch = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    let hours = 23, minutes = 59;
    if (timeStr) {
      const parsedTime = parseTimeComponents(timeStr);
      if (parsedTime) {
        hours = parsedTime.hours;
        minutes = parsedTime.minutes;
      }
    }
    return new Date(Number(year), Number(month) - 1, Number(day), hours, minutes, 59);
  }

  // Date ranges: "March 10-12, 2025" or "10 - 12 March 2025" or "Oct 15 - 16, 2024"
  let endPart = d;
  if (d.includes('–') || d.includes('-') || d.includes(' to ')) {
    const segments = d.split(/[–\-]|\bto\b/i).map((s) => s.trim()).filter(Boolean);
    if (segments.length >= 2) {
      const lastSegment = segments[segments.length - 1];
      const yearMatch = d.match(/\b(20\d\d)\b/);
      const monthMatch = d.match(
        /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/i
      );

      let reconstructed = lastSegment;
      if (!lastSegment.match(/\b(20\d\d)\b/) && yearMatch) {
        reconstructed += ' ' + yearMatch[1];
      }
      if (!reconstructed.match(/[a-zA-Z]/) && monthMatch) {
        reconstructed = monthMatch[1] + ' ' + reconstructed;
      }
      endPart = reconstructed;
    }
  }

  // Parse DD/MM/YYYY or DD-MM-YYYY format
  const dmyMatch = endPart.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    let hours = 23, minutes = 59;
    if (timeStr) {
      const parsedTime = parseTimeComponents(timeStr);
      if (parsedTime) {
        hours = parsedTime.hours;
        minutes = parsedTime.minutes;
      }
    }
    return new Date(Number(year), Number(month) - 1, Number(day), hours, minutes, 59);
  }

  // Natural language date (e.g. "March 15, 2024", "15 Oct 2024")
  const standardDate = new Date(endPart);
  if (!isNaN(standardDate.getTime())) {
    let hours = 23, minutes = 59;
    if (timeStr) {
      const parsedTime = parseTimeComponents(timeStr);
      if (parsedTime) {
        hours = parsedTime.hours;
        minutes = parsedTime.minutes;
      }
    }
    standardDate.setHours(hours, minutes, 59, 999);
    return standardDate;
  }

  return null;
}

/**
 * Extracts hours and minutes from time strings like "5:00 PM", "9:00 AM – 5:00 PM", "17:00".
 */
export function parseTimeComponents(timeStr?: string): { hours: number; minutes: number } | null {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const tLower = timeStr.toLowerCase().trim();
  if (tLower.includes('tba') || tLower.includes('hour') || tLower.includes('day')) return null;

  // If time range "9:00 AM – 5:00 PM", take the last (concluding) time
  const segments = timeStr.split(/[–\-]|\bto\b/i).map((s) => s.trim()).filter(Boolean);
  const targetTime = segments[segments.length - 1];

  const match = targetTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridian = match[3] ? match[3].toLowerCase() : null;

  if (meridian === 'pm' && hours < 12) hours += 12;
  if (meridian === 'am' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Checks if an event is concluded / past / finished.
 * Automatically checks:
 * 1. Explicit boolean `isConcluded === true` or `isPast === true`
 * 2. Completion keywords in date or descriptions
 * 3. Actual event end date and time compared with current time (Date.now())
 */
export function isEventConcluded(event?: EventLike | null): boolean {
  if (!event) return false;
  if (event.isConcluded === true || event.isPast === true) return true;

  const dateStr = (event.date || '').toLowerCase();
  const descStr = (event.shortDescription || '').toLowerCase();
  const nameStr = (event.name || '').toLowerCase();

  if (
    dateStr.includes('completed') ||
    dateStr.includes('concluded') ||
    dateStr.includes('archive') ||
    dateStr.includes('ended') ||
    dateStr.includes('finished') ||
    descStr.includes('completed') ||
    descStr.includes('archived') ||
    descStr.includes('concluded') ||
    nameStr.includes('completed') ||
    nameStr.includes('concluded')
  ) {
    return true;
  }

  const endDate = parseEventEndDate(event.date, event.time);
  if (endDate) {
    return Date.now() > endDate.getTime();
  }

  return false;
}

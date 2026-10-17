import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'calendar-config.json');

export function getCalendarConfig(): { icalUrl: string | null } {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (data && data.icalUrl) return { icalUrl: data.icalUrl };
    }
  } catch {
    // ignore
  }
  return { icalUrl: process.env.GOOGLE_CALENDAR_ICAL_URL || null };
}

export function saveCalendarConfig(icalUrl: string) {
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify({ icalUrl: icalUrl.trim(), updatedAt: new Date().toISOString() }, null, 2),
    'utf-8'
  );
}

export function deleteCalendarConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

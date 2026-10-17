/**
 * Utilitaires de synchronisation calendrier & iCal pour Jirel de Joiry
 */

export interface CalendarEventData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string; // Ex: "Mercredi 16 septembre 2026"
  slot: string; // Ex: "10h00"
  durationMinutes?: number; // 90 min par défaut
  notes?: string;
}

const MONTHS_MAP: Record<string, number> = {
  // Français
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
  // Anglais
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

/**
 * Extrait une date JS à partir d'une chaîne du type "Mercredi 16 septembre 2026" et d'un créneau "10h00"
 */
export function parseBookingDateTime(dateStr: string, slotStr: string): { start: Date; end: Date } {
  const defaultYear = 2026;
  let year = defaultYear;
  let month = 8; // Septembre
  let day = 16;
  let hour = 10;
  let minute = 0;

  // Extraction de l'heure
  const slotMatch = slotStr.match(/(\d{1,2})[h:](\d{2})?/i);
  if (slotMatch) {
    hour = parseInt(slotMatch[1], 10);
    minute = slotMatch[2] ? parseInt(slotMatch[2], 10) : 0;
  }

  // Extraction jour, mois, année
  const cleanDate = dateStr.toLowerCase().replace(/[,.-]/g, ' ');
  const tokens = cleanDate.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    // Année à 4 chiffres
    if (/^\d{4}$/.test(token)) {
      year = parseInt(token, 10);
      continue;
    }
    // Mois
    if (MONTHS_MAP[token] !== undefined) {
      month = MONTHS_MAP[token];
      continue;
    }
    // Jour du mois (1 à 31)
    if (/^\d{1,2}$/.test(token)) {
      const num = parseInt(token, 10);
      if (num >= 1 && num <= 31) {
        day = num;
      }
    }
  }

  // En France (Europe/Paris), l'heure locale est soit UTC+1 soit UTC+2
  // On construit la date en local
  const start = new Date(year, month, day, hour, minute, 0);
  const end = new Date(start.getTime() + 90 * 60 * 1000); // 1h30 par défaut

  return { start, end };
}

/**
 * Formate une date JS en chaîne iCal UTC : YYYYMMDDTHHMMSSZ
 */
export function formatIcalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Génère le contenu d'un fichier .ics conforme RFC 5545 pour synchronisation avec Google Calendar
 */
export function generateIcsInvite(event: CalendarEventData): string {
  const { start, end } = parseBookingDateTime(event.date, event.slot);
  const nowStr = formatIcalDate(new Date());
  const startStr = formatIcalDate(start);
  const endStr = formatIcalDate(end);

  const uid = event.id.startsWith('bk_')
    ? `${event.id}@jireldejoiry.com`
    : `bk_${event.id}_${Date.now()}@jireldejoiry.com`;

  const safeNotes = (event.notes || 'Aucune').replace(/\r?\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'PRODID:-//Jirel de Joiry//Reservation Colorimetrie//FR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:Séance Colorimétrie 1:1 — ${event.fullName}`,
    `DESCRIPTION:Séance de Colorimétrie personnalisée 1:1 avec Jirel de Joiry (Anne Martinons).\\n\\nCliente : ${event.fullName}\\nEmail : ${event.email}\\nTéléphone : ${event.phone}\\nTarif : 100€ (à régler sur place)\\nNotes : ${safeNotes}`,
    'LOCATION:Atelier Jirel de Joiry, Paris 13e arrondissement, France',
    'STATUS:CONFIRMED',
    'ORGANIZER;CN="Jirel de Joiry":mailto:mattiskhn@gmail.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${event.fullName}":mailto:${event.email}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rappel : Séance de Colorimétrie Jirel de Joiry demain',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Normalise une date et un créneau pour comparaison stricte anti-doublon
 * Ex: "Mercredi 16 septembre 2026" + "10h00" => "2026-09-16_10h00"
 */
export function getSlotKey(dateStr: string, slotStr: string): string {
  const { start } = parseBookingDateTime(dateStr, slotStr);
  const y = start.getFullYear();
  const m = String(start.getMonth() + 1).padStart(2, '0');
  const d = String(start.getDate()).padStart(2, '0');
  const normalizedSlot = slotStr.toLowerCase().replace(/\s+/g, '');
  return `${y}-${m}-${d}_${normalizedSlot}`;
}

/**
 * Parse un flux iCal brut (URL secrète Google Calendar) et en extrait les créneaux occupés
 */
export function parseIcalBusySlots(icalContent: string): { start: Date; end: Date }[] {
  const busyRanges: { start: Date; end: Date }[] = [];
  const eventBlocks = icalContent.split('BEGIN:VEVENT');

  for (let i = 1; i < eventBlocks.length; i++) {
    const block = eventBlocks[i].split('END:VEVENT')[0];
    const dtStartMatch = block.match(/DTSTART(?:;[^:]+)?:(\d{8}T\d{6}Z?|\d{8})/);
    const dtEndMatch = block.match(/DTEND(?:;[^:]+)?:(\d{8}T\d{6}Z?|\d{8})/);

    if (dtStartMatch) {
      try {
        const parseRaw = (raw: string) => {
          if (raw.length === 8) {
            // Journée entière YYYYMMDD
            const y = parseInt(raw.slice(0, 4), 10);
            const m = parseInt(raw.slice(4, 6), 10) - 1;
            const d = parseInt(raw.slice(6, 8), 10);
            return new Date(y, m, d, 0, 0, 0);
          }
          // YYYYMMDDTHHMMSS
          const y = parseInt(raw.slice(0, 4), 10);
          const m = parseInt(raw.slice(4, 6), 10) - 1;
          const d = parseInt(raw.slice(6, 8), 10);
          const h = parseInt(raw.slice(9, 11), 10);
          const min = parseInt(raw.slice(11, 13), 10);
          const s = parseInt(raw.slice(13, 15), 10);
          if (raw.endsWith('Z')) {
            return new Date(Date.UTC(y, m, d, h, min, s));
          }
          return new Date(y, m, d, h, min, s);
        };

        const start = parseRaw(dtStartMatch[1]);
        const end = dtEndMatch ? parseRaw(dtEndMatch[1]) : new Date(start.getTime() + 60 * 60 * 1000);
        busyRanges.push({ start, end });
      } catch {
        // Ignorer les blocs malformés
      }
    }
  }

  return busyRanges;
}

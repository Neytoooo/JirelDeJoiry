import { NextRequest, NextResponse } from 'next/server';
import { parseIcalBusySlots } from '@/lib/calendar-sync';
import {
  getCalendarConfig,
  saveCalendarConfig,
  deleteCalendarConfig,
} from '@/lib/calendar-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = getCalendarConfig();
  return NextResponse.json({
    success: true,
    connected: Boolean(config.icalUrl),
    icalUrl: config.icalUrl ? config.icalUrl.slice(0, 30) + '...' : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { icalUrl } = body;

    if (!icalUrl || typeof icalUrl !== 'string' || !icalUrl.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'Veuillez fournir une URL iCal valide commençant par https://' },
        { status: 400 }
      );
    }

    // Tester la validité de l'URL en téléchargeant le flux
    const testRes = await fetch(icalUrl.trim(), {
      headers: { 'User-Agent': 'Jirel-Calendar-Sync/1.0' },
      cache: 'no-store',
    });

    if (!testRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Impossible de joindre le flux Google Agenda (statut HTTP ${testRes.status}). Vérifiez l'adresse secrète iCal.`,
        },
        { status: 400 }
      );
    }

    const text = await testRes.text();
    if (!text.includes('BEGIN:VCALENDAR')) {
      return NextResponse.json(
        { success: false, error: "L'adresse fournie ne renvoie pas un flux d'agenda valide (.ics / VCALENDAR)." },
        { status: 400 }
      );
    }

    const events = parseIcalBusySlots(text);

    // Sauvegarder la configuration
    saveCalendarConfig(icalUrl.trim());

    return NextResponse.json({
      success: true,
      message: `Google Agenda synchronisé avec succès ! (${events.length} événements détectés)`,
      eventsCount: events.length,
    });
  } catch (err: any) {
    console.error('Erreur connexion Google Calendar:', err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de la synchronisation de l'agenda" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    deleteCalendarConfig();
    return NextResponse.json({ success: true, message: 'Google Agenda déconnecté avec succès.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

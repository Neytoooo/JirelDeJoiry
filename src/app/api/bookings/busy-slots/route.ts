import { NextRequest, NextResponse } from 'next/server';
import { getAllBookings } from '@/lib/bookings-store';
import {
  getSlotKey,
  parseIcalBusySlots,
  parseBookingDateTime,
} from '@/lib/calendar-sync';
import { getCalendarConfig } from '@/lib/calendar-server';
import { BOOKING_MONTHS, DEFAULT_TIME_SLOTS } from '@/data/booking';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const customIcalUrl = searchParams.get('icalUrl') || getCalendarConfig().icalUrl;

    // 1. Récupérer toutes les réservations enregistrées sur le site
    const siteBookings = await getAllBookings();

    const busySlotsMap = new Map<string, { date: string; slot: string; slotKey: string; source: string }>();

    siteBookings.forEach((b) => {
      if (b && b.date && b.slot) {
        try {
          const key = getSlotKey(b.date, b.slot);
          busySlotsMap.set(key, {
            date: b.date,
            slot: b.slot,
            slotKey: key,
            source: 'reservation_site',
          });
        } catch (e) {
          console.warn('Erreur clé créneau site:', e);
        }
      }
    });

    // 2. Si une URL iCal Google Calendar est configurée, extraire les créneaux occupés
    let googleSyncActive = false;
    let googleEventsCount = 0;

    if (customIcalUrl) {
      try {
        const res = await fetch(customIcalUrl, {
          headers: { 'User-Agent': 'Jirel-Calendar-Sync/1.0' },
          cache: 'no-store',
        });

        if (res.ok) {
          googleSyncActive = true;
          const icalText = await res.text();
          const googleBusyRanges = parseIcalBusySlots(icalText);
          googleEventsCount = googleBusyRanges.length;

          // Parcourir tous les jours et mois du calendrier de réservation
          BOOKING_MONTHS.forEach((monthData, mIndex) => {
            const monthNumber = 7 + mIndex; // 7 = Août, 8 = Septembre, 9 = Octobre
            for (let day = 1; day <= monthData.daysCount; day++) {
              const testDate = new Date(2026, monthNumber, day);
              const dateStr = testDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });

              DEFAULT_TIME_SLOTS.forEach((slot) => {
                const { start: slotStart, end: slotEnd } = parseBookingDateTime(dateStr, slot);
                const isOverlapping = googleBusyRanges.some((range) => {
                  // 1. Recouvrement temporel direct (Europe/Paris ou UTC)
                  if (slotStart < range.end && slotEnd > range.start) return true;

                  // 2. Tolérance pour les tests : uniquement si l'événement est pour l'année en cours ou 2026
                  const rangeY = range.start.getFullYear();
                  const currentYear = new Date().getFullYear();
                  if (rangeY === 2026 || rangeY === currentYear) {
                    const rangeM = range.start.getMonth();
                    const rangeD = range.start.getDate();
                    const rangeH = range.start.getHours();

                    const slotM = slotStart.getMonth();
                    const slotD = slotStart.getDate();
                    const slotH = slotStart.getHours();

                    if (rangeM === slotM && rangeD === slotD) {
                      const slotEndH = slotEnd.getHours() + (slotEnd.getMinutes() > 0 ? 1 : 0);
                      const rangeEndH = range.end.getHours() + (range.end.getMinutes() > 0 ? 1 : 0);
                      if (rangeH < slotEndH && rangeEndH > slotH) {
                        return true;
                      }
                    }
                  }

                  return false;
                });

                if (isOverlapping) {
                  const key = getSlotKey(dateStr, slot);
                  if (!busySlotsMap.has(key)) {
                    busySlotsMap.set(key, {
                      date: dateStr,
                      slot,
                      slotKey: key,
                      source: 'google_calendar',
                    });
                  }
                }
              });
            }
          });
        }
      } catch (icalErr) {
        console.warn('Erreur lors de la lecture du flux Google Calendar:', icalErr);
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        busySlots: Array.from(busySlotsMap.values()),
        totalBusy: busySlotsMap.size,
        googleCalendarConnected: googleSyncActive || Boolean(process.env.GOOGLE_CALENDAR_ICAL_URL),
        googleEventsCount,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('Erreur GET /api/bookings/busy-slots:', err);
    return NextResponse.json({ success: false, busySlots: [], error: 'Erreur serveur' }, { status: 500 });
  }
}

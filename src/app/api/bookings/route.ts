import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendBookingEmails, BookingEmailData } from '@/lib/email';
import {
  getAllBookings,
  isSlotAlreadyBooked,
  saveLocalBookings,
  getLocalBookings,
  deleteBooking,
} from '@/lib/bookings-store';

export const dynamic = 'force-dynamic';

const DB_NAME = 'jirel';
const COLLECTION_NAME = 'bookings';

// GET : Liste de toutes les réservations ou réservation spécifique par ID
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const list = await getAllBookings();

    if (id) {
      const found = list.find((b) => b && b.id === id);
      if (!found) {
        return NextResponse.json({ success: false, error: 'Réservation introuvable ou déjà annulée' }, { status: 404 });
      }
      return NextResponse.json({ success: true, booking: found });
    }

    return NextResponse.json({
      success: true,
      bookings: list,
    });
  } catch (err) {
    console.error('Erreur GET /api/bookings:', err);
    return NextResponse.json({ success: true, bookings: getLocalBookings(), source: 'fallback_catch' });
  }
}

// POST : Créer une réservation & envoyer les emails
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, date, slot, notes } = body;

    if (!fullName || !email || !phone || !date || !slot) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants (nom, email, téléphone, date ou créneau)' },
        { status: 400 }
      );
    }

    // Contrôle anti-doublon : vérifier si le créneau est déjà réservé
    const isTaken = await isSlotAlreadyBooked(String(date), String(slot));
    if (isTaken) {
      return NextResponse.json(
        {
          success: false,
          code: 'SLOT_ALREADY_BOOKED',
          error: 'Ce créneau horaire est déjà réservé par une autre personne. Merci de choisir un autre créneau disponible.',
        },
        { status: 409 }
      );
    }

    const bookingData: BookingEmailData & { createdAt: string } = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      date: String(date),
      slot: String(slot),
      notes: notes ? String(notes).trim() : '',
      service: 'Colorimétrie 1:1',
      price: '100€',
      duration: '1h30',
      createdAt: new Date().toISOString(),
    };

    // 1. Sauvegarde (MongoDB ou fichier local)
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).insertOne({ ...bookingData });
      } catch (dbErr) {
        console.warn('Erreur insertion MongoDB, fallback sur fichier local:', dbErr);
        const existing = getLocalBookings();
        saveLocalBookings([bookingData, ...existing]);
      }
    } else {
      const existing = getLocalBookings();
      saveLocalBookings([bookingData, ...existing]);
    }

    // 2. Envoi des notifications par email
    const emailResult = await sendBookingEmails(bookingData);

    return NextResponse.json({
      success: true,
      booking: bookingData,
      emailStatus: emailResult,
      message: 'Votre réservation a bien été enregistrée et transmise.',
    });
  } catch (err) {
    console.error('Erreur POST /api/bookings:', err);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre réservation." },
      { status: 500 }
    );
  }
}

// DELETE : Annuler / Supprimer une réservation
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Identifiant requis' }, { status: 400 });
    }

    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).deleteOne({ id });
      } catch (dbErr) {
        console.warn('Erreur suppression MongoDB:', dbErr);
      }
    }

    deleteBooking(id);
    return NextResponse.json({ success: true, message: 'Réservation supprimée avec succès.' });
  } catch (err: any) {
    console.error('Erreur DELETE /api/bookings:', err);
    return NextResponse.json({ success: false, error: err.message || 'Erreur lors de la suppression' }, { status: 500 });
  }
}

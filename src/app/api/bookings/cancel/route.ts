import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getAllBookings, deleteBooking } from '@/lib/bookings-store';
import { sendCancellationEmails } from '@/lib/email';

export const dynamic = 'force-dynamic';

const DB_NAME = 'jirel';
const COLLECTION_NAME = 'bookings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, reason } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Identifiant de réservation manquant.' },
        { status: 400 }
      );
    }

    const all = await getAllBookings();
    const target = all.find((b) => b && b.id === id);

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Cette réservation est introuvable ou a déjà été annulée.' },
        { status: 404 }
      );
    }

    // 1. Supprimer de MongoDB si configuré
    if (clientPromise) {
      try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        await db.collection(COLLECTION_NAME).deleteOne({ id });
      } catch (dbErr) {
        console.warn('Erreur suppression MongoDB:', dbErr);
      }
    }

    // 2. Supprimer du stockage local / fichiers json
    deleteBooking(id);

    // 3. Notifier par email (admin + client)
    const emailResult = await sendCancellationEmails({
      id: target.id,
      fullName: target.fullName,
      email: target.email,
      phone: target.phone,
      date: target.date,
      slot: target.slot,
      reason: reason ? String(reason).trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Votre réservation a été annulée avec succès et le créneau a été libéré.',
      booking: target,
      emailStatus: emailResult,
    });
  } catch (err: any) {
    console.error('Erreur POST /api/bookings/cancel:', err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur lors de l'annulation de la réservation." },
      { status: 500 }
    );
  }
}

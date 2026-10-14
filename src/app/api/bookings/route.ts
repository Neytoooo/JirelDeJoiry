import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { sendBookingEmails, BookingEmailData } from '@/lib/email';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_NAME = 'jirel';
const COLLECTION_NAME = 'bookings';
const LOCAL_BOOKINGS_FILE = path.join(process.cwd(), 'data-bookings.json');

// Lecture du fallback local en fichier si MongoDB n'est pas actif
function getLocalBookings(): BookingEmailData[] {
  try {
    if (fs.existsSync(LOCAL_BOOKINGS_FILE)) {
      const content = fs.readFileSync(LOCAL_BOOKINGS_FILE, 'utf-8');
      return JSON.parse(content) || [];
    }
  } catch (err) {
    console.warn('Impossible de lire le fichier local des réservations:', err);
  }
  return [];
}

// Sauvegarde dans le fallback local
function saveLocalBookings(bookings: BookingEmailData[]) {
  try {
    fs.writeFileSync(LOCAL_BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Impossible d’écrire dans le fichier local des réservations:', err);
  }
}

// GET : Liste de toutes les réservations
export async function GET() {
  try {
    if (!clientPromise) {
      const local = getLocalBookings();
      return NextResponse.json({
        success: true,
        source: 'local_file',
        bookings: local,
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      source: 'mongodb',
      bookings: docs.map((d) => ({
        id: d.id || d._id?.toString(),
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        date: d.date,
        slot: d.slot,
        notes: d.notes,
        service: d.service,
        price: d.price,
        duration: d.duration,
        createdAt: d.createdAt,
      })),
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

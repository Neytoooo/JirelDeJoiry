import clientPromise from '@/lib/mongodb';
import { getSlotKey } from '@/lib/calendar-sync';
import fs from 'fs';
import path from 'path';
import os from 'os';

const DB_NAME = 'jirel';
const COLLECTION_NAME = 'bookings';
const ROOT_BOOKINGS_FILE = path.join(process.cwd(), 'data-bookings.json');
const TMP_BOOKINGS_FILE = path.join(os.tmpdir(), 'data-bookings.json');

let memoryBookings: any[] = [];

/**
 * Récupère les réservations depuis les fichiers locaux (racine du projet, tmpdir et mémoire)
 */
export function getLocalBookings(): any[] {
  const map = new Map<string, any>();

  // 1. Lire data-bookings.json à la racine du projet
  try {
    if (fs.existsSync(ROOT_BOOKINGS_FILE)) {
      const content = fs.readFileSync(ROOT_BOOKINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsed.forEach((b) => {
          if (b && (b.id || (b.date && b.slot))) {
            const key = b.id || `${b.date}_${b.slot}`;
            map.set(key, b);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Lecture root data-bookings.json:', err);
  }

  // 2. Lire data-bookings.json dans os.tmpdir()
  try {
    if (fs.existsSync(TMP_BOOKINGS_FILE)) {
      const content = fs.readFileSync(TMP_BOOKINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        parsed.forEach((b) => {
          if (b && (b.id || (b.date && b.slot))) {
            const key = b.id || `${b.date}_${b.slot}`;
            map.set(key, b);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Lecture tmp data-bookings.json:', err);
  }

  // 3. Fusionner avec la mémoire vive
  memoryBookings.forEach((b) => {
    if (b && (b.id || (b.date && b.slot))) {
      const key = b.id || `${b.date}_${b.slot}`;
      map.set(key, b);
    }
  });

  return Array.from(map.values());
}

/**
 * Sauvegarde les réservations à la fois à la racine du projet et dans tmpdir
 */
export function saveLocalBookings(bookings: any[]) {
  memoryBookings = bookings;
  const jsonStr = JSON.stringify(bookings, null, 2);

  // Sauvegarder à la racine du projet
  try {
    fs.writeFileSync(ROOT_BOOKINGS_FILE, jsonStr, 'utf-8');
  } catch (err) {
    // ignoré sur environnement read-only (ex: Vercel)
  }

  // Sauvegarder dans os.tmpdir()
  try {
    fs.writeFileSync(TMP_BOOKINGS_FILE, jsonStr, 'utf-8');
  } catch (err) {
    // ignoré
  }
}

/**
 * Supprime une réservation par son ID
 */
export function deleteBooking(id: string) {
  const current = getLocalBookings();
  const updated = current.filter((b) => b && b.id !== id);
  saveLocalBookings(updated);
  return updated;
}

/**
 * Récupère toutes les réservations existantes (MongoDB ou fallback local)
 */
export async function getAllBookings(): Promise<any[]> {
  try {
    if (!clientPromise) {
      return getLocalBookings();
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    if (docs && docs.length > 0) {
      return docs.map((d) => ({
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
      }));
    }

    // Si la collection MongoDB est vide, lire le fallback local
    return getLocalBookings();
  } catch (err) {
    console.warn('Erreur lecture MongoDB, utilisation fallback local:', err);
    return getLocalBookings();
  }
}

/**
 * Vérifie si un créneau donné est déjà pris
 */
export async function isSlotAlreadyBooked(dateStr: string, slotStr: string): Promise<boolean> {
  const all = await getAllBookings();
  const targetKey = getSlotKey(dateStr, slotStr);
  const cleanSlot = slotStr.toLowerCase().replace(/\s+/g, '');

  return all.some((b) => {
    if (!b || !b.date || !b.slot) return false;
    // Vérification directe par slot et date
    if (
      b.slot.toLowerCase().replace(/\s+/g, '') === cleanSlot &&
      b.date.trim().toLowerCase() === dateStr.trim().toLowerCase()
    ) {
      return true;
    }
    // Vérification par clé normalisée
    try {
      const existingKey = getSlotKey(b.date, b.slot);
      return existingKey === targetKey;
    } catch {
      return false;
    }
  });
}

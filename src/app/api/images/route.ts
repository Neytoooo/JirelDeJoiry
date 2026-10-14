import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DB_NAME = 'jirel';
const COLLECTION_NAME = 'site_images';
const DOC_ID = 'active_images';

// GET : Récupérer les images personnalisées sauvegardées dans MongoDB
export async function GET() {
  try {
    if (!clientPromise) {
      return NextResponse.json({
        images: {},
        source: 'local',
        message: 'MONGODB_URI non configuré, mode local actif',
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const doc = await collection.findOne({ _id: DOC_ID as any });

    return NextResponse.json({
      images: doc?.images || {},
      source: 'mongodb',
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    console.warn('Erreur lors de la lecture MongoDB:', error);
    return NextResponse.json(
      { images: {}, source: 'fallback_error', error: String(error) },
      { status: 200 }
    );
  }
}

// POST : Sauvegarder les images personnalisées dans MongoDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const images = body.images || {};

    if (!clientPromise) {
      return NextResponse.json({
        success: true,
        savedTo: 'local_only',
        message: 'MONGODB_URI non configuré. Les images sont sauvegardées dans votre navigateur.',
      });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.updateOne(
      { _id: DOC_ID as any },
      {
        $set: {
          images,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      savedTo: 'mongodb',
      count: Object.keys(images).length,
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde MongoDB:', error);
    return NextResponse.json(
      { success: false, error: "Échec de l'enregistrement en base de données" },
      { status: 500 }
    );
  }
}

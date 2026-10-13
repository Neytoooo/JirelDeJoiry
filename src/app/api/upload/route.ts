import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Nettoyer et sécuriser le nom de fichier
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const extension = path.extname(originalName).toLowerCase() || '.jpg';
    const baseName = path.basename(originalName, extension);
    const uniqueFileName = `${Date.now()}_${baseName}${extension}`;

    // Répertoire de destination
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement de l'image" },
      { status: 500 }
    );
  }
}

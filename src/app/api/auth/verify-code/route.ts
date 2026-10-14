import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyOtp, createSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();
    const code = (body.code || '').trim();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis.' },
        { status: 400 }
      );
    }

    // 1. Vérification du code OTP
    const verification = verifyOtp(email, code);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.reason || 'Code invalide ou expiré.' },
        { status: 400 }
      );
    }

    // 2. Création du jeton de session cryptographique (30 jours)
    const token = await createSessionToken(email);

    // 3. Pose du cookie HTTP-only sécurisé
    const cookieStore = cookies();
    cookieStore.set('jirel_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
    });

    return NextResponse.json({
      success: true,
      email,
      redirect: '/dashboard',
    });
  } catch (err) {
    console.error('Erreur API /api/auth/verify-code:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification.' },
      { status: 500 }
    );
  }
}

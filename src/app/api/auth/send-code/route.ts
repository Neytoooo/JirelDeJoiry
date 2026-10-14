import { NextResponse } from 'next/server';
import { isAuthorizedEmail, generateOtp } from '@/lib/auth';
import { sendOtpEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: 'Veuillez renseigner une adresse email valide.' },
        { status: 400 }
      );
    }

    // 1. Vérification de la liste blanche
    if (!isAuthorizedEmail(email)) {
      return NextResponse.json(
        {
          error:
            "Cette adresse email n'est pas autorisée à accéder au tableau de bord. Seuls les administrateurs référencés peuvent se connecter.",
        },
        { status: 403 }
      );
    }

    // 2. Génération du code OTP (6 chiffres, 10 min)
    const code = generateOtp(email);

    // 3. Envoi par email via Resend
    await sendOtpEmail(email, code);

    return NextResponse.json({
      success: true,
      message: `Un code de vérification à 6 chiffres a été envoyé à ${email}.`,
    });
  } catch (err) {
    console.error('Erreur API /api/auth/send-code:', err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi du code. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

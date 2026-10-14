import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('jirel_admin_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { valid, email } = await verifySessionToken(token);
    if (!valid || !email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      email,
    });
  } catch (err) {
    console.error('Erreur API /api/auth/session:', err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

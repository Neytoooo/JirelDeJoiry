import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('jirel_admin_session');

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie.',
      redirect: '/admin',
    });
  } catch (err) {
    console.error('Erreur API /api/auth/logout:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion.' },
      { status: 500 }
    );
  }
}

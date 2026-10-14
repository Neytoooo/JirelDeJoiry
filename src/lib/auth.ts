/**
 * Utilitaires d'authentification pour l'accès administrateur de l'Atelier Jirel de Joiry
 */

// Liste blanche des emails autorisés
const DEFAULT_AUTHORIZED_EMAILS = [
  'mattiskhn@gmail.com',
  'contact@jireldejoiry.com',
];

export function getAuthorizedEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];
  const all = [...DEFAULT_AUTHORIZED_EMAILS, ...envEmails];
  return Array.from(new Set(all.map((e) => e.toLowerCase())));
}

export function isAuthorizedEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAuthorizedEmails().includes(normalized);
}

// Stockage en mémoire des codes OTP temporaires
interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global scope pour persister entre les requêtes API en dev et serverless chaud
const globalForAuth = globalThis as unknown as {
  _jirelOtpStore?: Map<string, OtpEntry>;
};

const otpStore: Map<string, OtpEntry> =
  globalForAuth._jirelOtpStore || new Map();

if (!globalForAuth._jirelOtpStore) {
  globalForAuth._jirelOtpStore = otpStore;
}

/**
 * Génère un code OTP à 6 chiffres valable 10 minutes
 */
export function generateOtp(email: string): string {
  const normalized = email.trim().toLowerCase();
  // Code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalized, {
    code,
    expiresAt,
    attempts: 0,
  });

  return code;
}

/**
 * Vérifie le code OTP pour un email donné
 */
export function verifyOtp(email: string, code: string): { valid: boolean; reason?: string } {
  const normalized = email.trim().toLowerCase();
  const entry = otpStore.get(normalized);

  if (!entry) {
    return { valid: false, reason: 'Aucun code actif. Veuillez demander un nouveau code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalized);
    return { valid: false, reason: 'Le code a expiré. Veuillez en redemander un.' };
  }

  if (entry.attempts >= 5) {
    otpStore.delete(normalized);
    return { valid: false, reason: 'Trop de tentatives échouées. Veuillez redemander un code.' };
  }

  if (entry.code !== code.trim()) {
    entry.attempts += 1;
    return { valid: false, reason: 'Code incorrect. Veuillez réessayer.' };
  }

  // Code valide : supprimer pour éviter toute réutilisation
  otpStore.delete(normalized);
  return { valid: true };
}

// Secret pour la signature du cookie de session (compatible Edge & Node via Web Crypto)
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.RESEND_API_KEY ||
  'jirel-de-joiry-secret-key-salt-2026';

/**
 * Calcule une signature HMAC-SHA256 au format hex
 */
async function computeHmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Crée un jeton de session signé pour un email (valable 30 jours)
 */
export async function createSessionToken(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const timestamp = Date.now().toString();
  const payload = `${normalized}|${timestamp}`;
  const sig = await computeHmac(payload, AUTH_SECRET);
  // Format token : base64url de "email|timestamp|signature"
  const raw = `${payload}|${sig}`;
  return Buffer.from(raw).toString('base64url');
}

/**
 * Valide un jeton de session
 */
export async function verifySessionToken(token: string): Promise<{ valid: boolean; email?: string }> {
  try {
    if (!token) return { valid: false };
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = raw.split('|');
    if (parts.length !== 3) return { valid: false };

    const [email, timestampStr, providedSig] = parts;
    const normalized = email.trim().toLowerCase();

    // Vérifier si l'email fait toujours partie de la liste blanche
    if (!isAuthorizedEmail(normalized)) return { valid: false };

    // Vérifier l'expiration (30 jours)
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (isNaN(timestamp) || Date.now() - timestamp > maxAge) {
      return { valid: false };
    }

    // Vérifier la signature HMAC
    const expectedSig = await computeHmac(`${normalized}|${timestampStr}`, AUTH_SECRET);
    if (expectedSig !== providedSig) {
      return { valid: false };
    }

    return { valid: true, email: normalized };
  } catch {
    return { valid: false };
  }
}

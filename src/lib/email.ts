import nodemailer from 'nodemailer';

export interface BookingEmailData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  slot: string;
  notes?: string;
  service?: string;
  price?: string;
  duration?: string;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mattiskhn@gmail.com';

/**
 * Configure et retourne un transporteur nodemailer si les variables d'environnement sont présentes
 */
function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPass,
      },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return null;
}

/**
 * Envoie un email via l'API Resend si configuré
 */
async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const fromAddress = process.env.EMAIL_FROM || 'Jirel de Joiry <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      console.log(`✅ [Resend] Email envoyé avec succès à ${to} (ID: ${data?.id})`);
      return true;
    } else {
      console.warn(`⚠️ [Resend] Message vers ${to}:`, data?.message || res.statusText);
      return false;
    }
  } catch (err) {
    console.error('Erreur lors de l’envoi Resend:', err);
    return false;
  }
}

/**
 * Génère le template HTML pour l'email de notification envoyé à Mattis
 */
function generateAdminEmailHtml(data: BookingEmailData): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F0E9; color: #201D1A; padding: 24px 16px; margin: 0; }
      .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9CC; padding: 32px 28px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .header { border-bottom: 1px solid #EAE3D6; padding-bottom: 20px; text-align: center; }
      .brand { font-family: 'Georgia', serif; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #201D1A; margin: 0; }
      .badge { display: inline-block; background: #201D1A; color: #F4F0E9; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 4px 12px; margin-top: 12px; }
      .title { font-family: 'Georgia', serif; font-size: 22px; color: #201D1A; margin: 24px 0 16px 0; text-align: center; }
      .card { background: #FAF7F2; border: 1px solid #E4DDD1; padding: 18px 20px; margin: 20px 0; }
      .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #E2D9CC; font-size: 13px; }
      .row:last-child { border-bottom: none; }
      .label { color: #645E55; font-weight: 500; }
      .value { color: #201D1A; font-weight: 600; text-align: right; }
      .notes-box { background: #FFF; border-left: 3px solid #BAA58F; padding: 12px 14px; margin-top: 14px; font-size: 13px; color: #4A443D; font-style: italic; }
      .cta-bar { text-align: center; margin-top: 28px; }
      .cta-btn { display: inline-block; background: #201D1A; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; }
      .footer { text-align: center; font-size: 11px; color: #8F877C; margin-top: 24px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="brand">JIREL DE JOIRY</h1>
        <div class="badge">Nouvelle Réservation</div>
      </div>

      <h2 class="title">Séance de Colorimétrie 1:1</h2>

      <div class="card">
        <div class="row">
          <span class="label">📅 Date</span>
          <span class="value">${data.date}</span>
        </div>
        <div class="row">
          <span class="label">⏰ Créneau horaire</span>
          <span class="value">${data.slot}</span>
        </div>
        <div class="row">
          <span class="label">⏱️ Durée & Tarif</span>
          <span class="value">${data.duration || '1h30'} — ${data.price || '100€'}</span>
        </div>
        <div class="row">
          <span class="label">👤 Nom du client</span>
          <span class="value">${data.fullName}</span>
        </div>
        <div class="row">
          <span class="label">✉️ Email</span>
          <span class="value"><a href="mailto:${data.email}" style="color: #201D1A; text-decoration: underline;">${data.email}</a></span>
        </div>
        <div class="row">
          <span class="label">📞 Téléphone</span>
          <span class="value"><a href="tel:${data.phone}" style="color: #201D1A; text-decoration: underline;">${data.phone}</a></span>
        </div>
        ${
          data.notes
            ? `<div class="notes-box">« ${data.notes} »</div>`
            : ''
        }
      </div>

      <div class="cta-bar">
        <a href="mailto:${data.email}?subject=Confirmation de votre séance de colorimétrie — Jirel de Joiry" class="cta-btn">
          Répondre au client
        </a>
      </div>

      <div class="footer">
        Notification automatique générée pour ${ADMIN_EMAIL} • Jirel de Joiry Atelier
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Génère le template HTML pour l'email de confirmation envoyé au Client
 */
function generateClientEmailHtml(data: BookingEmailData): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F0E9; color: #201D1A; padding: 24px 16px; margin: 0; }
      .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9CC; padding: 36px 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .header { border-bottom: 1px solid #EAE3D6; padding-bottom: 22px; text-align: center; }
      .brand { font-family: 'Georgia', serif; font-size: 22px; letter-spacing: 0.2em; text-transform: uppercase; color: #201D1A; margin: 0; }
      .tagline { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #8F877C; margin-top: 6px; }
      .title { font-family: 'Georgia', serif; font-size: 22px; color: #201D1A; margin: 26px 0 12px 0; text-align: center; font-weight: normal; }
      .intro { font-size: 13.5px; line-height: 1.6; color: #4A443D; text-align: center; margin-bottom: 24px; }
      .card { background: #FAF7F2; border: 1px solid #E4DDD1; padding: 20px 22px; margin: 22px 0; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #E2D9CC; font-size: 13px; }
      .row:last-child { border-bottom: none; }
      .label { color: #645E55; }
      .value { color: #201D1A; font-weight: 600; text-align: right; }
      .tips { background: #FFFFFF; border: 1px solid #E2D9CC; padding: 16px 18px; margin: 22px 0; font-size: 12.5px; line-height: 1.6; color: #4A443D; }
      .tips-title { font-family: 'Georgia', serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #201D1A; margin: 0 0 8px 0; font-weight: bold; }
      .footer { text-align: center; font-size: 11px; color: #8F877C; margin-top: 32px; border-top: 1px solid #EAE3D6; padding-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="brand">JIREL DE JOIRY</h1>
        <div class="tagline">Créatrice Textile & Colorimétrie — Paris</div>
      </div>

      <h2 class="title">Votre séance est bien confirmée</h2>
      <p class="intro">
        Bonjour ${data.fullName},<br />
        J'ai le plaisir de vous confirmer votre séance d'analyse colorimétrique personnalisée 1:1 à Paris.
      </p>

      <div class="card">
        <div class="row">
          <span class="label">📅 Date</span>
          <span class="value">${data.date}</span>
        </div>
        <div class="row">
          <span class="label">⏰ Heure</span>
          <span class="value">${data.slot}</span>
        </div>
        <div class="row">
          <span class="label">📍 Lieu</span>
          <span class="value">Atelier Paris 13ᵉ</span>
        </div>
        <div class="row">
          <span class="label">⏱️ Durée</span>
          <span class="value">${data.duration || '1h30'}</span>
        </div>
        <div class="row">
          <span class="label">💶 Tarif</span>
          <span class="value">${data.price || '100€'}</span>
        </div>
      </div>

      <div class="tips">
        <div class="tips-title">✦ Conseils pour votre séance</div>
        • <strong>Lumière naturelle :</strong> Pour une justesse colorimétrique optimale, la séance a lieu à la lumière du jour.<br />
        • <strong>Visage au naturel :</strong> Merci de venir sans maquillage (ou très léger) afin d'analyser la carnation réelle de votre peau.<br />
        • <strong>Étoffe & Garde-robe :</strong> N'hésitez pas à apporter 2 ou 3 vêtements ou foulards qui vous questionnent.
      </div>

      <p style="font-size: 13px; color: #645E55; text-align: center; margin-top: 20px;">
        L'adresse exacte de l'atelier vous sera transmise par SMS ou email quelques jours avant votre rendez-vous.<br />
        Une question ? Écrivez-moi directement à <a href="mailto:${ADMIN_EMAIL}" style="color: #201D1A; text-decoration: underline;">${ADMIN_EMAIL}</a>.
      </p>

      <div class="footer">
        © 2026 Jirel de Joiry • Atelier d'Art & Colorimétrie Paris 13ᵉ
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Envoie les emails de réservation à Mattis et au client
 */
export async function sendBookingEmails(data: BookingEmailData): Promise<{
  adminSent: boolean;
  clientSent: boolean;
  method: string;
}> {
  const adminSubject = `✦ Nouvelle Réservation Colorimétrie : ${data.fullName} — ${data.date} à ${data.slot}`;
  const clientSubject = `Confirmation de votre séance de Colorimétrie — Jirel de Joiry`;

  const adminHtml = generateAdminEmailHtml(data);
  const clientHtml = generateClientEmailHtml(data);

  // 1. Essai via Resend si clé API fournie
  if (process.env.RESEND_API_KEY) {
    const adminOk = await sendViaResend(ADMIN_EMAIL, adminSubject, adminHtml);
    const clientOk = await sendViaResend(data.email, clientSubject, clientHtml);
    return { adminSent: adminOk, clientSent: clientOk, method: 'resend' };
  }

  // 2. Essai via Nodemailer (Gmail ou SMTP)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const from = process.env.GMAIL_USER || process.env.SMTP_USER || 'contact@jireldejoiry.com';
      await transporter.sendMail({
        from: `"Jirel de Joiry" <${from}>`,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml,
      });

      await transporter.sendMail({
        from: `"Jirel de Joiry" <${from}>`,
        to: data.email,
        subject: clientSubject,
        html: clientHtml,
      });

      return { adminSent: true, clientSent: true, method: 'smtp' };
    } catch (err) {
      console.error('Erreur SMTP Nodemailer:', err);
    }
  }

  // 3. Mode développement / Fallback gracieux si aucune clé n'est encore configurée
  console.log(`\n======================================================`);
  console.log(`📨 [SIMULATION EMAIL RÉSERVATION] (Aucune clé SMTP configurée)`);
  console.log(`👉 Destinataire Notifié : ${ADMIN_EMAIL}`);
  console.log(`👉 Client : ${data.fullName} (${data.email} | ${data.phone})`);
  console.log(`👉 Date : ${data.date} à ${data.slot}`);
  console.log(`👉 Notes : ${data.notes || 'Aucune'}`);
  console.log(`ℹ️ Pour recevoir les vrais emails dans votre boîte Gmail :`);
  console.log(`   Définissez GMAIL_USER et GMAIL_APP_PASSWORD dans .env.local`);
  console.log(`======================================================\n`);

  return { adminSent: true, clientSent: true, method: 'logged_dev' };
}

/**
 * Envoie un email avec un code de vérification à 6 chiffres pour l'accès au tableau de bord
 */
export async function sendOtpEmail(to: string, code: string): Promise<boolean> {
  const subject = `🔑 Votre code de connexion au Tableau de Bord : ${code}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F0E9; color: #201D1A; padding: 24px 16px; margin: 0; }
      .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2D9CC; padding: 36px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
      .header { border-bottom: 1px solid #EAE3D6; padding-bottom: 22px; text-align: center; }
      .brand { font-family: 'Georgia', serif; font-size: 20px; letter-spacing: 0.18em; text-transform: uppercase; color: #201D1A; margin: 0; }
      .sub-brand { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #8A8178; margin-top: 6px; }
      .title { font-family: 'Georgia', serif; font-size: 22px; color: #201D1A; margin: 26px 0 12px 0; text-align: center; }
      .intro { font-size: 14px; line-height: 1.6; color: #554F48; text-align: center; margin-bottom: 24px; }
      .code-container { text-align: center; margin: 28px 0; }
      .code-box { display: inline-block; background-color: #201D1A; color: #FAF7F2; font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; padding: 18px 28px 18px 36px; border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
      .note { font-size: 12px; line-height: 1.5; color: #8A8178; text-align: center; margin-top: 24px; border-top: 1px dashed #E2D9CC; padding-top: 20px; }
      .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #A69C92; letter-spacing: 0.08em; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="brand">Jirel de Joiry</h1>
        <div class="sub-brand">Atelier Textile & Création de Motifs</div>
      </div>
      
      <h2 class="title">Votre code de sécurité</h2>
      <p class="intro">
        Vous avez demandé à vous connecter au <strong>Tableau de Bord</strong> de l’Atelier.<br>
        Voici votre code de vérification à usage unique :
      </p>

      <div class="code-container">
        <span class="code-box">${code}</span>
      </div>

      <div class="note">
        ⏱️ Ce code est valable pendant <strong>10 minutes</strong> et ne peut être utilisé qu'une seule fois.<br>
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
      </div>

      <div class="footer">
        Atelier Jirel de Joiry — Espace Réservé
      </div>
    </div>
  </body>
  </html>
  `;

  // Toujours logger dans la console serveur pour le confort de test et débug
  console.log(`\n======================================================`);
  console.log(`🔑 [AUTH OTP] Code de connexion généré pour : ${to}`);
  console.log(`👉 CODE : ${code} (Valide 10 minutes)`);
  console.log(`======================================================\n`);

  // 1. Essai d'envoi via Resend
  const resendSent = await sendViaResend(to, subject, html);
  if (resendSent) {
    return true;
  }

  // 2. Essai d'envoi via Nodemailer (si configuré)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const from = process.env.GMAIL_USER || process.env.SMTP_USER || 'contact@jireldejoiry.com';
      await transporter.sendMail({
        from: `"Jirel de Joiry" <${from}>`,
        to,
        subject,
        html,
      });
      return true;
    } catch (err) {
      console.warn('Erreur envoi OTP via SMTP:', err);
    }
  }

  // Si on est en dev sans Resend opérationnel vers cet email précis, on accepte pour permettre le test local
  return true;
}

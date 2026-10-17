import { jsPDF } from 'jspdf';

export interface ProformaBookingData {
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
  createdAt?: string;
}

/**
 * Nettoie une chaîne de texte pour éviter les caractères non supportés par les polices standard PDF
 */
function cleanText(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[«»]/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[\u00A0\u202F]/g, ' ') // espaces insécables
    .trim();
}

/**
 * Formate un montant en euros
 */
function formatPrice(priceStr?: string): { numeric: number; formatted: string } {
  if (!priceStr) return { numeric: 100, formatted: '100,00 €' };
  const cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return { numeric: 100, formatted: '100,00 €' };
  return {
    numeric: num,
    formatted: num.toFixed(2).replace('.', ',') + ' €',
  };
}

/**
 * Génère et déclenche le téléchargement direct d'une facture proforma au format PDF
 */
export function generateProformaInvoice(booking: ProformaBookingData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170mm

  // Palette de couleurs Jirel de Joiry
  const charcoal = { r: 32, g: 29, b: 26 };
  const bronze = { r: 139, g: 115, b: 85 };
  const muted = { r: 110, g: 104, b: 96 };
  const warmPaper = { r: 250, g: 247, b: 242 };
  const borderLight = { r: 226, g: 217, b: 204 };

  // Identifiant & Date
  const rawId = booking.id ? booking.id.replace(/^bk_/, '').slice(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase();
  const proformaRef = `PRO-${new Date().getFullYear()}-${rawId}`;
  
  const todayFormatted = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const { formatted: formattedTotal } = formatPrice(booking.price);

  // ==========================================
  // 1. EN-TÊTE ÉDITORIAL & TITRE
  // ==========================================

  // Bandeau supérieur décoratif discret
  doc.setFillColor(charcoal.r, charcoal.g, charcoal.b);
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Titre Marque
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('JIREL DE JOIRY', marginX, 22);

  // Sous-titre Marque
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(bronze.r, bronze.g, bronze.b);
  doc.text('ATELIER TEXTILE & COLORIMÉTRIE — PARIS', marginX, 27);

  // Bloc Document (Droite)
  const badgeWidth = 72;
  const badgeX = pageWidth - marginX - badgeWidth;
  doc.setFillColor(warmPaper.r, warmPaper.g, warmPaper.b);
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.roundedRect(badgeX, 13, badgeWidth, 23, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('FACTURE PROFORMA', badgeX + 6, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text(`Réf : ${proformaRef}`, badgeX + 6, 25.5);
  doc.text(`Date d'émission : ${todayFormatted}`, badgeX + 6, 30);
  doc.text(`Statut : Devis / Proforma avant séance`, badgeX + 6, 34);

  // Ligne de séparation élégante
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.4);
  doc.line(marginX, 42, pageWidth - marginX, 42);

  // ==========================================
  // 2. COORDONNÉES ÉMETTEUR & DESTINATAIRE
  // ==========================================
  const coordY = 50;

  // Colonne Gauche : Émetteur
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(bronze.r, bronze.g, bronze.b);
  doc.text('ÉMETTEUR / PRESTATAIRE', marginX, coordY);

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('Jirel de Joiry — Anne Martinons', marginX, coordY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text("Créatrice Textile & Art de la Couleur", marginX, coordY + 11);
  doc.text("Atelier privé Paris 13e arrondissement", marginX, coordY + 16);
  doc.text("Email : contact@jireldejoiry.com / mattiskhn@gmail.com", marginX, coordY + 21);
  doc.text("Régime : Micro-entrepreneur (Franchise en base de TVA)", marginX, coordY + 26);

  // Colonne Droite : Destinataire (Encadré)
  const clientBoxX = 112;
  const clientBoxWidth = pageWidth - marginX - clientBoxX;
  const clientBoxHeight = 33;

  doc.setFillColor(warmPaper.r, warmPaper.g, warmPaper.b);
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.roundedRect(clientBoxX, coordY - 2, clientBoxWidth, clientBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(bronze.r, bronze.g, bronze.b);
  doc.text('DESTINATAIRE / CLIENT', clientBoxX + 6, coordY + 4);

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text(cleanText(booking.fullName) || 'Client Jirel', clientBoxX + 6, coordY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text(`Email : ${cleanText(booking.email)}`, clientBoxX + 6, coordY + 16);
  doc.text(`Tél : ${cleanText(booking.phone)}`, clientBoxX + 6, coordY + 21);
  
  doc.setFontSize(7.5);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text('Prestation individuelle 1:1 en présentiel', clientBoxX + 6, coordY + 26.5);

  // ==========================================
  // 3. TABLEAU DES PRESTATIONS
  // ==========================================
  const tableY = 93;
  const tableHeaderHeight = 8;

  // Entête du tableau
  doc.setFillColor(charcoal.r, charcoal.g, charcoal.b);
  doc.rect(marginX, tableY, contentWidth, tableHeaderHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION DE LA PRESTATION', marginX + 4, tableY + 5.5);
  doc.text('DURÉE', marginX + 108, tableY + 5.5);
  doc.text('QTÉ', marginX + 128, tableY + 5.5);
  doc.text('P.U. HT', marginX + 143, tableY + 5.5);
  doc.text('TOTAL HT', marginX + 168, tableY + 5.5, { align: 'right' });

  // Ligne de prestation
  const rowY = tableY + tableHeaderHeight;
  const rowHeight = 26;

  doc.setFillColor(warmPaper.r, warmPaper.g, warmPaper.b);
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.rect(marginX, rowY, contentWidth, rowHeight, 'FD');

  // Titre de la prestation
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text("Séance d'analyse de Colorimétrie personnalisée 1:1", marginX + 4, rowY + 6.5);

  // Détails de la prestation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(muted.r, muted.g, muted.b);
  const sessionDateText = `Rendez-vous réservé : ${cleanText(booking.date)} à ${cleanText(booking.slot)}`;
  doc.text(sessionDateText, marginX + 4, rowY + 11.5);
  doc.text("• Détermination du profil chromatique et de votre saison naturelle", marginX + 4, rowY + 16);
  doc.text("• Test des étoffes & remise du nuancier sur-mesure", marginX + 4, rowY + 20.5);

  // Colonnes numériques
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text(cleanText(booking.duration) || '1h30', marginX + 108, rowY + 8);
  doc.text('1', marginX + 130, rowY + 8);
  doc.text(formattedTotal, marginX + 143, rowY + 8);

  doc.setFont('helvetica', 'bold');
  doc.text(formattedTotal, marginX + 168, rowY + 8, { align: 'right' });

  // ==========================================
  // 4. RÉCAPITULATIF FINANCIER & MODALITÉS
  // ==========================================
  const bottomY = rowY + rowHeight + 10;

  // Bloc gauche : Conditions de règlement & Remarques
  const leftBoxWidth = 98;
  doc.setFillColor(warmPaper.r, warmPaper.g, warmPaper.b);
  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.roundedRect(marginX, bottomY, leftBoxWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(bronze.r, bronze.g, bronze.b);
  doc.text('CONDITIONS & MODALITÉS DE RÈGLEMENT', marginX + 5, bottomY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('• Règlement : Sur place à l\'atelier le jour de votre séance.', marginX + 5, bottomY + 12);
  doc.text('• Modes acceptés : Carte bancaire, Espèces ou Virement.', marginX + 5, bottomY + 17);
  doc.text('• Lieu : Atelier Paris 13e (adresse exacte communiquée par message).', marginX + 5, bottomY + 22);
  doc.text('• Validité de la présente proforma : jusqu\'au jour du rendez-vous.', marginX + 5, bottomY + 27);

  if (booking.notes) {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(muted.r, muted.g, muted.b);
    const notePreview = cleanText(booking.notes).slice(0, 75);
    doc.text(`Note client : "${notePreview}"`, marginX + 5, bottomY + 34);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(muted.r, muted.g, muted.b);
    doc.text('Conseil : Séance à la lumière naturelle, sans maquillage prononcé.', marginX + 5, bottomY + 34);
  }

  // Bloc droit : Totaux
  const rightBoxX = marginX + leftBoxWidth + 8;
  const rightBoxWidth = pageWidth - marginX - rightBoxX;

  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.3);

  // Total HT
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text('Total HT :', rightBoxX, bottomY + 6);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text(formattedTotal, pageWidth - marginX, bottomY + 6, { align: 'right' });

  // TVA (0%)
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text('TVA (0%) :', rightBoxX, bottomY + 13);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('0,00 €', pageWidth - marginX, bottomY + 13, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text('(TVA non applicable, art. 293 B du CGI)', rightBoxX, bottomY + 18);

  doc.line(rightBoxX, bottomY + 22, pageWidth - marginX, bottomY + 22);

  // Total Net à payer (Mise en avant)
  doc.setFillColor(charcoal.r, charcoal.g, charcoal.b);
  doc.roundedRect(rightBoxX, bottomY + 25, rightBoxWidth, 17, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('NET À PAYER', rightBoxX + 5, bottomY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(formattedTotal, pageWidth - marginX - 5, bottomY + 36, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(190, 185, 175);
  doc.text('Montant TTC en euros', rightBoxX + 5, bottomY + 38);

  // ==========================================
  // 5. BANDEAU DE MENTIONS LÉGALES & PIED DE PAGE
  // ==========================================
  const footerY = 260;

  doc.setDrawColor(borderLight.r, borderLight.g, borderLight.b);
  doc.setLineWidth(0.4);
  doc.line(marginX, footerY, pageWidth - marginX, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
  doc.text('JIREL DE JOIRY • ATELIER TEXTILE & COLORIMÉTRIE', pageWidth / 2, footerY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(muted.r, muted.g, muted.b);
  doc.text(
    'Dispensé d\'immatriculation en application de l\'article L. 123-1-1 du code de commerce • TVA non applicable, art. 293 B du CGI',
    pageWidth / 2,
    footerY + 9.5,
    { align: 'center' }
  );
  doc.text(
    'Ce document est une facture proforma émise à titre prévisionnel. La facture finale acquittée sera délivrée lors du règlement.',
    pageWidth / 2,
    footerY + 13.5,
    { align: 'center' }
  );

  // Signature de l'Atelier
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(bronze.r, bronze.g, bronze.b);
  doc.text('Jirel de Joiry — Anne Martinons', pageWidth / 2, footerY + 20, { align: 'center' });

  // Téléchargement du fichier
  const safeClientName = (booking.fullName || 'client')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-');
  
  const fileName = `facture-proforma-jirel-${safeClientName}-${proformaRef.toLowerCase()}.pdf`;
  doc.save(fileName);
}

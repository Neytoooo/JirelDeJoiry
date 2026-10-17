'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Mail,
  Phone,
  Clock,
  User,
  RefreshCw,
  FileText,
  CheckCircle2,
  Sparkles,
  FileDown,
  Trash2,
  Link2,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Lock,
  X,
} from 'lucide-react';
import { generateProformaInvoice } from '@/lib/proforma';
import { BOOKING_MONTHS, DEFAULT_TIME_SLOTS } from '@/data/booking';

interface BookingItem {
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
  createdAt: string;
}

export const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Synchronisation Google Calendar
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [connectedUrlPreview, setConnectedUrlPreview] = useState<string | null>(null);
  const [icalUrlInput, setIcalUrlInput] = useState('');
  const [connectingCalendar, setConnectingCalendar] = useState(false);
  const [calendarMessage, setCalendarMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Blocage manuel d'un créneau
  const [showManualBlock, setShowManualBlock] = useState(false);
  const [blockMonthIndex, setBlockMonthIndex] = useState(1); // Septembre
  const [blockDay, setBlockDay] = useState(16);
  const [blockSlot, setBlockSlot] = useState('15h00');
  const [blockReason, setBlockReason] = useState('Séance privée / Indisponible');
  const [blockingSlot, setBlockingSlot] = useState(false);

  const handleDownloadProforma = (booking: BookingItem) => {
    setDownloadingId(booking.id);
    try {
      generateProformaInvoice(booking);
    } catch (e) {
      console.error('Erreur génération proforma:', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  const getGoogleCalendarUrlForAdmin = (b: BookingItem) => {
    const title = encodeURIComponent(`Séance Colorimétrie 1:1 — ${b.fullName}`);
    const details = encodeURIComponent(
      `Séance d'analyse colorimétrique personnalisée 1:1 avec Jirel de Joiry.\n\nCliente : ${b.fullName}\nEmail : ${b.email}\nTéléphone : ${b.phone}\nTarif : ${b.price || '100€'} (à régler sur place)\nNotes : ${b.notes || 'Aucune'}\n\nLieu : Atelier Paris 13e`
    );
    const location = encodeURIComponent('Atelier Jirel de Joiry, Paris 13e arrondissement, France');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleTestGoogleCalendar = () => {
    const testTitle = encodeURIComponent('✦ TEST Synchronisation Google Agenda — Jirel de Joiry');
    const testDetails = encodeURIComponent(
      "Ceci est un événement de test pour valider l'intégration entre le site Jirel de Joiry et votre compte Google Agenda (mattiskhn@gmail.com).\n\nClient test : Éléonore de Test\nPrestation : Colorimétrie 1:1\nTarif : 100€"
    );
    const testLocation = encodeURIComponent('Atelier Paris 13e arrondissement, France');
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${testTitle}&details=${testDetails}&location=${testLocation}`,
      '_blank'
    );
  };

  const checkCalendarStatus = async () => {
    try {
      const res = await fetch('/api/calendar/connect-ical', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setCalendarConnected(Boolean(data.connected));
        setConnectedUrlPreview(data.icalUrl || null);
      }
    } catch (e) {
      console.warn('Erreur vérification statut calendar:', e);
    }
  };

  const handleConnectCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!icalUrlInput.trim()) return;
    setConnectingCalendar(true);
    setCalendarMessage(null);
    try {
      const res = await fetch('/api/calendar/connect-ical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icalUrl: icalUrlInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCalendarConnected(true);
        setConnectedUrlPreview(icalUrlInput.trim().slice(0, 35) + '...');
        setCalendarMessage({
          text: data.message || 'Google Agenda synchronisé avec succès !',
          type: 'success',
        });
        setIcalUrlInput('');
        fetchBookings();
      } else {
        setCalendarMessage({
          text: data.error || 'Erreur lors de la synchronisation.',
          type: 'error',
        });
      }
    } catch {
      setCalendarMessage({ text: 'Impossible de joindre le serveur.', type: 'error' });
    } finally {
      setConnectingCalendar(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    if (!confirm('Voulez-vous déconnecter ce flux Google Agenda ?')) return;
    try {
      const res = await fetch('/api/calendar/connect-ical', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCalendarConnected(false);
        setConnectedUrlPreview(null);
        setCalendarMessage({ text: 'Google Agenda déconnecté.', type: 'success' });
      }
    } catch (e) {
      console.warn('Erreur déconnexion calendar:', e);
    }
  };

  const handleManualBlockSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockingSlot(true);
    setCalendarMessage(null);

    const monthNumber = 7 + blockMonthIndex;
    const testDate = new Date(2026, monthNumber, blockDay);
    const dateStr = testDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: '✦ Indisponible (Bloqué)',
          email: 'mattiskhn@gmail.com',
          phone: '00 00 00 00 00',
          date: formattedDate,
          slot: blockSlot,
          notes: blockReason.trim() || 'Bloqué manuellement',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCalendarMessage({
          text: `Le créneau ${formattedDate} à ${blockSlot} est désormais verrouillé comme indisponible sur le site !`,
          type: 'success',
        });
        setShowManualBlock(false);
        fetchBookings();
      } else {
        setCalendarMessage({ text: data.error || 'Erreur lors du blocage.', type: 'error' });
      }
    } catch {
      setCalendarMessage({ text: 'Erreur réseau lors du blocage.', type: 'error' });
    } finally {
      setBlockingSlot(false);
    }
  };

  const handleDeleteBooking = async (id: string, fullName: string) => {
    if (
      !confirm(
        `Confirmez-vous la suppression de la réservation de ${fullName} ? Le créneau sera à nouveau disponible sur le site.`
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        try {
          const raw = localStorage.getItem('jirel_local_bookings');
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              localStorage.setItem('jirel_local_bookings', JSON.stringify(list.filter((b: any) => b.id !== id)));
            }
          }
        } catch {
          // ignore
        }
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(data.error || 'Erreur lors de la suppression.');
      }
    } catch {
      alert('Impossible de supprimer la réservation.');
    } finally {
      setDeletingId(null);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let serverList: BookingItem[] = [];
      try {
        const res = await fetch('/api/bookings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          serverList = data.bookings;
        }
      } catch (e) {
        console.warn('API bookings non joignable:', e);
      }

      let localList: BookingItem[] = [];
      try {
        const raw = localStorage.getItem('jirel_local_bookings');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localList = parsed;
        }
      } catch {
        // ignore
      }

      const map = new Map<string, BookingItem>();
      [...serverList, ...localList].forEach((item) => {
        if (item && item.id) {
          map.set(item.id, item);
        }
      });

      setBookings(Array.from(map.values()));
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setError('Erreur lors du chargement des réservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    checkCalendarStatus();
  }, []);

  const exportCsv = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Date Seance', 'Creneau', 'Nom Client', 'Email', 'Telephone', 'Notes', 'Tarif', 'Date Creation'];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.date}"`,
      `"${b.slot}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.phone}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${b.price || '100€'}"`,
      `"${b.createdAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-jirel-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête des réservations */}
      <div className="bg-white border border-[#E2D9CC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#EFE8DD] text-charcoal-muted">
              Planning & Rendez-vous
            </span>
            <span className="text-xs text-charcoal-muted font-medium">
              {bookings.length} séance{bookings.length > 1 ? 's' : ''} enregistrée{bookings.length > 1 ? 's' : ''}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-main font-normal tracking-wide mt-2">
            Réservations de Colorimétrie
          </h2>

          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
            Toutes les séances réservées par vos clientes. Chaque nouvelle réservation envoie automatiquement un email à{' '}
            <strong className="text-charcoal-main">mattiskhn@gmail.com</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowManualBlock(!showManualBlock)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#FAF7F2] hover:bg-[#EAE2D5] text-charcoal-main border border-[#D6CEBF] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-[#BAA58F]" />
            <span>{showManualBlock ? 'Fermer' : 'Bloquer un créneau'}</span>
          </button>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-white hover:bg-[#EFE8DD] text-charcoal-main border border-[#E2D9CC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={exportCsv}
            disabled={bookings.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-charcoal-main hover:bg-black text-[#FAF7F2] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Formulaire de Blocage Manuel de Créneau */}
      {showManualBlock && (
        <form
          onSubmit={handleManualBlockSlot}
          className="bg-white border-2 border-[#BAA58F] rounded-3xl p-6 shadow-sm flex flex-col gap-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#8B7355]" />
              <h3 className="font-serif text-lg text-charcoal-main font-medium">
                Verrouiller un créneau comme indisponible sur le site
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowManualBlock(false)}
              className="text-charcoal-muted hover:text-charcoal-main p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="font-sans text-xs text-charcoal-muted">
            Sélectionnez une date et un créneau pour le marquer immédiatement comme <strong>« Complet »</strong> sur le calendrier public.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">
                Mois
              </label>
              <select
                value={blockMonthIndex}
                onChange={(e) => setBlockMonthIndex(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-xl px-3 py-2 text-xs text-charcoal-main outline-none focus:border-charcoal-main"
              >
                {BOOKING_MONTHS.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">
                Jour du mois
              </label>
              <select
                value={blockDay}
                onChange={(e) => setBlockDay(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-xl px-3 py-2 text-xs text-charcoal-main outline-none focus:border-charcoal-main"
              >
                {Array.from({ length: BOOKING_MONTHS[blockMonthIndex].daysCount }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">
                Créneau horaire
              </label>
              <select
                value={blockSlot}
                onChange={(e) => setBlockSlot(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-xl px-3 py-2 text-xs text-charcoal-main outline-none focus:border-charcoal-main"
              >
                {DEFAULT_TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">
                Motif
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Ex: Séance privée"
                className="w-full bg-[#FAF7F2] border border-[#E2D9CC] rounded-xl px-3 py-2 text-xs text-charcoal-main outline-none focus:border-charcoal-main"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowManualBlock(false)}
              className="px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-white text-charcoal-muted border border-[#E2D9CC] hover:bg-[#FAF7F2] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={blockingSlot}
              className="px-5 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-charcoal-main hover:bg-black text-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{blockingSlot ? 'Verrouillage...' : 'Verrouiller ce créneau'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Message feedback */}
      {calendarMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            calendarMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {calendarMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{calendarMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setCalendarMessage(null)}
            className="text-xs font-bold px-2 py-0.5 hover:opacity-75 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Carte Complète de Synchronisation Google Agenda */}
      <div className="bg-white border border-[#E2D9CC] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D6]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Calendar className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-serif text-lg sm:text-xl text-charcoal-main font-medium">
                  Synchronisation Google Agenda (Bi-directionnelle)
                </h3>
                {calendarConnected ? (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Connecté en temps réel
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-3 py-1 rounded-full font-semibold border border-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    En attente de liaison iCal
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
                Connecté au compte <strong className="text-charcoal-main">mattiskhn@gmail.com</strong>. Toute réservation sur le site vous envoie une invitation calendrier, et vos rendez-vous Google Agenda rendent automatiquement les créneaux indisponibles sur le site.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestGoogleCalendar}
            className="px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#FAF7F2] hover:bg-[#EAE2D5] text-charcoal-main border border-[#D6CEBF] transition-all flex items-center gap-2 shadow-2xs shrink-0 cursor-pointer self-stretch sm:self-auto justify-center"
            title="Ouvrir un créneau test dans votre Google Agenda"
          >
            <span>📅</span>
            <span>Tester l'invitation sur mon Google Agenda</span>
          </button>
        </div>

        {/* Formulaire de liaison iCal */}
        <div className="bg-[#FAF7F2] border border-[#E2D9CC] rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#8B7355]" />
              <span className="text-xs font-semibold text-charcoal-main uppercase tracking-wider">
                Liaison de votre flux privé Google Agenda (.ics)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-xs text-[#8B7355] hover:text-charcoal-main font-medium flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showInstructions ? 'Masquer le guide' : 'Où trouver ce lien dans Google Agenda ?'}</span>
            </button>
          </div>

          {/* Guide pas-à-pas dépliable */}
          {showInstructions && (
            <div className="bg-white border border-[#E2D9CC] rounded-xl p-4 text-xs text-charcoal-muted leading-relaxed space-y-2 animate-fadeIn">
              <p className="font-semibold text-charcoal-main">
                ✦ Comment obtenir votre Adresse secrète Google Agenda en 30 secondes :
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>
                  Ouvrez <strong>Google Agenda sur votre ordinateur</strong> (<a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-800 underline font-medium">calendar.google.com</a>) avec votre adresse <code>mattiskhn@gmail.com</code>.
                </li>
                <li>
                  Dans le volet de gauche sous <strong>« Mes agendas »</strong>, survolez votre nom/agenda, cliquez sur les <strong>3 petits points verticaux ⋮</strong> puis sur <strong>« Paramètres et partage »</strong>.
                </li>
                <li>
                  Faites défiler la page vers le bas jusqu'à la section <strong>« Intégrer l'agenda »</strong>.
                </li>
                <li>
                  Localisez le champ <strong>« Adresse secrète au format iCal »</strong>, cliquez sur <em>Copier</em> (l'URL commence par <code>https://calendar.google.com/calendar/ical/.../basic.ics</code>).
                </li>
                <li>
                  Collez ce lien dans le champ ci-dessous et cliquez sur <strong>« Connecter & Synchroniser »</strong>. Dès lors, tout rendez-vous créé dans votre Google Agenda bloquera automatiquement le créneau sur le site !
                </li>
              </ol>
            </div>
          )}

          {calendarConnected ? (
            <div className="flex items-center justify-between gap-3 bg-white border border-emerald-300 rounded-xl p-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2.5 truncate">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-mono text-charcoal-main truncate">
                  Flux connecté : {connectedUrlPreview}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDisconnectCalendar}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0 cursor-pointer"
              >
                Déconnecter
              </button>
            </div>
          ) : (
            <form onSubmit={handleConnectCalendar} className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="url"
                value={icalUrlInput}
                onChange={(e) => setIcalUrlInput(e.target.value)}
                placeholder="Collez ici l'Adresse secrète au format iCal (https://calendar.google.com/calendar/ical/.../basic.ics)"
                className="flex-1 w-full bg-white border border-[#D6CEBF] rounded-xl px-3.5 py-2.5 text-xs text-charcoal-main placeholder:text-charcoal-muted/60 outline-none focus:border-charcoal-main transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={connectingCalendar || !icalUrlInput.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold bg-charcoal-main hover:bg-black text-[#FAF7F2] transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                <Link2 className={`w-3.5 h-3.5 ${connectingCalendar ? 'animate-spin' : ''}`} />
                <span>{connectingCalendar ? 'Vérification...' : 'Connecter & Synchroniser'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Liste des réservations */}
      {loading ? (
        <div className="bg-white border border-[#E2D9CC] rounded-3xl p-12 text-center text-charcoal-muted text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-charcoal-muted" />
          Chargement des réservations en cours...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center text-red-800 text-sm">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-[#E2D9CC] rounded-3xl p-12 sm:p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#EFE8DD] text-charcoal-muted flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-xl uppercase tracking-wider text-charcoal-main mb-2">
            Aucune séance réservée pour le moment
          </h3>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            Dès qu'une cliente valide un créneau sur le site, sa fiche apparaîtra ici avec ses coordonnées complètes, et une alerte sera transmise à <strong>mattiskhn@gmail.com</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="bg-white border border-[#E2D9CC] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-charcoal-main/40 transition-colors"
            >
              <div>
                {/* Date & Créneau */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6] mb-3">
                  <div className="flex items-center gap-2 text-charcoal-main">
                    <Calendar className="w-4 h-4 text-[#BAA58F]" />
                    <span className="font-serif text-sm font-medium">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[11px] font-semibold bg-warm-dark text-white px-2 py-0.5 rounded">
                      {booking.slot}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBooking(booking.id, booking.fullName)}
                      disabled={deletingId === booking.id}
                      className="p-1 rounded text-charcoal-muted/50 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer cette réservation et libérer le créneau"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nom & Contact */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <span className="font-serif text-base text-charcoal-main font-semibold">
                      {booking.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <a
                      href={`mailto:${booking.email}?subject=Votre séance de colorimétrie — Jirel de Joiry`}
                      className="text-charcoal-muted hover:text-charcoal-main hover:underline truncate"
                    >
                      {booking.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <a
                      href={`tel:${booking.phone}`}
                      className="text-charcoal-muted hover:text-charcoal-main hover:underline"
                    >
                      {booking.phone}
                    </a>
                  </div>
                </div>

                {/* Notes éventuelles */}
                {booking.notes && (
                  <div className="bg-[#FAF7F2] border-l-2 border-[#BAA58F] p-3 text-xs text-[#524B43] italic mb-4 rounded-r">
                    « {booking.notes} »
                  </div>
                )}
              </div>

              {/* Pied de carte */}
              <div className="pt-3 border-t border-[#EAE3D6] flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
                  <span className="font-medium text-charcoal-main">Colorimétrie (100€)</span>
                  <span className="text-[10px] text-[#8F877C]">
                    {new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Actions : Facture Proforma & Google Agenda */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadProforma(booking)}
                    disabled={downloadingId === booking.id}
                    className="flex-1 py-2 px-2.5 rounded-xl text-xs uppercase tracking-wider font-medium bg-[#FAF7F2] hover:bg-charcoal-main text-charcoal-main hover:text-[#FAF7F2] border border-[#E2D9CC] transition-all flex items-center justify-center gap-1.5 group cursor-pointer shadow-2xs hover:shadow-xs disabled:opacity-60"
                    title="Télécharger la facture proforma en PDF"
                  >
                    <FileDown className={`w-3.5 h-3.5 text-[#BAA58F] group-hover:text-[#FAF7F2] transition-colors ${downloadingId === booking.id ? 'animate-bounce' : ''}`} />
                    <span>{downloadingId === booking.id ? 'PDF...' : 'Proforma'}</span>
                  </button>

                  <a
                    href={getGoogleCalendarUrlForAdmin(booking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl text-xs uppercase tracking-wider font-medium bg-white hover:bg-[#FAF7F2] text-charcoal-main border border-[#E2D9CC] hover:border-emerald-700/50 transition-all flex items-center justify-center gap-1.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                    title="Ajouter ou consulter dans Google Agenda"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Google Agenda</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

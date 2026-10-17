'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  CalendarX,
} from 'lucide-react';

interface BookingDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  slot: string;
  notes?: string;
  price?: string;
  duration?: string;
}

const CANCELLATION_REASONS = {
  fr: [
    'Imprévu personnel ou professionnel',
    "Erreur lors du choix de la date ou de l'heure",
    'Souhait de reporter à une date ultérieure',
    'Problème de transport / Déplacement impossible',
    'Autre motif',
  ],
  en: [
    'Personal or professional unforeseen event',
    'Mistake in date or time selection',
    'Wish to reschedule for a later date',
    'Transportation issue / Unable to travel',
    'Other reason',
  ],
};

function CancelBookingContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { lang, setLang } = useLanguage();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number>(0);
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const reasons = CANCELLATION_REASONS[lang] || CANCELLATION_REASONS.fr;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(
        lang === 'fr'
          ? "Aucun identifiant de réservation n'a été fourni."
          : 'No booking identifier was provided.'
      );
      return;
    }

    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/bookings?id=' + encodeURIComponent(id), { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data.success && data.booking) {
          setBooking(data.booking);
        } else {
          setError(
            data.error ||
              (lang === 'fr'
                ? 'Cette réservation est introuvable ou a déjà été annulée.'
                : 'This reservation was not found or has already been cancelled.')
          );
        }
      } catch {
        setError(
          lang === 'fr'
            ? 'Impossible de joindre le serveur. Vérifiez votre connexion.'
            : 'Unable to reach the server. Please check your connection.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, lang]);

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !booking) return;

    setIsSubmitting(true);
    const chosenReasonLabel = reasons[selectedReasonIndex] || reasons[0];
    const isOther = selectedReasonIndex === 4;
    const finalReason = isOther && customReason.trim() ? customReason.trim() : chosenReasonLabel;

    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason: finalReason }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        try {
          const raw = localStorage.getItem('jirel_local_bookings');
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              localStorage.setItem(
                'jirel_local_bookings',
                JSON.stringify(list.filter((b: any) => b.id !== id))
              );
            }
          }
        } catch {
          // ignore
        }
        setCancelled(true);
      } else {
        alert(
          data.error ||
            (lang === 'fr' ? "Erreur lors de l'annulation." : 'Error during cancellation.')
        );
      }
    } catch {
      alert(
        lang === 'fr'
          ? "Impossible d'annuler la réservation. Merci de réessayer."
          : 'Unable to cancel the booking. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#201D1A] flex flex-col justify-between selection:bg-[#BAA58F]/20">
      {/* Barre de navigation épurée & bilingue intégrée */}
      <header className="border-b border-[#E2D9CC] bg-[#FAF7F2]/90 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-lg tracking-[0.22em] uppercase font-light text-[#201D1A] group-hover:opacity-80 transition-opacity">
              JIREL DE JOIRY
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#8F877C]">
              {lang === 'fr' ? "Atelier d'Art & Colorimétrie — Paris" : "Art Studio & Colorimetry — Paris"}
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-xs uppercase tracking-wider font-sans font-medium text-[#645E55] hover:text-[#201D1A] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? 'Retour au site' : 'Back to website'}</span>
            </Link>

            {/* Sélecteur de langue FR | EN */}
            <div className="flex items-center gap-2 pl-4 sm:pl-6 border-l border-[#E2D9CC] text-[11px] tracking-wider font-medium text-[#8F877C]">
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`transition-colors cursor-pointer ${
                  lang === 'fr' ? 'text-[#201D1A] font-semibold underline underline-offset-4 decoration-[#BAA58F]' : 'hover:text-[#201D1A]'
                }`}
                aria-label="Passer en français"
              >
                FR
              </button>
              <span className="opacity-40">|</span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`transition-colors cursor-pointer ${
                  lang === 'en' ? 'text-[#201D1A] font-semibold underline underline-offset-4 decoration-[#BAA58F]' : 'hover:text-[#201D1A]'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 md:py-16">
        <div className="w-full max-w-xl">
          {loading ? (
            /* Chargement */
            <div className="bg-white border border-[#E2D9CC] p-12 text-center shadow-xs">
              <div className="w-8 h-8 border-2 border-[#BAA58F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-serif text-base text-[#201D1A] tracking-wide">
                {lang === 'fr'
                  ? 'Recherche de votre réservation en cours...'
                  : 'Searching for your reservation...'}
              </p>
            </div>
          ) : cancelled ? (
            /* Confirmation réussie d'annulation */
            <div className="bg-white border border-[#E2D9CC] p-8 sm:p-12 shadow-xs text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E2D9CC] text-[#8B7355] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 stroke-[1.6]" />
              </div>

              <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#8F877C] font-semibold">
                {lang === 'fr' ? 'ANNULATION CONFIRMÉE' : 'CANCELLATION CONFIRMED'}
              </span>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#201D1A] font-normal tracking-wide mt-2 mb-3">
                {lang === 'fr' ? 'Votre rendez-vous a été annulé' : 'Your appointment has been cancelled'}
              </h1>

              <p className="font-sans text-xs sm:text-sm text-[#645E55] leading-relaxed max-w-md mx-auto mb-6">
                {lang === 'fr' ? (
                  <>
                    Le créneau a bien été libéré. Un email de confirmation vient d'être envoyé à{' '}
                    <strong className="text-[#201D1A]">{booking?.email}</strong>.
                  </>
                ) : (
                  <>
                    The slot has been released. A confirmation email has just been sent to{' '}
                    <strong className="text-[#201D1A]">{booking?.email}</strong>.
                  </>
                )}
              </p>

              {booking && (
                <div className="bg-[#FAF7F2] border border-[#E2D9CC] p-4 text-left text-xs mb-8 space-y-2">
                  <div className="flex justify-between border-b border-[#EAE3D6] pb-2">
                    <span className="text-[#8F877C]">{lang === 'fr' ? 'Prestation' : 'Service'}</span>
                    <span className="font-semibold text-[#201D1A]">
                      {lang === 'fr' ? 'Colorimétrie 1:1' : '1:1 Colorimetry'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#EAE3D6] pb-2">
                    <span className="text-[#8F877C]">{lang === 'fr' ? 'Date libérée' : 'Released date'}</span>
                    <span className="font-semibold text-[#201D1A]">{booking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8F877C]">{lang === 'fr' ? 'Créneau' : 'Time slot'}</span>
                    <span className="font-semibold text-[#201D1A]">{booking.slot}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#reservation"
                  className="w-full sm:w-auto px-6 py-3 bg-[#201D1A] hover:bg-black text-[#FAF7F2] font-sans text-xs uppercase tracking-wider font-medium transition-colors text-center shadow-xs"
                >
                  {lang === 'fr' ? 'Choisir un autre créneau' : 'Book another slot'}
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E2D9CC] hover:bg-[#FAF7F2] text-[#201D1A] font-sans text-xs uppercase tracking-wider font-medium transition-colors text-center"
                >
                  {lang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
                </Link>
              </div>
            </div>
          ) : error || !booking ? (
            /* Erreur ou Réservation introuvable */
            <div className="bg-white border border-[#E2D9CC] p-8 sm:p-12 shadow-xs text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-7 h-7 stroke-[1.6]" />
              </div>

              <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#8F877C] font-semibold">
                {lang === 'fr' ? 'RÉSERVATION INTROUVABLE' : 'RESERVATION NOT FOUND'}
              </span>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#201D1A] font-normal tracking-wide mt-2 mb-3">
                {lang === 'fr'
                  ? "Impossible d'annuler ce rendez-vous"
                  : 'Unable to cancel this appointment'}
              </h1>

              <p className="font-sans text-xs sm:text-sm text-[#645E55] leading-relaxed max-w-md mx-auto mb-8">
                {error ||
                  (lang === 'fr'
                    ? 'Cette réservation est introuvable ou a déjà été annulée.'
                    : 'This reservation was not found or has already been cancelled.')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#reservation"
                  className="w-full sm:w-auto px-6 py-3 bg-[#201D1A] hover:bg-black text-[#FAF7F2] font-sans text-xs uppercase tracking-wider font-medium transition-colors text-center"
                >
                  {lang === 'fr' ? 'Prendre un rendez-vous' : 'Book an appointment'}
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E2D9CC] hover:bg-[#FAF7F2] text-[#201D1A] font-sans text-xs uppercase tracking-wider font-medium transition-colors text-center"
                >
                  {lang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
                </Link>
              </div>
            </div>
          ) : (
            /* Formulaire d'annulation actif */
            <div className="bg-white border border-[#E2D9CC] p-7 sm:p-10 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#EFE8DD] text-[#645E55]">
                  {lang === 'fr' ? 'Gestion de réservation' : 'Booking management'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#201D1A] font-normal tracking-wide mb-2">
                {lang === 'fr' ? 'Annuler votre rendez-vous' : 'Cancel your appointment'}
              </h1>

              <p className="font-sans text-xs text-[#645E55] leading-relaxed mb-6">
                {lang === 'fr'
                  ? "Vous êtes sur le point d'annuler votre séance de colorimétrie avec Jirel de Joiry. En confirmant ci-dessous, ce créneau sera immédiatement libéré sur notre calendrier."
                  : 'You are about to cancel your colorimetry session with Jirel de Joiry. By confirming below, this slot will be immediately released on our calendar.'}
              </p>

              {/* Carte récapitulative de la réservation */}
              <div className="bg-[#FAF7F2] border border-[#E2D9CC] p-5 mb-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#201D1A]">
                    <Calendar className="w-4 h-4 text-[#BAA58F]" />
                    <span className="font-serif text-sm">{booking.date}</span>
                  </div>
                  <span className="font-sans text-[11px] font-semibold bg-[#201D1A] text-white px-2 py-0.5 rounded">
                    {booking.slot}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#645E55]">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#8F877C] shrink-0" />
                    <span className="text-[#201D1A] font-medium truncate">{booking.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8F877C] shrink-0" />
                    <span className="truncate">{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8F877C] shrink-0" />
                    <span>{lang === 'fr' ? 'Atelier Paris 13ᵉ' : 'Paris 13th Studio'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8F877C] shrink-0" />
                    <span>{lang === 'fr' ? '1h30 (100€ sur place)' : '1h30 (€100 on site)'}</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de confirmation & motif */}
              <form onSubmit={handleConfirmCancel} className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#645E55] mb-2">
                    {lang === 'fr' ? "Motif de l'annulation (optionnel)" : 'Reason for cancellation (optional)'}
                  </label>
                  <div className="space-y-2">
                    {reasons.map((reason, idx) => (
                      <label
                        key={reason}
                        className={
                          'flex items-center gap-3 p-3 border rounded cursor-pointer transition-all text-xs font-sans ' +
                          (selectedReasonIndex === idx
                            ? 'bg-[#FAF7F2] border-[#201D1A] text-[#201D1A] font-medium'
                            : 'bg-white border-[#E2D9CC] text-[#645E55] hover:border-[#BAA58F]')
                        }
                      >
                        <input
                          type="radio"
                          name="cancel_reason"
                          value={idx}
                          checked={selectedReasonIndex === idx}
                          onChange={() => setSelectedReasonIndex(idx)}
                          className="accent-[#201D1A]"
                        />
                        <span>{reason}</span>
                      </label>
                    ))}
                  </div>

                  {selectedReasonIndex === 4 && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder={
                        lang === 'fr'
                          ? 'Précisez brièvement si vous le souhaitez...'
                          : 'Please specify briefly if you wish...'
                      }
                      rows={2}
                      className="mt-2 w-full bg-[#FAF7F2] border border-[#E2D9CC] p-3 text-xs text-[#201D1A] outline-none focus:border-[#201D1A] rounded"
                    />
                  )}
                </div>

                {/* Boutons d'actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 px-5 bg-red-900 hover:bg-red-950 text-white font-sans text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <CalendarX className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? lang === 'fr'
                          ? 'Annulation en cours...'
                          : 'Cancelling...'
                        : lang === 'fr'
                        ? "Confirmer l'annulation"
                        : 'Confirm cancellation'}
                    </span>
                  </button>

                  <Link
                    href="/"
                    className="w-full sm:w-auto py-3.5 px-5 bg-white border border-[#E2D9CC] hover:bg-[#FAF7F2] text-[#201D1A] font-sans text-xs uppercase tracking-wider font-medium transition-colors text-center"
                  >
                    {lang === 'fr' ? 'Conserver mon rendez-vous' : 'Keep my appointment'}
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Pied de page minimaliste */}
      <footer className="border-t border-[#E2D9CC] py-6 text-center text-[11px] font-sans text-[#8F877C]">
        <p>
          {lang === 'fr'
            ? '© 2026 Jirel de Joiry • Atelier Textile & Colorimétrie — Paris 13ᵉ'
            : '© 2026 Jirel de Joiry • Textile Studio & Colorimetry — Paris 13th'}
        </p>
      </footer>
    </div>
  );
}

export default function CancelBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-xs font-serif text-[#645E55]">
          Chargement...
        </div>
      }
    >
      <CancelBookingContent />
    </Suspense>
  );
}

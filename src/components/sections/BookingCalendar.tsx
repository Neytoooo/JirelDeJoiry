'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BOOKING_MONTHS, DEFAULT_TIME_SLOTS } from '@/data/booking';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteImages } from '@/context/ImageContext';
import {
  Clock,
  MapPin,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  User,
  ArrowRight,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const BookingCalendar: React.FC = () => {
  const { lang, t } = useLanguage();
  const { getImage } = useSiteImages();
  const [monthIndex, setMonthIndex] = useState(1); // 1 = Septembre
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState('10h00');
  const [modalOpen, setModalOpen] = useState(false);

  // États du formulaire de réservation
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const currentMonth = BOOKING_MONTHS[monthIndex];

  // Offset pour le 1er jour du mois
  const offset = currentMonth.startDay === 0 ? 6 : currentMonth.startDay - 1;

  const dayNames = lang === 'fr' 
    ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const monthHeaders = {
    fr: ['AOÛT 2026', 'SEPTEMBRE 2026', 'OCTOBRE 2026'],
    en: ['AUGUST 2026', 'SEPTEMBER 2026', 'OCTOBER 2026'],
  };
  const displayedMonthHeader = monthHeaders[lang][monthIndex];

  // Date dynamique formatée selon la maquette
  const formattedDate = useMemo(() => {
    const monthNumber = 7 + monthIndex; // 7 = Août (0-indexed), 8 = Septembre, 9 = Octobre
    const date = new Date(2026, monthNumber, selectedDay);
    if (lang === 'fr') {
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
      const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return `${capitalizedDay} ${selectedDay} ${monthName} 2026`;
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      return `${dayName}, ${monthName} ${selectedDay}, 2026`;
    }
  }, [lang, monthIndex, selectedDay]);

  const photoSrc = getImage(
    'booking-calendar-photo',
    '/images/booking-colorimetrie-nuancier.jpg'
  );

  const handleOpenModal = () => {
    setModalOpen(true);
    setSubmitStatus('idle');
    setErrorMessage(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (submitStatus === 'success') {
      // Réinitialiser les champs après une réservation réussie
      setFullName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setSubmitStatus('idle');
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage(
        lang === 'fr'
          ? 'Merci de renseigner votre nom, adresse email et numéro de téléphone.'
          : 'Please provide your full name, email address, and phone number.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          date: formattedDate,
          slot: selectedSlot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
        setSubmitStatus('success');
      } else {
        setErrorMessage(
          data.error ||
            (lang === 'fr'
              ? "Une erreur est survenue lors de l'enregistrement. Merci de réessayer."
              : 'An error occurred while confirming your reservation. Please try again.')
        );
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Erreur réservation:', err);
      setErrorMessage(
        lang === 'fr'
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion.'
          : 'Could not connect to the server. Please check your connection.'
      );
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // URL pour Google Calendar
  const googleCalendarUrl = useMemo(() => {
    if (!confirmedBooking) return '#';
    const title = encodeURIComponent(
      lang === 'fr' ? 'Séance Colorimétrie 1:1 — Jirel de Joiry' : 'Color Analysis Session 1:1 — Jirel de Joiry'
    );
    const details = encodeURIComponent(
      lang === 'fr'
        ? `Séance de Colorimétrie personnalisée 1:1 avec Jirel de Joiry.\n\nDate : ${confirmedBooking.date} à ${confirmedBooking.slot}\nLieu : Atelier Paris 13ᵉ\nDurée : 1h30 — Tarif : 100€ (à régler sur place)\n\nPour toute question : mattiskhn@gmail.com`
        : `Personalized Color Analysis 1:1 with Jirel de Joiry.\n\nDate: ${confirmedBooking.date} at ${confirmedBooking.slot}\nLocation: Atelier Paris 13th\nDuration: 1h30 — Fee: €100 (payable on site)\n\nQuestions: mattiskhn@gmail.com`
    );
    const location = encodeURIComponent('Paris 13e arrondissement, France');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }, [confirmedBooking, lang]);

  // Téléchargement du fichier Agenda (.ics) pour Apple Calendar / Outlook
  const downloadIcs = () => {
    if (!confirmedBooking) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Jirel de Joiry//Reservation//FR',
      'BEGIN:VEVENT',
      `SUMMARY:Séance Colorimétrie 1:1 — Jirel de Joiry`,
      `DESCRIPTION:Séance avec Jirel de Joiry pour ${confirmedBooking.fullName}. Tarif: 100€ (1h30). Atelier Paris 13e.`,
      `LOCATION:Atelier Paris 13e, France`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colorimetrie-jirel-${selectedDay}-${monthIndex + 8}-2026.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reservation" className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
      <ScrollReveal animation="fade-up" duration={750}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-warm-card border border-border-subtle p-6 sm:p-10 shadow-editorial items-stretch">
        
        {/* Colonne 1 : Détails de la séance (4 colonnes) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-charcoal-main leading-snug">
              {lang === 'fr' ? 'RÉSERVER UNE SÉANCE DE COLORIMÉTRIE' : 'BOOK A COLOR ANALYSIS SESSION'}
            </h3>
            <p className="font-serif italic text-base sm:text-lg text-charcoal-main">
              {lang === 'fr' ? '1:1 — En présentiel à Paris' : '1:1 — In-person in Paris'}
            </p>
            <p className="font-sans text-xs sm:text-[13px] text-charcoal-muted leading-relaxed mt-1">
              {lang === 'fr'
                ? 'Une analyse personnalisée pour découvrir votre saison, comprendre les couleurs qui vous mettent en valeur et repartir avec votre palette sur mesure.'
                : 'A personalized chromatic analysis to discover your season, understand your most flattering tones, and receive your tailored palette.'}
            </p>

            {/* Liste des détails avec icônes conforme à la maquette */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 stroke-charcoal-main mt-0.5 shrink-0" />
                <div>
                  <div className="font-sans text-xs font-semibold text-charcoal-main">
                    {lang === 'fr' ? 'Créneaux disponibles' : 'Available slots'}
                  </div>
                  <div className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                    {lang === 'fr'
                      ? 'de 10h à 16h uniquement (pour une lumière naturelle optimale)'
                      : 'from 10am to 4pm only (for optimal natural daylight)'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 stroke-charcoal-main mt-0.5 shrink-0" />
                <div>
                  <div className="font-sans text-xs font-semibold text-charcoal-main">
                    {lang === 'fr' ? 'À Paris 13ᵉ' : 'In Paris 13th'}
                  </div>
                  <div className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                    {lang === 'fr'
                      ? '(adresse communiquée après réservation)'
                      : '(studio address confirmed upon booking)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <div className="font-sans text-xs font-semibold text-charcoal-main">
                  {lang === 'fr' ? 'Durée : 1h30' : 'Duration: 1h30'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CircleDollarSign className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <div className="font-sans text-xs font-semibold text-charcoal-main">
                  {lang === 'fr' ? 'Tarif : 100€' : 'Fee: €100'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              asAnchor
              href="#deroulement"
              variant="dark"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <span>{lang === 'fr' ? 'EN SAVOIR PLUS SUR LA COLORIMÉTRIE' : 'LEARN MORE ABOUT COLOR ANALYSIS'}</span>
              <span>→</span>
            </Button>
          </div>
        </div>

        {/* Colonne 2 : Photo centrale nuancier & matières (4 colonnes) */}
        <div className="hidden lg:flex lg:col-span-4 h-full min-h-[480px] overflow-hidden border border-border-subtle bg-warm-paper shadow-sm">
          <img
            src={photoSrc}
            alt={lang === 'fr' ? 'Nuancier de colorimétrie et étoffes textiles' : 'Color analysis swatch palette and fabrics'}
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Colonne 3 : Widget de Calendrier Dynamique (4 colonnes) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div>
            <h4 className="font-serif text-lg sm:text-xl uppercase tracking-wider text-charcoal-main text-left mb-4">
              {lang === 'fr' ? 'CHOISISSEZ VOTRE CRÉNEAU' : 'SELECT YOUR TIME SLOT'}
            </h4>

            {/* Navigation mois */}
            <div className="flex items-center justify-between py-2 border-b border-border-subtle mb-4">
              <button
                type="button"
                onClick={() => monthIndex > 0 && setMonthIndex(monthIndex - 1)}
                className="p-1 text-charcoal-muted hover:text-charcoal-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={monthIndex === 0}
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="font-sans text-xs font-semibold tracking-widest text-charcoal-main uppercase">
                {displayedMonthHeader}
              </span>

              <button
                type="button"
                onClick={() => monthIndex < BOOKING_MONTHS.length - 1 && setMonthIndex(monthIndex + 1)}
                className="p-1 text-charcoal-muted hover:text-charcoal-main transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={monthIndex === BOOKING_MONTHS.length - 1}
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grille calendrier */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-4">
              {dayNames.map((d, i) => (
                <div key={i} className="text-[11px] font-sans font-medium text-charcoal-muted uppercase py-1">
                  {d}
                </div>
              ))}

              {/* Cases vides */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Jours du mois */}
              {Array.from({ length: currentMonth.daysCount }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-full flex items-center justify-center text-xs font-sans transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#8B7355] text-white font-medium shadow-sm'
                        : 'text-charcoal-main hover:bg-[#EAE4D9]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Label de la date sélectionnée */}
            <div className="font-serif italic text-base sm:text-lg text-charcoal-main text-left mb-4">
              {formattedDate}
            </div>

            {/* Créneaux horaires (2 lignes de 3) */}
            <div className="grid grid-cols-3 gap-2.5">
              {DEFAULT_TIME_SLOTS.map((slot) => {
                const isSlotSelected = slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 text-center text-xs font-sans transition-colors border ${
                      isSlotSelected
                        ? 'bg-warm-dark text-white border-warm-dark font-medium'
                        : 'bg-[#FAF7F2] text-charcoal-main border-[#DFD8CC] hover:border-charcoal-main'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            variant="dark"
            fullWidth
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <span>{lang === 'fr' ? 'VALIDER CE CRÉNEAU' : 'CONFIRM THIS SLOT'}</span>
            <span>→</span>
          </Button>

        </div>

      </div>
      </ScrollReveal>

      {/* Modale de Réservation Complète & Interactive */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        hideCloseButton={true}
        maxWidth="md"
      >
        {submitStatus === 'success' && confirmedBooking ? (
          /* Écran de Confirmation Réussie */
          <div className="flex flex-col items-center text-center py-2 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#BAA58F]/20 text-[#8B7355] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 stroke-[2]" />
            </div>

            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-charcoal-muted font-semibold">
              {lang === 'fr' ? 'SÉANCE CONFIRMÉE' : 'SESSION CONFIRMED'}
            </span>

            <h3 className="font-serif text-2xl uppercase tracking-wider text-charcoal-main mt-1 mb-2">
              {lang === 'fr' ? 'Merci' : 'Thank You'}, {confirmedBooking.fullName}
            </h3>

            <p className="font-sans text-xs text-charcoal-muted leading-relaxed max-w-sm mb-5">
              {lang === 'fr'
                ? `Votre réservation pour le ${confirmedBooking.date} à ${confirmedBooking.slot} est enregistrée.`
                : `Your booking for ${confirmedBooking.date} at ${confirmedBooking.slot} has been successfully placed.`}
            </p>

            {/* Carte de rappel des détails */}
            <div className="w-full bg-warm-paper/70 border border-border-subtle p-4 mb-5 text-left text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">{lang === 'fr' ? 'Prestation :' : 'Service:'}</span>
                <span className="font-semibold text-charcoal-main">Colorimétrie 1:1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">{lang === 'fr' ? 'Horaire :' : 'Time:'}</span>
                <span className="font-semibold text-charcoal-main">{confirmedBooking.slot} (1h30)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">{lang === 'fr' ? 'Tarif :' : 'Fee:'}</span>
                <span className="font-semibold text-charcoal-main">100€ (sur place)</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border-subtle/60">
                <span className="text-charcoal-muted">{lang === 'fr' ? 'Confirmation envoyée à :' : 'Confirmation sent to:'}</span>
                <span className="font-semibold text-charcoal-main truncate max-w-[200px]">{confirmedBooking.email}</span>
              </div>
            </div>

            {/* Notification transmise à Mattis */}
            <div className="w-full bg-[#EAE3D6]/60 border border-[#D8CEBF] px-3.5 py-2.5 rounded text-[11px] text-charcoal-muted mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
              <span>
                {lang === 'fr'
                  ? 'Une alerte directe a été transmise à mattiskhn@gmail.com.'
                  : 'A direct notification was dispatched to mattiskhn@gmail.com.'}
              </span>
            </div>

            {/* Boutons d'export d'agenda */}
            <div className="w-full flex flex-col sm:flex-row gap-2.5 mb-5">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-warm-paper hover:bg-[#EAE3D6] text-charcoal-main border border-border-medium px-4 py-2.5 text-xs font-sans tracking-editorial uppercase transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Agenda</span>
              </a>

              <button
                type="button"
                onClick={downloadIcs}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-warm-paper hover:bg-[#EAE3D6] text-charcoal-main border border-border-medium px-4 py-2.5 text-xs font-sans tracking-editorial uppercase transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Apple / Outlook (.ics)</span>
              </button>
            </div>

            <Button variant="dark" fullWidth onClick={handleCloseModal}>
              {lang === 'fr' ? 'TERMINER' : 'DONE'}
            </Button>
          </div>
        ) : (
          /* Formulaire de saisie des coordonnées */
          <form onSubmit={handleSubmitBooking} className="flex flex-col">
            <div className="border-b border-border-subtle pb-4 mb-5">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal-muted font-semibold">
                {lang === 'fr' ? 'RÉSERVATION 1:1 EN PRÉSENTIEL' : '1:1 IN-PERSON BOOKING'}
              </span>
              <h3 className="font-serif text-2xl uppercase tracking-wider text-charcoal-main mt-0.5">
                {lang === 'fr' ? 'CONFIRMER VOTRE SÉANCE' : 'CONFIRM YOUR SESSION'}
              </h3>
            </div>

            {/* Récapitulatif du créneau sélectionné */}
            <div className="bg-warm-paper border border-border-subtle p-3.5 mb-5 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-charcoal-main font-medium">{formattedDate}</span>
                <span className="font-sans text-[11px] font-semibold bg-warm-dark text-white px-2.5 py-0.5">
                  {selectedSlot}
                </span>
              </div>
              <div className="text-[11px] text-charcoal-muted flex items-center justify-between pt-1 border-t border-border-subtle/50">
                <span>Atelier Paris 13ᵉ • 1h30</span>
                <span>Tarif : 100€ (à régler sur place)</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
                {errorMessage}
              </div>
            )}

            {/* Champs du formulaire */}
            <div className="flex flex-col gap-3.5 mb-6">
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-charcoal-main font-medium mb-1">
                  {lang === 'fr' ? 'Nom & Prénom *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'fr' ? 'Ex: Éléonore de Montmirail' : 'e.g. Jane Doe'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warm-paper/60 border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-charcoal-main font-medium mb-1">
                  {lang === 'fr' ? 'Adresse Email *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="votre.email@domaine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warm-paper/60 border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                  />
                </div>
                <span className="text-[10px] text-charcoal-subtle mt-0.5 block">
                  {lang === 'fr' ? 'Pour recevoir votre récapitulatif et l’adresse de l’atelier' : 'To receive your confirmation & studio address'}
                </span>
              </div>

              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-charcoal-main font-medium mb-1">
                  {lang === 'fr' ? 'Numéro de Téléphone *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-warm-paper/60 border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                  />
                </div>
                <span className="text-[10px] text-charcoal-subtle mt-0.5 block">
                  {lang === 'fr' ? 'Pour vous joindre en cas de besoin' : 'In case we need to reach you'}
                </span>
              </div>

              <div>
                <label className="block font-sans text-[11px] uppercase tracking-wider text-charcoal-main font-medium mb-1">
                  {lang === 'fr' ? 'Notes ou attentes particulières (optionnel)' : 'Special notes or expectations (optional)'}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    lang === 'fr'
                      ? 'Ex: Première analyse, tri de dressing, préparation d’un mariage...'
                      : 'e.g. First chromatic analysis, wardrobe refresh, special event...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-warm-paper/60 border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="dark"
              fullWidth
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2"
            >
              <span>
                {isSubmitting
                  ? (lang === 'fr' ? 'CONFIRMATION EN COURS...' : 'CONFIRMING...')
                  : (lang === 'fr' ? 'CONFIRMER MA RÉSERVATION' : 'CONFIRM MY RESERVATION')}
              </span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>

            <p className="text-[10px] text-center text-charcoal-subtle mt-3">
              {lang === 'fr'
                ? '✦ Aucun paiement immédiat requis. Règlement sur place le jour de votre séance.'
                : '✦ No upfront payment required. Payment on site on the day of your session.'}
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
};

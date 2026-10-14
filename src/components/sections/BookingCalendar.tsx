'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { BOOKING_MONTHS, DEFAULT_TIME_SLOTS } from '@/data/booking';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteImages } from '@/context/ImageContext';
import { Clock, MapPin, CircleDollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const BookingCalendar: React.FC = () => {
  const { lang, t } = useLanguage();
  const { getImage } = useSiteImages();
  const [monthIndex, setMonthIndex] = useState(1); // 1 = Septembre
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState('10h00');
  const [modalOpen, setModalOpen] = useState(false);

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
      return `${capitalizedDay} ${selectedDay} ${monthName}`;
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      return `${dayName}, ${monthName} ${selectedDay}`;
    }
  }, [lang, monthIndex, selectedDay]);

  const photoSrc = getImage(
    'booking-calendar-photo',
    '/images/booking-colorimetrie-nuancier.jpg'
  );

  const handleValidate = () => {
    setModalOpen(true);
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
            onClick={handleValidate}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <span>{lang === 'fr' ? 'VALIDER CE CRÉNEAU' : 'CONFIRM THIS SLOT'}</span>
            <span>→</span>
          </Button>

        </div>

      </div>
      </ScrollReveal>

      {/* Modale de confirmation */}
      <Modal
        isOpen={modalOpen}
        title={t.booking.confirmTitle}
        onClose={() => setModalOpen(false)}
      >
        <p>
          {lang === 'fr'
            ? `Votre séance pour le ${formattedDate} à ${selectedSlot} est pré-réservée.`
            : `Your appointment for ${formattedDate} at ${selectedSlot} has been pre-booked.`}
        </p>
        <p className="text-xs text-charcoal-subtle mt-2">
          {t.booking.confirmMsg}
        </p>
      </Modal>
    </div>
  );
};

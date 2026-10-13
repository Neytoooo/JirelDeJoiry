'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { Modal } from '@/components/ui/Modal';
import { BOOKING_MONTHS, DEFAULT_TIME_SLOTS } from '@/data/booking';
import { Clock, MapPin, Hourglass, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

export const BookingCalendar: React.FC = () => {
  const [monthIndex, setMonthIndex] = useState(1); // 1 = Septembre
  const [selectedDay, setSelectedDay] = useState(16);
  const [selectedSlot, setSelectedSlot] = useState('10h00');
  const [modalOpen, setModalOpen] = useState(false);

  const currentMonth = BOOKING_MONTHS[monthIndex];

  // Offset pour le 1er jour du mois (alignement L M M J V S D)
  const offset = currentMonth.startDay === 0 ? 6 : currentMonth.startDay - 1;

  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const handleValidate = () => {
    setModalOpen(true);
  };

  return (
    <div id="reservation" className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-warm-card border border-border-subtle p-6 sm:p-10 shadow-editorial">
        
        {/* Colonne 1 : Détails de la séance (4 colonnes) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-charcoal-main leading-snug">
              RÉSERVER UNE SÉANCE DE COLORIMÉTRIE
            </h3>
            <p className="font-serif italic text-base text-charcoal-main">
              1:1 — En présentiel à Paris
            </p>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mt-1">
              Une analyse personnalisée pour découvrir votre saison, comprendre les couleurs qui vous mettent en valeur et repartir avec votre palette sur mesure.
            </p>

            {/* Liste des détails avec icônes */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 stroke-charcoal-main mt-0.5 shrink-0" />
                <div>
                  <div className="font-sans text-xs font-semibold text-charcoal-main">
                    Créneaux disponibles
                  </div>
                  <div className="font-sans text-[11px] text-charcoal-muted">
                    de 10h à 16h uniquement (pour une lumière naturelle optimale)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 stroke-charcoal-main mt-0.5 shrink-0" />
                <div>
                  <div className="font-sans text-xs font-semibold text-charcoal-main">
                    À Paris 13ᵉ
                  </div>
                  <div className="font-sans text-[11px] text-charcoal-muted">
                    (adresse communiquée après réservation)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hourglass className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <div className="font-sans text-xs font-semibold text-charcoal-main">
                  Durée : 1h30
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <div className="font-sans text-xs font-semibold text-charcoal-main">
                  Tarif : 100€
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button asAnchor href="#deroulement" variant="dark" fullWidth>
              EN SAVOIR PLUS SUR LA COLORIMÉTRIE
            </Button>
          </div>
        </div>

        {/* Colonne 2 : Photo centrale (4 colonnes) */}
        <div className="hidden lg:block lg:col-span-4">
          <ImagePlaceholder
            ratio="portrait"
            tag="Nuancier & Tissus"
            dimensionLabel="Lumière Naturelle"
            illustrationSrc="/illustrations/swatch-palette.svg"
            className="h-full"
          />
        </div>

        {/* Colonne 3 : Widget de Calendrier Dynamique (4 colonnes) */}
        <div className="lg:col-span-4 bg-warm-bg border border-border-subtle p-5 sm:p-6 flex flex-col justify-between gap-5">
          
          <div>
            <h4 className="font-serif text-lg uppercase tracking-wider text-charcoal-main text-center mb-3">
              CHOISISSEZ VOTRE CRÉNEAU
            </h4>

            {/* Navigation mois */}
            <div className="flex items-center justify-between py-2 border-b border-border-subtle mb-3">
              <button
                type="button"
                onClick={() => monthIndex > 0 && setMonthIndex(monthIndex - 1)}
                className="p-1 text-charcoal-muted hover:text-charcoal-main transition-colors"
                disabled={monthIndex === 0}
                aria-label="Mois précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="font-sans text-xs font-semibold tracking-wider text-charcoal-main uppercase">
                {currentMonth.name}
              </span>

              <button
                type="button"
                onClick={() => monthIndex < BOOKING_MONTHS.length - 1 && setMonthIndex(monthIndex + 1)}
                className="p-1 text-charcoal-muted hover:text-charcoal-main transition-colors"
                disabled={monthIndex === BOOKING_MONTHS.length - 1}
                aria-label="Mois suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grille calendrier */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {dayNames.map((d, i) => (
                <div key={i} className="text-[10px] font-semibold text-charcoal-subtle uppercase py-1">
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
                        ? 'bg-warm-dark text-white font-semibold'
                        : 'text-charcoal-main hover:bg-border-subtle'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Label de la date sélectionnée */}
            <div className="font-serif text-sm font-medium text-center text-charcoal-main mt-4 mb-3">
              Mercredi {selectedDay} septembre
            </div>

            {/* Créneaux horaires */}
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_TIME_SLOTS.map((slot) => {
                const isSlotSelected = slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-center text-xs font-sans font-medium transition-colors border ${
                      isSlotSelected
                        ? 'bg-warm-dark text-white border-warm-dark'
                        : 'bg-white text-charcoal-main border-border-medium hover:border-warm-dark'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <Button variant="dark" fullWidth onClick={handleValidate}>
            VALIDER CE CRÉNEAU
          </Button>

        </div>

      </div>

      {/* Modale de confirmation */}
      <Modal
        isOpen={modalOpen}
        title="Créneau Enregistré"
        onClose={() => setModalOpen(false)}
      >
        <p>
          Votre séance pour le <strong>Mercredi {selectedDay} septembre à {selectedSlot}</strong> est pré-réservée.
        </p>
        <p className="text-xs text-charcoal-subtle mt-2">
          Un email de confirmation récapitulatif avec l'adresse à Paris 13ᵉ vous sera transmis.
        </p>
      </Modal>
    </div>
  );
};

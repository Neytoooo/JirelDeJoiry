'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const TrustBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 bg-warm-bg text-center">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Titre unique : ILS M'ONT FAIT CONFIANCE / THEY TRUSTED ME */}
        <h4 className="font-serif text-xs sm:text-[13px] tracking-[0.24em] uppercase text-charcoal-muted mb-8 sm:mb-12 font-normal">
          {t.trustBanner.title}
        </h4>

        {/* Marques partenaires en pur texte HTML stylisé selon leur identité typographique */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20">
          
          {/* kvadrat : géométrique lourd minuscule */}
          <span className="font-sans font-black text-xl sm:text-2xl md:text-[1.7rem] tracking-tighter lowercase text-[#1A1A1A] select-none hover:opacity-75 transition-opacity">
            kvadrat
          </span>

          {/* MUUTO : majuscules géométriques scandinaves */}
          <span className="font-sans font-extrabold text-lg sm:text-xl md:text-[1.4rem] tracking-[0.16em] uppercase text-[#1A1A1A] select-none hover:opacity-75 transition-opacity">
            MUUTO
          </span>

          {/* maaram : géométrique épuré minuscule */}
          <span className="font-sans font-black text-xl sm:text-2xl md:text-[1.65rem] tracking-tight lowercase text-[#1A1A1A] select-none hover:opacity-75 transition-opacity">
            maaram
          </span>

          {/* SMEG : capitales espacées */}
          <span className="font-sans font-bold text-base sm:text-lg md:text-xl tracking-[0.28em] uppercase text-[#1A1A1A] select-none hover:opacity-75 transition-opacity">
            SMEG
          </span>

          {/* Petite Friture : haute couture sérif française */}
          <span className="font-serif font-medium text-xl sm:text-2xl md:text-[1.65rem] tracking-wide text-[#1A1A1A] select-none hover:opacity-75 transition-opacity">
            Petite Friture
          </span>

        </div>

      </div>
    </section>
  );
};

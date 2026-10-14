'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const TrustBanner: React.FC = () => {
  const { t } = useLanguage();

  const brands = [
    {
      name: 'kvadrat',
      className: 'font-sans font-black text-xl sm:text-2xl md:text-[1.7rem] tracking-tighter lowercase',
    },
    {
      name: 'MUUTO',
      className: 'font-sans font-extrabold text-lg sm:text-xl md:text-[1.4rem] tracking-[0.16em] uppercase',
    },
    {
      name: 'maaram',
      className: 'font-sans font-black text-xl sm:text-2xl md:text-[1.65rem] tracking-tight lowercase',
    },
    {
      name: 'SMEG',
      className: 'font-sans font-bold text-base sm:text-lg md:text-xl tracking-[0.28em] uppercase',
    },
    {
      name: 'Petite Friture',
      className: 'font-serif font-medium text-xl sm:text-2xl md:text-[1.65rem] tracking-wide',
    },
  ];

  // Duplication pour assurer une boucle infinie continue et sans rupture
  const repeatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-12 sm:py-16 bg-warm-bg text-center overflow-hidden border-b border-border-subtle/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6 sm:mb-8">
        
        {/* Titre avec filets éditoriaux élégants */}
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <div className="h-[1px] w-8 sm:w-16 bg-charcoal-muted/25" aria-hidden="true" />
          <h4 className="font-serif text-xs sm:text-[13px] tracking-[0.26em] uppercase text-charcoal-muted font-normal select-none">
            {t.trustBanner.title}
          </h4>
          <div className="h-[1px] w-8 sm:w-16 bg-charcoal-muted/25" aria-hidden="true" />
        </div>

      </div>

      {/* Ruban animé en défilement infini haute couture */}
      <div className="relative w-full overflow-hidden py-2 select-none group">
        
        {/* Masques de fondu vaporeux à gauche et à droite */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 bg-gradient-to-r from-warm-bg via-warm-bg/90 to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-44 bg-gradient-to-l from-warm-bg via-warm-bg/90 to-transparent z-10"
          aria-hidden="true"
        />

        {/* Piste de défilement continu */}
        <div className="animate-marquee flex items-center gap-10 sm:gap-16 md:gap-20">
          {repeatedBrands.map((brand, idx) => (
            <div key={`${brand.name}-${idx}`} className="flex items-center gap-10 sm:gap-16 md:gap-20 shrink-0">
              <span
                className={`${brand.className} text-[#1A1A1A] opacity-75 group-hover:opacity-60 hover:!opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                {brand.name}
              </span>
              <span className="text-charcoal-muted/25 text-[10px] select-none" aria-hidden="true">
                ✦
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';

export const QuoteBanner: React.FC = () => {
  const { getImage } = useSiteImages();
  const bannerBgSrc = getImage('banner-bg', '/images/banner-clean-bg.png');

  return (
    <section className="relative w-full my-6 sm:my-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Conteneur de la bannière calé sur le ratio natif de l'image (1024x342) */}
        <div className="relative w-full aspect-[1024/342] min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex items-center justify-center overflow-hidden border border-border-subtle/40 shadow-sm">
          
          {/* Image d'arrière-plan haute définition originale (ombres végétales, fleurs séchées et drapé nuit) */}
          <img
            src={bannerBgSrc}
            alt="Ambiance atelier textile et ombres végétales"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Textes et bouton réels en HTML/CSS superposés avec précision au centre */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-xl py-6 sm:py-8">
            
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal-main font-normal leading-[1.15]">
              Imaginer aujourd'hui<br />
              les couleurs de demain
            </h2>

            <p className="font-serif italic text-xs sm:text-sm md:text-[14px] text-charcoal-muted leading-relaxed mt-2.5 sm:mt-3.5 mb-4 sm:mb-5 max-w-md">
              Une approche sensible et stratégique de la couleur,<br className="hidden sm:inline" />
              au croisement de la mode, du design et de l'art de vivre.
            </p>

            <div>
              <a
                href="#collaborations"
                className="inline-flex items-center justify-center gap-3 bg-warm-dark text-warm-bg px-6 sm:px-7 py-2.5 sm:py-3 font-sans text-[11px] sm:text-xs tracking-editorial uppercase hover:bg-[#383430] hover:text-white transition-all duration-200 group cursor-pointer"
              >
                <span>MES SERVICES</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

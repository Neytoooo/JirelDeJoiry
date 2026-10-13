'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';

export const Hero: React.FC = () => {
  const { getImage } = useSiteImages();
  const heroImageSrc = getImage('hero-collage', '/images/hero-collage-2x.png');

  return (
    <section id="accueil" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-warm-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* TITRE AU MILIEU : JIREL DE JOIRY */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[3.25rem] tracking-[0.16em] uppercase text-charcoal-main font-normal leading-none">
            JIREL DE JOIRY
          </h1>
          <p className="font-sans text-[10px] sm:text-xs tracking-[0.24em] uppercase text-charcoal-muted mt-2 font-medium">
            COULEUR · TEXTILE · CRÉATION
          </p>
        </div>

        {/* CONTENU PRINCIPAL : COLONNE GAUCHE + COLLAGE VISUEL DROITE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* COLONNE GAUCHE (Textes & CTA) */}
          <div className="lg:col-span-5 flex flex-col justify-start pt-2 sm:pt-6 z-10">
            
            {/* Titre éditorial : La couleur comme langage */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] text-charcoal-main font-normal leading-[1.08] tracking-tight">
              La couleur<br />
              comme langage
            </h2>

            {/* Paragraphe descriptif */}
            <p className="font-sans text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed max-w-sm mt-5 sm:mt-6">
              Designer textile, styliste et experte<br className="hidden sm:inline" />
              en colorimétrie, j'imagine des univers sensibles<br className="hidden sm:inline" />
              où la couleur révèle, relie et inspire.
            </p>

            {/* Tiret horizontal décoratif */}
            <div className="w-10 h-[1.5px] bg-charcoal-main my-5 sm:my-6" aria-hidden="true" />

            {/* Bouton CTA */}
            <div>
              <a
                href="#univers"
                className="inline-flex items-center justify-center gap-3 bg-warm-dark text-warm-bg px-6 sm:px-7 py-3.5 font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] hover:text-white transition-all duration-200 group cursor-pointer"
              >
                <span>DÉCOUVRIR MON UNIVERS</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>

          </div>

          {/* COLONNE DROITE : LE COLLAGE VISUEL COMPLET DE LA MAQUETTE */}
          <div className="lg:col-span-7 flex justify-end relative">
            <div className="relative w-full max-w-[620px] transition-transform duration-300 hover:scale-[1.01]">
              <img
                src={heroImageSrc}
                alt="Univers de Jirel de Joiry — Colorimétrie, moodboard et créations textiles"
                className="w-full h-auto object-contain block drop-shadow-sm select-none"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

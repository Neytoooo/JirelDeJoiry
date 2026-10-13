'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';

export const Colorimetrie: React.FC = () => {
  const { getImage } = useSiteImages();
  const swatchesSrc = getImage('colorimetrie-swatches', '/images/colorimetrie-swatches.webp');

  return (
    <section id="colorimetrie" className="pt-14 sm:pt-20 pb-16 sm:pb-24 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Grille 3 colonnes conforme à la maquette : Texte | Photo Nuancier | Formats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Colonne 1 : Titres, Descriptif et CTA (4 colonnes) */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] uppercase tracking-[0.14em] text-charcoal-main font-normal leading-none mb-3">
              COLORIMÉTRIE
            </h2>

            <p className="font-serif italic text-lg sm:text-xl lg:text-[1.35rem] text-charcoal-main leading-snug mb-4">
              Révéler votre palette, sublimer<br className="hidden sm:inline" />
              votre singularité
            </p>

            <p className="font-sans text-xs sm:text-[13px] text-charcoal-muted font-light leading-relaxed mb-6 max-w-sm">
              Une approche personnalisée pour découvrir votre saison, comprendre les couleurs qui vous mettent en valeur et les intégrer au quotidien.
            </p>

            <div>
              <a
                href="#reservation"
                className="inline-flex items-center justify-center gap-3 bg-warm-dark text-warm-bg px-6 py-3.5 font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] hover:text-white transition-all duration-200 group cursor-pointer"
              >
                <span>DÉCOUVRIR LES ATELIERS</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>

          </div>

          {/* Colonne 2 : Photo centrale du nuancier sur table en bois (5 colonnes) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[440px] aspect-[4/5] overflow-hidden shadow-sm group">
              <img
                src={swatchesSrc}
                alt="Nuancier de couleurs et étoffes d'analyse colorimétrique"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Colonne 3 : Liste des 4 Formats d'Ateliers (3 colonnes) */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-6 lg:pl-4">
            
            <div>
              <h3 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-charcoal-main">
                ATELIERS 1:1
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted mt-0.5">
                Découvrir sa saison
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-charcoal-main">
                ATELIERS ÉVÉNEMENTS
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted mt-0.5">
                Mariage, EVJF, entreprise...
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-charcoal-main">
                CONFÉRENCES
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted mt-0.5">
                Autour de la couleur
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs font-semibold tracking-[0.12em] uppercase text-charcoal-main">
                ATELIERS DÉCORATION
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted mt-0.5">
                Pour les marques et professionnels
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

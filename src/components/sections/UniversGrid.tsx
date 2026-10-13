'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';

export const UniversGrid: React.FC = () => {
  const { getImage } = useSiteImages();

  const UNIVERS_ITEMS = [
    {
      id: 'colorimetrie',
      imageSrc: getImage('univers-colorimetrie', '/images/univers-colorimetrie.png'),
      alt: 'Colorimétrie - Harmonies et étoffes',
      title: 'COLORIMÉTRIE',
      subtitle: 'Révéler les harmonies de chacun',
      href: '#colorimetrie',
    },
    {
      id: 'decoration',
      imageSrc: getImage('univers-decoration', '/images/univers-decoration.png'),
      alt: 'Décoration & Intérieur - Espaces de vie',
      title: 'DÉCORATION & INTÉRIEUR',
      subtitle: 'La couleur au service des espaces de vie',
      href: '#ateliers',
    },
    {
      id: 'direction-artistique',
      imageSrc: getImage('univers-direction-artistique', '/images/univers-direction-artistique.png'),
      alt: 'Direction Artistique & Consulting',
      title: 'DIRECTION ARTISTIQUE\n& CONSULTING',
      subtitle: 'Anticiper les tendances,\ncréer du sens',
      href: '#ateliers',
    },
    {
      id: 'tapisserie',
      imageSrc: getImage('univers-tapisserie', '/images/univers-tapisserie.png'),
      alt: 'Atelier de Tapisserie - Matière et geste',
      title: 'ATELIER DE TAPISSERIE',
      subtitle: 'Matière, geste, création',
      href: '#tapisserie',
    },
  ];

  return (
    <section id="univers" className="pt-10 sm:pt-14 pb-14 sm:pb-20 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Titre centré : MES UNIVERS */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-serif text-sm sm:text-base tracking-[0.24em] uppercase text-charcoal-main font-normal">
            MES UNIVERS
          </h2>
        </div>

        {/* Grille des 4 Univers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {UNIVERS_ITEMS.map((item) => (
            <article key={item.id} className="flex flex-col items-center text-center group">
              
              {/* Photo de l'univers */}
              <div className="w-full aspect-square overflow-hidden mb-4 bg-warm-paper transition-transform duration-300 group-hover:scale-[1.015]">
                <img
                  src={item.imageSrc}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center block select-none"
                />
              </div>

              {/* Titre de l'univers */}
              <h3 className="font-serif text-xs sm:text-[13px] tracking-[0.08em] uppercase text-charcoal-main font-normal leading-snug whitespace-pre-line min-h-[2rem] flex items-center justify-center">
                {item.title}
              </h3>

              {/* Sous-titre descriptif */}
              <p className="font-serif italic text-xs sm:text-[12px] text-charcoal-muted leading-relaxed mt-1 whitespace-pre-line min-h-[2rem]">
                {item.subtitle}
              </p>

              {/* Lien DÉCOUVRIR → */}
              <div className="mt-3">
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.16em] uppercase text-charcoal-main hover:text-accent-terracotta transition-colors group/link"
                >
                  <span>DÉCOUVRIR</span>
                  <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                </a>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

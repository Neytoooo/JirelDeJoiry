'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';

export const ProcessSteps: React.FC = () => {
  const { getImage } = useSiteImages();
  const { t } = useLanguage();
  const portraitSrc = getImage('deroulement-portrait', '/images/deroulement-portrait.jpg');

  return (
    <section id="deroulement" className="pt-14 sm:pt-20 pb-16 sm:pb-24 bg-warm-bg border-t border-border-subtle/50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Colonne gauche (6 colonnes) : Les 5 étapes numérotées collées en haut */}
          <div className="lg:col-span-6 flex flex-col pt-0">
            
            {/* Titre en 2 lignes exact de la maquette (collé en haut) */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] uppercase tracking-[0.14em] text-charcoal-main font-normal leading-[1.08] mb-6 sm:mb-8">
              {t.processSteps.titleLine1}<br />
              {t.processSteps.titleLine2}
            </h2>

            {/* Liste des 5 étapes : texte plus grand, espacement resserré et bas décollé */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {t.processSteps.steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4 sm:gap-5">
                  
                  {/* Pastille numéro taupe doux avec chiffre blanc */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#BAA58F] text-white flex items-center justify-center font-sans text-xs sm:text-sm font-semibold tracking-wide shrink-0 shadow-xs mt-0.5">
                    {step.number}
                  </div>

                  {/* Textes de l'étape : taille agrandie et interlignage raffiné */}
                  <div className="flex flex-col">
                    <h3 className="font-serif text-base sm:text-lg lg:text-[1.2rem] text-charcoal-main font-normal leading-snug">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm lg:text-[13.5px] text-charcoal-muted font-light leading-relaxed mt-0.5 max-w-md">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Colonne droite (6 colonnes) : Photo drapage haute définition & Citation incrustée */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] aspect-[565/920] overflow-hidden shadow-sm group">
              
              {/* Photo haute résolution personnalisable */}
              <img
                src={portraitSrc}
                alt="Séance d'analyse colorimétrique et drapages de tissus"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.015]"
              />

              {/* Incrustation texte poétique en 3 lignes avec tiret en bas à gauche */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 flex flex-col justify-end">
                <p className="font-serif text-2xl sm:text-3xl lg:text-[2.1rem] leading-[1.18] text-[#FAF7F2] font-normal drop-shadow-sm">
                  {t.processSteps.quoteLine1}<br />
                  {t.processSteps.quoteLine2}<br />
                  {t.processSteps.quoteLine3}
                </p>
                <div className="w-9 h-[1.5px] bg-[#FAF7F2] mt-4" aria-hidden="true" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

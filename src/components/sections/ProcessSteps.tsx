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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Colonne gauche (6 colonnes) : Les 5 étapes numérotées */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Titre en 2 lignes exact de la maquette */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] uppercase tracking-[0.14em] text-charcoal-main font-normal leading-[1.08] mb-8 sm:mb-10">
              {t.processSteps.titleLine1}<br />
              {t.processSteps.titleLine2}
            </h2>

            {/* Liste des 5 étapes avec cercles taupe et texte en casse de phrase */}
            <div className="flex flex-col gap-5 sm:gap-6">
              {t.processSteps.steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4 sm:gap-5">
                  
                  {/* Pastille numéro taupe doux avec chiffre blanc */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#BAA58F] text-white flex items-center justify-center font-sans text-xs sm:text-[13px] font-medium tracking-wide shrink-0 shadow-xs">
                    {step.number}
                  </div>

                  {/* Textes de l'étape */}
                  <div className="flex flex-col pt-0.5">
                    <h3 className="font-serif text-sm sm:text-[15px] text-charcoal-main font-normal leading-snug">
                      {step.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[12.5px] text-charcoal-muted font-light leading-relaxed mt-0.5">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Colonne droite (6 colonnes) : Photo drapage haute définition & Citation incrustée */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] aspect-[565/1024] overflow-hidden shadow-sm group">
              
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

'use client';

import React from 'react';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Workshops: React.FC = () => {
  const { getImage } = useSiteImages();
  const { t } = useLanguage();

  const mainSpeakerSrc = getImage('ateliers-speaker', '/images/ateliers-main-speaker.jpg');
  const decoSrc = getImage('ateliers-deco', '/images/ateliers-decoration.jpg');
  const eventsSrc = getImage('ateliers-events', '/images/ateliers-evenements-prives.jpg');
  const brandsSrc = getImage('ateliers-brands', '/images/ateliers-conferences-marques.jpg');

  return (
    <section id="ateliers" className="pt-14 sm:pt-20 pb-16 sm:pb-24 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* En-tête avec texte à gauche et grande photo à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-18">
          
          {/* Colonne gauche (5 colonnes) : Titre & Descriptif */}
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-5 flex flex-col justify-center">
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] uppercase tracking-[0.14em] text-charcoal-main font-normal leading-none mb-3">
              {t.workshops.title}
            </h2>

            <p className="font-serif italic text-lg sm:text-xl lg:text-[1.35rem] text-charcoal-main leading-snug mb-4">
              {t.workshops.subtitle}
            </p>

            <p className="font-sans text-xs sm:text-[13px] text-charcoal-muted font-light leading-relaxed mb-6 max-w-md">
              {t.workshops.description}
            </p>

            <div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 bg-warm-dark text-warm-bg px-6 py-3.5 font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] hover:text-white transition-all duration-200 group cursor-pointer"
              >
                <span>{t.workshops.cta}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>

          </ScrollReveal>

          {/* Colonne droite (7 colonnes) : Photo principale de la conférencière à l'écran */}
          <ScrollReveal animation="image-reveal" delay={150} className="lg:col-span-7">
            <div className="w-full aspect-[16/10] overflow-hidden shadow-sm group">
              <img
                src={mainSpeakerSrc}
                alt="Conférence et masterclass sur la couleur et les tendances"
                className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
          </ScrollReveal>

        </div>

        {/* 3 formats d'ateliers (3 cartes alignées) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Carte 1 : Décoration & Intérieur */}
          <ScrollReveal animation="fade-up" delay={0}>
            <article className="flex flex-col group">
              <div className="w-full aspect-[16/10] overflow-hidden mb-3.5 shadow-sm">
                <img
                  src={decoSrc}
                  alt="Ateliers Décoration & Intérieur - Échantillons et matières"
                  className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="font-serif text-sm tracking-[0.08em] uppercase text-charcoal-main font-normal leading-snug">
                {t.workshops.card1TitleLine1}<br />{t.workshops.card1TitleLine2}
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted leading-relaxed mt-1.5">
                {t.workshops.card1Sub}
              </p>
            </article>
          </ScrollReveal>

          {/* Carte 2 : Événements Privés */}
          <ScrollReveal animation="fade-up" delay={120}>
            <article className="flex flex-col group">
              <div className="w-full aspect-[16/10] overflow-hidden mb-3.5 shadow-sm">
                <img
                  src={eventsSrc}
                  alt="Événements Privés - Table de réception et art de vivre"
                  className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="font-serif text-sm tracking-[0.08em] uppercase text-charcoal-main font-normal leading-snug">
                {t.workshops.card2Title}
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted leading-relaxed mt-1.5">
                {t.workshops.card2Sub}
              </p>
            </article>
          </ScrollReveal>

          {/* Carte 3 : Conférences Marques & Professionnels */}
          <ScrollReveal animation="fade-up" delay={240}>
            <article className="flex flex-col group">
              <div className="w-full aspect-[16/10] overflow-hidden mb-3.5 shadow-sm">
                <img
                  src={brandsSrc}
                  alt="Conférences Marques & Professionnels - Moodboards et équipes créatives"
                  className="w-full h-full object-cover object-center select-none transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="font-serif text-sm tracking-[0.08em] uppercase text-charcoal-main font-normal leading-snug">
                {t.workshops.card3TitleLine1}<br />{t.workshops.card3TitleLine2}
              </h3>
              <p className="font-serif italic text-xs sm:text-[13px] text-charcoal-muted leading-relaxed mt-1.5">
                {t.workshops.card3Sub}
              </p>
            </article>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

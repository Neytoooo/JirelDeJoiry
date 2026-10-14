'use client';

import React, { useState, useEffect } from 'react';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Hero: React.FC = () => {
  const { getImage } = useSiteImages();
  const { t } = useLanguage();
  const heroImageSrc = getImage('hero-collage', '/images/hero-collage-2x.png');

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          // Progression de 0 à 1 sur les 240 premiers pixels de scroll
          const progress = Math.min(Math.max(y / 240, 0), 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="accueil" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-warm-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* TITRE AU MILIEU : JIREL DE JOIRY AVEC ANIMATION DE DÉFILEMENT HAUTE COUTURE */}
        <div
          className="text-center mb-8 sm:mb-12 lg:mb-14 will-change-transform"
          style={{
            transform: `translateY(${scrollProgress * 32}px) scale(${1 - scrollProgress * 0.08})`,
            opacity: Math.max(1 - scrollProgress * 1.35, 0),
            filter: `blur(${scrollProgress * 3.5}px)`,
          }}
        >
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-[3.25rem] uppercase text-charcoal-main font-normal leading-none"
            style={{
              letterSpacing: `${0.16 + scrollProgress * 0.14}em`,
            }}
          >
            {t.brand.name}
          </h1>
          <p
            className="font-sans text-[10px] sm:text-xs uppercase text-charcoal-muted mt-2 font-medium"
            style={{
              letterSpacing: `${0.24 + scrollProgress * 0.08}em`,
              opacity: Math.max(1 - scrollProgress * 1.5, 0),
            }}
          >
            {t.brand.tagline}
          </p>

          {/* Ligne éditoriale raffinée qui s'étire délicatement au défilement */}
          <div
            className="h-[1px] bg-charcoal-main/25 mx-auto mt-4"
            style={{
              width: `${40 + scrollProgress * 70}px`,
              opacity: Math.max(1 - scrollProgress * 1.5, 0),
            }}
          />
        </div>

        {/* CONTENU PRINCIPAL : COLONNE GAUCHE + COLLAGE VISUEL DROITE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* COLONNE GAUCHE (Textes & CTA) */}
          <ScrollReveal animation="fade-up" delay={100} className="lg:col-span-5 flex flex-col justify-start pt-2 sm:pt-6 z-10">
            {/* Titre éditorial : La couleur comme langage */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] text-charcoal-main font-normal leading-[1.08] tracking-tight">
              {t.hero.titleLine1}<br />
              {t.hero.titleLine2}
            </h2>

            {/* Paragraphe descriptif */}
            <p className="font-sans text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed max-w-sm mt-5 sm:mt-6">
              {t.hero.description}
            </p>

            {/* Tiret horizontal décoratif */}
            <div className="w-10 h-[1.5px] bg-charcoal-main my-5 sm:my-6" aria-hidden="true" />

            {/* Bouton CTA */}
            <div>
              <a
                href="#univers"
                className="inline-flex items-center justify-center gap-3 bg-warm-dark text-warm-bg px-6 sm:px-7 py-3.5 font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] hover:text-white transition-all duration-200 group cursor-pointer"
              >
                <span>{t.hero.cta}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </ScrollReveal>

          {/* COLONNE DROITE : LE COLLAGE VISUEL COMPLET DE LA MAQUETTE */}
          <ScrollReveal animation="image-reveal" delay={200} className="lg:col-span-7 flex justify-end relative">
            <div className="relative w-full max-w-[620px] transition-transform duration-500 hover:scale-[1.015]">
              <img
                src={heroImageSrc}
                alt="Univers de Jirel de Joiry — Colorimétrie, moodboard et créations textiles"
                className="w-full h-auto object-contain block drop-shadow-sm select-none"
              />
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Patterns: React.FC = () => {
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();
  const motifSrc = getImage('motifs-textile', '/images/motifs-textile.jpg');

  return (
    <section id="motifs" className="bg-warm-paper border-y border-border-subtle">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[38%_44%_18%] xl:grid-cols-[36%_46%_18%] items-stretch">
        
        {/* Colonne 1 : Titres, description et bouton CTA */}
        <ScrollReveal
          animation="fade-up"
          delay={50}
          className="flex flex-col justify-between p-6 sm:p-10 lg:py-10 lg:px-8 xl:py-12 xl:px-12"
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl uppercase tracking-widest text-charcoal-main leading-tight">
              {t.patterns.title}
            </h2>
            <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-charcoal-main">
              {t.patterns.subtitle}
            </p>
            <p className="font-sans text-xs sm:text-sm text-charcoal-muted leading-relaxed mt-2 max-w-md">
              {t.patterns.description}
            </p>
          </div>

          <div className="pt-6 sm:pt-8">
            <Button asAnchor href="#applications" variant="dark">
              {t.patterns.cta}
            </Button>
          </div>
        </ScrollReveal>

        {/* Colonne 2 : Visuel du motif pur en pleine hauteur (sans boîte ni marge) */}
        <ScrollReveal
          animation="image-reveal"
          delay={150}
          className="border-y lg:border-y-0 lg:border-l lg:border-r border-border-subtle relative overflow-hidden select-none min-h-[280px] sm:min-h-[360px] lg:min-h-0 h-full"
        >
          <img
            src={motifSrc}
            alt={lang === 'fr' ? 'Création de motifs botaniques — Atelier Jirel de Joiry' : 'Botanical pattern creation — Atelier Jirel de Joiry'}
            className="w-full h-full object-cover object-center select-none"
          />
        </ScrollReveal>

        {/* Colonne 3 : Menu des 4 collections séparées par des filets */}
        <ScrollReveal
          animation="fade-up"
          delay={250}
          className="grid grid-rows-4 divide-y divide-border-subtle h-full"
        >
          <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-6 py-3.5 sm:py-4">
            <h4 className="font-sans text-[11px] font-semibold tracking-editorial uppercase text-charcoal-main">
              {t.patterns.menu1Title}
            </h4>
            <p className="font-serif italic text-xs text-charcoal-muted mt-0.5 leading-snug">
              {t.patterns.menu1Sub}
            </p>
          </div>

          <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-6 py-3.5 sm:py-4">
            <h4 className="font-sans text-[11px] font-semibold tracking-editorial uppercase text-charcoal-main">
              {t.patterns.menu2Title}
            </h4>
            <p className="font-serif italic text-xs text-charcoal-muted mt-0.5 leading-snug">
              {t.patterns.menu2Sub}
            </p>
          </div>

          <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-6 py-3.5 sm:py-4">
            <h4 className="font-sans text-[11px] font-semibold tracking-editorial uppercase text-charcoal-main">
              {t.patterns.menu3Title}
            </h4>
            <p className="font-serif italic text-xs text-charcoal-muted mt-0.5 leading-snug">
              {t.patterns.menu3Sub}
            </p>
          </div>

          <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-6 py-3.5 sm:py-4">
            <h4 className="font-sans text-[11px] font-semibold tracking-editorial uppercase text-charcoal-main">
              {t.patterns.menu4Title}
            </h4>
            <p className="font-serif italic text-xs text-charcoal-muted mt-0.5 leading-snug">
              {t.patterns.menu4Sub}
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const TapestryAtelier: React.FC = () => {
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();
  const pelotesSrc = getImage('tapisserie-pelotes', '/images/tapisserie-pelotes.jpg');
  const pieceUniqueSrc = getImage('tapisserie-piece-unique', '/images/tapisserie-piece-unique.jpg');
  const ambianceSrc = getImage('tapisserie-ambiance', '/images/tapisserie-ambiance.jpg');

  return (
    <section id="tapisserie" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              {t.tapestry.title}
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              {t.tapestry.subtitle}
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              {t.tapestry.description}
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                {t.tapestry.cta}
              </Button>
            </div>
          </ScrollReveal>

          {/* Triptyque des 3 photos : Pelotes, Pièce unique et Ambiance salon */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 items-start">
            <ScrollReveal animation="image-reveal" delay={100} className="w-full">
              <img
                src={pelotesSrc}
                alt="Pelotes de laine et matières brutes — Atelier Jirel de Joiry"
                className="w-full aspect-[3/4] sm:aspect-[4/5] object-cover select-none"
              />
            </ScrollReveal>

            <ScrollReveal animation="image-reveal" delay={180} className="w-full">
              <img
                src={pieceUniqueSrc}
                alt="Détail de tapisserie tuftée artisanale — Atelier Jirel de Joiry"
                className="w-full aspect-[2/3.1] sm:aspect-[9/14.5] object-cover select-none"
              />
            </ScrollReveal>

            <ScrollReveal animation="image-reveal" delay={260} className="w-full mt-6 sm:mt-8 lg:mt-12">
              <img
                src={ambianceSrc}
                alt="Mise en situation de la tapisserie dans un intérieur contemporain — Atelier Jirel de Joiry"
                className="w-full aspect-[3/4] sm:aspect-[4/5] object-cover select-none"
              />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

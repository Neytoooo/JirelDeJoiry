'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Collaborations: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <section id="collaborations" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              {t.collaborations.title}
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              {t.collaborations.subtitle}
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              {t.collaborations.description}
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                {t.quoteBanner.cta}
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="image-reveal" delay={150} className="lg:col-span-6">
            <ImagePlaceholder
              ratio="landscape"
              tag={lang === 'fr' ? 'Collaborations & Studios' : 'Collaborations & Studios'}
              dimensionLabel={lang === 'fr' ? 'Direction de Projet' : 'Project Management'}
              illustrationSrc="/illustrations/swatch-palette.svg"
            />
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

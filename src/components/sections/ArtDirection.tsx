'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const ArtDirection: React.FC = () => {
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();
  const moodboardSrc = getImage('art-direction-moodboard');

  return (
    <section className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              {t.artDirection.title}
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              {t.artDirection.subtitle}
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              {t.artDirection.description}
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                {t.artDirection.cta}
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="image-reveal" delay={150} className="lg:col-span-6">
            <ImagePlaceholder
              src={moodboardSrc || undefined}
              ratio="landscape"
              tag={lang === 'fr' ? 'Moodboard de Matières' : 'Material Moodboard'}
              dimensionLabel={lang === 'fr' ? 'Céramique, Lin, Teintes' : 'Ceramics, Linen, Hues'}
              illustrationSrc={!moodboardSrc ? '/illustrations/swatch-palette.svg' : undefined}
            />
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

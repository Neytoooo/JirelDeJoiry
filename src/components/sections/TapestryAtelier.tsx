'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const TapestryAtelier: React.FC = () => {
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();
  const pelotesSrc = getImage('tapisserie-pelotes');
  const pieceUniqueSrc = getImage('tapisserie-piece-unique');

  return (
    <section id="tapisserie" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-6 flex flex-col gap-4">
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

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <ScrollReveal animation="image-reveal" delay={120}>
              <ImagePlaceholder
                src={pelotesSrc || undefined}
                ratio="tall-portrait"
                tag={t.tapestry.tag1}
                dimensionLabel={lang === 'fr' ? 'Matières Brutes' : 'Raw Materials'}
                illustrationSrc={!pelotesSrc ? '/illustrations/swatch-palette.svg' : undefined}
              />
            </ScrollReveal>
            <ScrollReveal animation="image-reveal" delay={220}>
              <ImagePlaceholder
                src={pieceUniqueSrc || undefined}
                ratio="tall-portrait"
                tag={t.tapestry.tag2}
                dimensionLabel={lang === 'fr' ? 'Pièce Unique' : 'Bespoke Work'}
                illustrationSrc={!pieceUniqueSrc ? '/illustrations/bird-tapestry.svg' : undefined}
              />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

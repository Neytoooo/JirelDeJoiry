'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const Patterns: React.FC = () => {
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();
  const motifSrc = getImage('motifs-textile');

  return (
    <section id="motifs" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          <ScrollReveal animation="fade-up" delay={50} className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              {t.patterns.title}
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              {t.patterns.subtitle}
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              {t.patterns.description}
            </p>
            <div className="pt-2">
              <Button asAnchor href="#applications" variant="dark">
                {t.patterns.cta}
              </Button>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
            
            {/* Visuel du motif dynamique ou illustration */}
            <ScrollReveal animation="image-reveal" delay={150} className="sm:col-span-7">
              <ImagePlaceholder
                src={motifSrc || undefined}
                ratio="square"
                tag={lang === 'fr' ? 'Motif Textile' : 'Textile Pattern'}
                illustrationSrc={!motifSrc ? '/illustrations/tapestry-sun.svg' : undefined}
              />
            </ScrollReveal>

            {/* Menu latéral des collections */}
            <ScrollReveal animation="fade-up" delay={250} className="sm:col-span-5 border-l border-border-subtle pl-5 flex flex-col justify-around gap-4">
              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  {t.patterns.menu1Title}
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  {t.patterns.menu1Sub}
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  {t.patterns.menu2Title}
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  {t.patterns.menu2Sub}
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  {t.patterns.menu3Title}
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  {t.patterns.menu3Sub}
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  {t.patterns.menu4Title}
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  {t.patterns.menu4Sub}
                </p>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';

export const ArtDirection: React.FC = () => {
  const { getImage } = useSiteImages();
  const moodboardSrc = getImage('art-direction-moodboard');

  return (
    <section className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              DIRECTION ARTISTIQUE & CONSULTING
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              Tendances, couleurs et matières pour des projets porteurs de sens
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              J'accompagne les marques, studios et entreprises dans leurs réflexions créatives : analyse des tendances, développement de palettes couleur, conseil en matières et direction artistique.
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                EN SAVOIR PLUS
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ImagePlaceholder
              src={moodboardSrc || undefined}
              ratio="landscape"
              tag="Moodboard de Matières"
              dimensionLabel="Céramique, Lin, Teintes"
              illustrationSrc={!moodboardSrc ? '/illustrations/swatch-palette.svg' : undefined}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

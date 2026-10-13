'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';

export const TapestryAtelier: React.FC = () => {
  const { getImage } = useSiteImages();
  const pelotesSrc = getImage('tapisserie-pelotes');
  const pieceUniqueSrc = getImage('tapisserie-piece-unique');

  return (
    <section id="tapisserie" className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              ATELIER DE TAPISSERIE
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              Un travail de la matière, entre tradition et modernité
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              Dans mon atelier, je crée des tapisseries tuftées et pièces textiles uniques, inspirées par la couleur, la matière et les gestes artisanaux.
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                DÉCOUVRIR L'ATELIER
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <ImagePlaceholder
              src={pelotesSrc || undefined}
              ratio="tall-portrait"
              tag="Pelotes & Laines"
              dimensionLabel="Matières Brutes"
              illustrationSrc={!pelotesSrc ? '/illustrations/swatch-palette.svg' : undefined}
            />
            <ImagePlaceholder
              src={pieceUniqueSrc || undefined}
              ratio="tall-portrait"
              tag="Tapisserie Tuftée"
              dimensionLabel="Pièce Unique"
              illustrationSrc={!pieceUniqueSrc ? '/illustrations/bird-tapestry.svg' : undefined}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

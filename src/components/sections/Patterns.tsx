'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useSiteImages } from '@/context/ImageContext';

export const Patterns: React.FC = () => {
  const { getImage } = useSiteImages();
  const motifSrc = getImage('motifs-textile');

  return (
    <section id="motifs" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              CRÉATION DE MOTIFS
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              Des histoires en surface
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              Je crée des motifs originaux, poétiques et intemporels, à la croisée de l'art, de l'artisanat et du design. Inspirés par la nature, les symboles et les récits, mes motifs peuvent être déclinés sur une multitude de supports ou réalisés sur mesure.
            </p>
            <div className="pt-2">
              <Button asAnchor href="#applications" variant="dark">
                DÉCOUVRIR LES COLLECTIONS
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
            
            {/* Visuel du motif dynamique ou illustration */}
            <div className="sm:col-span-7">
              <ImagePlaceholder
                src={motifSrc || undefined}
                ratio="square"
                tag="Motif Textile"
                illustrationSrc={!motifSrc ? '/illustrations/tapestry-sun.svg' : undefined}
              />
            </div>

            {/* Menu latéral des collections */}
            <div className="sm:col-span-5 border-l border-border-subtle pl-5 flex flex-col justify-around gap-4">
              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  COLLECTIONS
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  Motifs originaux
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  CRÉATIONS SUR MESURE
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  Pour vos projets
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  APPLICATIONS
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  Multi-supports
                </p>
              </div>

              <div>
                <h4 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main">
                  PROCESSUS CRÉATIF
                </h4>
                <p className="font-sans text-[11px] text-charcoal-muted mt-0.5">
                  De l'idée à la surface
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

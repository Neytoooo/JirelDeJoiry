import React from 'react';
import { Button } from '@/components/ui/Button';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

export const Collaborations: React.FC = () => {
  return (
    <section id="collaborations" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
              PROJETS & COLLABORATIONS
            </h2>
            <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main">
              Des accompagnements sur mesure
            </p>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-lg mt-1">
              J'accompagne les marques, studios, architectes, décorateurs et particuliers dans leurs projets autour de la couleur, du textile et de la création de motifs. Chaque collaboration est unique et pensée en fonction de vos besoins, de votre univers et de vos objectifs.
            </p>
            <div className="pt-2">
              <Button asAnchor href="#contact" variant="dark">
                DÉCOUVRIR MES SERVICES
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ImagePlaceholder
              ratio="landscape"
              tag="Collaborations & Studios"
              dimensionLabel="Direction de Projet"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

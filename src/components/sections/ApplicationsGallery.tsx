'use client';

import React, { useState } from 'react';
import { GALLERY_ITEMS } from '@/data/gallery';
import { useSiteImages } from '@/context/ImageContext';
import { useLanguage } from '@/context/LanguageContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const ApplicationsGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { getImage } = useSiteImages();
  const { lang, t } = useLanguage();

  const categories = [
    { id: 'all', label: t.gallery.all },
    { id: 'papier-peint', label: t.gallery.wallpaper },
    { id: 'textile', label: t.gallery.textile },
    { id: 'mode', label: t.gallery.fashion },
    { id: 'accessoires', label: t.gallery.accessories },
    { id: 'stationery', label: t.gallery.stationery },
    { id: 'broderie', label: t.gallery.embroidery },
    { id: 'sur-mesure', label: t.gallery.custom },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'mode' || activeCategory === 'accessoires') {
      return item.category === 'mode' || item.category === 'accessoires';
    }
    if (activeCategory === 'sur-mesure') {
      return item.category === 'broderie' || item.category === 'papier-peint';
    }
    return item.category === activeCategory;
  });

  const defaultImages: Record<string, string> = {
    'app-1': '/images/app-papier-peint.png',
    'app-2': '/images/app-textile.png',
    'app-3': '/images/app-mode.jpg',
    'app-4': '/images/app-stationery.png',
    'app-5': '/images/app-broderie.jpg',
  };

  return (
    <section id="applications" className="py-16 sm:py-24 bg-warm-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        <ScrollReveal animation="fade-up">
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main mb-8">
            {t.gallery.title}
          </h2>
        </ScrollReveal>

        {/* Barre d'onglets de filtrage */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-4 border-b border-border-subtle mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`editorial-link font-sans text-xs tracking-editorial uppercase transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-charcoal-main font-semibold after:w-full'
                    : 'text-charcoal-subtle hover:text-charcoal-main'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          </div>
        </ScrollReveal>

        {/* Grille de 5 réalisations sans encadré artificiel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {filteredItems.map((item, idx) => {
            const dynamicSrc =
              getImage(item.id) ||
              (item.category === 'papier-peint' && getImage('app-papier-peint')) ||
              (item.category === 'textile' && getImage('app-textile-ameublement')) ||
              (item.category === 'mode' && getImage('app-mode-accessoires')) ||
              (item.category === 'stationery' && getImage('app-objets-deco')) ||
              (item.category === 'broderie' && getImage('app-broderie')) ||
              defaultImages[item.id];

            return (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={(idx % 5) * 80}
              >
                <article className="flex flex-col group cursor-pointer">
                  {/* Visuel pur sans boîte ni badge superposé */}
                  <div className="overflow-hidden aspect-[2/3.05] sm:aspect-[9/13.8] bg-warm-card select-none">
                    <img
                      src={dynamicSrc}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                    />
                  </div>

                  {/* Textes centrés avec sous-titre en italique conforme à la maquette */}
                  <div className="text-center mt-3 flex flex-col items-center">
                    <h4 className="font-serif text-xs sm:text-sm uppercase tracking-wider text-charcoal-main">
                      {item.title}
                    </h4>
                    <p className="font-serif italic text-[11px] sm:text-xs text-charcoal-muted mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

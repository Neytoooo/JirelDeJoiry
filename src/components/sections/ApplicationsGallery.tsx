'use client';

import React, { useState } from 'react';
import { GALLERY_ITEMS } from '@/data/gallery';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
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

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <section id="applications" className="py-16 sm:py-24 border-t border-border-subtle">
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

        {/* Grille de réalisations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => {
            const dynamicSrc =
              getImage(item.id) ||
              (item.category === 'papier-peint' && getImage('app-papier-peint')) ||
              (item.category === 'textile' && getImage('app-textile-ameublement')) ||
              (item.category === 'mode' && getImage('app-mode-accessoires')) ||
              (item.category === 'stationery' && getImage('app-objets-deco')) ||
              undefined;

            return (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={(idx % 4) * 80}
              >
                <article className="flex flex-col group animate-fadeIn">
                  <div className="mb-4 overflow-hidden border border-border-subtle transition-transform duration-300 group-hover:-translate-y-1">
                    <ImagePlaceholder
                      src={dynamicSrc || undefined}
                      ratio="portrait"
                      tag={item.tag}
                      illustrationSrc={!dynamicSrc ? item.illustrationSrc || '/illustrations/flower-ornament.svg' : undefined}
                    />
                  </div>

                  <h4 className="font-serif text-base uppercase tracking-wider text-charcoal-main">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted mt-0.5">
                    {item.subtitle}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

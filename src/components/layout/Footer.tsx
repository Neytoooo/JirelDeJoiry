'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Ne pas afficher le footer public sur le dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-warm-paper border-t border-border-subtle pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Marque & Bio */}
          <div className="flex flex-col gap-3 max-w-xs">
            <span className="font-serif text-2xl uppercase tracking-widest text-charcoal-main">
              {t.brand.name}
            </span>
            <span className="font-sans text-[9px] font-medium tracking-[0.24em] uppercase text-charcoal-muted">
              {t.brand.tagline}
            </span>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mt-2">
              {t.brand.shortBio}
            </p>
          </div>

          {/* Univers */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              {t.footer.univers}
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-charcoal-muted">
              <li><a href="#colorimetrie" className="hover:text-charcoal-main transition-colors">{t.univers.colorimetrieTitle}</a></li>
              <li><a href="#ateliers" className="hover:text-charcoal-main transition-colors">{t.univers.decorationTitle}</a></li>
              <li><a href="#motifs" className="hover:text-charcoal-main transition-colors">{t.patterns.title}</a></li>
              <li><a href="#tapisserie" className="hover:text-charcoal-main transition-colors">{t.univers.tapestryTitle}</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              {t.footer.navigation}
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-charcoal-muted">
              <li><a href="#accueil" className="hover:text-charcoal-main transition-colors">{t.nav.accueil}</a></li>
              <li><a href="#ateliers" className="hover:text-charcoal-main transition-colors">{t.nav.ateliers}</a></li>
              <li><a href="#applications" className="hover:text-charcoal-main transition-colors">{t.nav.applications}</a></li>
              <li><a href="#contact" className="hover:text-charcoal-main transition-colors">{t.nav.contact}</a></li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              {t.footer.atelier}
            </h5>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed">
              Paris 13ᵉ arrondissement<br />
              {t.contact.address}<br />
              <a href="mailto:contact@jireldejoiry.com" className="hover:text-charcoal-main underline underline-offset-4">
                contact@jireldejoiry.com
              </a>
            </p>
          </div>

        </div>

        {/* Mentions & Copyright (sans le bouton Studio) */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-subtle">
          <div>
            © 2026 JIREL DE JOIRY. {t.footer.allRights}
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="hover:text-charcoal-main transition-colors">{t.footer.legal}</a>
            <a href="#" className="hover:text-charcoal-main transition-colors">{t.footer.privacy}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

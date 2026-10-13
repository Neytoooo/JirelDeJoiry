'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const pathname = usePathname();

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
              JIREL DE JOIRY
            </span>
            <span className="font-sans text-[9px] font-medium tracking-[0.24em] uppercase text-charcoal-muted">
              COULEUR · TEXTILE · CRÉATION
            </span>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mt-2">
              Atelier de création textile, stylisme et expertise en colorimétrie. Imaginer des univers sensibles où la matière et la couleur dialoguent.
            </p>
          </div>

          {/* Univers */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              UNIVERS
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-charcoal-muted">
              <li><a href="#colorimetrie" className="hover:text-charcoal-main transition-colors">Colorimétrie</a></li>
              <li><a href="#ateliers" className="hover:text-charcoal-main transition-colors">Décoration & Intérieur</a></li>
              <li><a href="#motifs" className="hover:text-charcoal-main transition-colors">Création de motifs</a></li>
              <li><a href="#tapisserie" className="hover:text-charcoal-main transition-colors">Atelier de tapisserie</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              NAVIGATION
            </h5>
            <ul className="flex flex-col gap-2.5 text-xs text-charcoal-muted">
              <li><a href="#accueil" className="hover:text-charcoal-main transition-colors">Accueil</a></li>
              <li><a href="#ateliers" className="hover:text-charcoal-main transition-colors">Ateliers & Formats</a></li>
              <li><a href="#applications" className="hover:text-charcoal-main transition-colors">Réalisations</a></li>
              <li><a href="#contact" className="hover:text-charcoal-main transition-colors">Contact & Devis</a></li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div>
            <h5 className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-4">
              ATELIER
            </h5>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed">
              Paris 13ᵉ arrondissement<br />
              Séances sur rendez-vous individuel<br />
              <a href="mailto:contact@jireldejoiry.com" className="hover:text-charcoal-main underline underline-offset-4">
                contact@jireldejoiry.com
              </a>
            </p>
          </div>

        </div>

        {/* Mentions & Copyright */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-subtle">
          <div>
            © 2026 JIREL DE JOIRY. Tous droits réservés.
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/dashboard" className="hover:text-charcoal-main text-charcoal-muted font-medium transition-colors flex items-center gap-1.5">
              <span>Studio Anne Martinons</span>
              <span className="text-[10px]">✨</span>
            </Link>
            <a href="#" className="hover:text-charcoal-main transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-charcoal-main transition-colors">Politique de Confidentialité</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ne pas afficher le header public sur le dashboard ou sur la page d'annulation
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/reservation/annuler')) {
    return null;
  }

  const navLinks = [
    { label: t.nav.accueil, href: '#accueil' },
    { label: t.nav.univers, href: '#univers' },
    { label: t.nav.colorimetrie, href: '#colorimetrie' },
    { label: t.nav.ateliers, href: '#ateliers' },
    { label: t.nav.directionArtistique, href: '#ateliers' },
    { label: t.nav.tapisserie, href: '#tapisserie' },
    { label: t.nav.motifs, href: '#motifs' },
    { label: t.nav.applications, href: '#applications' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b border-border-subtle/60 ${
        isScrolled
          ? 'bg-warm-bg/95 backdrop-blur-md shadow-editorial py-2.5'
          : 'bg-warm-bg/90 backdrop-blur-sm py-3'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-5 sm:px-8 flex items-center transition-all duration-500 ${
          isScrolled ? 'justify-between' : 'justify-between lg:justify-center'
        }`}
      >
        
        {/* Titre de marque Desktop révélé avec animation fluide au scroll (dans le flux flexbox, 0 chevauchement) */}
        <div
          className={`hidden lg:flex transition-all duration-500 ease-out overflow-hidden shrink-0 ${
            isScrolled
              ? 'opacity-100 max-w-[240px] translate-x-0 mr-6 pointer-events-auto'
              : 'opacity-0 max-w-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <a href="#accueil" className="group flex flex-col whitespace-nowrap">
            <span className="font-serif text-[15px] tracking-[0.22em] uppercase text-charcoal-main group-hover:text-charcoal-muted transition-colors leading-tight">
              JIREL DE JOIRY
            </span>
            <span className="font-sans text-[8px] tracking-[0.26em] uppercase text-charcoal-subtle">
              {t.brand.tagline}
            </span>
          </a>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 shrink-0">
          <ul className="flex items-center gap-3.5 xl:gap-6">
            {navLinks.map((item) => (
              <li key={item.label + item.href}>
                <a
                  href={item.href}
                  className="editorial-link font-sans text-[11px] tracking-[0.16em] uppercase text-charcoal-muted hover:text-charcoal-main py-1 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Sélecteur de langue FR | EN */}
          <div className="flex items-center gap-2 pl-4 xl:pl-6 border-l border-border-subtle text-[11px] tracking-wider font-medium text-charcoal-subtle shrink-0">
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`transition-colors cursor-pointer ${
                lang === 'fr' ? 'text-charcoal-main font-semibold' : 'hover:text-charcoal-main'
              }`}
            >
              FR
            </button>
            <span className="opacity-40">|</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`transition-colors cursor-pointer ${
                lang === 'en' ? 'text-charcoal-main font-semibold' : 'hover:text-charcoal-main'
              }`}
            >
              EN
            </button>
          </div>
        </nav>

        {/* Logo minimal pour mobile uniquement */}
        <div className="lg:hidden flex flex-col">
          <span className="font-serif text-lg tracking-widest uppercase text-charcoal-main">
            JIREL DE JOIRY
          </span>
        </div>

        {/* Bouton Burger Mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 text-charcoal-main hover:opacity-75 transition-opacity"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
        </button>

      </div>

      {/* Menu Tiroir Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-warm-paper border-b border-border-subtle shadow-lift p-6 animate-fadeIn">
          <ul className="flex flex-col gap-3.5">
            {navLinks.map((item) => (
              <li key={item.label + item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-xs tracking-editorial uppercase text-charcoal-main hover:text-accent-terracotta py-1"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border-subtle text-xs tracking-wider text-charcoal-subtle">
            <span className="text-charcoal-muted uppercase text-[10px] mr-2">
              {lang === 'fr' ? 'Langue :' : 'Language :'}
            </span>
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`p-1 ${lang === 'fr' ? 'font-bold text-charcoal-main' : ''}`}
            >
              FR
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-1 ${lang === 'en' ? 'font-bold text-charcoal-main' : ''}`}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

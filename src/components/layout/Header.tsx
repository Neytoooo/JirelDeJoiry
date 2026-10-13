'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/data/navigation';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ne pas afficher le header public sur le dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b border-border-subtle/60 ${
        isScrolled
          ? 'bg-warm-bg/95 backdrop-blur-md shadow-editorial py-2.5'
          : 'bg-warm-bg/90 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between lg:justify-center relative">
        
        {/* Navigation Desktop centrée et délicate */}
        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="editorial-link font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-muted hover:text-charcoal-main py-1 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Sélecteur de langue FR | EN & Lien Studio */}
          <div className="flex items-center gap-2 pl-6 border-l border-border-subtle text-[11px] tracking-wider font-medium text-charcoal-subtle">
            <button
              type="button"
              onClick={() => setCurrentLang('fr')}
              className={`transition-colors cursor-pointer ${
                currentLang === 'fr' ? 'text-charcoal-main font-semibold' : 'hover:text-charcoal-main'
              }`}
            >
              FR
            </button>
            <span className="opacity-40">|</span>
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`transition-colors cursor-pointer ${
                currentLang === 'en' ? 'text-charcoal-main font-semibold' : 'hover:text-charcoal-main'
              }`}
            >
              EN
            </button>

            {/* Accès discret au studio Anne Martinons */}
            <Link
              href="/dashboard"
              className="ml-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-[#EFE8DD] hover:bg-charcoal-main hover:text-white text-charcoal-muted transition-all flex items-center gap-1.5 shadow-2xs"
              title="Ouvrir le studio d'images Anne Martinons"
            >
              <span className="text-xs">✨</span>
              <span>Studio Anne</span>
            </Link>
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
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
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
            <span className="text-charcoal-muted uppercase text-[10px] mr-2">Langue :</span>
            <button
              type="button"
              onClick={() => setCurrentLang('fr')}
              className={`p-1 ${currentLang === 'fr' ? 'font-bold text-charcoal-main' : ''}`}
            >
              FR
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setCurrentLang('en')}
              className={`p-1 ${currentLang === 'en' ? 'font-bold text-charcoal-main' : ''}`}
            >
              EN
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs tracking-wider uppercase text-charcoal-main font-medium py-1.5"
            >
              <span>Studio Anne Martinons</span>
              <span className="text-xs">✨</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

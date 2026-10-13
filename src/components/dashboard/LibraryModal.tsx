'use client';

import React, { useState } from 'react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title: string;
}

const PRESET_LIBRARY = [
  { label: 'Collage Hero Atelier', url: '/images/hero-collage-2x.png', tag: 'Accueil' },
  { label: 'Nuancier Colorimétrie', url: '/images/univers-colorimetrie.png', tag: 'Univers' },
  { label: 'Décoration & Intérieur', url: '/images/univers-decoration.png', tag: 'Univers' },
  { label: 'Direction Artistique', url: '/images/univers-direction-artistique.png', tag: 'Univers' },
  { label: 'Atelier Tapisserie', url: '/images/univers-tapisserie.png', tag: 'Univers' },
  { label: 'Fond Citation Textile', url: '/images/banner-clean-bg.png', tag: 'Bannière' },
  { label: 'Nuancier Swatches WebP', url: '/images/colorimetrie-swatches.webp', tag: 'Colorimétrie' },
  { label: 'Portrait Drapage Séance', url: '/images/deroulement-portrait.jpg', tag: 'Déroulement' },
  { label: 'Conférencière en séance', url: '/images/ateliers-main-speaker.jpg', tag: 'Ateliers' },
  { label: 'Nuanciers et Lin brut', url: '/images/ateliers-decoration.jpg', tag: 'Ateliers' },
  { label: 'Table de Réception Événement', url: '/images/ateliers-evenements-prives.jpg', tag: 'Ateliers' },
  { label: 'Participants & Moodboards', url: '/images/ateliers-conferences-marques.jpg', tag: 'Ateliers' },
];

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title,
}) => {
  const [filter, setFilter] = useState('Tous');
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const categories = ['Tous', 'Accueil', 'Univers', 'Colorimétrie', 'Déroulement', 'Ateliers', 'Bannière'];

  const filteredPresets = PRESET_LIBRARY.filter((item) => {
    if (filter === 'Tous') return true;
    return item.tag.toLowerCase().includes(filter.toLowerCase());
  });

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-main/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#D6CEBF] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        
        {/* Header du modal */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D7]">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8F877C] font-semibold">
              Bibliothèque du Studio
            </span>
            <h3 className="font-serif text-2xl text-charcoal-main mt-0.5">
              Choisir une image pour « {title} »
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EFE8DD] hover:bg-[#E2D9CC] text-charcoal-main flex items-center justify-center transition-colors text-lg"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Section URL personnalisée rapide */}
        <form onSubmit={handleCustomUrlSubmit} className="mt-4 flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Ou collez directement l'adresse d'une image web (https://...)"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#D6CEBF] rounded-xl focus:outline-hidden focus:border-charcoal-main placeholder:text-charcoal-muted/60"
          />
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="px-4 py-2.5 bg-charcoal-main text-[#FAF7F2] text-xs uppercase tracking-wider font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-40"
          >
            Appliquer
          </button>
        </form>

        {/* Filtres par catégorie */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-sans transition-all shrink-0 ${
                filter === cat
                  ? 'bg-charcoal-main text-white font-medium'
                  : 'bg-[#EFE8DD] text-charcoal-muted hover:bg-[#E2D9CC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des images de la bibliothèque */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredPresets.map((preset) => (
            <div
              key={preset.url}
              onClick={() => {
                onSelect(preset.url);
                onClose();
              }}
              className="group cursor-pointer border border-[#E8E2D7] hover:border-charcoal-main bg-white rounded-xl overflow-hidden p-2 transition-all hover:shadow-md flex flex-col"
            >
              <div className="relative aspect-4/3 w-full bg-[#F4EFE7] rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/univers-colorimetrie.png';
                  }}
                />
                <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/65 text-white text-[9px] uppercase tracking-wider rounded font-sans">
                  {preset.tag}
                </span>
              </div>
              <p className="font-serif text-xs text-charcoal-main mt-2 line-clamp-1 group-hover:text-black font-medium">
                {preset.label}
              </p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 flex items-center gap-1">
                <span>Sélectionner</span> →
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-[#E8E2D7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs uppercase tracking-wider text-charcoal-muted hover:text-charcoal-main transition-colors"
          >
            Annuler
          </button>
        </div>

      </div>
    </div>
  );
};

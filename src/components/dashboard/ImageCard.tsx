'use client';

import React, { useState, useRef } from 'react';
import { SiteImageItem } from '@/types/images';
import { LibraryModal } from './LibraryModal';

interface ImageCardProps {
  item: SiteImageItem;
  currentSrc: string;
  isCustomized: boolean;
  onUpdate: (id: string, newSrc: string) => void;
  onReset: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  currentSrc,
  isCustomized,
  onUpdate,
  onReset,
  onNotify,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Déterminer si l'emplacement n'a pas encore de photo
  const hasPhoto = Boolean(currentSrc || (item.hasDefaultPhoto && item.defaultSrc));
  const isAwaitingPhoto = !item.hasDefaultPhoto && !isCustomized;

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'enregistrement de l'image");
      }

      const data = await res.json();
      if (data.url) {
        onUpdate(item.id, data.url);
        onNotify(`✨ Photo ajoutée pour « ${item.title} » !`);
      }
    } catch (err) {
      console.warn('Upload API fallback vers Data URL:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUpdate(item.id, e.target.result as string);
          onNotify(`✨ Photo appliquée pour « ${item.title} » !`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const displayedSrc = showOriginal ? item.defaultSrc : currentSrc;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group border ${
        isAwaitingPhoto
          ? 'border-dashed border-amber-300/80 bg-amber-50/15'
          : isCustomized
          ? 'border-accent-terracotta/40'
          : 'border-[#E2D9CC]'
      }`}
    >
      
      {/* Header de la carte */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3 border-b border-[#F1ECE3]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium bg-[#EFE8DD] text-charcoal-muted">
              {item.section}
            </span>

            {/* Badges dynamiques */}
            {isAwaitingPhoto ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                <span>⏳</span>
                <span>En attente de photo</span>
              </span>
            ) : isCustomized ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-accent-terracotta/15 text-accent-terracotta flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-terracotta animate-pulse" />
                Personnalisée
              </span>
            ) : (
              <span className="text-[10px] font-sans text-charcoal-muted/70 tracking-wider">
                Originale
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg text-charcoal-main mt-1.5 font-normal truncate">
            {item.title}
          </h3>
          <p className="font-sans text-[11px] text-charcoal-muted line-clamp-1 mt-0.5">
            {item.description}
          </p>
        </div>

        {/* Bouton bascule Avant/Après si personnalisé et s'il y avait une photo d'origine */}
        {isCustomized && item.hasDefaultPhoto && (
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-lg border transition-all shrink-0 ${
              showOriginal
                ? 'bg-charcoal-main text-white border-charcoal-main'
                : 'bg-[#F4EFE7] hover:bg-[#EAE2D5] text-charcoal-muted border-[#D6CEBF]'
            }`}
            title="Comparer avec l'image originale"
          >
            {showOriginal ? '👀 Original' : '✨ Actuel'}
          </button>
        )}
      </div>

      {/* Zone visuelle & Drag and Drop */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full bg-[#F4EFE7] cursor-pointer overflow-hidden transition-all ${
          isDragging
            ? 'ring-4 ring-accent-terracotta ring-inset bg-accent-terracotta/10'
            : isAwaitingPhoto && !displayedSrc
            ? 'bg-linear-to-b from-[#FAF7F2] to-[#F1ECE3] aspect-[4/3]'
            : ''
        }`}
      >
        {displayedSrc ? (
          <img
            src={displayedSrc}
            alt={item.title}
            className="w-full h-auto max-h-[580px] object-cover transition-transform duration-500 group-hover:scale-[1.02] block"
          />
        ) : item.illustrationSrc ? (
          <div className="w-full aspect-[4/3] flex items-center justify-center p-8 opacity-80 group-hover:opacity-100 transition-all">
            <img
              src={item.illustrationSrc}
              alt={item.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          /* Placeholder ludique invitant à déposer une photo */
          <div className="w-full aspect-[4/3] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#D6CEBF]/70 m-2 rounded-xl max-w-[calc(100%-1rem)] max-h-[calc(100%-1rem)] bg-white/40">
            <span className="text-3xl mb-1 text-charcoal-muted/70 animate-bounce">
              📷
            </span>
            <span className="font-serif text-sm text-charcoal-main font-normal">
              Aucune photo pour l'instant
            </span>
            <span className="text-[11px] font-sans text-accent-terracotta font-medium mt-1">
              + Cliquer pour ajouter votre photo
            </span>
          </div>
        )}

        {/* Overlay hover avec indication ludique */}
        <div className="absolute inset-0 bg-charcoal-main/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center backdrop-blur-2xs">
          <div className="w-12 h-12 rounded-full bg-white/90 text-charcoal-main flex items-center justify-center shadow-lg text-xl mb-2 transition-transform group-hover:scale-110">
            {isAwaitingPhoto ? '✨' : '📸'}
          </div>
          <span className="text-white text-xs font-medium uppercase tracking-wider">
            {isAwaitingPhoto ? 'Ajouter une photo' : 'Remplacer la photo'}
          </span>
          <span className="text-white/80 text-[10px] mt-1 font-sans">
            Glisser-déposer ou cliquer
          </span>
        </div>

        {/* Feedback lors du drag over */}
        {isDragging && (
          <div className="absolute inset-0 bg-accent-terracotta/80 text-white flex flex-col items-center justify-center z-20">
            <span className="text-3xl mb-1">✨</span>
            <span className="text-sm font-semibold uppercase tracking-wider">
              Déposez la nouvelle photo ici !
            </span>
          </div>
        )}

        {/* Loader upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-charcoal-main/80 text-white flex flex-col items-center justify-center z-30">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
            <span className="text-xs uppercase tracking-wider font-sans">
              Enregistrement...
            </span>
          </div>
        )}

        {/* Format conseillé */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white/90 text-[9px] font-sans tracking-wide backdrop-blur-xs">
          {item.recommendedSize}
        </div>
      </div>

      {/* Barre d'outils d'actions ludiques */}
      <div className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-[#F1ECE3] flex items-center justify-between gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Bouton Ajouter / Changer */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 shadow-2xs ${
              isAwaitingPhoto
                ? 'bg-accent-terracotta hover:bg-[#A35540] text-white border border-transparent'
                : 'bg-white hover:bg-[#F3ECE2] text-charcoal-main border border-[#D6CEBF]'
            }`}
          >
            <span>{isAwaitingPhoto ? '➕' : '📁'}</span>
            <span>{isAwaitingPhoto ? 'Ajouter' : 'Changer'}</span>
          </button>

          {/* Bouton Galerie */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-white hover:bg-[#F3ECE2] text-charcoal-main border border-[#D6CEBF] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>🖼️</span>
            <span>Galerie</span>
          </button>
        </div>

        {/* Bouton Réinitialiser / Supprimer */}
        {isCustomized ? (
          <button
            type="button"
            onClick={() => {
              onReset(item.id);
              onNotify(
                item.hasDefaultPhoto
                  ? `Photo réinitialisée pour « ${item.title} »`
                  : `Photo retirée pour « ${item.title} » (retour au placeholder)`
              );
            }}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-sans text-[#8F877C] hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1"
            title={
              item.hasDefaultPhoto
                ? "Revenir à la photo d'origine"
                : 'Supprimer la photo ajoutée'
            }
          >
            <span>↺</span>
            <span className="hidden sm:inline">
              {item.hasDefaultPhoto ? 'Rétablir' : 'Retirer'}
            </span>
          </button>
        ) : (
          <span className="text-[10px] text-charcoal-muted/60 font-sans italic">
            {item.hasDefaultPhoto ? "Photo d'origine" : 'En attente'}
          </span>
        )}
      </div>

      {/* Modal Bibliothèque */}
      <LibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(newUrl) => {
          onUpdate(item.id, newUrl);
          onNotify(`✨ Image appliquée depuis la galerie pour « ${item.title} » !`);
        }}
        title={item.title}
      />

    </div>
  );
};

'use client';

import React from 'react';
import { Button } from './Button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  hideCloseButton = false,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const widthClass =
    maxWidth === 'lg'
      ? 'max-w-xl'
      : maxWidth === 'sm'
      ? 'max-w-sm'
      : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-dark/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${widthClass} bg-warm-bg border border-border-medium p-6 sm:p-8 shadow-lift text-left max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton croix en haut à droite */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-charcoal-muted hover:text-charcoal-main hover:bg-black/5 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {title && (
          <h3 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-charcoal-main mb-3 pr-8">
            {title}
          </h3>
        )}

        <div className="text-charcoal-muted text-sm leading-relaxed">
          {children}
        </div>

        {!hideCloseButton && (
          <div className="mt-6">
            <Button variant="dark" showArrow={false} onClick={onClose} fullWidth>
              FERMER
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

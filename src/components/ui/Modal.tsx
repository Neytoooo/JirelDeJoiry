'use client';

import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-dark/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-warm-bg border border-border-medium p-8 text-center shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-2xl uppercase tracking-wider text-charcoal-main mb-3">
          {title}
        </h3>
        <div className="text-charcoal-muted text-sm leading-relaxed mb-6">
          {children}
        </div>
        <Button variant="dark" showArrow={false} onClick={onClose} fullWidth>
          FERMER
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { AspectRatio } from '@/types';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  src?: string;
  alt?: string;
  tag?: string;
  dimensionLabel?: string;
  ratio?: AspectRatio;
  illustrationSrc?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  src,
  alt = 'Emplacement visuel',
  tag,
  dimensionLabel,
  ratio = 'portrait',
  illustrationSrc,
  className = '',
  children,
}) => {
  const ratioStyles: Record<AspectRatio, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    'tall-portrait': 'aspect-[3/4]',
    landscape: 'aspect-[16/10]',
    'wide-banner': 'aspect-[21/9] min-h-[220px]',
    'vertical-banner': 'aspect-[9/16] min-h-[460px]',
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#F5EFE6] to-[#EAE2D5] border border-border-subtle overflow-hidden transition-all duration-300 hover:border-border-medium hover:shadow-editorial group select-none ${ratioStyles[ratio]} ${className}`}
    >
      {/* Texture de fond subtile */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#201D1A 0.4px, transparent 0.4px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Si une vraie image est injectée */}
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
        />
      ) : illustrationSrc ? (
        /* Si une illustration décorative vectorielle est fournie */
        <div className="absolute inset-0 flex items-center justify-center p-6 opacity-85 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105">
          <img
            src={illustrationSrc}
            alt={alt}
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
      ) : (
        /* Placeholder par défaut avec badge et icône */
        <div className="relative z-10 flex flex-col items-center text-center gap-1.5 p-4">
          <ImageIcon className="w-6 h-6 stroke-charcoal-subtle opacity-70 stroke-[1.4]" />
          {tag && (
            <span className="font-sans text-[11px] font-medium tracking-wider uppercase text-charcoal-muted bg-warm-bg/90 backdrop-blur-sm px-2.5 py-1 border border-border-subtle/80">
              {tag}
            </span>
          )}
          {dimensionLabel && (
            <span className="font-sans text-[10px] text-charcoal-subtle tracking-normal">
              {dimensionLabel}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

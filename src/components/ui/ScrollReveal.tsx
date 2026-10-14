'use client';

import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-in'
  | 'fade-left'
  | 'fade-right'
  | 'image-reveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number; // en millisecondes (ex: 100, 200)
  duration?: number; // en millisecondes (défaut: 750)
  threshold?: number; // ratio de visibilité (défaut: 0.15)
  className?: string;
  as?: 'div' | 'span' | 'section' | 'article' | 'li' | 'ul';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.15,
  className = '',
  as: Component = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Si le navigateur ne gère pas IntersectionObserver, afficher directement
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getAnimationStyles = (): {
    transition: string;
    opacity: number;
    transform: string;
  } => {
    const transitionTiming = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const transition = `opacity ${duration}ms ${transitionTiming} ${delay}ms, transform ${duration}ms ${transitionTiming} ${delay}ms`;

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            transition,
            opacity: 0,
            transform: 'translate3d(0, 22px, 0)',
          };
        case 'fade-in':
          return {
            transition,
            opacity: 0,
            transform: 'translate3d(0, 0, 0)',
          };
        case 'fade-left':
          return {
            transition,
            opacity: 0,
            transform: 'translate3d(-24px, 0, 0)',
          };
        case 'fade-right':
          return {
            transition,
            opacity: 0,
            transform: 'translate3d(24px, 0, 0)',
          };
        case 'image-reveal':
          return {
            transition,
            opacity: 0,
            transform: 'scale(1.03)',
          };
        default:
          return {
            transition,
            opacity: 0,
            transform: 'translate3d(0, 20px, 0)',
          };
      }
    }

    return {
      transition,
      opacity: 1,
      transform: animation === 'image-reveal' ? 'scale(1)' : 'translate3d(0, 0, 0)',
    };
  };

  const animStyles = getAnimationStyles();

  return (
    <Component
      ref={elementRef as any}
      className={`will-change-[opacity,transform] ${className}`}
      style={animStyles}
    >
      {children}
    </Component>
  );
};

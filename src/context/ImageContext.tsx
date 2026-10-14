'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteImageItem, ImageContextType } from '@/types/images';

export const ALL_SITE_IMAGES: SiteImageItem[] = [
  // --- SECTIONS AYANT DÉJÀ UNE PHOTO OFFICIELLE ---
  {
    id: 'hero-collage',
    title: 'Composition Principale (Collage)',
    section: 'Accueil',
    description: "Le grand collage éditorial asymétrique à droite du titre d'accueil.",
    recommendedSize: '800 × 750 px (PNG transparent)',
    defaultSrc: '/images/hero-collage-2x.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'univers-colorimetrie',
    title: 'Univers 01 — Colorimétrie',
    section: 'Mes Univers',
    description: 'Première carte de la galerie des univers, dédiée au conseil couleur.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '/images/univers-colorimetrie.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'univers-decoration',
    title: 'Univers 02 — Décoration & Intérieur',
    section: 'Mes Univers',
    description: 'Deuxième carte de la galerie des univers, dédiée aux intérieurs.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '/images/univers-decoration.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'univers-direction-artistique',
    title: 'Univers 03 — Direction Artistique',
    section: 'Mes Univers',
    description: 'Troisième carte de la galerie des univers, création et identité.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '/images/univers-direction-artistique.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'univers-tapisserie',
    title: 'Univers 04 — Atelier Tapisserie',
    section: 'Mes Univers',
    description: 'Quatrième carte de la galerie des univers, savoir-faire textile.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '/images/univers-tapisserie.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'banner-bg',
    title: 'Bannière Citation — Fond Textile',
    section: 'Bannière',
    description: "Arrière-plan de la citation « Imaginer aujourd'hui les couleurs de demain ».",
    recommendedSize: '1920 × 700 px (Panoramique)',
    defaultSrc: '/images/banner-clean-bg.png',
    hasDefaultPhoto: true,
  },
  {
    id: 'colorimetrie-swatches',
    title: 'Nuancier & Échantillons Couleurs',
    section: 'Colorimétrie',
    description: 'Visuel central de la section colorimétrie avec les gammes de teintes.',
    recommendedSize: '600 × 800 px (Portrait)',
    defaultSrc: '/images/colorimetrie-swatches.webp',
    hasDefaultPhoto: true,
  },
  {
    id: 'booking-calendar-photo',
    title: 'Réservation Séance — Nuancier & Tissus',
    section: 'Colorimétrie',
    description: 'Photo centrale du module de réservation de séance (nuancier, étoffes et atelier).',
    recommendedSize: '800 × 1000 px (Portrait)',
    defaultSrc: '/images/booking-colorimetrie-nuancier.jpg',
    hasDefaultPhoto: true,
  },
  {
    id: 'deroulement-portrait',
    title: 'Portrait Séance Drapage & Tissus',
    section: 'Déroulement',
    description: 'Photo de droite des 5 étapes avec la citation incrustée.',
    recommendedSize: '565 × 1024 px (Haut portrait)',
    defaultSrc: '/images/deroulement-portrait.jpg',
    hasDefaultPhoto: true,
  },
  {
    id: 'ateliers-speaker',
    title: 'Conférence — Photo Principale',
    section: 'Ateliers & Conférences',
    description: 'Photo haute résolution de la conférencière face au public.',
    recommendedSize: '1000 × 650 px (Paysage)',
    defaultSrc: '/images/ateliers-main-speaker.jpg',
    hasDefaultPhoto: true,
  },
  {
    id: 'ateliers-deco',
    title: 'Atelier 01 — Décoration & Intérieur',
    section: 'Ateliers & Conférences',
    description: 'Carte 1 : rouleaux de lin, nuanciers et détails laiton.',
    recommendedSize: '600 × 450 px (Paysage)',
    defaultSrc: '/images/ateliers-decoration.jpg',
    hasDefaultPhoto: true,
  },
  {
    id: 'ateliers-events',
    title: 'Atelier 02 — Événements Privés',
    section: 'Ateliers & Conférences',
    description: 'Carte 2 : grande table de réception dressée et compositions florales.',
    recommendedSize: '600 × 450 px (Paysage)',
    defaultSrc: '/images/ateliers-evenements-prives.jpg',
    hasDefaultPhoto: true,
  },
  {
    id: 'ateliers-brands',
    title: 'Atelier 03 — Conférences Marques',
    section: 'Ateliers & Conférences',
    description: 'Carte 3 : participants en atelier face aux moodboards.',
    recommendedSize: '600 × 450 px (Paysage)',
    defaultSrc: '/images/ateliers-conferences-marques.jpg',
    hasDefaultPhoto: true,
  },

  // --- SECTIONS EN ATTENTE DE PHOTO (PLACEHOLDERS ARTISTIQUES) ---
  {
    id: 'art-direction-moodboard',
    title: 'Moodboard Tendances & Matières',
    section: 'Direction Artistique',
    description: 'Grand visuel horizontal : harmonies céramiques, lin et nuanciers.',
    recommendedSize: '1200 × 750 px (Paysage)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/swatch-palette.svg',
  },
  {
    id: 'tapisserie-pelotes',
    title: 'Pelotes de Laine & Matières Brutes',
    section: 'Atelier Tapisserie',
    description: 'Première photo verticale de la tapisserie : textures, laines et pelotes.',
    recommendedSize: '600 × 800 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
  },
  {
    id: 'tapisserie-piece-unique',
    title: 'Tapisserie Tuftée (Pièce Unique)',
    section: 'Atelier Tapisserie',
    description: 'Deuxième photo verticale : œuvre textile finalisée en relief et gestes artisanaux.',
    recommendedSize: '600 × 800 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
  },
  {
    id: 'motifs-textile',
    title: 'Motif Textile (Soleil & Tapis)',
    section: 'Création de Motifs',
    description: 'Carré de présentation de la création de motifs et ornementation.',
    recommendedSize: '800 × 800 px (Carré)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/tapestry-sun.svg',
  },
  {
    id: 'app-papier-peint',
    title: 'Application 01 — Papier Peint',
    section: 'Exemples d’Applications',
    description: 'Mise en situation murale : lé de papier peint panoramique à motif.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/bird-tapestry.svg',
  },
  {
    id: 'app-textile-ameublement',
    title: 'Application 02 — Textile d’Ameublement',
    section: 'Exemples d’Applications',
    description: 'Mise en situation textile : coussins, rideaux ou fauteuil tapissé.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/flower-ornament.svg',
  },
  {
    id: 'app-mode-accessoires',
    title: 'Application 03 — Mode & Soie',
    section: 'Exemples d’Applications',
    description: 'Mise en situation mode : foulard de soie, écharpe ou accessoire couture.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/swatch-palette.svg',
  },
  {
    id: 'app-objets-deco',
    title: 'Application 04 — Objets & Décoration',
    section: 'Exemples d’Applications',
    description: 'Mise en situation déco : céramique, papeterie ou luminaire.',
    recommendedSize: '600 × 750 px (Portrait)',
    defaultSrc: '',
    hasDefaultPhoto: false,
    illustrationSrc: '/illustrations/tapestry-sun.svg',
  },
  {
    id: 'contact-oeuvre-textile',
    title: 'Illustration Artistique / Contact',
    section: 'Contact & Devis',
    description: 'Visuel végétal et poétique accompagnant le formulaire de demande de projet.',
    recommendedSize: '800 × 600 px (Paysage)',
    defaultSrc: '/images/contact-bird.jpg',
    hasDefaultPhoto: true,
  },
];

const STORAGE_KEY = 'jirel_custom_site_images_v1';

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger depuis localStorage immédiatement, puis synchroniser avec MongoDB
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCustomImages(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Erreur chargement images locales:', e);
    }
    setIsLoaded(true);

    // Synchronisation avec MongoDB via l'API
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        if (data.images && Object.keys(data.images).length > 0) {
          setCustomImages((prev) => {
            const merged = { ...prev, ...data.images };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch((err) => {
        console.info('Mode hors-ligne ou MongoDB en attente de configuration:', err);
      });
  }, []);

  // Sauvegarder dans localStorage + envoyer à MongoDB
  const saveImages = (newMap: Record<string, string>) => {
    setCustomImages(newMap);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
    } catch (e) {
      console.warn('Erreur sauvegarde images:', e);
    }

    // Persistance dans MongoDB
    fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: newMap }),
    }).catch((err) => {
      console.warn('Erreur synchronisation API MongoDB:', err);
    });
  };

  const getImage = (id: string, fallback?: string): string => {
    if (customImages[id]) {
      return customImages[id];
    }
    const item = ALL_SITE_IMAGES.find((img) => img.id === id);
    return item?.defaultSrc || fallback || '';
  };

  const setImage = (id: string, newSrc: string) => {
    const updated = { ...customImages, [id]: newSrc };
    saveImages(updated);
  };

  const resetImage = (id: string) => {
    const updated = { ...customImages };
    delete updated[id];
    saveImages(updated);
  };

  const resetAllImages = () => {
    saveImages({});
  };

  const isCustomized = (id: string): boolean => {
    return Boolean(customImages[id]);
  };

  const totalCustomizedCount = Object.keys(customImages).length;

  // Calcul du nombre de photos qui n'ont ni photo par défaut ni personnalisation
  const pendingPhotosCount = ALL_SITE_IMAGES.filter(
    (item) => !item.hasDefaultPhoto && !customImages[item.id]
  ).length;

  const items: SiteImageItem[] = ALL_SITE_IMAGES.map((item) => ({
    ...item,
    currentSrc: customImages[item.id] || item.defaultSrc,
  }));

  return (
    <ImageContext.Provider
      value={{
        images: customImages,
        items,
        getImage,
        setImage,
        resetImage,
        resetAllImages,
        isCustomized,
        totalCustomizedCount,
        pendingPhotosCount,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useSiteImages = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    return {
      images: {},
      items: ALL_SITE_IMAGES,
      getImage: (id: string, fallback?: string) => {
        const item = ALL_SITE_IMAGES.find((img) => img.id === id);
        return item?.defaultSrc || fallback || '';
      },
      setImage: () => {},
      resetImage: () => {},
      resetAllImages: () => {},
      isCustomized: () => false,
      totalCustomizedCount: 0,
      pendingPhotosCount: 9,
    };
  }
  return context;
};

import { GalleryItem } from '@/types';

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'TOUS' },
  { id: 'papier-peint', label: 'PAPIER PEINT' },
  { id: 'textile', label: 'TEXTILE' },
  { id: 'mode', label: 'MODE' },
  { id: 'accessoires', label: 'ACCESSOIRES' },
  { id: 'stationery', label: 'STATIONERY' },
  { id: 'broderie', label: 'BRODERIE' },
  { id: 'sur-mesure', label: 'SUR MESURE' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'app-1',
    category: 'papier-peint',
    title: 'PAPIER PEINT',
    subtitle: 'Univers intérieurs',
    tag: 'Papier Peint',
  },
  {
    id: 'app-2',
    category: 'textile',
    title: 'TEXTILE',
    subtitle: 'Ameublement & décoration',
    tag: 'Ameublement',
  },
  {
    id: 'app-3',
    category: 'mode',
    title: 'MODE & ACCESSOIRES',
    subtitle: 'Vêtements, foulards, sacs...',
    tag: 'Mode & Soierie',
  },
  {
    id: 'app-4',
    category: 'stationery',
    title: 'STATIONERY',
    subtitle: 'Carnets, cartes, packaging',
    tag: 'Papeterie d\'Art',
  },
  {
    id: 'app-5',
    category: 'broderie',
    title: 'BRODERIE',
    subtitle: 'Détails et savoir-faire',
    tag: 'Savoir-faire',
    illustrationSrc: '/illustrations/tapestry-sun.svg',
  },
  {
    id: 'app-6',
    category: 'accessoires',
    title: 'ACCESSOIRES DESIGN',
    subtitle: 'Maroquinerie & soierie',
    tag: 'Accessoires',
  },
  {
    id: 'app-7',
    category: 'sur-mesure',
    title: 'COMMANDE SPÉCIALE',
    subtitle: 'Édition numérotée pour architectes',
    tag: 'Sur Mesure',
  },
];

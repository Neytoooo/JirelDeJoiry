export interface SiteImageItem {
  id: string;
  title: string;
  section: string;
  description: string;
  recommendedSize: string;
  defaultSrc: string; // URL ou vide si en attente de photo
  currentSrc?: string;
  illustrationSrc?: string; // Illustration vectorielle de remplacement si pas encore de photo
  hasDefaultPhoto: boolean;
  updatedAt?: string;
}

export interface ImageContextType {
  images: Record<string, string>;
  items: SiteImageItem[];
  getImage: (id: string, fallback?: string) => string;
  setImage: (id: string, newSrc: string) => void;
  resetImage: (id: string) => void;
  resetAllImages: () => void;
  isCustomized: (id: string) => boolean;
  totalCustomizedCount: number;
  pendingPhotosCount: number;
}

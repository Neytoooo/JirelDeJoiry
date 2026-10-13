export type AspectRatio =
  | 'square'
  | 'portrait'
  | 'tall-portrait'
  | 'landscape'
  | 'wide-banner'
  | 'vertical-banner';

export interface NavItem {
  label: string;
  href: string;
}

export interface UniversCardData {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  href: string;
  iconName?: string;
  illustrationSrc?: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  tag: string;
  illustrationSrc?: string;
}

export interface BookingSlot {
  time: string;
  available: boolean;
}

export interface ProjectFormData {
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  description: string;
  wishes: string[];
  clientType: string[];
}

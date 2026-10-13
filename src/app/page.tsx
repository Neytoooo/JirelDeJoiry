import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { UniversGrid } from '@/components/sections/UniversGrid';
import { QuoteBanner } from '@/components/sections/QuoteBanner';
import { TrustBanner } from '@/components/sections/TrustBanner';
import { Colorimetrie } from '@/components/sections/Colorimetrie';
import { BookingCalendar } from '@/components/sections/BookingCalendar';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { Workshops } from '@/components/sections/Workshops';
import { ArtDirection } from '@/components/sections/ArtDirection';
import { TapestryAtelier } from '@/components/sections/TapestryAtelier';
import { Patterns } from '@/components/sections/Patterns';
import { ApplicationsGallery } from '@/components/sections/ApplicationsGallery';
import { Collaborations } from '@/components/sections/Collaborations';
import { ContactProjectForm } from '@/components/sections/ContactProjectForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <UniversGrid />
      <QuoteBanner />
      <TrustBanner />
      <Colorimetrie />
      <BookingCalendar />
      <ProcessSteps />
      <Workshops />
      <ArtDirection />
      <TapestryAtelier />
      <Patterns />
      <ApplicationsGallery />
      <Collaborations />
      <ContactProjectForm />
    </>
  );
}

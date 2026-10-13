import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageProvider } from '@/context/ImageContext';

export const metadata: Metadata = {
  title: 'JIREL DE JOIRY — Couleur · Textile · Création',
  description:
    'Designer textile, styliste et experte en colorimétrie à Paris. Des univers sensibles où la couleur révèle, relie et inspire.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-warm-bg text-charcoal-main font-sans antialiased selection:bg-accent-terracotta selection:text-white">
        <ImageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ImageProvider>
      </body>
    </html>
  );
}

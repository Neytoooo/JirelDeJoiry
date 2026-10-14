'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSiteImages } from '@/context/ImageContext';
import { ImageCard } from '@/components/dashboard/ImageCard';
import { BookingsView } from '@/components/dashboard/BookingsView';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

export default function DashboardPage() {
  const {
    items,
    setImage,
    resetImage,
    resetAllImages,
    isCustomized,
    totalCustomizedCount,
    pendingPhotosCount,
  } = useSiteImages();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photos' | 'bookings'>('photos');
  const [activeSection, setActiveSection] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } catch {
      window.location.href = '/admin';
    }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 3800);
  };

  const sections = [
    'Tous',
    '⏳ En attente de photo',
    'Accueil',
    'Mes Univers',
    'Bannière',
    'Colorimétrie',
    'Déroulement',
    'Ateliers & Conférences',
    'Direction Artistique',
    'Atelier Tapisserie',
    'Création de Motifs',
    'Exemples d’Applications',
    'Contact & Devis',
  ];

  const filteredItems = items.filter((item) => {
    // Gestion du filtre spécial "En attente de photo"
    if (activeSection === '⏳ En attente de photo') {
      const isPending = !item.hasDefaultPhoto && !isCustomized(item.id);
      if (!isPending) return false;
    } else if (activeSection !== 'Tous') {
      if (item.section !== activeSection) return false;
    }

    // Filtre de recherche
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  const handleResetAll = () => {
    if (
      totalCustomizedCount > 0 &&
      window.confirm(
        'Êtes-vous sûre de vouloir réinitialiser toutes les photos personnalisées aux images d’origine du site ?'
      )
    ) {
      resetAllImages();
      notify('Toutes les images ont été réinitialisées aux originaux ✨');
    }
  };

  const totalPhotosFilled = items.length - pendingPhotosCount;
  const progressPercent = Math.round((totalPhotosFilled / items.length) * 100);

  return (
    <div className="min-h-screen bg-[#F4F0E9] text-charcoal-main pb-20">
      
      {/* Barre de navigation supérieure du Studio */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E2D9CC] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal-muted hover:text-charcoal-main transition-colors"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
            <span>Retour au site</span>
          </Link>
          <span className="text-[#D6CEBF]" aria-hidden="true">|</span>
          
          {/* Sélecteur de mode Studio Photos / Réservations */}
          <div className="flex items-center bg-[#EAE2D5] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-white text-charcoal-main font-semibold shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-main'
              }`}
            >
              🖼️ Photos du site
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans tracking-wider uppercase transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-white text-charcoal-main font-semibold shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal-main'
              }`}
            >
              📅 Réservations
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-charcoal-main hover:bg-black text-[#FAF7F2] transition-all flex items-center gap-2 shadow-xs"
          >
            <span>👀 Voir le site</span>
            <span className="text-[10px]">↗</span>
          </Link>

          <LogoutButton onLogout={handleLogout} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
        
        {activeTab === 'bookings' ? (
          <BookingsView />
        ) : (
          <>
            {/* Bannière de Bienvenue Anne Martinons */}
            <section className="bg-white border border-[#E2D9CC] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden mb-10">
          
          {/* Motifs décoratifs de fond */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-[#EAE2D5]/40 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-48 h-48 bg-accent-terracotta/5 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar monogramme Anne Martinons */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#BAA58F] to-[#8C7A6B] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl shadow-sm shrink-0 border border-white">
                AM
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#EFE8DD] text-charcoal-muted">
                    Studio Créatif
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    Synchronisation active
                  </span>
                </div>

                {/* Titre principal Bienvenue Anne Martinons */}
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-main font-normal tracking-wide mt-2">
                  Bienvenue Anne Martinons
                </h1>

                <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-1.5 max-w-xl leading-relaxed">
                  Personnalisez facilement les visuels et étoffes de votre univers. Glissez-déposez vos photos, prévisualisez en direct et sublimez chaque section de votre site.
                </p>

                {/* Barre de progression des photos */}
                <div className="mt-4 flex items-center gap-3 max-w-md">
                  <div className="flex-1 h-2 bg-[#EFE8DD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#BAA58F] to-accent-terracotta rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-sans font-medium text-charcoal-muted shrink-0">
                    {totalPhotosFilled} / {items.length} visuels pourvus ({progressPercent}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Statistiques rapides et bouton Reset */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-[#F1ECE3]">
              
              <div className="flex items-center md:flex-col md:items-end gap-4 md:gap-1 text-left md:text-right">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">
                    Personnalisées
                  </span>
                  <span className="font-serif text-xl sm:text-2xl text-accent-terracotta font-medium">
                    {totalCustomizedCount}
                  </span>
                </div>

                {pendingPhotosCount > 0 && (
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 block">
                      En attente de photo
                    </span>
                    <button
                      onClick={() => setActiveSection('⏳ En attente de photo')}
                      className="font-serif text-xl sm:text-2xl text-amber-800 font-semibold underline decoration-dotted hover:text-amber-900"
                      title="Cliquez pour filtrer les photos manquantes"
                    >
                      {pendingPhotosCount}
                    </button>
                  </div>
                )}
              </div>

              {totalCustomizedCount > 0 && (
                <button
                  onClick={handleResetAll}
                  className="px-3.5 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors font-medium flex items-center gap-1.5"
                >
                  <span>↺</span>
                  <span>Tout réinitialiser</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* Barre de contrôle : Filtres par section & Recherche */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Onglets des sections */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sections.map((sec) => {
              const isPendingTab = sec === '⏳ En attente de photo';
              const isActive = activeSection === sec;

              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-sans transition-all shrink-0 ${
                    isActive
                      ? isPendingTab
                        ? 'bg-amber-800 text-white font-semibold shadow-xs'
                        : 'bg-charcoal-main text-[#FAF7F2] font-semibold shadow-xs'
                      : isPendingTab
                      ? 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300/80 font-medium'
                      : 'bg-white hover:bg-[#EFE8DD] text-charcoal-muted border border-[#E2D9CC]'
                  }`}
                >
                  {sec}
                  {isPendingTab && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900 text-white">
                      {pendingPhotosCount}
                    </span>
                  )}
                  {sec === 'Tous' && (
                    <span className="ml-1.5 text-[10px] opacity-75">
                      ({items.length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Recherche */}
          <div className="w-full lg:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une section, titre..."
              className="w-full px-4 py-2 pl-9 bg-white border border-[#E2D9CC] rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-charcoal-main placeholder:text-charcoal-muted/60"
            />
            <span className="absolute left-3 top-2.5 text-xs text-charcoal-muted/70">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-charcoal-muted hover:text-charcoal-main"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Message d'état pour le filtre "En attente de photo" */}
        {activeSection === '⏳ En attente de photo' && (
          <div className="mb-6 p-4 bg-amber-100/60 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>
                <strong>{filteredItems.length} emplacements</strong> sont actuellement sans photo officielle. Glissez ou ajoutez une photo pour chaque fiche ci-dessous, elle s'affichera immédiatement sur votre site !
              </span>
            </div>
            <button
              onClick={() => setActiveSection('Tous')}
              className="text-amber-950 font-medium underline underline-offset-2 hover:opacity-80 shrink-0 ml-4"
            >
              Voir tous les visuels
            </button>
          </div>
        )}

        {/* Grille des cartes d'images */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-[#E2D9CC] rounded-2xl p-12 text-center my-6">
            <p className="font-serif text-xl text-charcoal-main">
              {activeSection === '⏳ En attente de photo'
                ? 'Félicitations ! Toutes les sections de votre site ont désormais une photo 🎉'
                : 'Aucun visuel ne correspond à votre recherche'}
            </p>
            <button
              onClick={() => {
                setActiveSection('Tous');
                setSearchQuery('');
              }}
              className="mt-3 text-xs uppercase tracking-wider text-accent-terracotta underline font-medium"
            >
              Afficher tous les visuels
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                currentSrc={item.currentSrc || item.defaultSrc}
                isCustomized={isCustomized(item.id)}
                onUpdate={setImage}
                onReset={resetImage}
                onNotify={notify}
              />
            ))}
          </div>
        )}

        {/* Note d'inspiration & guide textile */}
        <section className="mt-14 p-6 sm:p-8 bg-[#FAF7F2] border border-[#E2D9CC] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎨</span>
            <div>
              <h4 className="font-serif text-lg text-charcoal-main">
                Guide des formats d'attente
              </h4>
              <p className="font-sans text-xs text-charcoal-muted mt-0.5 max-w-2xl leading-relaxed">
                Tant qu'une photo n'est pas ajoutée, le site affiche un placeholder élégant ou une illustration vectorielle d'artisanat textile. Dès que vous importez votre photo, elle remplace automatiquement le placeholder en direct.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white hover:bg-[#F3ECE2] text-charcoal-main border border-[#D6CEBF] rounded-xl text-xs uppercase tracking-wider font-medium transition-all shrink-0"
          >
            Aller sur le site
          </Link>
        </section>
        </>
        )}

      </main>

      {/* Toast Notification flottante */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-main text-[#FAF7F2] px-5 py-3.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <span className="text-base">🎉</span>
          <span className="text-xs sm:text-sm font-sans tracking-wide">
            {notification}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="text-white/70 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

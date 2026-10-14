'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Mail, Instagram, MapPin, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteImages } from '@/context/ImageContext';

export const ContactProjectForm: React.FC = () => {
  const { t } = useLanguage();
  const { getImage } = useSiteImages();
  const contactBirdSrc = getImage('contact-oeuvre-textile', '/images/contact-bird.jpg');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });

  const [wishes, setWishes] = useState<string[]>([]);
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const handleWishToggle = (val: string) => {
    setWishes((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleClientTypeToggle = (val: string) => {
    setClientTypes((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const wishesList = [
    { id: 'colorimetrie', label: t.contact.wish1 },
    { id: 'atelier', label: t.contact.wish2 },
    { id: 'decoration', label: t.contact.wish3 },
    { id: 'motif', label: t.contact.wish4 },
    { id: 'devis', label: t.contact.wish5 },
    { id: 'autre', label: t.contact.wish6 },
  ];

  const clientTypesList = [
    { id: 'particulier', label: t.contact.client1 },
    { id: 'marque', label: t.contact.client2 },
    { id: 'archi', label: t.contact.client3 },
    { id: 'presse', label: t.contact.client4 },
    { id: 'autre', label: t.contact.client5 },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* En-tête de section */}
        <div className="mb-12 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-widest text-charcoal-main">
            {t.contact.title}
          </h2>
          <p className="font-serif italic text-xl sm:text-2xl text-charcoal-main mt-1">
            {t.contact.subtitle}
          </p>
          <p className="font-sans text-sm text-charcoal-muted leading-relaxed mt-3">
            {t.contact.description}
          </p>
        </div>

        {/* Formulaire complet 3 colonnes */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-warm-card border border-border-subtle p-6 sm:p-12 shadow-editorial mb-14"
        >
          
          {/* Colonne 1 : Champs de coordonnées & message (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-serif text-2xl uppercase tracking-wider text-charcoal-main">
                  {t.contact.yourProjectTitle}
                </h3>
                <p className="font-serif italic text-base text-charcoal-main">
                  {t.contact.tellMe}
                </p>
                <p className="font-sans text-xs text-charcoal-muted leading-relaxed mt-1">
                  {t.contact.formIntro}
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <input
                  type="text"
                  required
                  placeholder={t.contact.fullNameLabel}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-bg border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                />

                <input
                  type="email"
                  required
                  placeholder={t.contact.emailLabel}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-bg border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                />

                <input
                  type="tel"
                  placeholder={t.contact.phoneLabel}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-bg border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                />

                <select
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-bg border border-border-subtle text-xs text-charcoal-main focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="" disabled>{t.contact.selectType}</option>
                  <option value="colorimetrie">{t.contact.colorimetrieOpt}</option>
                  <option value="atelier">{t.contact.workshopOpt}</option>
                  <option value="decoration">{t.contact.collabOpt}</option>
                  <option value="motif">{t.contact.motifOpt}</option>
                  <option value="autre">{t.contact.otherOpt}</option>
                </select>

                <textarea
                  required
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-warm-bg border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors resize-y"
                />
              </div>
            </div>

            <Button variant="dark" fullWidth type="submit">
              {t.contact.submit}
            </Button>
          </div>

          {/* Colonne 2 : Options & Statut (4 colonnes) */}
          <div className="lg:col-span-4 flex flex-col gap-8 lg:border-l border-border-subtle lg:pl-8">
            
            {/* Groupe 1 : Je souhaite... */}
            <div>
              <div className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-1">
                {t.contact.wishesTitle}
              </div>
              <div className="font-serif italic text-xs text-charcoal-muted mb-3">
                {t.contact.multipleChoices}
              </div>

              <div className="flex flex-col gap-2.5">
                {wishesList.map((item) => {
                  const checked = wishes.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      onClick={() => handleWishToggle(item.id)}
                      className="flex items-start gap-2.5 text-xs text-charcoal-muted cursor-pointer group"
                    >
                      <span
                        className={`w-4 h-4 border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-warm-dark border-warm-dark text-white'
                            : 'bg-warm-bg border-border-medium group-hover:border-warm-dark'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </span>
                      <span className="leading-tight group-hover:text-charcoal-main">
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Groupe 2 : Vous êtes... */}
            <div>
              <div className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-3">
                {t.contact.clientTypeTitle}
              </div>

              <div className="flex flex-col gap-2.5">
                {clientTypesList.map((item) => {
                  const checked = clientTypes.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      onClick={() => handleClientTypeToggle(item.id)}
                      className="flex items-start gap-2.5 text-xs text-charcoal-muted cursor-pointer group"
                    >
                      <span
                        className={`w-4 h-4 border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-warm-dark border-warm-dark text-white'
                            : 'bg-warm-bg border-border-medium group-hover:border-warm-dark'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </span>
                      <span className="leading-tight group-hover:text-charcoal-main">
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Colonne 3 : Bannière verticale décorative (3 colonnes) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center bg-warm-paper border border-border-subtle relative overflow-hidden p-6 select-none">
            <img
              src="/illustrations/tapestry-sun.svg"
              alt="Frise textile médiévale & soleil"
              className="w-full max-w-[200px] object-contain opacity-90 my-auto"
            />
            <div className="mt-auto pt-4 text-center">
              <span className="font-sans text-[10px] font-medium tracking-widest uppercase text-charcoal-muted bg-warm-bg/90 px-3 py-1 border border-border-subtle">
                {t.contact.friezeBadge}
              </span>
            </div>
          </div>

        </form>

        {/* Bloc Contact Direct "RESTONS EN CONTACT" */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-warm-paper border border-border-subtle p-6 sm:p-10 items-center overflow-hidden">
          
          <div className="md:col-span-6 flex flex-col gap-5">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-charcoal-main">
                {t.contact.directTitle}
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-charcoal-main mt-0.5">
                {t.contact.responseTime}
              </p>
              <div className="w-10 h-[1px] bg-charcoal-muted/30 my-3" />
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <a
                  href="mailto:contact@jireldejoiry.com"
                  className="text-charcoal-main hover:underline text-sm font-medium"
                >
                  contact@jireldejoiry.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="w-4 h-4 stroke-charcoal-main shrink-0" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal-main hover:underline text-sm font-medium"
                >
                  @jirel.de.joiry
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 stroke-charcoal-main shrink-0 mt-0.5" />
                <div>
                  <div className="text-charcoal-main text-sm font-medium">Paris, France</div>
                  <div className="text-charcoal-muted text-[11px]">
                    {t.contact.appointmentOnly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration Végétale & Oiseau Couronné */}
          <div className="md:col-span-6 flex justify-center items-center overflow-hidden h-full min-h-[240px] max-h-80">
            <img
              src={contactBirdSrc}
              alt="Peinture botanique médiévale et oiseau couronné"
              className="w-full h-full object-cover object-center shadow-sm select-none"
            />
          </div>

        </div>

      </div>

      {/* Modale de validation */}
      <Modal
        isOpen={modalOpen}
        title={t.contact.modalTitle}
        onClose={() => setModalOpen(false)}
      >
        <p>
          {t.contact.thankYou} <strong>{formData.fullName || t.contact.dearClient}</strong> !
        </p>
        <p className="mt-2 text-xs text-charcoal-muted">
          {t.contact.requestReceived}<br />
          {t.contact.followUpNotice}
        </p>
      </Modal>
    </section>
  );
};

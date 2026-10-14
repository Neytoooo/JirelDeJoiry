'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Phone, Clock, User, RefreshCw, FileText, CheckCircle2, Sparkles } from 'lucide-react';

interface BookingItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  slot: string;
  notes?: string;
  service?: string;
  price?: string;
  duration?: string;
  createdAt: string;
}

export const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      let serverList: BookingItem[] = [];
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          serverList = data.bookings;
        }
      } catch (e) {
        console.warn('API bookings non joignable:', e);
      }

      // Récupérer également les réservations créées localement sur ce navigateur
      let localList: BookingItem[] = [];
      try {
        const raw = localStorage.getItem('jirel_local_bookings');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) localList = parsed;
        }
      } catch (storageErr) {
        // ignore
      }

      // Fusionner et dédoublonner par ID
      const map = new Map<string, BookingItem>();
      [...serverList, ...localList].forEach((item) => {
        if (item && item.id) {
          map.set(item.id, item);
        }
      });

      setBookings(Array.from(map.values()));
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setError('Erreur lors du chargement des réservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const exportCsv = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Date Seance', 'Creneau', 'Nom Client', 'Email', 'Telephone', 'Notes', 'Tarif', 'Date Creation'];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.date}"`,
      `"${b.slot}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.phone}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${b.price || '100€'}"`,
      `"${b.createdAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-jirel-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête des réservations */}
      <div className="bg-white border border-[#E2D9CC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#EFE8DD] text-charcoal-muted">
              Planning & Rendez-vous
            </span>
            <span className="text-xs text-charcoal-muted font-medium">
              {bookings.length} séance{bookings.length > 1 ? 's' : ''} enregistrée{bookings.length > 1 ? 's' : ''}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal-main font-normal tracking-wide mt-2">
            Réservations de Colorimétrie
          </h2>

          <p className="font-sans text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
            Toutes les séances réservées par vos clientes. Chaque nouvelle réservation envoie automatiquement un email à{' '}
            <strong className="text-charcoal-main">mattiskhn@gmail.com</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-white hover:bg-[#EFE8DD] text-charcoal-main border border-[#E2D9CC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={exportCsv}
            disabled={bookings.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium bg-charcoal-main hover:bg-black text-[#FAF7F2] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Alerte configuration email destination */}
      <div className="bg-[#FAF7F2] border border-[#E2D9CC] rounded-2xl p-4 flex items-center gap-3 text-xs text-charcoal-muted">
        <Sparkles className="w-4 h-4 text-[#BAA58F] shrink-0" />
        <span>
          <strong>Destinataire des alertes :</strong> <code className="bg-white px-2 py-0.5 border border-[#E2D9CC] rounded font-mono text-[11px] text-charcoal-main">mattiskhn@gmail.com</code> (modifiable dans les variables d'environnement via <code>ADMIN_EMAIL</code>).
        </span>
      </div>

      {/* Liste des réservations */}
      {loading ? (
        <div className="bg-white border border-[#E2D9CC] rounded-3xl p-12 text-center text-charcoal-muted text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-charcoal-muted" />
          Chargement des réservations en cours...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center text-red-800 text-sm">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-[#E2D9CC] rounded-3xl p-12 sm:p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#EFE8DD] text-charcoal-muted flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-xl uppercase tracking-wider text-charcoal-main mb-2">
            Aucune séance réservée pour le moment
          </h3>
          <p className="font-sans text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
            Dès qu'une cliente valide un créneau sur le site, sa fiche apparaîtra ici avec ses coordonnées complètes, et une alerte sera transmise à <strong>mattiskhn@gmail.com</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="bg-white border border-[#E2D9CC] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-charcoal-main/40 transition-colors"
            >
              <div>
                {/* Date & Créneau */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6] mb-3">
                  <div className="flex items-center gap-2 text-charcoal-main">
                    <Calendar className="w-4 h-4 text-[#BAA58F]" />
                    <span className="font-serif text-sm font-medium">{booking.date}</span>
                  </div>
                  <span className="font-sans text-[11px] font-semibold bg-warm-dark text-white px-2 py-0.5 rounded">
                    {booking.slot}
                  </span>
                </div>

                {/* Nom & Contact */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <span className="font-serif text-base text-charcoal-main font-semibold">
                      {booking.fullName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <a
                      href={`mailto:${booking.email}?subject=Votre séance de colorimétrie — Jirel de Joiry`}
                      className="text-charcoal-muted hover:text-charcoal-main hover:underline truncate"
                    >
                      {booking.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                    <a
                      href={`tel:${booking.phone}`}
                      className="text-charcoal-muted hover:text-charcoal-main hover:underline"
                    >
                      {booking.phone}
                    </a>
                  </div>
                </div>

                {/* Notes éventuelles */}
                {booking.notes && (
                  <div className="bg-[#FAF7F2] border-l-2 border-[#BAA58F] p-3 text-xs text-[#524B43] italic mb-4 rounded-r">
                    « {booking.notes} »
                  </div>
                )}
              </div>

              {/* Pied de carte */}
              <div className="pt-3 border-t border-[#EAE3D6] flex items-center justify-between text-[11px] text-charcoal-muted">
                <span>Colorimétrie (100€)</span>
                <span className="text-[10px] text-[#8F877C]">
                  {new Date(booking.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

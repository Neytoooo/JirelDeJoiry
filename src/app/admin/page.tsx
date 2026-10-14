'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('from') || '/dashboard';

  // État du formulaire
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compte à rebours de 10 minutes pour le code OTP
  const [timeLeft, setTimeLeft] = useState(600); // 10 min en secondes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'code' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          if (prev <= 570) {
            // Après 30 secondes d'attente, on peut autoriser le renvoi
            setCanResend(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. Demande d'envoi du code OTP
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Veuillez renseigner votre adresse email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossible d'envoyer le code.");
        setLoading(false);
        return;
      }

      setStep('code');
      setTimeLeft(600);
      setCanResend(false);
      setSuccessMsg(`Un code de sécurité à 6 chiffres a été envoyé à ${cleanEmail}.`);
    } catch {
      setError('Erreur réseau. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Validation du code OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setError('Veuillez renseigner le code complet reçu par email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: cleanCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Code erroné ou expiré.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Connexion autorisée. Redirection vers votre tableau de bord...');
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 700);
    } catch {
      setError('Erreur lors de la validation du code.');
      setLoading(false);
    }
  };

  // 3. Renvoyer un nouveau code
  const handleResend = async () => {
    if (!canResend || loading) return;
    setError(null);
    setCode('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Impossible de renvoyer le code.');
      } else {
        setTimeLeft(600);
        setCanResend(false);
        setSuccessMsg('Un nouveau code vient de vous être envoyé par email.');
      }
    } catch {
      setError('Erreur lors du renvoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between items-center p-4 sm:p-8 select-none">
      
      {/* En-tête minimaliste */}
      <div className="w-full max-w-md pt-4 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-editorial uppercase text-charcoal-muted hover:text-charcoal-main transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au site</span>
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-charcoal-subtle border border-border-subtle px-2 py-0.5">
          Espace Privé
        </span>
      </div>

      {/* Carte d'authentification centrale */}
      <div className="w-full max-w-md my-auto bg-warm-card border border-border-subtle p-7 sm:p-11 shadow-editorial">
        
        {/* Titre & blason */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-warm-dark text-white rounded-full flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h1 className="font-serif text-2xl uppercase tracking-widest text-charcoal-main">
            Jirel de Joiry
          </h1>
          <p className="font-serif italic text-sm text-charcoal-muted mt-1">
            Tableau de bord administrateur
          </p>
          <div className="w-10 h-px bg-border-medium mx-auto mt-4" />
        </div>

        {/* Messages d'alerte et notifications */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50/80 border border-red-200 text-red-900 text-xs flex items-start gap-2.5 leading-relaxed animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-700 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 leading-relaxed animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ÉTAPE 1 : Saisie de l'adresse email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email-input"
                className="block font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main mb-2"
              >
                Adresse Email Autorisée
              </label>
              <div className="relative">
                <input
                  id="email-input"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-warm-bg border border-border-subtle text-xs text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-3.5" />
              </div>
              <p className="font-sans text-[11px] text-charcoal-muted mt-2 leading-relaxed">
                Accès exclusivement réservé aux adresses référencées de l'Atelier.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-warm-dark text-white font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Envoi du code...</span>
                </>
              ) : (
                <>
                  <span>Recevoir mon code d'accès</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ÉTAPE 2 : Saisie du code OTP à 6 chiffres */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="code-input"
                  className="font-sans text-xs font-semibold tracking-editorial uppercase text-charcoal-main"
                >
                  Code de Sécurité (6 chiffres)
                </label>
                <span className="font-sans text-[11px] text-charcoal-muted">
                  ⏱️ {formatTime(timeLeft)}
                </span>
              </div>

              <div className="relative">
                <input
                  id="code-input"
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3.5 pl-10 bg-warm-bg border border-border-subtle text-center text-lg font-mono tracking-[0.4em] font-semibold text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-charcoal-main focus:bg-white transition-colors"
                />
                <KeyRound className="w-4 h-4 text-charcoal-subtle absolute left-3.5 top-4" />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] text-charcoal-muted hover:text-charcoal-main underline transition-colors"
                >
                  Changer d'email ({email})
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || loading}
                  className={`text-[11px] transition-colors ${
                    canResend
                      ? 'text-charcoal-main font-semibold hover:underline cursor-pointer'
                      : 'text-charcoal-subtle cursor-not-allowed'
                  }`}
                >
                  Renvoyer un code
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3.5 px-6 bg-warm-dark text-white font-sans text-xs tracking-editorial uppercase hover:bg-[#383430] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Accéder au Tableau de Bord</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Pied de page */}
      <div className="w-full max-w-md text-center py-4">
        <p className="font-sans text-[11px] text-charcoal-subtle">
          Atelier Jirel de Joiry &copy; {new Date().getFullYear()} — Tous droits réservés.
        </p>
      </div>

    </div>
  );
}

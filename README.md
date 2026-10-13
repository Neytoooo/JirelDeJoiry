# JIREL DE JOIRY — Next.js 14, MongoDB & Vercel

Site web haute couture et studio d'artisanat textile pour **JIREL DE JOIRY** (Couleur · Textile · Création).
Développé sous **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** et connecté à **MongoDB Atlas** pour le déploiement sur **Vercel**.

---

## 🌟 Fonctionnalités Clés

1. **Expérience Éditoriale Haute Couture** :
   - Fond lin/craie naturel (`#F4F0E9`), typographie *Cormorant Garamond* et *Plus Jakarta Sans*.
   - Reproduction fidèle des maquettes avec photos haute résolution et textes HTML/CSS accessibles.
   - Sections complètes : Accueil, Mes Univers, Bannières, Partenaires (Kvadrat, Muuto, SMEG...), Colorimétrie, Calendrier interactif, Déroulement en 5 étapes, Ateliers & Conférences, Direction Artistique, Tapisserie, Motifs et Formulaire de contact.

2. **Dashboard Créatif — « Bienvenue Anne Martinons » (`/dashboard`)** :
   - Interface ludique et interactive pour gérer et remplacer toutes les images du site en direct.
   - Glisser-déposer (Drag & Drop), sélection de fichiers, bibliothèque d'images intégrée ou saisie d'URL.
   - Mode comparateur *Avant / Après* et bouton de réinitialisation.
   - Prise en charge des sections avec ou sans photo officielle (filtre dédié *« ⏳ En attente de photo »* avec jauge de progression).

3. **Base de Données & Persistance MongoDB** :
   - Persistance automatique des photos personnalisées dans **MongoDB Atlas**.
   - Mode hors-ligne / local transparent (fallback gracieux sur `localStorage`).

---

## 🚀 Déploiement sur Vercel

1. **Importer le dépôt GitHub sur Vercel** :
   - Connectez votre compte Vercel à GitHub et importez le dépôt :
     `https://github.com/Neytoooo/JirelDeJoiry.git`
   - Framework Preset : **Next.js** (détecté automatiquement).

2. **Ajouter la variable d'environnement MongoDB** :
   - Dans le projet Vercel > **Settings** > **Environment Variables** :
     - **Name** : `MONGODB_URI`
     - **Value** : `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Déployer ! 🎉

---

## 💻 Développement Local

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

- Site public : [http://localhost:3000](http://localhost:3000)
- Studio d'images Anne Martinons : [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

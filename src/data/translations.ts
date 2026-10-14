export type Language = 'fr' | 'en';

export interface Translations {
  nav: {
    accueil: string;
    univers: string;
    colorimetrie: string;
    ateliers: string;
    directionArtistique: string;
    tapisserie: string;
    motifs: string;
    applications: string;
    contact: string;
  };
  brand: {
    name: string;
    tagline: string;
    shortBio: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    cta: string;
  };
  univers: {
    title: string;
    colorimetrieTitle: string;
    colorimetrieSub: string;
    decorationTitle: string;
    decorationSub: string;
    artDirectionTitle: string;
    artDirectionSub: string;
    tapestryTitle: string;
    tapestrySub: string;
    discover: string;
  };
  quoteBanner: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    cta: string;
  };
  trustBanner: {
    title: string;
  };
  colorimetrie: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    format1Title: string;
    format1Sub: string;
    format2Title: string;
    format2Sub: string;
    format3Title: string;
    format3Sub: string;
    format4Title: string;
    format4Sub: string;
  };
  booking: {
    title: string;
    subtitle: string;
    selectDate: string;
    availableSlots: string;
    noSlots: string;
    selectedSlot: string;
    cta: string;
    confirmTitle: string;
    confirmMsg: string;
    close: string;
  };
  processSteps: {
    titleLine1: string;
    titleLine2: string;
    quoteLine1: string;
    quoteLine2: string;
    quoteLine3: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  workshops: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    card1TitleLine1: string;
    card1TitleLine2: string;
    card1Sub: string;
    card2Title: string;
    card2Sub: string;
    card3TitleLine1: string;
    card3TitleLine2: string;
    card3Sub: string;
  };
  artDirection: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
  tapestry: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    tag1: string;
    tag2: string;
  };
  patterns: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    menu1Title: string;
    menu1Sub: string;
    menu2Title: string;
    menu2Sub: string;
    menu3Title: string;
    menu3Sub: string;
    menu4Title: string;
    menu4Sub: string;
  };
  gallery: {
    title: string;
    all: string;
    wallpaper: string;
    textile: string;
    fashion: string;
    accessories: string;
    stationery: string;
    embroidery: string;
    custom: string;
  };
  collaborations: {
    title: string;
    subtitle: string;
    description: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    yourProjectTitle: string;
    tellMe: string;
    formIntro: string;
    fullNameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    projectTypeLabel: string;
    selectType: string;
    colorimetrieOpt: string;
    workshopOpt: string;
    collabOpt: string;
    motifOpt: string;
    otherOpt: string;
    messageLabel: string;
    messagePlaceholder: string;
    wishesTitle: string;
    multipleChoices: string;
    wish1: string;
    wish2: string;
    wish3: string;
    wish4: string;
    wish5: string;
    wish6: string;
    clientTypeTitle: string;
    client1: string;
    client2: string;
    client3: string;
    client4: string;
    client5: string;
    friezeBadge: string;
    submit: string;
    modalTitle: string;
    thankYou: string;
    dearClient: string;
    requestReceived: string;
    followUpNotice: string;
    directTitle: string;
    responseTime: string;
    appointmentOnly: string;
    address: string;
  };
  footer: {
    univers: string;
    navigation: string;
    atelier: string;
    allRights: string;
    legal: string;
    privacy: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    nav: {
      accueil: 'ACCUEIL',
      univers: 'UNIVERS',
      colorimetrie: 'SERVICES',
      ateliers: 'ATELIERS',
      directionArtistique: 'DIRECTION ARTISTIQUE',
      tapisserie: 'TAPISSERIE',
      motifs: 'MOTIFS',
      applications: 'RÉALISATIONS',
      contact: 'CONTACT',
    },
    brand: {
      name: 'JIREL DE JOIRY',
      tagline: 'COULEUR · TEXTILE · CRÉATION',
      shortBio:
        'Atelier de création textile, stylisme et expertise en colorimétrie. Imaginer des univers sensibles où la matière et la couleur dialoguent.',
    },
    hero: {
      titleLine1: 'La couleur',
      titleLine2: 'comme langage',
      description:
        "Designer textile, styliste et experte en colorimétrie, j'imagine des univers sensibles où la couleur révèle, relie et inspire.",
      cta: 'DÉCOUVRIR MON UNIVERS',
    },
    univers: {
      title: 'MES UNIVERS',
      colorimetrieTitle: 'COLORIMÉTRIE',
      colorimetrieSub: 'Révéler les harmonies de chacun',
      decorationTitle: 'DÉCORATION & INTÉRIEUR',
      decorationSub: 'La couleur au service des espaces de vie',
      artDirectionTitle: 'DIRECTION ARTISTIQUE\n& CONSULTING',
      artDirectionSub: 'Anticiper les tendances,\ncréer du sens',
      tapestryTitle: 'ATELIER DE TAPISSERIE',
      tapestrySub: 'Matière, geste, création',
      discover: 'DÉCOUVRIR',
    },
    quoteBanner: {
      titleLine1: "Imaginer aujourd'hui",
      titleLine2: 'les couleurs de demain',
      subtitle:
        "Une approche sensible et stratégique de la couleur, au croisement de la mode, du design et de l'art de vivre.",
      cta: 'MES SERVICES',
    },
    trustBanner: {
      title: "ILS M'ONT FAIT CONFIANCE",
    },
    colorimetrie: {
      title: 'COLORIMÉTRIE',
      subtitle: 'Révéler votre palette, sublimer votre singularité',
      description:
        'Une approche personnalisée pour découvrir votre saison, comprendre les couleurs qui vous mettent en valeur et les intégrer au quotidien.',
      cta: 'DÉCOUVRIR LES ATELIERS',
      format1Title: 'ATELIERS 1:1',
      format1Sub: 'Découvrir sa saison',
      format2Title: 'ATELIERS ÉVÉNEMENTS',
      format2Sub: 'Mariage, EVJF, entreprise...',
      format3Title: 'CONFÉRENCES',
      format3Sub: 'Autour de la couleur',
      format4Title: 'ATELIERS DÉCORATION',
      format4Sub: 'Pour les marques et professionnels',
    },
    booking: {
      title: 'RÉSERVER UNE SÉANCE',
      subtitle: 'Sélectionnez une date pour votre analyse colorimétrique en studio',
      selectDate: 'Choisir une date',
      availableSlots: 'Créneaux disponibles',
      noSlots: 'Aucun créneau disponible pour cette date.',
      selectedSlot: 'Créneau sélectionné :',
      cta: 'CONFIRMER CE CRÉNEAU',
      confirmTitle: 'Séance réservée avec succès !',
      confirmMsg: 'Je vous recontacte sous 24h pour confirmer votre venue en studio.',
      close: 'FERMER',
    },
    processSteps: {
      titleLine1: 'DÉROULEMENT',
      titleLine2: 'DE LA SÉANCE',
      quoteLine1: 'Des couleurs',
      quoteLine2: 'qui révèlent',
      quoteLine3: 'votre singularité.',
      steps: [
        {
          number: '01',
          title: 'Accueil et échange',
          description: 'Comprendre vos besoins, votre mode de vie et vos préférences.',
        },
        {
          number: '02',
          title: 'Analyse colorimétrique',
          description: 'Étude de votre carnation, contraste et harmonie avec les couleurs.',
        },
        {
          number: '03',
          title: 'Découverte de votre saison',
          description: 'Présentation de votre palette personnalisée et des couleurs clés.',
        },
        {
          number: '04',
          title: 'Conseils personnalisés',
          description: 'Vêtements, maquillage, accessoires et inspirations.',
        },
        {
          number: '05',
          title: 'Support remis',
          description: 'Votre palette au format digital et un guide personnalisé.',
        },
      ],
    },
    workshops: {
      title: 'ATELIERS & CONFÉRENCES',
      subtitle: 'Des expériences autour de la couleur, pour tous les publics',
      description:
        "J'anime des ateliers et conférences sur la colorimétrie, la décoration et les tendances couleur, pour des marques, maisons de design, architectes, entreprises et particuliers.",
      cta: 'VOIR LES FORMATS',
      card1TitleLine1: 'ATELIERS DÉCORATION',
      card1TitleLine2: '& INTÉRIEUR',
      card1Sub: 'Créer des harmonies, explorer les matières, jouer avec la couleur.',
      card2Title: 'ÉVÉNEMENTS PRIVÉS',
      card2Sub:
        'Mariage, enterrement de vie de jeune fille, anniversaire, entrée dans la vie active...',
      card3TitleLine1: 'CONFÉRENCES MARQUES',
      card3TitleLine2: '& PROFESSIONNELS',
      card3Sub: 'Pour architectes, décorateurs, équipes créatives, showrooms...',
    },
    artDirection: {
      title: 'DIRECTION ARTISTIQUE & CONSULTING',
      subtitle: 'Tendances, couleurs et matières pour des projets porteurs de sens',
      description:
        "J'accompagne les marques, studios et entreprises dans leurs réflexions créatives : analyse des tendances, développement de palettes couleur, conseil en matières et direction artistique.",
      cta: 'EN SAVOIR PLUS',
    },
    tapestry: {
      title: 'ATELIER DE TAPISSERIE',
      subtitle: 'Un travail de la matière, entre tradition et modernité',
      description:
        'Dans mon atelier, je crée des tapisseries tuftées et pièces textiles uniques, inspirées par la couleur, la matière et les gestes artisanaux.',
      cta: "DÉCOUVRIR L'ATELIER",
      tag1: 'Pelotes & Laines',
      tag2: 'Pièce Unique',
    },
    patterns: {
      title: 'CRÉATION DE MOTIFS',
      subtitle: 'Des histoires en surface',
      description:
        "Je crée des motifs originaux, poétiques et intemporels, à la croisée de l'art, de l'artisanat et du design. Inspirés par la nature, les symboles et les récits, mes motifs peuvent être déclinés sur une multitude de supports ou réalisés sur mesure.",
      cta: 'DÉCOUVRIR LES COLLECTIONS',
      menu1Title: 'COLLECTIONS',
      menu1Sub: 'Motifs originaux',
      menu2Title: 'CRÉATIONS SUR MESURE',
      menu2Sub: 'Pour vos projets',
      menu3Title: 'APPLICATIONS',
      menu3Sub: 'Multi-supports',
      menu4Title: 'PROCESSUS CRÉATIF',
      menu4Sub: "De l'idée à la surface",
    },
    gallery: {
      title: "EXEMPLES D'APPLICATIONS",
      all: 'TOUS',
      wallpaper: 'PAPIER PEINT',
      textile: 'TEXTILE',
      fashion: 'MODE',
      accessories: 'ACCESSOIRES',
      stationery: 'PAPETERIE',
      embroidery: 'BRODERIE',
      custom: 'SUR MESURE',
    },
    collaborations: {
      title: 'COLLABORATIONS & CRÉATIONS SUR MESURE',
      subtitle: 'Donner vie à vos projets par la couleur et le textile',
      description:
        'Que vous soyez une marque de mode, une maison d’édition, un architecte d’intérieur ou un particulier à la recherche d’une pièce textile exclusive, je mets ma sensibilité et mon savoir-faire au service de votre vision.',
      badge1: 'Édition & Design',
      badge2: 'Hospitality & Hôtellerie',
      badge3: 'Pièces de Galerie',
    },
    contact: {
      title: 'ME CONTACTER',
      subtitle: 'Parlons de votre projet',
      description:
        "Une question, une collaboration, une demande de devis ou une envie d'atelier ? Je serais ravie d'échanger avec vous et d'imaginer ensemble un projet sur mesure.",
      yourProjectTitle: 'VOTRE PROJET',
      tellMe: 'Racontez-moi',
      formIntro:
        'Remplissez ce formulaire avec un maximum de détails sur votre projet. Je vous recontacte rapidement pour en discuter et vous proposer un accompagnement adapté.',
      fullNameLabel: 'Nom / Prénom *',
      emailLabel: 'Email *',
      phoneLabel: 'Téléphone',
      projectTypeLabel: 'Type de projet *',
      selectType: 'Type de projet *',
      colorimetrieOpt: 'Séance de colorimétrie 1:1',
      workshopOpt: 'Atelier ou conférence',
      collabOpt: 'Décoration / Direction artistique',
      motifOpt: 'Création de motif sur mesure',
      otherOpt: 'Autre demande',
      messageLabel: 'Votre message / Racontez-moi votre projet *',
      messagePlaceholder: 'Décrivez votre projet, vos besoins, vos inspirations... *',
      wishesTitle: 'JE SOUHAITE...',
      multipleChoices: '(plusieurs choix possibles)',
      wish1: 'Prendre rendez-vous pour une séance de colorimétrie 1:1',
      wish2: 'Organiser un atelier ou une conférence (entreprise, marque, événement privé...)',
      wish3: 'Collaborer sur un projet de décoration ou de direction artistique',
      wish4: 'Créer un motif sur mesure',
      wish5: 'Obtenir un devis',
      wish6: 'Autre demande',
      clientTypeTitle: 'VOUS ÊTES...',
      client1: 'Particulier',
      client2: 'Marque / Entreprise',
      client3: 'Architecte / Décorateur / Designer',
      client4: 'Presse / Média',
      client5: 'Autre',
      friezeBadge: 'Frise Textile & Soleil',
      submit: 'ENVOYER MA DEMANDE',
      modalTitle: 'Message Envoyé',
      thankYou: 'Merci',
      dearClient: 'cher client',
      requestReceived: 'Votre demande de projet a bien été transmise.',
      followUpNotice: 'Jirel de Joiry reviendra vers vous sous 48 heures.',
      directTitle: 'RESTONS EN CONTACT',
      responseTime: 'Je vous réponds sous 48h',
      appointmentOnly: 'Rencontres sur rendez-vous uniquement',
      address: 'Paris 13ᵉ arrondissement · Métro Nationale ou Place d’Italie',
    },
    footer: {
      univers: 'UNIVERS',
      navigation: 'NAVIGATION',
      atelier: 'ATELIER',
      allRights: 'Tous droits réservés.',
      legal: 'Mentions Légales',
      privacy: 'Politique de Confidentialité',
    },
  },
  en: {
    nav: {
      accueil: 'HOME',
      univers: 'UNIVERSES',
      colorimetrie: 'SERVICES',
      ateliers: 'WORKSHOPS',
      directionArtistique: 'ART DIRECTION',
      tapisserie: 'TAPESTRY',
      motifs: 'PATTERNS',
      applications: 'PORTFOLIO',
      contact: 'CONTACT',
    },
    brand: {
      name: 'JIREL DE JOIRY',
      tagline: 'COLOR · TEXTILE · CREATION',
      shortBio:
        'Textile design studio, styling, and color analysis expertise. Curating sensitive atmospheres where material and color converse.',
    },
    hero: {
      titleLine1: 'Color as',
      titleLine2: 'a language',
      description:
        'Textile designer, stylist, and color analysis expert, I create sensitive universes where color reveals, connects, and inspires.',
      cta: 'DISCOVER MY UNIVERSE',
    },
    univers: {
      title: 'MY UNIVERSES',
      colorimetrieTitle: 'COLOR ANALYSIS',
      colorimetrieSub: "Revealing each person's unique harmonies",
      decorationTitle: 'DECORATION & INTERIORS',
      decorationSub: 'Color dedicated to living spaces',
      artDirectionTitle: 'ART DIRECTION\n& CONSULTING',
      artDirectionSub: 'Anticipating trends,\ncrafting purpose',
      tapestryTitle: 'TAPESTRY ATELIER',
      tapestrySub: 'Craft, gesture, creation',
      discover: 'DISCOVER',
    },
    quoteBanner: {
      titleLine1: 'Imagining today',
      titleLine2: 'the colors of tomorrow',
      subtitle:
        'A sensitive and strategic approach to color, at the crossroads of fashion, design, and art de vivre.',
      cta: 'MY SERVICES',
    },
    trustBanner: {
      title: 'THEY TRUSTED ME',
    },
    colorimetrie: {
      title: 'COLOR ANALYSIS',
      subtitle: 'Reveal your palette, celebrate your uniqueness',
      description:
        'A bespoke methodology to discover your season, embrace the shades that elevate your presence, and seamlessly weave them into your everyday style.',
      cta: 'EXPLORE WORKSHOPS',
      format1Title: '1:1 WORKSHOPS',
      format1Sub: 'Discover your season',
      format2Title: 'EVENT WORKSHOPS',
      format2Sub: 'Weddings, celebrations, corporate...',
      format3Title: 'KEYNOTE TALKS',
      format3Sub: 'Exploring the world of color',
      format4Title: 'INTERIOR WORKSHOPS',
      format4Sub: 'For creative brands & designers',
    },
    booking: {
      title: 'BOOK A SESSION',
      subtitle: 'Select a date for your in-studio color analysis',
      selectDate: 'Choose a date',
      availableSlots: 'Available slots',
      noSlots: 'No slots available for this date.',
      selectedSlot: 'Selected slot:',
      cta: 'CONFIRM THIS SLOT',
      confirmTitle: 'Session booked successfully!',
      confirmMsg: 'I will contact you within 24 hours to confirm your studio appointment.',
      close: 'CLOSE',
    },
    processSteps: {
      titleLine1: 'SESSION',
      titleLine2: 'WORKFLOW',
      quoteLine1: 'Colors that',
      quoteLine2: 'reveal your',
      quoteLine3: 'uniqueness.',
      steps: [
        {
          number: '01',
          title: 'Welcome & Consultation',
          description: 'Understanding your lifestyle, personality, and aesthetic aspirations.',
        },
        {
          number: '02',
          title: 'Colorimetric Draping',
          description: 'Assessing your skin undertones, contrast, and chromatic affinities.',
        },
        {
          number: '03',
          title: 'Discovering Your Season',
          description: 'Unveiling your personalized palette and signature power shades.',
        },
        {
          number: '04',
          title: 'Tailored Styling Advice',
          description: 'Garments, beauty, textiles, jewelry, and creative inspirations.',
        },
        {
          number: '05',
          title: 'Your Dedicated Guide',
          description: 'Your digital swatch book and personalized consultation dossier.',
        },
      ],
    },
    workshops: {
      title: 'WORKSHOPS & CONFERENCES',
      subtitle: 'Immersive color experiences designed for every audience',
      description:
        'I lead creative workshops and conferences on colorimetry, interior harmony, and trend forecasting for design houses, architects, brands, and private groups.',
      cta: 'VIEW FORMATS',
      card1TitleLine1: 'INTERIOR DECORATION',
      card1TitleLine2: '& DESIGN',
      card1Sub: 'Composing palettes, feeling textures, experimenting with pigments.',
      card2Title: 'PRIVATE CELEBRATIONS',
      card2Sub:
        'Weddings, bridal showers, milestone birthdays, life milestones...',
      card3TitleLine1: 'BRAND CONFERENCES',
      card3TitleLine2: '& PROFESSIONALS',
      card3Sub: 'For architects, interior designers, creative directors, showrooms...',
    },
    artDirection: {
      title: 'ART DIRECTION & CONSULTING',
      subtitle: 'Forecasting trends, palette curations, and tactile storytelling',
      description:
        'I support brands, studios, and agencies in their creative developments: trend synthesis, chromatic identity, material sourcing, and evocative art direction.',
      cta: 'LEARN MORE',
    },
    tapestry: {
      title: 'TAPESTRY ATELIER',
      subtitle: 'A tactile journey between ancient craftsmanship and contemporary design',
      description:
        'In my atelier, I weave and tuft unique textile artworks and tapestries, driven by raw textures, rich pigments, and meditative handcrafted gestures.',
      cta: 'DISCOVER THE ATELIER',
      tag1: 'Yarn & Raw Wool',
      tag2: 'One-of-a-Kind Piece',
    },
    patterns: {
      title: 'PATTERN DESIGN',
      subtitle: 'Stories etched into surfaces',
      description:
        'I develop original, poetic, and timeless patterns at the junction of art, textile craft, and decorative arts. Inspired by botanicals, mythologies, and cultural heritage, my motifs can be licensed or tailored to bespoke commissions.',
      cta: 'EXPLORE COLLECTIONS',
      menu1Title: 'COLLECTIONS',
      menu1Sub: 'Original motifs',
      menu2Title: 'BESPOKE COMMISSIONS',
      menu2Sub: 'For your projects',
      menu3Title: 'APPLICATIONS',
      menu3Sub: 'Multi-surface design',
      menu4Title: 'CREATIVE PROCESS',
      menu4Sub: 'From sketch to surface',
    },
    gallery: {
      title: 'APPLICATION EXAMPLES',
      all: 'ALL',
      wallpaper: 'WALLPAPER',
      textile: 'TEXTILES',
      fashion: 'FASHION',
      accessories: 'ACCESSORIES',
      stationery: 'STATIONERY',
      embroidery: 'EMBROIDERY',
      custom: 'BESPOKE',
    },
    collaborations: {
      title: 'COLLABORATIONS & BESPOKE EDITIONS',
      subtitle: 'Bringing your visions to life through color and textile arts',
      description:
        'Whether you represent a fashion house, a publishing house, an interior design studio, or are a private collector seeking an exclusive commission, I bring my chromatic sensitivity to your vision.',
      badge1: 'Publishing & Design',
      badge2: 'Hospitality & Luxury',
      badge3: 'Gallery Editions',
    },
    contact: {
      title: 'CONTACT ME',
      subtitle: "Let's discuss your project",
      description:
        "A question, a collaboration, a quotation request, or a workshop inquiry? I would be delighted to exchange ideas and imagine a bespoke creation together.",
      yourProjectTitle: 'YOUR PROJECT',
      tellMe: 'Tell me about it',
      formIntro:
        'Fill out this form with as much detail as possible about your project. I will get back to you promptly to discuss and offer tailored support.',
      fullNameLabel: 'Name / Surname *',
      emailLabel: 'Email *',
      phoneLabel: 'Phone',
      projectTypeLabel: 'Project Type *',
      selectType: 'Project type *',
      colorimetrieOpt: '1:1 Color Analysis Session',
      workshopOpt: 'Workshop or Conference',
      collabOpt: 'Interior Design / Art Direction',
      motifOpt: 'Bespoke Pattern Design',
      otherOpt: 'Other Inquiry',
      messageLabel: 'Your message / Tell me about your project *',
      messagePlaceholder: 'Describe your project, your needs, your inspirations... *',
      wishesTitle: 'I WOULD LIKE TO...',
      multipleChoices: '(multiple choices possible)',
      wish1: 'Book an individual 1:1 color analysis session',
      wish2: 'Organize a workshop or lecture (corporate, brand, private event...)',
      wish3: 'Collaborate on an interior design or art direction project',
      wish4: 'Create a bespoke pattern design',
      wish5: 'Request a detailed quotation',
      wish6: 'Other inquiry',
      clientTypeTitle: 'YOU ARE...',
      client1: 'Individual',
      client2: 'Brand / Corporate',
      client3: 'Architect / Interior Designer',
      client4: 'Press / Media',
      client5: 'Other',
      friezeBadge: 'Textile Frieze & Sun',
      submit: 'SUBMIT MY INQUIRY',
      modalTitle: 'Message Sent',
      thankYou: 'Thank you',
      dearClient: 'valued client',
      requestReceived: 'Your project inquiry has been successfully transmitted.',
      followUpNotice: 'Jirel de Joiry will get back to you within 48 hours.',
      directTitle: 'STAY IN TOUCH',
      responseTime: 'Replies within 48h',
      appointmentOnly: 'Meetings by appointment only',
      address: 'Paris 13th arrondissement · Métro Nationale or Place d’Italie',
    },
    footer: {
      univers: 'UNIVERSES',
      navigation: 'NAVIGATION',
      atelier: 'ATELIER',
      allRights: 'All rights reserved.',
      legal: 'Legal Notice',
      privacy: 'Privacy Policy',
    },
  },
};

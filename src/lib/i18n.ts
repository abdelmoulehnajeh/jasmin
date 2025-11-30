import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      cars: 'Cars',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      dashboard: 'Dashboard',
      getStarted: 'GET STARTED',
      menu: 'Menu',
      signIn: 'Sign In',

      // Service Types
      marriage: 'MARRIAGE',
      transfer: 'TRANSFER',

      // Hero Section
      heroTitle: 'Cars for Weddings & Transfers',
      heroSubtitle: 'Comfortable, professional transport',
      heroDescription: 'Reserve a clean, chauffeured vehicle for ceremonies or airport transfers.',
      heroDescriptionHighlight: 'Reliable pickup and punctual service.',
      exploreNow: 'Explore Now',
      bookNow: 'Book Now',
      getQuote: 'Get a Quote',
      selectService: 'SELECT YOUR SERVICE',
      marriageService: 'MARRIAGE',
      transferService: 'TRANSFER',
      marriageDesc: 'Luxury cars for your special day',
      transferDesc: 'Airport & location transfers',
      startScrolling: 'START SCROLLING',

      // Landing Stats
      statReal: 'PREMIUM',
      statRealLabel: 'SERVICE',
      statOne: 'LUXURY',
      statOneLabel: 'VEHICLES',
      statSmooth: 'SMOOTH',
      statSmoothLabel: 'EXPERIENCE',

      // Menu Items
      weddingCars: 'Wedding Cars',
      airportTransfers: 'Airport Transfers',
      ourFleetMenu: 'Our Fleet',
      getQuoteMenu: 'Get a Quote',
      aboutUs: 'About Us',
      driverRecruitment: 'Driver Recruitment',
      businessAccounts: 'Business Accounts',

      // Quote Form
      getYourQuote: 'Get Your Quote',
      serviceType: 'Service Type',
      weddingSpecialEvents: 'Wedding & Special Events',
      airportLocationTransfer: 'Airport & Location Transfer',
      enterPickupAddress: 'Enter pickup address',
      enterDestination: 'Enter destination',
      pickupDate: 'Pickup Date',
      pickupTime: 'Pickup Time',
      viewAvailableVehicles: 'View Available Vehicles',

      // Services Section
      ourServices: 'Our Services',
      premiumLuxuryTransport: 'Premium luxury transportation for every occasion',
      wedding: 'Wedding',
      weddingServiceDesc: 'Luxury wedding car service with professional chauffeurs. Make your special day unforgettable.',
      transferTitle: 'Transfer',
      transferServiceDesc: 'Reliable airport and location transfers with flight tracking and fixed pricing.',
      learnMore: 'Learn More',

      // Fleet Section
      ourFleet: 'OUR FLEET',
      premiumCars: 'PREMIUM CARS',
      ourPremiumFleet: 'Our Premium Fleet',
      luxuryVehiclesFor: 'luxury vehicles for',
      weddingsSpecialEvents: 'weddings & special events',
      airportLocationTransfers: 'airport & location transfers',
      watchArrive: 'Watch them arrive from the horizon',
      onTheHighway: 'ON THE HIGHWAY',
      chooseYourExperience: 'Choose Your Experience',
      exploreServices: 'Explore Services',
      exploreOurCars: 'Explore Our Premium Collection',
      noCarsAvailable: 'No cars available for this service',
      noVehiclesAvailable: 'No Vehicles Available',
      updatingFleet: "We're updating our fleet for the selected service. Please check back soon.",
      loadingPremiumFleet: 'Loading our premium fleet...',

      // Airport Transfer Section
      airportAssuredService: 'Airport Assured Service',
      airportTransferDesc: 'Experience seamless airport transfers with our premium fleet. We track your flight in real-time.',
      realTimeFlightTracking: 'Real-time flight tracking',
      fixedPricingNoHiddenFees: 'Fixed pricing with no hidden fees',
      professionalChauffeurs: 'Professional chauffeurs',
      bookAirportTransfer: 'Book Airport Transfer',

      // Why Choose Us
      whyChooseUs: 'WHY CHOOSE US',
      whyChooseJasmin: 'Why Choose Jasmin Rent Cars',
      trustedByThousands: 'Trusted by thousands for professional, reliable service',
      premiumQuality: 'Premium Quality',
      premiumQualityDesc: 'Luxury vehicles with professional chauffeurs',
      instantBooking: 'Instant Booking',
      instantBookingDesc: 'Online booking with 24/7 support',
      securePayment: 'Secure Payment',
      securePaymentDesc: 'Bank-level encryption for transactions',

      // CTA Section
      readyToBook: 'Ready to Book Your Ride?',
      experienceProfessional: 'Experience professional luxury transportation with fixed pricing and exceptional service',
      getStartedCta: 'Get Started',

      // Footer
      company: 'Company',
      getQuoteFooter: 'Get a Quote',
      servicesFooter: 'Services',
      fleet: 'Fleet',
      careers: 'Careers',
      ourStory: 'Our Story',
      accreditations: 'Accreditations',
      signUpFooter: 'Sign Up',
      mobileApp: 'Mobile App',
      support: 'Support',
      helpCenter: 'Help Center',
      contactUs: 'Contact Us',
      faqs: 'FAQs',
      support247: '24/7 Support',
      services: 'Services',
      weddingCarsFooter: 'Wedding Cars',
      airportTransferFooter: 'Airport Transfer',
      luxuryFleetFooter: 'Luxury Fleet',
      chauffeurService: 'Chauffeur Service',
      jasminRentCars: 'Jasmin Rent Cars',
      allRightsReserved: '© 2024 Jasmin Rent Cars. All rights reserved.',
      footerTagline: 'Your premium car rental experience',
      quickLinks: 'Quick Links',

      // Car Details
      perDay: 'per day',
      available: 'Available',
      rented: 'Rented',
      maintenance: 'Maintenance',
      features: 'Features',
      specifications: 'Specifications',
      ratings: 'Ratings',
      viewDetails: 'View Details',

      // Booking
      selectDates: 'Select Dates',
      startDate: 'Start Date',
      endDate: 'End Date',
      pickupLocation: 'Pickup Location',
      dropoffLocation: 'Dropoff Location',
      totalDays: 'Total Days',
      totalPrice: 'Total Price',
      notes: 'Notes',
      confirmBooking: 'Confirm Booking',

      // Auth
      email: 'Email',
      password: 'Password',
      fullName: 'Full User Name',
      phone: 'Phone',
      address: 'Address',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',

      // User Dashboard
      myBookings: 'My Bookings',
      myProfile: 'My Profile',
      bookingHistory: 'Booking History',
      rateBooking: 'Rate Booking',

      // Admin Panel
      adminDashboard: 'Admin Dashboard',
      carManagement: 'Car Management',
      userManagement: 'User Management',
      bookingManagement: 'Booking Management',
      addCar: 'Add Car',
      editCar: 'Edit Car',
      deleteCar: 'Delete Car',

      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',

      // Spin Wheel
      winADiscount: 'Win a Discount!',
      spinWheelDescription: 'Register now and spin the wheel to win a special discount on your next booking!',
      continueToSpin: 'Continue to Spin',
      spinTheWheel: 'Spin the Wheel',
      spinNow: 'Spin Now',
      spinning: 'Spinning...',
      congratulations: 'Congratulations',
      youWon: 'You won',
      discount: 'discount',
      yourPromoCode: 'Your Promo Code',
      copyCode: 'Copy Code',
      promoCodeCopied: 'Promo code copied to clipboard!',
      promoCodeSentEmail: 'Your promo code has been sent to:',
      startBooking: 'Start Booking',
      giftOffer: 'Gift Offer',
      enterYourName: 'Enter your full name',
      enterYourEmail: 'Enter your email',
      enterYourPhone: 'Enter your phone number',
      pleaseFillAllFields: 'Please fill in all fields',
      invalidEmail: 'Please enter a valid email address',
    },
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      cars: 'Voitures',
      about: 'À propos',
      contact: 'Contact',
      login: 'Connexion',
      signup: "S'inscrire",
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      getStarted: 'COMMENCER',
      menu: 'Menu',
      signIn: 'Se Connecter',

      // Service Types
      marriage: 'MARIAGE',
      transfer: 'TRANSFERT',

      // Hero Section
      heroTitle: 'Location voitures Mariage & Transfert',
      heroSubtitle: 'Voitures élégantes avec chauffeurs professionnels',
      heroDescription: 'Véhicules sélectionnés pour mariages et transferts aéroportuaires ponctuels.',
      heroDescriptionHighlight: 'Réservation rapide - véhicules prêts et à l\'heure.',
      exploreNow: 'Explorer',
      bookNow: 'Réserver',
      getQuote: 'Obtenir un Devis',
      selectService: 'CHOISISSEZ VOTRE SERVICE',
      marriageService: 'MARIAGE',
      transferService: 'TRANSFERT',
      marriageDesc: 'Voitures de luxe pour votre jour spécial',
      transferDesc: 'Transferts aéroport & destinations',
      startScrolling: 'COMMENCER À DÉFILER',

      // Landing Stats
      statReal: 'PREMIUM',
      statRealLabel: 'SERVICE',
      statOne: 'LUXE',
      statOneLabel: 'VÉHICULES',
      statSmooth: 'FLUIDE',
      statSmoothLabel: 'EXPÉRIENCE',

      // Menu Items
      weddingCars: 'Voitures de Mariage',
      airportTransfers: 'Transferts Aéroport',
      ourFleetMenu: 'Notre Flotte',
      getQuoteMenu: 'Obtenir un Devis',
      aboutUs: 'À Propos',
      driverRecruitment: 'Recrutement Chauffeurs',
      businessAccounts: 'Comptes Entreprise',

      // Quote Form
      getYourQuote: 'Obtenez Votre Devis',
      serviceType: 'Type de Service',
      weddingSpecialEvents: 'Mariage & Événements Spéciaux',
      airportLocationTransfer: 'Transfert Aéroport & Lieu',
      enterPickupAddress: 'Entrez l\'adresse de prise en charge',
      enterDestination: 'Entrez la destination',
      pickupDate: 'Date de Prise en Charge',
      pickupTime: 'Heure de Prise en Charge',
      viewAvailableVehicles: 'Voir les Véhicules Disponibles',

      // Services Section
      ourServices: 'Nos Services',
      premiumLuxuryTransport: 'Transport de luxe premium pour toutes les occasions',
      wedding: 'Mariage',
      weddingServiceDesc: 'Service de voiture de mariage de luxe avec chauffeurs professionnels. Rendez votre journée spéciale inoubliable.',
      transferTitle: 'Transfert',
      transferServiceDesc: 'Transferts d\'aéroport et de lieu fiables avec suivi de vol et tarification fixe.',
      learnMore: 'En Savoir Plus',

      // Fleet Section
      ourFleet: 'NOTRE FLOTTE',
      premiumCars: 'VOITURES PREMIUM',
      ourPremiumFleet: 'Notre Flotte Premium',
      luxuryVehiclesFor: 'véhicules de luxe pour',
      weddingsSpecialEvents: 'mariages et événements spéciaux',
      airportLocationTransfers: 'transferts aéroport et lieux',
      watchArrive: "Regardez-les arriver de l'horizon",
      onTheHighway: "SUR L'AUTOROUTE",
      chooseYourExperience: 'Choisissez Votre Expérience',
      exploreServices: 'Explorer les Services',
      exploreOurCars: 'Découvrez Notre Collection Premium',
      noCarsAvailable: 'Aucune voiture disponible pour ce service',
      noVehiclesAvailable: 'Aucun Véhicule Disponible',
      updatingFleet: 'Nous mettons à jour notre flotte pour le service sélectionné. Revenez bientôt.',
      loadingPremiumFleet: 'Chargement de notre flotte premium...',

      // Airport Transfer Section
      airportAssuredService: 'Service Aéroport Assuré',
      airportTransferDesc: 'Découvrez des transferts aéroportuaires sans faille avec notre flotte premium. Nous suivons votre vol en temps réel.',
      realTimeFlightTracking: 'Suivi de vol en temps réel',
      fixedPricingNoHiddenFees: 'Tarification fixe sans frais cachés',
      professionalChauffeurs: 'Chauffeurs professionnels',
      bookAirportTransfer: 'Réserver un Transfert Aéroport',

      // Why Choose Us
      whyChooseUs: 'POURQUOI NOUS CHOISIR',
      whyChooseJasmin: 'Pourquoi Choisir Jasmin Rent Cars',
      trustedByThousands: 'Approuvé par des milliers pour un service professionnel et fiable',
      premiumQuality: 'Qualité Premium',
      premiumQualityDesc: 'Véhicules de luxe avec chauffeurs professionnels',
      instantBooking: 'Réservation Instantanée',
      instantBookingDesc: 'Réservation en ligne avec support 24/7',
      securePayment: 'Paiement Sécurisé',
      securePaymentDesc: 'Chiffrement de niveau bancaire pour les transactions',

      // CTA Section
      readyToBook: 'Prêt à Réserver Votre Course?',
      experienceProfessional: 'Découvrez le transport de luxe professionnel avec tarification fixe et service exceptionnel',
      getStartedCta: 'Commencer',

      // Footer
      company: 'Entreprise',
      getQuoteFooter: 'Obtenir un Devis',
      servicesFooter: 'Services',
      fleet: 'Flotte',
      careers: 'Carrières',
      ourStory: 'Notre Histoire',
      accreditations: 'Accréditations',
      signUpFooter: 'S\'inscrire',
      mobileApp: 'Application Mobile',
      support: 'Support',
      helpCenter: 'Centre d\'Aide',
      contactUs: 'Nous Contacter',
      faqs: 'FAQs',
      support247: 'Support 24/7',
      services: 'Services',
      weddingCarsFooter: 'Voitures de Mariage',
      airportTransferFooter: 'Transfert Aéroport',
      luxuryFleetFooter: 'Flotte de Luxe',
      chauffeurService: 'Service de Chauffeur',
      jasminRentCars: 'Jasmin Rent Cars',
      allRightsReserved: '© 2024 Jasmin Rent Cars. Tous droits réservés.',
      footerTagline: 'Votre expérience de location de voiture premium',
      quickLinks: 'Liens Rapides',

      // Features
      featureMarriageTitle: 'Service Mariage',
      featureMarriageDesc: 'Rendez votre jour spécial inoubliable',
      featureTransferTitle: 'Service Transfert',
      featureTransferDesc: 'Transferts confortables aéroport & destinations',
      featureLuxuryTitle: 'Flotte de Luxe',
      featureLuxuryDesc: 'Véhicules premium pour chaque occasion',
      
      // Car Details
      perDay: 'par jour',
      available: 'Disponible',
      rented: 'Loué',
      maintenance: 'Maintenance',
      features: 'Caractéristiques',
      specifications: 'Spécifications',
      ratings: 'Évaluations',
      viewDetails: 'Voir détails',
      
      // Booking
      selectDates: 'Sélectionner dates',
      startDate: 'Date début',
      endDate: 'Date fin',
      pickupLocation: 'Lieu de prise',
      dropoffLocation: 'Lieu de retour',
      totalDays: 'Jours totaux',
      totalPrice: 'Prix total',
      notes: 'Notes',
      confirmBooking: 'Confirmer réservation',
      
      // Auth
      email: 'Email',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      address: 'Adresse',
      confirmPassword: 'Confirmer mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      dontHaveAccount: "Pas de compte?",
      alreadyHaveAccount: 'Déjà un compte?',
      
      // User Dashboard
      myBookings: 'Mes réservations',
      myProfile: 'Mon profil',
      bookingHistory: 'Historique',
      rateBooking: 'Évaluer',
      
      // Admin Panel
      adminDashboard: 'Tableau Admin',
      carManagement: 'Gestion voitures',
      userManagement: 'Gestion utilisateurs',
      bookingManagement: 'Gestion réservations',
      addCar: 'Ajouter voiture',
      editCar: 'Modifier voiture',
      deleteCar: 'Supprimer voiture',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      search: 'Rechercher',
      filter: 'Filtrer',
      loading: 'Chargement...',
      success: 'Succès',
      error: 'Erreur',

      // Spin Wheel
      winADiscount: 'Gagnez une Réduction!',
      spinWheelDescription: 'Inscrivez-vous maintenant et tournez la roue pour gagner une réduction spéciale sur votre prochaine réservation!',
      continueToSpin: 'Continuer à Tourner',
      spinTheWheel: 'Tournez la Roue',
      spinNow: 'Tourner Maintenant',
      spinning: 'En cours...',
      congratulations: 'Félicitations',
      youWon: 'Vous avez gagné',
      discount: 'de réduction',
      yourPromoCode: 'Votre Code Promo',
      copyCode: 'Copier le Code',
      promoCodeCopied: 'Code promo copié dans le presse-papiers!',
      promoCodeSentEmail: 'Votre code promo a été envoyé à:',
      startBooking: 'Commencer la Réservation',
      giftOffer: 'Offre Cadeau',
      enterYourName: 'Entrez votre nom complet',
      enterYourEmail: 'Entrez votre email',
      enterYourPhone: 'Entrez votre numéro de téléphone',
      pleaseFillAllFields: 'Veuillez remplir tous les champs',
      invalidEmail: 'Veuillez entrer une adresse email valide',
    },
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      cars: 'السيارات',
      about: 'عن',
      contact: 'اتصل',
      login: 'دخول',
      signup: 'تسجيل',
      logout: 'خروج',
      dashboard: 'لوحة التحكم',
      getStarted: 'ابدأ الآن',
      menu: 'القائمة',
      signIn: 'تسجيل الدخول',

      // Service Types
      marriage: 'زواج',
      transfer: 'نقل',

      // Hero Section
      heroTitle: 'تأجير سيارات للمناسبات والنقل',
      heroSubtitle: 'سيارات أنيقة مع سائقين محترفين',
      heroDescription: 'اختيار دقيق للسيارات لحفلات الزواج ونقل المطار الموثوق.',
      heroDescriptionHighlight: 'حجز سريع — وصول المركبات جاهزة وفي الوقت المحدد.',
      exploreNow: 'استكشف الآن',
      bookNow: 'احجز الآن',
      getQuote: 'احصل على عرض أسعار',
      selectService: 'اختر خدمتك',
      marriageService: 'زواج',
      transferService: 'نقل',
      marriageDesc: 'سيارات فاخرة ليومك الخاص',
      transferDesc: 'نقل المطار والمواقع',
      startScrolling: 'ابدأ التمرير',

      // Landing Stats
      statReal: 'بريميوم',
      statRealLabel: 'خدمة',
      statOne: 'فاخر',
      statOneLabel: 'مركبات',
      statSmooth: 'سلس',
      statSmoothLabel: 'تجربة',

      // Menu Items
      weddingCars: 'سيارات الزفاف',
      airportTransfers: 'نقل المطار',
      ourFleetMenu: 'أسطولنا',
      getQuoteMenu: 'احصل على عرض أسعار',
      aboutUs: 'معلومات عنا',
      driverRecruitment: 'توظيف السائقين',
      businessAccounts: 'حسابات الأعمال',

      // Quote Form
      getYourQuote: 'احصل على عرض الأسعار الخاص بك',
      serviceType: 'نوع الخدمة',
      weddingSpecialEvents: 'الزفاف والمناسبات الخاصة',
      airportLocationTransfer: 'نقل المطار والموقع',
      enterPickupAddress: 'أدخل عنوان الاستلام',
      enterDestination: 'أدخل الوجهة',
      pickupDate: 'تاريخ الاستلام',
      pickupTime: 'وقت الاستلام',
      viewAvailableVehicles: 'عرض المركبات المتاحة',

      // Services Section
      ourServices: 'خدماتنا',
      premiumLuxuryTransport: 'نقل فاخر متميز لكل مناسبة',
      wedding: 'زفاف',
      weddingServiceDesc: 'خدمة سيارات زفاف فاخرة مع سائقين محترفين. اجعل يومك الخاص لا ينسى.',
      transferTitle: 'نقل',
      transferServiceDesc: 'نقل موثوق للمطار والموقع مع تتبع الرحلة وأسعار ثابتة.',
      learnMore: 'اعرف المزيد',

      // Fleet Section
      ourFleet: 'أسطولنا',
      premiumCars: 'سيارات بريميوم',
      ourPremiumFleet: 'أسطولنا المتميز',
      luxuryVehiclesFor: 'مركبات فاخرة لـ',
      weddingsSpecialEvents: 'حفلات الزفاف والمناسبات الخاصة',
      airportLocationTransfers: 'نقل المطار والموقع',
      watchArrive: 'شاهدهم يصلون من الأفق',
      onTheHighway: 'على الطريق السريع',
      chooseYourExperience: 'اختر تجربتك',
      exploreServices: 'استكشف الخدمات',
      exploreOurCars: 'استكشف مجموعتنا المتميزة',
      noCarsAvailable: 'لا توجد سيارات متاحة لهذه الخدمة',
      noVehiclesAvailable: 'لا توجد مركبات متاحة',
      updatingFleet: 'نحن نقوم بتحديث أسطولنا للخدمة المحددة. يرجى التحقق مرة أخرى قريبًا.',
      loadingPremiumFleet: 'تحميل أسطولنا المتميز...',

      // Airport Transfer Section
      airportAssuredService: 'خدمة المطار المضمونة',
      airportTransferDesc: 'استمتع بنقل سلس للمطار مع أسطولنا المتميز. نتتبع رحلتك في الوقت الفعلي.',
      realTimeFlightTracking: 'تتبع الرحلة في الوقت الفعلي',
      fixedPricingNoHiddenFees: 'أسعار ثابتة بدون رسوم مخفية',
      professionalChauffeurs: 'سائقون محترفون',
      bookAirportTransfer: 'احجز نقل المطار',

      // Why Choose Us
      whyChooseUs: 'لماذا تختارنا',
      whyChooseJasmin: 'لماذا تختار جاسمين لتأجير السيارات',
      trustedByThousands: 'موثوق به من قبل الآلاف للخدمة الاحترافية والموثوقة',
      premiumQuality: 'جودة متميزة',
      premiumQualityDesc: 'مركبات فاخرة مع سائقين محترفين',
      instantBooking: 'حجز فوري',
      instantBookingDesc: 'حجز عبر الإنترنت مع دعم 24/7',
      securePayment: 'دفع آمن',
      securePaymentDesc: 'تشفير على مستوى البنوك للمعاملات',

      // CTA Section
      readyToBook: 'هل أنت مستعد لحجز رحلتك؟',
      experienceProfessional: 'استمتع بنقل فاخر احترافي مع أسعار ثابتة وخدمة استثنائية',
      getStartedCta: 'ابدأ الآن',

      // Footer
      company: 'الشركة',
      getQuoteFooter: 'احصل على عرض أسعار',
      servicesFooter: 'الخدمات',
      fleet: 'الأسطول',
      careers: 'الوظائف',
      ourStory: 'قصتنا',
      accreditations: 'الاعتمادات',
      signUpFooter: 'سجل',
      mobileApp: 'تطبيق الجوال',
      support: 'الدعم',
      helpCenter: 'مركز المساعدة',
      contactUs: 'اتصل بنا',
      faqs: 'الأسئلة الشائعة',
      support247: 'دعم 24/7',
      services: 'الخدمات',
      weddingCarsFooter: 'سيارات الزفاف',
      airportTransferFooter: 'نقل المطار',
      luxuryFleetFooter: 'الأسطول الفاخر',
      chauffeurService: 'خدمة السائق',
      jasminRentCars: 'جاسمين لتأجير السيارات',
      allRightsReserved: '© 2024 جاسمين لتأجير السيارات. جميع الحقوق محفوظة.',
      footerTagline: 'تجربة تأجير السيارات المتميزة الخاصة بك',
      quickLinks: 'روابط سريعة',
      
      // Car Details
      perDay: 'في اليوم',
      available: 'متاح',
      rented: 'مؤجر',
      maintenance: 'صيانة',
      features: 'المميزات',
      specifications: 'المواصفات',
      ratings: 'التقييمات',
      viewDetails: 'عرض التفاصيل',
      
      // Booking
      selectDates: 'اختر التواريخ',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      pickupLocation: 'موقع الاستلام',
      dropoffLocation: 'موقع التسليم',
      totalDays: 'إجمالي الأيام',
      totalPrice: 'السعر الكلي',
      notes: 'ملاحظات',
      confirmBooking: 'تأكيد الحجز',
      
      // Auth
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      address: 'العنوان',
      confirmPassword: 'تأكيد كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      alreadyHaveAccount: 'لديك حساب؟',
      
      // User Dashboard
      myBookings: 'حجوزاتي',
      myProfile: 'ملفي الشخصي',
      bookingHistory: 'السجل',
      rateBooking: 'تقييم',
      
      // Admin Panel
      adminDashboard: 'لوحة الإدارة',
      carManagement: 'إدارة السيارات',
      userManagement: 'إدارة المستخدمين',
      bookingManagement: 'إدارة الحجوزات',
      addCar: 'إضافة سيارة',
      editCar: 'تعديل سيارة',
      deleteCar: 'حذف سيارة',
      
      // Common
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      search: 'بحث',
      filter: 'تصفية',
      loading: 'جاري التحميل...',
      success: 'نجح',
      error: 'خطأ',

      // Spin Wheel
      winADiscount: 'اربح خصمًا!',
      spinWheelDescription: 'سجل الآن وقم بتدوير العجلة للفوز بخصم خاص على حجزك التالي!',
      continueToSpin: 'متابعة إلى التدوير',
      spinTheWheel: 'أدر العجلة',
      spinNow: 'أدر الآن',
      spinning: 'جاري الدوران...',
      congratulations: 'تهانينا',
      youWon: 'لقد فزت بـ',
      discount: 'خصم',
      yourPromoCode: 'كود الخصم الخاص بك',
      copyCode: 'نسخ الكود',
      promoCodeCopied: 'تم نسخ كود الخصم!',
      promoCodeSentEmail: 'تم إرسال كود الخصم إلى:',
      startBooking: 'بدء الحجز',
      giftOffer: 'عرض هدية',
      enterYourName: 'أدخل اسمك الكامل',
      enterYourEmail: 'أدخل بريدك الإلكتروني',
      enterYourPhone: 'أدخل رقم هاتفك',
      pleaseFillAllFields: 'يرجى ملء جميع الحقول',
      invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    },
  },
  it: {
    translation: {
      // Navigation
      home: 'Home',
      cars: 'Auto',
      about: 'Chi siamo',
      contact: 'Contatto',
      login: 'Accedi',
      signup: 'Registrati',
      logout: 'Esci',
      dashboard: 'Dashboard',
      getStarted: 'INIZIA',
      menu: 'Menu',
      signIn: 'Accedi',

      // Service Types
      marriage: 'MATRIMONIO',
      transfer: 'TRANSFER',

      // Hero Section
      heroTitle: 'Noleggio Auto per Matrimoni & Transfer',
      heroSubtitle: 'Auto eleganti con autisti professionisti',
      heroDescription: 'Veicoli selezionati per matrimoni e transfer aeroportuali puntuali.',
      heroDescriptionHighlight: 'Prenotazione rapida — veicoli pronti e puntuali.',
      exploreNow: 'Esplora',
      bookNow: 'Prenota Ora',
      getQuote: 'Richiedi Preventivo',
      selectService: 'SCEGLI IL TUO SERVIZIO',
      marriageService: 'MATRIMONIO',
      transferService: 'TRANSFER',
      marriageDesc: 'Auto di lusso per il tuo giorno speciale',
      transferDesc: 'Transfer aeroportuali e locali',
      startScrolling: 'INIZIA A SCORRERE',

      // Landing Stats
      statReal: 'PREMIUM',
      statRealLabel: 'SERVIZIO',
      statOne: 'LUSSO',
      statOneLabel: 'VEICOLI',
      statSmooth: 'FLUIDO',
      statSmoothLabel: 'ESPERIENZA',

      // Menu Items
      weddingCars: 'Auto da Matrimonio',
      airportTransfers: 'Transfer Aeroportuali',
      ourFleetMenu: 'La Nostra Flotta',
      getQuoteMenu: 'Richiedi Preventivo',
      aboutUs: 'Chi Siamo',
      driverRecruitment: 'Reclutamento Autisti',
      businessAccounts: 'Account Aziendali',

      // Quote Form
      getYourQuote: 'Ottieni il Tuo Preventivo',
      serviceType: 'Tipo di Servizio',
      weddingSpecialEvents: 'Matrimonio ed Eventi Speciali',
      airportLocationTransfer: 'Transfer Aeroporto e Località',
      enterPickupAddress: 'Inserisci indirizzo di ritiro',
      enterDestination: 'Inserisci destinazione',
      pickupDate: 'Data di Ritiro',
      pickupTime: 'Ora di Ritiro',
      viewAvailableVehicles: 'Visualizza Veicoli Disponibili',

      // Services Section
      ourServices: 'I Nostri Servizi',
      premiumLuxuryTransport: 'Trasporto di lusso premium per ogni occasione',
      wedding: 'Matrimonio',
      weddingServiceDesc: 'Servizio auto da matrimonio di lusso con autisti professionisti. Rendi il tuo giorno speciale indimenticabile.',
      transferTitle: 'Transfer',
      transferServiceDesc: 'Transfer aeroportuali e locali affidabili con tracciamento voli e prezzi fissi.',
      learnMore: 'Scopri di Più',

      // Fleet Section
      ourFleet: 'LA NOSTRA FLOTTA',
      premiumCars: 'AUTO PREMIUM',
      ourPremiumFleet: 'La Nostra Flotta Premium',
      luxuryVehiclesFor: 'veicoli di lusso per',
      weddingsSpecialEvents: 'matrimoni ed eventi speciali',
      airportLocationTransfers: 'transfer aeroportuali e locali',
      watchArrive: 'Guardali arrivare dall\'orizzonte',
      onTheHighway: 'SULL\'AUTOSTRADA',
      chooseYourExperience: 'Scegli la Tua Esperienza',
      exploreServices: 'Esplora i Servizi',
      exploreOurCars: 'Esplora la Nostra Collezione Premium',
      noCarsAvailable: 'Nessuna auto disponibile per questo servizio',
      noVehiclesAvailable: 'Nessun Veicolo Disponibile',
      updatingFleet: 'Stiamo aggiornando la nostra flotta per il servizio selezionato. Ricontrolla presto.',
      loadingPremiumFleet: 'Caricamento della nostra flotta premium...',

      // Airport Transfer Section
      airportAssuredService: 'Servizio Aeroporto Garantito',
      airportTransferDesc: 'Vivi transfer aeroportuali senza problemi con la nostra flotta premium. Tracciamo il tuo volo in tempo reale.',
      realTimeFlightTracking: 'Tracciamento volo in tempo reale',
      fixedPricingNoHiddenFees: 'Prezzi fissi senza costi nascosti',
      professionalChauffeurs: 'Autisti professionisti',
      bookAirportTransfer: 'Prenota Transfer Aeroporto',

      // Why Choose Us
      whyChooseUs: 'PERCHÉ SCEGLIERCI',
      whyChooseJasmin: 'Perché Scegliere Jasmin Rent Cars',
      trustedByThousands: 'Di fiducia da migliaia per servizio professionale e affidabile',
      premiumQuality: 'Qualità Premium',
      premiumQualityDesc: 'Veicoli di lusso con autisti professionisti',
      instantBooking: 'Prenotazione Immediata',
      instantBookingDesc: 'Prenotazione online con supporto 24/7',
      securePayment: 'Pagamento Sicuro',
      securePaymentDesc: 'Crittografia di livello bancario per le transazioni',

      // CTA Section
      readyToBook: 'Pronto a Prenotare la Tua Corsa?',
      experienceProfessional: 'Vivi il trasporto di lusso professionale con prezzi fissi e servizio eccezionale',
      getStartedCta: 'Inizia',

      // Footer
      company: 'Azienda',
      getQuoteFooter: 'Richiedi Preventivo',
      servicesFooter: 'Servizi',
      fleet: 'Flotta',
      careers: 'Carriere',
      ourStory: 'La Nostra Storia',
      accreditations: 'Accreditamenti',
      signUpFooter: 'Registrati',
      mobileApp: 'App Mobile',
      support: 'Supporto',
      helpCenter: 'Centro Assistenza',
      contactUs: 'Contattaci',
      faqs: 'FAQs',
      support247: 'Supporto 24/7',
      services: 'Servizi',
      weddingCarsFooter: 'Auto da Matrimonio',
      airportTransferFooter: 'Transfer Aeroporto',
      luxuryFleetFooter: 'Flotta di Lusso',
      chauffeurService: 'Servizio Autista',
      jasminRentCars: 'Jasmin Rent Cars',
      allRightsReserved: '© 2024 Jasmin Rent Cars. Tutti i diritti riservati.',
      footerTagline: 'La tua esperienza di noleggio auto premium',
      quickLinks: 'Link Rapidi',
      
      // Car Details
      perDay: 'al giorno',
      available: 'Disponibile',
      rented: 'Noleggiato',
      maintenance: 'Manutenzione',
      features: 'Caratteristiche',
      specifications: 'Specifiche',
      ratings: 'Valutazioni',
      viewDetails: 'Vedi dettagli',
      
      // Booking
      selectDates: 'Seleziona date',
      startDate: 'Data inizio',
      endDate: 'Data fine',
      pickupLocation: 'Luogo ritiro',
      dropoffLocation: 'Luogo consegna',
      totalDays: 'Giorni totali',
      totalPrice: 'Prezzo totale',
      notes: 'Note',
      confirmBooking: 'Conferma prenotazione',
      
      // Auth
      email: 'Email',
      password: 'Password',
      fullName: 'Nome completo',
      phone: 'Telefono',
      address: 'Indirizzo',
      confirmPassword: 'Conferma password',
      forgotPassword: 'Password dimenticata?',
      dontHaveAccount: 'Non hai un account?',
      alreadyHaveAccount: 'Hai già un account?',
      
      // User Dashboard
      myBookings: 'Le mie prenotazioni',
      myProfile: 'Il mio profilo',
      bookingHistory: 'Cronologia',
      rateBooking: 'Valuta',
      
      // Admin Panel
      adminDashboard: 'Dashboard Admin',
      carManagement: 'Gestione auto',
      userManagement: 'Gestione utenti',
      bookingManagement: 'Gestione prenotazioni',
      addCar: 'Aggiungi auto',
      editCar: 'Modifica auto',
      deleteCar: 'Elimina auto',
      
      // Common
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      search: 'Cerca',
      filter: 'Filtra',
      loading: 'Caricamento...',
      success: 'Successo',
      error: 'Errore',

      // Spin Wheel
      winADiscount: 'Vinci uno Sconto!',
      spinWheelDescription: 'Registrati ora e gira la ruota per vincere uno sconto speciale sulla tua prossima prenotazione!',
      continueToSpin: 'Continua a Girare',
      spinTheWheel: 'Gira la Ruota',
      spinNow: 'Gira Ora',
      spinning: 'In rotazione...',
      congratulations: 'Congratulazioni',
      youWon: 'Hai vinto',
      discount: 'di sconto',
      yourPromoCode: 'Il Tuo Codice Promo',
      copyCode: 'Copia Codice',
      promoCodeCopied: 'Codice promo copiato negli appunti!',
      promoCodeSentEmail: 'Il tuo codice promo è stato inviato a:',
      startBooking: 'Inizia a Prenotare',
      giftOffer: 'Offerta Regalo',
      enterYourName: 'Inserisci il tuo nome completo',
      enterYourEmail: 'Inserisci la tua email',
      enterYourPhone: 'Inserisci il tuo numero di telefono',
      pleaseFillAllFields: 'Si prega di compilare tutti i campi',
      invalidEmail: 'Si prega di inserire un indirizzo email valido',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Always start with English for SSR
    fallbackLng: 'en',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language on client side only
if (typeof window !== 'undefined') {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && savedLanguage !== 'en') {
    i18n.changeLanguage(savedLanguage);
  }
}

export default i18n;

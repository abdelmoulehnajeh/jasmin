import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './globals-responsive.css';
import { I18nProvider } from './i18n-provider';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.transfertmariage.com'),
  title: {
    default: 'Jasmin Rent Cars | Location voiture mariage & Transfert Aéroport Tunisie',
    template: '%s | Jasmin Rent Cars'
  },
  description: 'Jasmin Rent Cars propose la location de voitures de luxe pour mariages, cérémonies et transferts aéroport en Tunisie. Service premium avec chauffeur, élégance et ponctualité garanties.',
  keywords: [
    'location voiture mariage',
    'louer voiture tunisie',
    'transfert aeroport tunisie',
    'mariage luxe tunisie',
    'car rental tunisia',
    'wedding car rental',
    'airport transfer tunis',
    'location voiture de luxe',
    'jasmin rent cars',
    'transfert mariage'
  ],
  authors: [{ name: 'Jasmin Rent Cars' }],
  creator: 'Jasmin Rent Cars',
  publisher: 'Jasmin Rent Cars',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
      'ar-TN': '/ar',
    },
  },
  openGraph: {
    title: 'Jasmin Rent Cars | Location voiture mariage & Transfert Aéroport Tunisie',
    description: 'Location de voitures de luxe pour vos événements spéciaux et transferts aéroport en Tunisie. Excellence et prestige.',
    url: 'https://www.transfertmariage.com',
    siteName: 'Jasmin Rent Cars',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Jasmin Rent Cars Logo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jasmin Rent Cars | Location voiture mariage & Transfert Aéroport',
    description: 'Location de voitures de luxe pour mariages et transferts aéroport en Tunisie.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: 'Jasmin Rent Cars',
    description: 'Location de voitures de luxe pour mariages et transferts aéroport en Tunisie.',
    url: 'https://www.transfertmariage.com',
    logo: 'https://www.transfertmariage.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Cité El Ghazala',
      addressLocality: 'Ariana',
      addressRegion: 'Ariana',
      postalCode: '2083',
      addressCountry: 'TN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.892422,
      longitude: 10.176791
    },
    telephone: '+21622420360',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '00:00',
        closes: '23:59'
      }
    ],
    priceRange: '$$'
  };

  return (
    <html lang="fr" bbai-tooltip-injected="true">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

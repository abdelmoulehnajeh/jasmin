import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './globals-responsive.css';
import { I18nProvider } from './i18n-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jasmin Rent Cars - Premium Luxury Car Rentals',
  description: 'Rent luxury cars for weddings and transfers with 3D visualization and multilingual support',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" bbai-tooltip-injected="true">
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

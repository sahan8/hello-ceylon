import { Toaster } from 'react-hot-toast';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT', 'WONK'],
});
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hello Ceylon';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Hello Ceylon | Private Sri Lanka Tours & Journeys',
  description: 'Say hello to Sri Lanka. Private, locally guided tours, scenic transfers, and tailor-made journeys across the island — with live availability and simple booking.',
  keywords: 'Hello Ceylon, Sri Lanka tours, private Sri Lanka guide, Ella tours, Sri Lanka taxi, Ceylon travel, tailor made Sri Lanka',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Hello Ceylon — Sri Lanka, one story at a time.',
    description: 'Private, locally guided journeys across Sri Lanka with live availability and simple booking.',
    url: siteUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Hello Ceylon', description: 'Private, locally guided journeys across Sri Lanka.' },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristInformationCenter',
  name: siteName,
  description: 'Private, locally guided tours and tailor-made journeys across Sri Lanka.',
  url: siteUrl,
  areaServed: { '@type': 'Country', name: 'Sri Lanka' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#14211B',
              color: '#FAF7F0',
              fontFamily: 'var(--font-sans)',
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}

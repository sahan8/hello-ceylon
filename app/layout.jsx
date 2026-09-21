import { Toaster } from 'react-hot-toast';
import { Cormorant_Garamond, DM_Mono, DM_Sans } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400', '500'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hello Ceylon';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Hello Ceylon | Sri Lanka Trips & Day Tours',
  description: 'Simple Sri Lanka trips, scenic transfers, local places, live availability, and easy booking from Ella.',
  keywords: 'Hello Ceylon, Sri Lanka trips, Ella tours, Sri Lanka taxi, Ceylon travel, day tours Sri Lanka',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Hello Ceylon — Sri Lanka, one story at a time.',
    description: 'Simple trips across Sri Lanka with local knowledge, live availability, and easy booking.',
    url: siteUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Hello Ceylon', description: 'Simple trips across Sri Lanka, one place at a time.' },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristInformationCenter',
  name: siteName,
  description: 'Local trips, scenic transfers, and simple day tours across Sri Lanka.',
  url: siteUrl,
  areaServed: { '@type': 'Country', name: 'Sri Lanka' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#102A43',
              color: '#FBF8F1',
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

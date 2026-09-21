'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Tours from '../components/Tours';
import BookingForm from '../components/BookingForm';
import Payment from '../components/Payment';
import Testimonials from '../components/Testimonials';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import MobileDock from '../components/MobileDock';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <div
        className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-gold-bright via-canopy-600 to-gold-bright transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Tours />
      <Gallery />
      <BookingForm />
      <Payment />
      <Testimonials />
      <MapSection />
      <Footer />
      <FloatingWhatsApp />
      <MobileDock />
    </main>
  );
}

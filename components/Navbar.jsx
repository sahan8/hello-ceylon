'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function LogoMark({ size = 38, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className="text-gold" />
      <circle cx="24" cy="19" r="7" fill="#E3B23C" />
      <path d="M8 30c4-3.5 8-3.5 12 0s8 3.5 12 0 6-3 8-1.5" stroke="#0C3B2E" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M10 36c3.5-2.8 7-2.8 10.5 0s7 2.8 10.5 0 5.2-2.4 7-1.2" stroke="#0C3B2E" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.55" />
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: '-35% 0px -55%' }
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = event => event.key === 'Escape' && setIsMobileMenuOpen(false);
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '#story', label: 'Our Story' },
    { href: '#tours', label: 'Journeys' },
    { href: '#availability', label: 'Availability' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Primary navigation"
        className={`container-premium mt-3 flex items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-5 ${
          isScrolled ? 'glass h-16 shadow-[0_12px_40px_-16px_rgba(12,59,46,0.35)]' : 'h-[4.5rem] bg-transparent'
        }`}
      >
        <Link href="#home" className="group flex items-center gap-3" aria-label="Hello Ceylon — back to top">
          <LogoMark className={`transition-all duration-500 ${isScrolled ? 'h-9 w-9' : 'h-10 w-10'} group-hover:rotate-12`} />
          <span className="leading-none">
            <span className={`block font-display text-xl tracking-tight transition-colors duration-500 ${isScrolled ? 'text-ink' : 'text-white'}`}>
              Hello Ceylon
            </span>
            <span className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-500 ${isScrolled ? 'text-moss' : 'text-white/70'}`}>
              Sri Lanka, privately
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.href.slice(1) ? 'location' : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                isScrolled ? 'text-moss hover:text-canopy' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
              {activeSection === link.href.slice(1) && (
                <motion.span layoutId="nav-active" className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${isScrolled ? 'bg-gold' : 'bg-gold-bright'}`} />
              )}
            </Link>
          ))}
          <Link
            href="#book"
            className={`ml-3 inline-flex min-h-11 items-center rounded-full px-6 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
              isScrolled
                ? 'bg-canopy text-white shadow-[0_10px_28px_-10px_rgba(12,59,46,0.6)] hover:bg-canopy-950'
                : 'bg-gold-bright text-canopy-950 shadow-[0_10px_28px_-8px_rgba(227,178,60,0.55)] hover:bg-[#F0C254]'
            }`}
          >
            Plan my trip
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
            isScrolled ? 'text-ink hover:bg-canopy/5' : 'text-white hover:bg-white/10'
          }`}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <div className="flex h-4 w-5 flex-col justify-between">
            <motion.span animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }} className="h-0.5 w-full origin-center rounded-full bg-current" />
            <motion.span animate={{ opacity: isMobileMenuOpen ? 0 : 1, x: isMobileMenuOpen ? 8 : 0 }} className="h-0.5 w-full rounded-full bg-current" />
            <motion.span animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }} className="h-0.5 w-full origin-center rounded-full bg-current" />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            id="mobile-navigation"
            className="fixed inset-x-3 top-[5.5rem] max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-3xl bg-canopy-950 p-6 shadow-2xl lg:hidden grain"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 font-display text-3xl text-shell transition-colors hover:bg-white/5 hover:text-gold-bright"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-lg text-gold-bright/60">→</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link
                  href="#book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 flex min-h-14 items-center justify-center rounded-2xl bg-gold-bright font-sans text-base font-bold text-canopy-950 transition-colors hover:bg-[#F0C254]"
                >
                  Plan my trip
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

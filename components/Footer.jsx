'use client';

import Link from 'next/link';
import { LogoMark } from './Navbar';

const links = [
  ['Our story', '#story'],
  ['Journeys', '#tours'],
  ['Book a journey', '#book'],
  ['Guest stories', '#reviews'],
  ['Contact', '#contact'],
];

export default function Footer() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <footer className="relative overflow-hidden bg-canopy-950 text-white grain">
      <div className="container-premium relative py-16 sm:py-20">
        <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={40} />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-bright">Hello Ceylon</p>
            </div>
             <h2 className="mt-7 max-w-2xl font-display text-4xl leading-[1.08] sm:text-5xl">
               Your next view is waiting.
               <span className="block italic text-gold-bright">Say hello.</span>
            </h2>
            <Link
              href="#book"
              className="group mt-9 inline-flex min-h-14 items-center gap-4 rounded-full bg-gold-bright px-8 text-sm font-bold text-canopy-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cinnamon"
            >
              Plan your journey
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lg:justify-self-end">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">Explore</p>
            <nav aria-label="Footer navigation" className="grid gap-3">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="w-fit text-base text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
            {number && (
              <a href={`https://wa.me/${number}`} target="_blank" rel="noreferrer" className="mt-8 inline-block border-b border-gold-bright pb-1 text-sm text-white transition-colors hover:text-gold-bright">
                Contact on WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hello Ceylon. All rights reserved.</p>
          <Link href="/admin" className="w-fit transition-colors hover:text-white">Admin access</Link>
        </div>
      </div>

       <div className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[9vw] leading-[0.8] tracking-[-0.03em] text-white/[0.04]" aria-hidden="true">
        HELLO CEYLON
      </div>
    </footer>
  );
}

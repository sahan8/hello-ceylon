'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '32%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="home" ref={sectionRef} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-canopy-950 text-white">
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: reduceMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 2.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Cinematic views of Sri Lanka"
          >
            <source src="/videos/hero-desktop.mp4" media="(min-width: 640px)" type="video/mp4" />
            <source src="/videos/hero-mobile.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </motion.div>

       <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(6,35,27,.92)_0%,rgba(6,35,27,.62)_42%,rgba(6,35,27,.18)_75%,rgba(6,35,27,.42)_100%)]" />
       <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,35,27,.45)_0%,transparent_26%,transparent_62%,rgba(6,35,27,.95)_100%)]" />
       <div className="tech-grid pointer-events-none absolute inset-x-0 top-0 h-3/4 opacity-70" aria-hidden="true" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-gold-bright/10 blur-3xl animate-drift" aria-hidden="true" />
       <div className="pointer-events-none absolute -right-32 bottom-1/3 h-[28rem] w-[28rem] rounded-full bg-lagoon/20 blur-3xl animate-drift" style={{ animationDelay: '-7s' }} aria-hidden="true" />

       <svg className="absolute inset-y-0 right-0 hidden h-full w-[42%] opacity-20 lg:block" viewBox="0 0 700 900" fill="none" aria-hidden="true">
        <motion.path
          d="M770 90C570 55 430 150 455 282c26 137 208 121 178 272-28 140-230 137-256 287"
          stroke="#E3B23C" strokeWidth="1.5" strokeDasharray="4 8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 3, ease: 'easeInOut', delay: 0.6 }}
        />
        <motion.path
          d="M830 160C646 105 507 166 518 266c14 123 163 137 145 272-18 126-160 176-189 288"
          stroke="white" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0 : 3.4, ease: 'easeInOut', delay: 0.9 }}
        />
       </svg>

       <motion.div
         aria-hidden="true"
         className="soft-glow pointer-events-none absolute right-[9%] top-[31%] hidden h-40 w-40 rounded-full border border-gold-bright/30 lg:block"
         animate={reduceMotion ? {} : { rotate: 360 }}
         transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
       >
         <span className="absolute -right-1 top-1/2 h-2 w-2 rounded-full bg-gold-bright shadow-[0_0_18px_4px_rgba(217,170,60,0.8)]" />
         <span className="absolute inset-5 rounded-full border border-lagoon/50" />
       </motion.div>

      <motion.div style={{ y: contentY, opacity: fade }} className="container-premium relative z-10 flex flex-1 flex-col justify-center pb-40 pt-36 sm:pb-44">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: reduceMotion ? 0 : 0.13 }} className="max-w-4xl">
          <motion.div variants={reveal} transition={{ duration: 0.65 }} className="mb-7 flex items-center gap-3">
            <span className="h-px w-12 bg-gold-bright" aria-hidden="true" />
           <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-bright">Made for Sri Lanka</span>
          </motion.div>

          <motion.h1 variants={reveal} transition={{ duration: 0.85 }} id="hero-title" className="display-title max-w-[12ch] text-white">
            Hello,
            <span className="block">
              <em className="wonk gradient-text not-italic">Ceylon.</em>
            </span>
          </motion.h1>

          <motion.p variants={reveal} transition={{ duration: 0.7 }} className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
             Tea hills, waterfalls, wildlife and coastlines. Choose a place, pick a date, and let the island do the rest.
          </motion.p>

          <motion.div variants={reveal} transition={{ duration: 0.7 }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#book"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gold-bright px-8 text-sm font-bold text-canopy-950 shadow-[0_18px_44px_-12px_rgba(227,178,60,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F0C254]"
            >
              Start your journey
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
            <Link
              href="#tours"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/35 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-canopy-950"
            >
              Explore journeys
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 1, duration: 0.8 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/12 bg-canopy-950/60 backdrop-blur-md"
      >
         <div className="container-premium flex snap-x snap-mandatory overflow-x-auto divide-x divide-white/10 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0 no-scrollbar">
          {[
             ['01', 'Made for your pace', 'Keep the day open for the places you enjoy.'],
             ['02', 'Local knowledge', 'Useful stops, honest tips, and routes that make sense.'],
             ['03', 'Easy to arrange', 'Pick a place and date. We will confirm the details.'],
          ].map(([number, title, text]) => (
            <div key={number} className="flex min-h-24 min-w-[86vw] snap-start items-center gap-4 px-5 py-4 sm:min-w-0 lg:px-8">
              <span className="font-display text-2xl italic text-gold-bright">{number}</span>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 1.6 }}
        className="absolute bottom-32 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:bottom-36 md:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <motion.span
          animate={reduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-gold-bright to-transparent"
        />
      </motion.div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import { DataState, SkeletonCards } from './ui/States';
import { motionTokens, revealUp } from '../lib/motion';

const categoryLabel = { city: 'City', nature: 'Nature', culture: 'Culture', transfer: 'Transfer', custom: 'Custom' };

function StampIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-gold">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reduceMotion = useReducedMotion();

  const loadTours = () => {
    setLoading(true);
    setError('');
    fetch('/api/tours')
      .then(response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => setTours(data.success ? data.tours : []))
      .catch(() => setError('We could not connect to the journey catalogue. Your booking details have not been changed.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadTours, []);

  return (
    <section id="tours" aria-labelledby="tours-title" className="section-space relative overflow-hidden bg-parchment">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-canopy/10 blur-3xl" aria-hidden="true" />

      <div className="container-premium relative">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div id="tours-title">
            <SectionHeading eyebrow="Choose your journey" title="See more." accent="Travel deeper." />
          </div>
          <p className="max-w-2xl text-base leading-7 text-moss lg:justify-self-end">
            Every experience below comes from the live catalogue — real pricing, real duration, confirmed personally. Pick one, or use it as the starting point for something tailor-made.
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <SkeletonCards />
          ) : error ? (
            <DataState title="Journeys are temporarily unavailable" message={error} action={loadTours} />
          ) : tours.length === 0 ? (
            <DataState title="New journeys are being prepared" message="There are no active journeys to show right now. Please get in touch for a custom request." />
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              transition={{ staggerChildren: reduceMotion ? 0 : motionTokens.stagger.normal }}
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {tours.map((tour, index) => (
                <motion.article
                  key={tour._id}
                  variants={revealUp}
                  transition={{ duration: reduceMotion ? 0 : motionTokens.duration.reveal, ease: motionTokens.ease.out }}
                  className="card-lift group relative flex min-h-[380px] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-7"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-gradient-to-bl from-gold/15 to-transparent" aria-hidden="true" />
                  <div className="absolute right-5 top-5 opacity-70 transition-transform duration-500 group-hover:rotate-12" aria-hidden="true">
                    <StampIcon />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-canopy/15 bg-canopy-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-canopy">
                      {categoryLabel[tour.category] || 'Journey'}
                    </span>
                    <span className="font-display text-3xl italic text-canopy/25" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-10 flex-1">
                    <h3 className="font-display text-[1.9rem] leading-[1.05] text-ink">{tour.name}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-moss">{tour.description}</p>
                  </div>

                  <div className="mt-8 border-t border-dashed border-line pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-moss">Duration</p>
                        <p className="mt-1 text-sm font-bold text-ink">{tour.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-moss">Per person</p>
                        <p className="mt-1 font-display text-3xl text-canopy">${tour.price}</p>
                      </div>
                    </div>
                    <a
                      href="#book"
                      className="mt-5 flex min-h-12 w-full items-center justify-between rounded-full bg-ink px-5 text-sm font-bold text-white transition-colors duration-300 group-hover:bg-canopy"
                    >
                      Select this journey
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

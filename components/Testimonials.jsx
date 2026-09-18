'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

const testimonials = [
  { name: 'Sarah M.', country: 'United Kingdom', rating: 5, text: 'Our Sri Lanka trip was truly magical. The knowledge of the ancient sites is extraordinary — we felt like we were discovering a hidden world.' },
  { name: 'James T.', country: 'Australia', rating: 5, text: 'Booked the hill country tour and the team went above and beyond. The waterfalls and tea plantations were breathtaking.' },
  { name: 'Priya K.', country: 'India', rating: 5, text: 'So professional and warm. Every hidden temple and local spot was known. Highly recommend the cultural trail!' },
  { name: 'Marco R.', country: 'Germany', rating: 5, text: 'Best guiding in Sri Lanka without question. Pure discovery at every turn — the name Hello Ceylon truly fits.' },
  { name: 'Lisa C.', country: 'United States', rating: 5, text: 'We did three tours over two weeks. Every single one was unforgettable and customized to our interests.' },
  { name: 'Yuki T.', country: 'Japan', rating: 5, text: 'Perfect English and genuine warmth. We were shown places no guidebook mentions. An absolutely wonderful experience.' },
  { name: 'David & Emma', country: 'Canada', rating: 5, text: 'Our family of four had the best time. Amazing with our kids — Sri Lanka is beautiful, and the guiding made it magical.' },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rated ${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="h-4 w-4 text-gold-bright" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const next = useCallback(() => { setDirection(1); setCurrentIndex(prev => (prev + 1) % testimonials.length); }, []);
  const prev = () => { setDirection(-1); setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length); };
  const goTo = (index) => { setDirection(index > currentIndex ? 1 : -1); setCurrentIndex(index); };

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(next, 6500);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, next]);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: reduceMotion ? 0 : dir > 0 ? 120 : -120 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: reduceMotion ? 0 : dir > 0 ? -120 : 120 }),
  };

  return (
    <section id="reviews" className="section-space relative overflow-hidden bg-parchment">
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />

      <div className="container-premium relative">
        <SectionHeading
          align="center"
          eyebrow="Guest stories"
          title="Travelers say it"
          accent="best."
          description="Real journeys, real people — a few words from guests who traveled the island with us."
        />

        <div
          className="relative mx-auto mt-12 max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex min-h-[300px] items-center justify-center sm:min-h-[280px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeInOut' }}
                className="w-full"
              >
                <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-8 paper-edge lg:p-12">
                  <div className="absolute left-0 top-0 h-20 w-20 rounded-br-full bg-gold/10" aria-hidden="true" />
                  <svg className="mb-5 h-10 w-10 text-gold/40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.5 8C7 8 5 10 5 12.5S7 17 9.5 17c.4 0 .8-.1 1.1-.2C10 18.5 8.6 19.6 7 20l.6 1.5c3.3-.9 5.9-3.9 5.9-8C13.5 10.4 11.7 8 9.5 8zm9 0C16 8 14 10 14 12.5S16 17 18.5 17c.4 0 .8-.1 1.1-.2-.6 1.7-2 2.8-3.6 3.2l.6 1.5c3.3-.9 5.9-3.9 5.9-8 0-3.1-1.8-5.5-4-5.5z" />
                  </svg>
                  <blockquote className="mx-auto max-w-2xl text-center font-display text-xl italic leading-relaxed text-ink lg:text-2xl">
                    {testimonials[currentIndex].text}
                  </blockquote>
                  <figcaption className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    <span className="font-bold text-ink">{testimonials[currentIndex].name}</span>
                    <span className="h-4 w-px bg-line" aria-hidden="true" />
                    <span className="text-sm text-moss">{testimonials[currentIndex].country}</span>
                    <span className="h-4 w-px bg-line" aria-hidden="true" />
                    <Stars count={testimonials[currentIndex].rating} />
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-canopy shadow-lg transition-all duration-200 hover:bg-canopy hover:text-white sm:-left-6"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-canopy shadow-lg transition-all duration-200 hover:bg-canopy hover:text-white sm:-right-6"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Testimonial ${idx + 1}`}
              className={`cursor-pointer rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'h-2.5 w-8 bg-canopy' : 'h-2.5 w-2.5 bg-moss/25 hover:bg-canopy/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

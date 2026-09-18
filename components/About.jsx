'use client';

import { motion, useReducedMotion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import { motionTokens, revealUp } from '../lib/motion';

const principles = [
  ['A journey with context', 'Go beyond a list of stops — understand the places, the people, and the stories you travel through.'],
  ['Space to travel well', 'Private guiding gives the day room to breathe: linger at a viewpoint, skip a crowd, follow a recommendation.'],
  ['A direct conversation', 'Your request goes straight to your guide for a personal confirmation — no call centres, no middlemen.'],
];

export default function About() {
  const reduceMotion = useReducedMotion();
  const guideName = process.env.NEXT_PUBLIC_GUIDE_NAME || 'Chanu';

  return (
    <section id="story" className="section-space relative overflow-hidden bg-shell contour-pattern">
      <div className="container-premium grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: reduceMotion ? 0 : -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: motionTokens.ease.out }}
          className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-canopy-950 p-8 text-white grain sm:p-12"
        >
          <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 600 600" fill="none" aria-hidden="true">
            {[100, 145, 190, 235].map(size => (
              <path key={size} d={`M-40 ${size + 80} C110 ${size - 70}, 210 ${size + 130}, 360 ${size} S650 ${size + 70}, 690 ${size - 50}`} stroke="#FAF7F0" strokeWidth="0.8" />
            ))}
            <motion.path
              d="M110 510C185 380 185 240 312 105"
              stroke="#E3B23C" strokeWidth="2.5" strokeDasharray="5 11"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 2.2, ease: 'easeInOut' }}
            />
            <circle cx="111" cy="510" r="7" fill="#E3B23C" />
            <circle cx="312" cy="105" r="7" fill="#E3B23C" />
          </svg>

          <div className="relative flex h-full min-h-[400px] flex-col justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-bright/90">The guide behind the journey</p>
            <blockquote className="max-w-md font-display text-4xl leading-[1.08] sm:text-5xl">
              “A good journey leaves <em className="wonk not-italic text-gold-bright">space</em> for the island to surprise you.”
            </blockquote>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-bright font-display text-2xl text-canopy-950">{guideName.charAt(0)}</span>
              <div>
                <p className="font-bold">{guideName}</p>
                <p className="text-sm text-white/60">Your local guide</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div>
          <SectionHeading
            eyebrow="Travel personally"
            title="Meet the person"
            accent="guiding your story."
            description="Hello Ceylon is built around a direct, personal guiding experience — not an anonymous itinerary marketplace. You plan with the person who will actually drive, walk, and explore alongside you."
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ staggerChildren: reduceMotion ? 0 : 0.1 }}
            className="mt-10 divide-y divide-line border-y border-line"
          >
            {principles.map(([title, description], index) => (
              <motion.div
                key={title}
                variants={revealUp}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: motionTokens.ease.out }}
                className="grid gap-3 py-6 sm:grid-cols-[52px_1fr]"
              >
                <span className="font-display text-2xl italic text-gold">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-moss">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

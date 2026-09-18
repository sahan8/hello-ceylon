'use client';

import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

export default function MapSection() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const guideName = process.env.NEXT_PUBLIC_GUIDE_NAME || 'your guide';

  return (
    <section id="contact" className="section-space bg-shell contour-pattern">
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white px-6 py-12 paper-edge sm:px-12 lg:px-16 lg:py-16">
          <svg className="absolute -right-24 -top-24 h-96 w-96 opacity-[0.07]" viewBox="0 0 400 400" fill="none" aria-hidden="true">
            <circle cx="200" cy="200" r="160" stroke="#0C3B2E" />
            <circle cx="200" cy="200" r="120" stroke="#0C3B2E" />
            <circle cx="200" cy="200" r="80" stroke="#0C3B2E" />
            <path d="M200 15v370M15 200h370" stroke="#0C3B2E" />
          </svg>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading
              eyebrow="Start a conversation"
               title="Ready to go?"
               accent="Let's plan it."
               description={`Send your dates and interests. ${guideName} will reply with a clear plan before you confirm anything.`}
            />
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="flex flex-col gap-3">
              {number ? (
                <a
                  href={`https://wa.me/${number}?text=${encodeURIComponent('Hello Ceylon! I would like to plan a Sri Lanka journey.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-canopy px-8 text-sm font-bold text-white transition-colors hover:bg-canopy-950"
                >
                  Message on WhatsApp
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <p className="max-w-xs rounded-2xl bg-parchment p-4 text-sm leading-6 text-moss">
                  Contact details will appear here once the WhatsApp number is configured.
                </p>
              )}
              <a href="#book" className="inline-flex min-h-14 items-center justify-center rounded-full border border-line px-8 text-sm font-bold text-ink transition-colors hover:border-canopy hover:text-canopy">
                Or book directly →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

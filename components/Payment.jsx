'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

export default function Payment() {
  const [tours, setTours] = useState([]);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    fetch('/api/tours')
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => { if (data.success) setTours(data.tours); })
      .catch(() => {});
  }, []);

  return (
    <section id="pricing" className="section-space relative overflow-hidden bg-shell contour-pattern">
      <div className="container-premium">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Simple &"
          accent="transparent."
          description="No hidden fees. Reserve your journey first, then contact your guide to arrange payment."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 max-w-2xl rounded-[1.75rem] border border-canopy/15 bg-white p-7 paper-edge sm:p-9"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 10.5c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-gold">After booking</p>
              <h3 className="font-display text-2xl text-ink">Arrange payment safely</h3>
              <p className="mt-4 rounded-xl bg-parchment px-4 py-3 text-sm leading-6 text-moss">
                Payment is arranged directly after your booking is confirmed. No bank or card details are collected on this website.
              </p>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Ceylon! I would like to ask about payment for my booking.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-canopy px-5 text-sm font-bold text-white transition-colors hover:bg-canopy-950"
                >
                  Ask about payment →
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-[1.75rem] border border-line bg-white paper-edge"
        >
          <div className="border-b border-line p-6 sm:px-8">
            <h3 className="font-display text-2xl text-ink">Journey pricing</h3>
             <p className="mt-1 text-sm text-moss">Live pricing and currency from the journey catalogue</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-parchment/60">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-moss sm:px-8">Journey</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-moss">Duration</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.16em] text-moss sm:px-8">Price</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-moss">Pricing appears here once journeys are loaded</td></tr>
                ) : (
                  tours.map((tour, index) => (
                    <tr key={tour._id} className={`transition-colors hover:bg-canopy-50/60 ${index % 2 === 0 ? 'bg-white' : 'bg-shell'}`}>
                      <td className="px-6 py-4 font-display text-lg text-ink sm:px-8">{tour.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-moss">
                          <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {tour.duration}
                        </span>
                      </td>
                       <td className="px-6 py-4 text-right font-display text-xl text-canopy sm:px-8">{tour.priceOnRequest || tour.price === 0 ? 'On request' : `${tour.currency || 'USD'} ${Number(tour.price).toLocaleString()}`}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-8 rounded-2xl border-l-4 border-l-gold bg-white p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <svg className="h-7 w-7 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <div>
              <p className="font-display text-lg italic text-ink">
                 Hello Ceylon runs on trust. Every booking is confirmed personally within 24 hours.
              </p>
               <p className="mt-2 text-xs text-moss">Payment details are shared directly after your journey is confirmed.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

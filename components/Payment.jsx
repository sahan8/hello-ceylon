'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';

const icons = {
  cash: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  bank: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 10.5c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  card: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  mobile: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
};

const paymentMethods = [
  { icon: 'cash', name: 'Cash on the day', description: 'Pay your guide directly when you travel', tint: 'bg-canopy-50 text-canopy' },
  { icon: 'bank', name: 'Bank transfer', description: 'Transfer to our Sri Lankan account', tint: 'bg-gold/10 text-gold' },
  { icon: 'card', name: 'Visa / Mastercard', description: 'Secure card payment online', tint: 'bg-cinnamon/10 text-cinnamon' },
  { icon: 'mobile', name: 'PayHere', description: 'Local Sri Lankan payment gateway', tint: 'bg-lagoon/10 text-lagoon' },
];

export default function Payment() {
  const [tours, setTours] = useState([]);

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
          description="No hidden fees. Pay on the day, or settle in advance — whichever suits you."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="card-lift rounded-2xl border border-line bg-white p-6"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${method.tint}`}>
                {icons[method.icon]}
              </div>
              <h3 className="font-display text-xl text-ink">{method.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-moss">{method.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-[1.75rem] border border-line bg-white paper-edge"
        >
          <div className="border-b border-line p-6 sm:px-8">
            <h3 className="font-display text-2xl text-ink">Journey pricing</h3>
            <p className="mt-1 text-sm text-moss">Per person, in USD — straight from the live catalogue</p>
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
                      <td className="px-6 py-4 text-right font-display text-xl text-canopy sm:px-8">${tour.price}</td>
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
              <p className="mt-2 text-xs text-moss">No prepayment required — pay on the day of your journey</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './ui/SectionHeading';
import 'react-day-picker/dist/style.css';

export default function AvailabilityCalendar({ onSelectDate }) {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAvailability = () => {
    setLoading(true);
    setError('');
    fetch('/api/availability')
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => { if (data.success) setAvailability(data.availability); })
      .catch(() => setError('Availability could not be loaded. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadAvailability, []);

  const asLocalDate = value => new Date(`${value}T12:00:00`);
  const bookedDates = availability.filter(a => ['booked', 'pending'].includes(a.status)).map(a => asLocalDate(a.date));
  const blockedDates = availability.filter(a => a.status === 'blocked').map(a => asLocalDate(a.date));
  const availableDates = availability.filter(a => a.status === 'available').map(a => asLocalDate(a.date));

  const handleSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const modifiers = { booked: bookedDates, blocked: blockedDates, available: availableDates };

  const modifiersStyles = {
    booked: { backgroundColor: '#B34A2B', color: '#fff', borderRadius: '50%', fontWeight: 700 },
    available: { backgroundColor: '#0C3B2E', color: '#fff', borderRadius: '50%', fontWeight: 600 },
    blocked: { textDecoration: 'line-through', opacity: 0.4 },
  };

  return (
    <section id="availability" className="section-space relative overflow-hidden bg-shell contour-pattern">
      <div className="container-premium">
        <SectionHeading
          align="center"
          eyebrow="Plan ahead"
          title="Check live"
          accent="availability."
          description="Dates update in real time. Green days are open — choose one and continue straight into booking."
        />

        <div className="mx-auto mt-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1.75rem] border border-line bg-white p-5 paper-edge sm:p-7"
          >
            {loading ? (
              <div className="flex h-72 items-center justify-center" role="status" aria-label="Loading availability">
                <div className="relative">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-canopy/15 border-t-canopy" />
                  <div className="absolute inset-0 h-10 w-10 animate-spin-slow rounded-full border-2 border-gold/10 border-b-gold" />
                </div>
              </div>
            ) : error ? (
              <div className="grid min-h-72 place-items-center text-center" role="alert">
                <div>
                  <p className="mb-4 text-moss">{error}</p>
                  <button onClick={loadAvailability} className="min-h-11 cursor-pointer rounded-full bg-canopy px-6 font-bold text-white transition-colors hover:bg-canopy-950">
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                disabled={[...bookedDates, ...blockedDates]}
                fromDate={new Date()}
                toDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                numberOfMonths={1}
                className="font-sans"
                styles={{
                  caption: { fontFamily: 'var(--font-display), serif', fontSize: '1.3rem', color: '#14211B' },
                  head_cell: { fontWeight: 600, fontSize: '0.78rem', color: '#55645B' },
                  cell: { padding: '4px' },
                  day: { width: '44px', height: '44px', borderRadius: '50%', fontWeight: 500 },
                  day_selected: { backgroundColor: '#A16207', color: '#fff', fontWeight: 700 },
                  day_today: { fontWeight: 800, color: '#A16207' },
                }}
              />
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-canopy" aria-hidden="true" />
                <span className="text-sm text-moss">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cinnamon" aria-hidden="true" />
                <span className="text-sm text-moss">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-moss/40" aria-hidden="true" />
                <span className="text-sm text-moss">Blocked</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 12, height: 0 }}
                className="mt-6 overflow-hidden rounded-2xl border-l-4 border-l-gold bg-white shadow-lg"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-start gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="mt-0.5 text-xs text-moss">Selected — continue below to complete your booking</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SectionHeading from './ui/SectionHeading';

export default function BookingForm({ selectedDate: initialDate }) {
  const [step, setStep] = useState(1);
  const [tours, setTours] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate || null);
  const [people, setPeople] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  const [toursError, setToursError] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', specialRequests: '' });
  const [errors, setErrors] = useState({});

  const selectedTourDetails = tours.find(tour => tour._id === selectedTour);
  const formatPrice = tour => tour?.priceOnRequest || tour?.price === 0 ? 'Price on request' : `${tour?.currency || 'USD'} ${Number(tour.price).toLocaleString()}`;

  useEffect(() => {
    setToursError('');
    fetch('/api/tours')
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
      .then(data => { if (data.success) setTours(data.tours); })
      .catch(() => setToursError('Journeys could not be loaded. Please retry before booking.'));
  }, []);

  useEffect(() => {
    if (initialDate) setSelectedDate(initialDate);
  }, [initialDate]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^\S+@\S+$/i)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!selectedTour) newErrors.tour = 'Please select a journey';
    if (!selectedDate) newErrors.date = 'Please select a date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!selectedDate) { toast.error('Please select a date'); return; }
    setIsLoading(true);
    setBookingName(formData.name);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: selectedDate.toISOString(), people, tourId: selectedTour }),
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setBookingReference(result.reference || '');
        toast.success('Booking submitted successfully!');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to submit booking');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Your Details' },
    { num: 2, label: 'Choose Journey' },
    { num: 3, label: 'Review & Submit' },
  ];

  if (isSuccess) {
    return (
      <section id="book" className="section-space relative overflow-hidden bg-canopy-950 grain">
        <div className="mx-auto max-w-lg px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-bright/15">
              <svg className="h-10 w-10 text-gold-bright" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-white">Thank you, {bookingName}!</h3>
            <p className="mt-3 text-white/70">Your journey request has been received.</p>
            <p className="text-white/70">You&apos;ll receive a personal confirmation within 24 hours.</p>
            {bookingReference && (
              <p className="mt-6 inline-block rounded-full border border-gold-bright/30 bg-gold-bright/10 px-5 py-2 text-sm text-gold-bright" aria-live="polite">
                Booking reference: <strong>{bookingReference}</strong>
              </p>
            )}
            <div className="mt-8">
              <button
                onClick={() => { setIsSuccess(false); setBookingName(''); setBookingReference(''); setStep(1); }}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-gold-bright px-7 text-sm font-bold text-canopy-950 transition-colors hover:bg-cinnamon"
              >
                Plan another journey
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="section-space relative overflow-hidden bg-canopy-950 grain">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold-bright/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-canopy-600/20 blur-3xl" aria-hidden="true" />

      <div className="container-premium relative">
        <SectionHeading
          align="center"
          dark
          eyebrow="Book now"
          title="Reserve your"
          accent="Ceylon story."
          description="Three quick steps. Your guide confirms personally within 24 hours — no payment details needed to request a booking."
        />

        <div className="mx-auto max-w-2xl">
          <div className="mb-10 mt-12 flex items-center justify-center" role="list" aria-label="Booking progress">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center" role="listitem" aria-current={step === s.num ? 'step' : undefined}>
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                    step >= s.num ? 'bg-gold-bright text-canopy-950' : 'bg-white/10 text-white/50'
                  }`}>
                    {step > s.num ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`hidden text-xs font-semibold sm:block ${step >= s.num ? 'text-white' : 'text-white/45'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-px w-12 transition-colors duration-300 sm:w-20 ${step > s.num ? 'bg-gold-bright' : 'bg-white/15'}`} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.75rem] border border-white/10 bg-shell p-6 shadow-2xl sm:p-9"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <h3 className="font-display text-2xl text-ink">Your details</h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <InputField label="Full Name" placeholder="Your full name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} error={errors.name} />
                    <InputField label="Email Address" type="email" placeholder="your@email.com" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} error={errors.email} />
                  </div>
                  <InputField label="Phone Number" type="tel" placeholder="+94 77 123 4567" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} error={errors.phone} />
                  <div className="pt-4">
                    <button onClick={handleNext} className="min-h-13 w-full cursor-pointer rounded-xl bg-canopy py-3.5 font-bold text-white transition-colors hover:bg-canopy-950">
                      Continue →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <h3 className="font-display text-2xl text-ink">Choose your journey</h3>
                  <div className="space-y-2">
                    <label htmlFor="booking-tour" className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Select journey</label>
                    <select
                      id="booking-tour"
                      value={selectedTour}
                      onChange={e => setSelectedTour(e.target.value)}
                      aria-invalid={Boolean(errors.tour)}
                      aria-describedby={errors.tour ? 'booking-tour-error' : undefined}
                      className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink transition-all focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15"
                    >
                      <option value="">Choose your journey...</option>
                      {tours.map(tour => (
                        <option key={tour._id} value={tour._id}>{tour.name} — {formatPrice(tour)}</option>
                      ))}
                    </select>
                    {toursError && <p className="mt-2 text-sm text-cinnamon" role="alert">{toursError}</p>}
                    {errors.tour && <p id="booking-tour-error" className="mt-1 text-xs text-cinnamon">{errors.tour}</p>}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="booking-date" className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Preferred date</label>
                      <input
                        id="booking-date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => { const d = new Date(e.target.value); if (!isNaN(d)) setSelectedDate(d); }}
                        aria-invalid={Boolean(errors.date)}
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink transition-all focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15"
                      />
                      {errors.date && <p className="mt-1 text-xs text-cinnamon">{errors.date}</p>}
                    </div>
                    <div className="space-y-2">
                      <span id="people-label" className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Number of people</span>
                      <div className="flex items-center gap-4 rounded-xl border border-line bg-white px-4 py-2" role="group" aria-labelledby="people-label">
                        <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Decrease number of people" className="h-9 w-9 cursor-pointer rounded-full border border-canopy/30 font-display text-lg text-canopy transition-colors hover:bg-canopy hover:text-white">−</button>
                        <span className="w-8 text-center font-display text-xl text-ink" aria-live="polite">{people}</span>
                        <button type="button" onClick={() => setPeople(Math.min(15, people + 1))} aria-label="Increase number of people" className="h-9 w-9 cursor-pointer rounded-full border border-canopy/30 font-display text-lg text-canopy transition-colors hover:bg-canopy hover:text-white">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep(1)} className="min-h-13 flex-1 cursor-pointer rounded-xl border-2 border-line py-3.5 font-bold text-moss transition-colors hover:border-canopy/40 hover:text-ink">← Back</button>
                    <button onClick={handleNext} className="min-h-13 flex-1 cursor-pointer rounded-xl bg-canopy py-3.5 font-bold text-white transition-colors hover:bg-canopy-950">Review booking →</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
                  <h3 className="font-display text-2xl text-ink">Review your booking</h3>
                  <div className="space-y-4 rounded-xl border border-line bg-white p-5">
                    <ReviewRow label="Name" value={formData.name} />
                    <ReviewRow label="Email" value={formData.email} />
                    <ReviewRow label="Phone" value={formData.phone} />
                     <ReviewRow label="Journey" value={selectedTourDetails?.name || 'Not selected'} />
                    <ReviewRow label="Date" value={selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not selected'} />
                    <ReviewRow label="People" value={`${people} ${people === 1 ? 'person' : 'people'}`} />
                    <div className="border-t border-dashed border-line pt-4">
                       <ReviewRow label="Estimated total" value={selectedTourDetails?.priceOnRequest || selectedTourDetails?.price === 0 ? 'Price on request' : `${selectedTourDetails?.currency || 'USD'} ${((selectedTourDetails?.price || 0) * people).toLocaleString()}`} strong />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-requests" className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Special requests</label>
                    <textarea
                      id="booking-requests"
                      value={formData.specialRequests}
                      onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-ink transition-all focus:border-canopy focus:outline-none focus:ring-2 focus:ring-canopy/15"
                      placeholder="Dietary preferences, mobility needs, photography stops..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep(2)} className="min-h-13 flex-1 cursor-pointer rounded-xl border-2 border-line py-3.5 font-bold text-moss transition-colors hover:border-canopy/40 hover:text-ink">← Edit</button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="min-h-13 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold py-3.5 font-bold text-white transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                          </svg>
                          Submitting...
                        </>
                      ) : 'Confirm & book'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InputField({ label, placeholder, value, onChange, error, type = 'text' }) {
  const id = `booking-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-ink transition-all focus:outline-none focus:ring-2 ${
          error ? 'border-cinnamon/60 focus:ring-cinnamon/20' : 'border-line focus:border-canopy focus:ring-canopy/15'
        }`}
      />
      {error && <p id={`${id}-error`} className="text-xs text-cinnamon">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-moss">{label}</span>
      <span className={`text-right text-sm text-ink ${strong ? 'font-display text-xl text-canopy' : 'font-semibold'}`}>{value}</span>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/gallery')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { if (data.success) setImages(data.images); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (images.length < 2 || reduceMotion) return undefined;
    const timer = window.setInterval(() => setActive(current => (current + 1) % images.length), 4200);
    return () => window.clearInterval(timer);
  }, [images.length, reduceMotion]);

  if (!images.length) return null;

  const move = direction => setActive((active + direction + images.length) % images.length);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section-space overflow-hidden bg-canopy-950 text-white">
      <div className="container-premium">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-gold-bright" aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-bright">From the island</p>
            </div>
            <h2 id="gallery-title" className="section-title text-white">Little moments.<br /><em className="wonk not-italic text-gold-bright">Big memories.</em></h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70">A few glimpses from the roads, coastlines, and quiet corners we love to share.</p>
            {images.length > 1 && (
              <div className="mt-8 flex items-center gap-3">
                <button type="button" onClick={() => move(-1)} aria-label="Previous gallery image" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-xl transition-colors hover:bg-white hover:text-canopy-950">←</button>
                <button type="button" onClick={() => move(1)} aria-label="Next gallery image" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-xl transition-colors hover:bg-white hover:text-canopy-950">→</button>
                <span className="ml-2 text-xs font-bold tracking-[0.18em] text-white/50">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              </div>
            )}
          </div>

          <div className="relative h-[25rem] sm:h-[32rem]" aria-live="polite">
            {images.map((image, index) => {
              const offset = (index - active + images.length) % images.length;
              const position = offset === 0 ? 'active' : offset === 1 ? 'next' : offset === images.length - 1 ? 'previous' : 'hidden';
              return (
                <motion.figure
                  key={image._id}
                  initial={false}
                  animate={position}
                  variants={{
                    active: { opacity: 1, x: 0, rotate: 0, scale: 1, zIndex: 3 },
                    next: { opacity: 0.5, x: '38%', rotate: 8, scale: 0.82, zIndex: 2 },
                    previous: { opacity: 0.5, x: '-38%', rotate: -8, scale: 0.82, zIndex: 2 },
                    hidden: { opacity: 0, x: 0, rotate: 0, scale: 0.7, zIndex: 1 },
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 mx-auto w-[min(78vw,28rem)] origin-bottom"
                >
                  <div className="relative h-full overflow-hidden rounded-[2rem] border-8 border-white/10 bg-canopy-900 shadow-2xl">
                    <Image src={image.url} alt={image.alt} fill unoptimized sizes="(max-width: 640px) 78vw, 448px" className="object-cover" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16 text-sm text-white">{image.alt}</figcaption>
                  </div>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

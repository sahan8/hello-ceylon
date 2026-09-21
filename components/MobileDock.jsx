'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileDock() {
  const [visible, setVisible] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
        >
          <div className="glass-dark flex items-center gap-2 rounded-2xl p-2 shadow-[0_16px_40px_-12px_rgba(8,28,46,0.7)]">
            {number && (
              <a
                href={`https://wa.me/${number}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.348-.16-1.332-.49-2.338-1.462-.861-.767-1.442-1.713-1.61-2.004-.168-.29-.018-.447.13-.591.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            )}
            <Link
              href="#tours"
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-white/20 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Explore
            </Link>
            <Link
              href="#book"
              className="flex h-12 flex-[1.4] items-center justify-center rounded-xl bg-gold-bright text-sm font-bold text-canopy-950 transition-colors hover:bg-cinnamon"
            >
              Plan my trip →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

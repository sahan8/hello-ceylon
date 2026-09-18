'use client';

const destinations = [
  'Ella', 'Nine Arch Bridge', 'Yala National Park', 'Sigiriya', 'Mirissa',
  'Kandy', 'Galle Fort', 'Nuwara Eliya', 'Udawalawe', "Adam's Peak",
  'Diyaluma Falls', 'Anuradhapura', 'Trincomalee', 'Horton Plains',
];

function SunDivider() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mx-6 shrink-0 text-gold-bright/80 sm:mx-10">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {destinations.map(place => (
        <span key={place} className="flex items-center">
          <span className="whitespace-nowrap font-display text-lg italic text-shell/85 sm:text-xl">{place}</span>
          <SunDivider />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-canopy-950 py-4 sm:py-5" role="presentation">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row}
        {row}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canopy-950 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canopy-950 to-transparent" aria-hidden="true" />
    </div>
  );
}

export default function SectionHeading({ eyebrow, title, accent, description, align = 'left', dark = false }) {
  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <div className={`mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`h-px w-9 ${dark ? 'bg-gold-bright' : 'bg-gold'}`} aria-hidden="true" />
        <p className={`font-mono text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-gold-bright' : 'text-gold'}`}>{eyebrow}</p>
      </div>
      <h2 className={`section-title ${dark ? 'text-white' : 'text-ink'}`}>
        {title} {accent && <em className={`wonk not-italic ${dark ? 'text-gold-bright' : 'text-canopy'}`}>{accent}</em>}
      </h2>
      {description && (
        <p className={`mt-5 max-w-2xl text-base leading-7 ${dark ? 'text-white/70' : 'text-moss'} ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </header>
  );
}

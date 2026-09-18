export function SkeletonCards({ count = 3 }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading content">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-96 animate-pulse rounded-[1.75rem] border border-line bg-white/60" />
      ))}
    </div>
  );
}

export function DataState({ title, message, action, actionLabel = 'Try again' }) {
  return (
    <div className="rounded-[1.75rem] border border-line bg-white/80 px-6 py-14 text-center paper-edge" role="status">
      <h3 className="font-display text-3xl text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-moss">{message}</p>
      {action && (
        <button onClick={action} className="mt-6 min-h-12 cursor-pointer rounded-full bg-canopy px-6 font-bold text-white transition-colors hover:bg-canopy-950">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

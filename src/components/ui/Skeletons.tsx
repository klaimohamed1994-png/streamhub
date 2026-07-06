export function CardSkeleton() {
  return (
    <div className="w-[150px] sm:w-[160px] md:w-[180px] shrink-0">
      <div className="aspect-[2/3] skeleton rounded-xl mb-2" />
      <div className="skeleton h-3 w-3/4 mb-1 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div>
      <div className="skeleton h-6 w-48 rounded mb-4" />
      <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="w-full aspect-video skeleton rounded-xl" />
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <div className="h-[50vh] skeleton" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 shrink-0">
            <div className="aspect-[2/3] skeleton rounded-xl" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3 pt-8">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

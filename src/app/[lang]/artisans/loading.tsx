import { Skeleton } from "@/components/skeleton";

function ArtisanCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-primary/10 shadow-xs p-3 sm:p-3.5 flex flex-col h-full relative">
      {/* 2x2 Image Preview Grid Skeleton */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl md:rounded-2xl overflow-hidden aspect-square bg-cream/40 mb-3 relative p-1 border border-primary/5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative w-full h-full aspect-square rounded-lg overflow-hidden bg-cream/30"
          >
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Studio Info Section */}
      <div className="flex items-center justify-between gap-2.5 pt-1 mt-auto">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Studio Avatar */}
          <Skeleton className="w-11 h-11 rounded-full shrink-0" />

          {/* Studio Details */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="w-32 h-4 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-16 h-3 rounded-md" />
              <Skeleton className="w-12 h-3 rounded-md" />
            </div>
          </div>
        </div>

        {/* Heart / Favorite Button */}
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      </div>
    </div>
  );
}

export default function ArtisansLoading() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Sticky Navbar Skeleton */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-primary/5">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          <Skeleton className="w-28 md:w-36 h-9 md:h-10 rounded-xl shrink-0" />
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <Skeleton className="w-full h-11 rounded-full" />
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20">
        {/* Header Skeleton */}
        <div className="text-center mb-16 md:mb-20 space-y-6">
          <Skeleton className="w-44 h-8 rounded-full mx-auto" />
          <Skeleton className="w-72 md:w-96 h-12 md:h-16 rounded-2xl mx-auto" />
          <Skeleton className="w-full max-w-xl h-5 rounded-md mx-auto" />
        </div>

        {/* Artisans Cards Grid Skeleton: 4 cols on desktop matching /artisans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ArtisanCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

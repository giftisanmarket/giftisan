import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar Skeleton */}
      <div className="h-16 md:h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-24 md:w-32 h-8 md:h-10 rounded-lg" />
        <div className="flex gap-2 md:gap-4">
          <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
          <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 space-y-20 md:space-y-32">
        {/* Hero Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Skeleton className="w-20 md:w-24 h-5 md:h-6 rounded-full" />
            <Skeleton className="w-full h-12 md:h-20 rounded-xl md:rounded-2xl" />
            <Skeleton className="w-3/4 h-12 md:h-20 rounded-xl md:rounded-2xl" />
            <Skeleton className="w-2/3 h-8 md:h-12 rounded-lg md:rounded-xl" />
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Skeleton className="w-full sm:w-40 h-14 rounded-full" />
              <Skeleton className="w-full sm:w-40 h-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="aspect-square rounded-[2rem] md:rounded-[3rem] hidden lg:block" />
        </div>

        {/* Featured Treasures Skeleton */}
        <div className="space-y-8 md:space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-3 w-full sm:w-auto">
              <Skeleton className="w-2/3 sm:w-64 h-8 md:h-10 rounded-lg" />
              <Skeleton className="w-full sm:w-80 h-4 md:h-5 rounded-md" />
            </div>
            <Skeleton className="w-24 md:w-32 h-6 rounded-md" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3 md:space-y-4">
                <Skeleton className="aspect-[3/4] rounded-2xl md:rounded-[2rem]" />
                <Skeleton className="w-16 md:w-24 h-3 md:h-4 rounded-md" />
                <Skeleton className="w-full h-6 md:h-8 rounded-lg" />
                <Skeleton className="w-12 md:w-20 h-4 md:h-6 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-8 md:space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-3 w-full sm:w-auto">
              <Skeleton className="w-1/2 sm:w-56 h-8 md:h-10 rounded-lg" />
              <Skeleton className="w-full sm:w-72 h-4 md:h-5 rounded-md" />
            </div>
            <Skeleton className="w-24 md:w-32 h-6 rounded-md" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-2xl md:rounded-3xl p-3 md:p-6 flex flex-col items-center justify-center gap-2 md:gap-3 bg-white border border-primary/5">
                <Skeleton className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl" />
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  <Skeleton className="w-12 md:w-20 h-3 md:h-4 rounded-md" />
                  <Skeleton className="w-8 md:w-12 h-2 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Bar Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-12 md:py-16 border-y border-primary/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 md:space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl" />
              <Skeleton className="w-32 md:w-40 h-6 md:h-8 rounded-lg" />
              <Skeleton className="w-full max-w-xs h-10 md:h-12 rounded-md" />
            </div>
          ))}
        </div>

        {/* Artisan Spotlight Skeleton */}
        <div className="space-y-8 md:space-y-12 pb-12 md:pb-20">
          <div className="flex justify-between items-end">
            <div className="space-y-3 w-full">
              <Skeleton className="w-1/2 sm:w-72 h-8 md:h-12 rounded-lg" />
              <Skeleton className="w-full sm:w-96 h-4 md:h-5 rounded-md" />
            </div>
          </div>
          <div className="flex gap-4 md:gap-8 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[280px] md:w-80 bg-cream rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-primary/5 space-y-4 md:space-y-6">
                <Skeleton className="w-16 h-16 md:w-24 md:h-24 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="w-32 md:w-40 h-6 md:h-8 rounded-lg" />
                  <Skeleton className="w-20 md:w-24 h-3 md:h-4 rounded-md" />
                  <Skeleton className="w-full h-16 md:h-20 rounded-lg md:rounded-xl" />
                </div>
                <div className="pt-4 md:pt-6 border-t border-primary/5 flex justify-between items-center">
                  <Skeleton className="w-20 md:w-24 h-3" />
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/skeleton";
import { NavbarSkeleton } from "@/components/navbar-skeleton";

export default function GiftsLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <NavbarSkeleton />

      {/* Hero Skeleton with lavender tone */}
      <section className="bg-gradient-to-b from-[#EFE9F6] via-[#F7F4FA] to-cream pt-10 md:pt-16 pb-12 md:pb-16 border-b border-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 md:mb-14 flex flex-col items-center">
            <Skeleton className="w-64 md:w-80 h-10 md:h-14 rounded-2xl bg-primary/10" />
            <Skeleton className="w-80 md:w-96 h-5 rounded-lg bg-primary/10" />
          </div>

          {/* 3 Cards Skeleton */}
          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible pb-4 pt-1 px-4 -mx-4 md:px-0 md:mx-auto snap-x snap-mandatory scrollbar-none">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[76vw] max-w-[310px] sm:w-[46vw] md:w-auto shrink-0 snap-center md:snap-align-none rounded-3xl p-3 md:p-3.5 bg-white/70 border border-primary/10 space-y-3"
              >
                <Skeleton className="aspect-[4/5] rounded-2xl md:rounded-[22px] w-full bg-primary/10" />
                <div className="space-y-2 px-1">
                  <Skeleton className="w-32 h-5 rounded-lg bg-primary/10" />
                  <Skeleton className="w-44 h-3.5 rounded bg-primary/10" />
                  <Skeleton className="w-20 h-3.5 rounded bg-primary/10 mt-2" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <div className="py-3 border-y border-primary/5 mb-6 md:mb-8 bg-cream/95">
        <div className="container mx-auto px-4 md:px-6 flex gap-2">
          <Skeleton className="w-24 h-8 rounded-full" />
          <Skeleton className="w-28 h-8 rounded-full" />
          <Skeleton className="w-28 h-8 rounded-full" />
          <Skeleton className="w-28 h-8 rounded-full" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <section className="container mx-auto px-4 md:px-6 pb-16">
        <Skeleton className="w-48 h-8 rounded-lg mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-xl md:rounded-2xl w-full" />
              <div className="space-y-1 pt-1">
                <Skeleton className="w-20 h-3 rounded" />
                <Skeleton className="w-4/5 h-4 rounded" />
                <Skeleton className="w-16 h-3.5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

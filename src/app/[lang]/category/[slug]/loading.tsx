import { Skeleton } from "@/components/skeleton";
import { NavbarSkeleton } from "@/components/navbar-skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <NavbarSkeleton />
      {/* Category Header Skeleton */}
      <section className="pt-8 md:pt-12 pb-6 md:pb-8 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto flex flex-col items-center space-y-3">
            <Skeleton className="w-48 sm:w-64 md:w-80 h-10 md:h-12 rounded-xl" />
            <Skeleton className="w-64 sm:w-96 h-4 md:h-5 rounded-full" />
          </div>
        </div>
      </section>

      {/* Filter Pills Toolbar Skeleton */}
      <div className="sticky top-[72px] md:top-[124px] z-30 bg-cream/95 backdrop-blur-md py-3 border-y border-primary/5 mb-6 md:mb-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-24 h-7 rounded-full" />
            <Skeleton className="w-28 h-7 rounded-full" />
            <Skeleton className="w-24 h-7 rounded-full" />
            <Skeleton className="w-32 h-7 rounded-full" />
          </div>
          <Skeleton className="w-16 h-4 rounded-md" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <section className="pb-12 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group block">
              {/* Image box mockup */}
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-2">
                <Skeleton className="w-full h-full rounded-inherit" />
              </div>
              
              {/* Product title and info mockup */}
              <div className="space-y-1.5 px-0.5">
                <div className="flex justify-between items-center gap-2">
                  <Skeleton className="w-3/4 h-3.5 rounded-md" />
                  <Skeleton className="w-10 h-3 rounded-md" />
                </div>
                <Skeleton className="w-1/2 h-3 rounded-md" />
                <Skeleton className="w-16 h-3.5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

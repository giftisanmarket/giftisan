import { Skeleton } from "@/components/skeleton";
import { NavbarSkeleton } from "@/components/navbar-skeleton";

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <NavbarSkeleton />
      {/* Header Skeleton */}
      <section className="pt-8 md:pt-12 pb-6 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl mx-auto flex flex-col items-center space-y-3">
            <Skeleton className="w-56 sm:w-72 md:w-96 h-10 md:h-12 rounded-xl" />
            <Skeleton className="w-72 sm:w-96 h-4 md:h-5 rounded-full" />
          </div>
        </div>
      </section>

      {/* Filter Tabs Skeleton */}
      <section className="container mx-auto px-4 md:px-6 mb-8 md:mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-28 h-8 rounded-full" />
          ))}
        </div>
      </section>

      {/* Categories Grid Skeleton */}
      <section className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 md:p-6 border border-primary/5 flex flex-col items-center justify-center shadow-xs">
              <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl mb-3" />
              <Skeleton className="w-24 h-4 rounded-md mb-1.5" />
              <Skeleton className="w-16 h-3 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

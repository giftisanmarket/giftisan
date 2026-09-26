import { Skeleton } from "@/components/skeleton";

export function NavbarSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full pointer-events-none select-none">
      <nav className="w-full glass border-b border-primary/10">
        {/* Tier 1: Top Navigation Bar */}
        <div className="max-w-[1600px] mx-auto px-3.5 md:px-8 lg:px-12 h-14 md:h-20 flex items-center justify-between gap-2 md:gap-4 lg:gap-6 xl:gap-8">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-md" />
            <Skeleton className="w-20 md:w-24 h-6 md:h-7 rounded-lg" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 w-full max-w-2xl">
            <Skeleton className="w-full h-11 rounded-full" />
          </div>

          {/* Actions: Heart, Cart, Profile, Lang */}
          <div className="flex items-center gap-1 md:gap-1.5 xl:gap-2">
            <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-full" />
            <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-full" />
            <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full md:hidden" />
            <div className="ps-1 border-s border-primary/10">
              <Skeleton className="w-8 md:w-10 h-6 md:h-7 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tier 2: Dedicated Mobile Search Bar */}
        <div className="block md:hidden px-3.5 pb-2.5">
          <Skeleton className="w-full h-9 rounded-full" />
        </div>

        {/* Tier 3: Mobile Category Pills Carousel */}
        <div className="block md:hidden border-t border-primary/5 px-3 py-2 bg-cream/15 overflow-hidden">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-16 sm:w-20 rounded-full shrink-0" />
            ))}
          </div>
        </div>

        {/* Tier 4: Desktop Categories Bar */}
        <div className="hidden md:block border-t border-primary/5 py-3">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-8">
            <div className="flex items-center gap-6 lg:gap-10 overflow-hidden flex-1 py-1">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-4 w-16 lg:w-20 rounded" />
              ))}
            </div>
            <div className="ps-6 border-s border-primary/10 shrink-0">
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

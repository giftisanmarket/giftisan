import { Skeleton } from "@/components/skeleton";

function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-square rounded-xl md:rounded-2xl w-full" />
      <div className="space-y-1.5 pt-1">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-4/5 h-4 rounded" />
        <Skeleton className="w-16 h-3.5 rounded" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#064e3b08_1px,transparent_1px),linear-gradient(to_bottom,#064e3b08_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none -z-10" />

      {/* Navbar Skeleton */}
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-primary/5">
        {/* Top Navbar Row */}
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo Skeleton */}
          <Skeleton className="w-28 md:w-36 h-9 md:h-10 rounded-xl shrink-0" />

          {/* Search Bar Skeleton */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <Skeleton className="w-full h-11 rounded-full" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Skeleton className="w-9 h-9 rounded-full hidden sm:block" />
            <Skeleton className="w-24 h-9 rounded-full hidden lg:block" />
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>

        {/* Category Bar Skeleton */}
        <div className="hidden md:block border-t border-primary/5">
          <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="w-20 lg:w-28 h-3.5 rounded" />
            ))}
            <Skeleton className="w-36 h-3.5 rounded shrink-0" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="space-y-10 md:space-y-16 pb-20">
        {/* Hero Section Skeleton */}
        <section className="w-full max-w-[1520px] mx-auto px-4 md:px-8 py-3 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
            {/* Left Card: Main Hero Banner */}
            <div className="lg:col-span-7 xl:col-span-8 rounded-2xl md:rounded-3xl overflow-hidden bg-primary/10 border border-primary/10 grid grid-cols-1 sm:grid-cols-2 min-h-[380px] lg:min-h-[430px]">
              <div className="flex flex-col justify-center items-center text-center p-8 sm:p-10 space-y-6">
                <Skeleton className="w-28 h-6 rounded-full bg-primary/15" />
                <div className="space-y-3 w-full flex flex-col items-center">
                  <Skeleton className="w-4/5 h-9 md:h-11 rounded-xl bg-primary/15" />
                  <Skeleton className="w-3/5 h-9 md:h-11 rounded-xl bg-primary/15" />
                </div>
                <Skeleton className="w-36 h-11 rounded-full bg-primary/20" />
              </div>
              <div className="w-full h-full min-h-[220px] sm:min-h-[380px] bg-primary/15" />
            </div>

            {/* Right Card: Artisan Spotlight */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 rounded-2xl md:rounded-3xl overflow-hidden min-h-[380px] lg:min-h-[430px] border border-primary/10 bg-primary/10 p-8 flex-col justify-end space-y-4">
              <Skeleton className="w-28 h-5 rounded-full bg-primary/15" />
              <div className="space-y-2">
                <Skeleton className="w-4/5 h-7 rounded-lg bg-primary/15" />
                <Skeleton className="w-3/5 h-4 rounded-md bg-primary/15" />
              </div>
              <Skeleton className="w-32 h-10 rounded-full bg-primary/20" />
            </div>
          </div>
        </section>

        {/* Section 1: Featured Products / Products of the Week */}
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div className="space-y-2">
              <Skeleton className="w-56 md:w-72 h-8 md:h-9 rounded-lg" />
              <Skeleton className="w-72 md:w-96 h-4 rounded-md" />
            </div>
            <Skeleton className="w-36 h-5 rounded-md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Section 2: Personalized & Bespoke Gifts */}
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-10 border-t border-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div className="space-y-2">
              <Skeleton className="w-64 md:w-80 h-8 md:h-9 rounded-lg" />
              <Skeleton className="w-80 md:w-[420px] h-4 rounded-md" />
            </div>
            <Skeleton className="w-36 h-5 rounded-md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Section 3: Handcrafted Textiles & Wearables */}
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-10 border-t border-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
            <div className="space-y-2">
              <Skeleton className="w-64 md:w-80 h-8 md:h-9 rounded-lg" />
              <Skeleton className="w-80 md:w-[420px] h-4 rounded-md" />
            </div>
            <Skeleton className="w-36 h-5 rounded-md" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Trust Bar Skeleton */}
        <section className="max-w-[1520px] mx-auto px-4 md:px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-10 md:py-14 border-t border-primary/5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-primary/5">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-36 h-5 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-4/5 h-4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

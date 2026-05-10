import { Skeleton } from "@/components/skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Category Header Skeleton */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <Skeleton className="w-40 h-4 md:w-48 md:h-5 bg-white/20 rounded-full" />
            <Skeleton className="w-64 h-12 md:w-96 md:h-16 bg-white/20 rounded-xl" />
            <Skeleton className="w-full h-12 bg-white/20 rounded-xl" />
          </div>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 end-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Toolbar Skeleton */}
      <div className="sticky top-[72px] md:top-[124px] z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-3 md:py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center gap-3">
          <Skeleton className="w-32 h-4 md:w-48 md:h-5 rounded-md" />
          <div className="flex items-center gap-2 md:gap-3">
            <Skeleton className="w-20 h-7 md:w-32 md:h-10 rounded-full" />
            <Skeleton className="w-20 h-7 md:w-32 md:h-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <section className="py-6 md:py-12 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group block">
              {/* Image box mockup */}
              <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden mb-3 md:mb-6">
                <Skeleton className="w-full h-full rounded-inherit" />
              </div>
              
              {/* Product title and info mockup */}
              <div className="space-y-1.5 md:space-y-2 px-1">
                <Skeleton className="w-20 h-3 md:w-32 md:h-4 rounded-md" />
                <Skeleton className="w-full h-5 md:h-8 rounded-lg" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-16 h-4 md:w-20 md:h-5 rounded-md" />
                  <Skeleton className="w-16 h-3 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

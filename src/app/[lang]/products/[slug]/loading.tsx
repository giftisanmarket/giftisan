import { Skeleton } from "@/components/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-cream pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 min-w-0">
          {/* Image Gallery Skeleton */}
          <div className="space-y-6 min-w-0">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Skeleton className="w-full h-full rounded-inherit" />
            </div>
            
            {/* Horizontal Thumbnails Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 md:w-24 aspect-square rounded-xl shrink-0" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col min-w-0 space-y-6">
            <div className="space-y-4">
              <Skeleton className="w-24 h-4 md:w-32 md:h-5 rounded-md" />
              <Skeleton className="w-full h-10 md:h-14 rounded-xl" />
              
              <div className="flex items-center gap-2 pt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Skeleton key={s} className="w-4 h-4 rounded-full" />
                  ))}
                </div>
                <Skeleton className="w-20 h-4 rounded-md" />
              </div>
            </div>

            {/* Price & Stock Display */}
            <div className="flex items-center justify-between py-2">
              <Skeleton className="w-36 h-8 md:w-44 md:h-10 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="w-20 h-4 rounded-md" />
              </div>
            </div>

            {/* Description Text Mock */}
            <div className="border-l-4 border-accent/20 ps-6 py-2 space-y-2">
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-4/5 h-4 rounded-md" />
            </div>

            {/* Artisan Quick Bio Card Mock */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-4 p-5 md:p-6 bg-white rounded-3xl border border-primary/5 shadow-sm flex-1">
                <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-24 h-3 rounded-md" />
                  <Skeleton className="w-44 h-5 rounded-md" />
                  <Skeleton className="w-32 h-3 rounded-md" />
                </div>
              </div>
              <Skeleton className="w-full md:w-40 h-14 md:h-16 rounded-3xl" />
            </div>

            {/* Actions & Buttons */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <Skeleton className="flex-1 h-16 rounded-2xl" />
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
              </div>
              <Skeleton className="w-full h-16 rounded-2xl" />
            </div>

            {/* Benefits Row Mock */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="w-24 h-4 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

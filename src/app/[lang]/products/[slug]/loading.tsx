import { Skeleton } from "@/components/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-12 md:py-32 mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4 md:space-y-6">
            <Skeleton className="aspect-square rounded-[2rem] md:rounded-[3rem]" />
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl md:rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-8 md:space-y-12 bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-24 h-4 md:w-32 md:h-6 rounded-full" />
                  <Skeleton className="w-full h-8 md:h-12 rounded-lg" />
                </div>
                <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0" />
              </div>
              <Skeleton className="w-28 md:w-32 h-8 md:h-10 rounded-lg" />
            </div>

            <div className="space-y-4 md:space-y-6">
              <Skeleton className="w-32 md:w-48 h-6 md:h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-full h-3 md:h-4 rounded-md" />
                <Skeleton className="w-full h-3 md:h-4 rounded-md" />
                <Skeleton className="w-3/4 h-3 md:h-4 rounded-md" />
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-primary/5 flex gap-3 md:gap-4">
              <Skeleton className="flex-1 h-14 md:h-16 rounded-2xl md:rounded-full" />
              <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-full" />
            </div>

            <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
              <Skeleton className="w-32 md:w-40 h-6 md:h-8 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream/50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                    <Skeleton className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
                    <Skeleton className="w-20 md:w-24 h-3 md:h-4 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

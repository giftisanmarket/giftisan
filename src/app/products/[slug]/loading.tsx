import { Skeleton } from "@/components/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-32 mt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image Gallery Skeleton */}
          <div className="space-y-6">
            <Skeleton className="aspect-square rounded-[3rem]" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-12 bg-white rounded-[4rem] p-12 border border-primary/5 shadow-2xl shadow-primary/5">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="w-32 h-6 rounded-full" />
                  <Skeleton className="w-full h-12 rounded-lg" />
                </div>
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>

            <div className="space-y-6">
              <Skeleton className="w-48 h-8 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4 rounded-md" />
                <Skeleton className="w-full h-4 rounded-md" />
                <Skeleton className="w-3/4 h-4 rounded-md" />
              </div>
            </div>

            <div className="pt-8 border-t border-primary/5 flex gap-4">
              <Skeleton className="flex-1 h-16 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>

            <div className="space-y-6 pt-12">
              <Skeleton className="w-40 h-8 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream/50 p-4 rounded-2xl">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-24 h-4 rounded-md" />
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

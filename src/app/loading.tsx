import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar Skeleton */}
      <div className="h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 space-y-32">
        {/* Hero Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-full h-20 rounded-2xl" />
            <Skeleton className="w-3/4 h-20 rounded-2xl" />
            <Skeleton className="w-2/3 h-12 rounded-xl" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="w-40 h-14 rounded-full" />
              <Skeleton className="w-40 h-14 rounded-full" />
            </div>
          </div>
          <Skeleton className="aspect-square rounded-[3rem]" />
        </div>

        {/* Featured Treasures Skeleton (6 items) */}
        <div className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="w-64 h-10 rounded-lg" />
              <Skeleton className="w-80 h-5 rounded-md" />
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-[2rem]" />
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-20 h-6 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Skeleton (6 items) */}
        <div className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="w-56 h-10 rounded-lg" />
              <Skeleton className="w-72 h-5 rounded-md" />
            </div>
            <Skeleton className="w-32 h-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-3xl p-6 flex flex-col items-center justify-center gap-3 bg-white border border-primary/5">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="w-20 h-4 rounded-md" />
                  <Skeleton className="w-12 h-2 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Bar Skeleton */}
        <div className="grid md:grid-cols-3 gap-12 py-16 border-y border-primary/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="w-40 h-8 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-md" />
            </div>
          ))}
        </div>

        {/* Artisan Spotlight Skeleton (5 items) */}
        <div className="space-y-12 pb-20">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <Skeleton className="w-72 h-12 rounded-lg" />
              <Skeleton className="w-96 h-5 rounded-md" />
            </div>
          </div>
          <div className="flex gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-cream rounded-[3rem] p-8 border border-primary/5 space-y-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="w-40 h-8 rounded-lg" />
                  <Skeleton className="w-24 h-4 rounded-md" />
                  <Skeleton className="w-full h-20 rounded-xl" />
                </div>
                <div className="pt-6 border-t border-primary/5 flex justify-between">
                  <Skeleton className="w-24 h-3" />
                  <Skeleton className="w-10 h-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Category Header Skeleton */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6">
            <Skeleton className="w-48 h-6 rounded-full" />
            <Skeleton className="w-80 h-16 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Toolbar Skeleton */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-primary/5 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Skeleton className="w-48 h-5 rounded-md" />
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-[4/5] rounded-[3rem]" />
              <div className="space-y-3 px-2">
                <Skeleton className="w-32 h-4 rounded-md" />
                <Skeleton className="w-3/4 h-8 rounded-lg" />
                <Skeleton className="w-40 h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

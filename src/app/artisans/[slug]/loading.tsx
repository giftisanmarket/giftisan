import { Skeleton } from "@/components/skeleton";

export default function ArtisanDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Profile Header Skeleton */}
      <section className="pt-32 pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
            <Skeleton className="w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl flex-shrink-0" />
            <div className="flex-1 space-y-6 w-full text-center md:text-left">
              <div className="space-y-4">
                <Skeleton className="w-48 h-6 rounded-full mx-auto md:mx-0" />
                <Skeleton className="w-96 h-12 rounded-lg mx-auto md:mx-0" />
                <Skeleton className="w-full max-w-lg h-5 rounded-md mx-auto md:mx-0" />
                <Skeleton className="w-64 h-5 rounded-md mx-auto md:mx-0" />
              </div>
            </div>
            <Skeleton className="w-48 h-16 rounded-full" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <Skeleton className="w-48 h-8 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-md" />
          </div>
          <Skeleton className="w-40 h-10 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-square rounded-[3rem]" />
              <div className="space-y-3 px-2">
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-3/4 h-8 rounded-lg" />
                <Skeleton className="w-32 h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

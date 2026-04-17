import { Skeleton } from "@/components/skeleton";

export default function ArtisanDetailLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Profile Header Skeleton */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 bg-primary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl flex-shrink-0" />
            <div className="flex-1 space-y-4 md:space-y-6 w-full text-center md:text-left">
              <div className="space-y-3 md:space-y-4">
                <Skeleton className="w-32 h-5 md:w-48 md:h-6 rounded-full mx-auto md:mx-0" />
                <Skeleton className="w-full max-w-sm h-10 md:h-12 rounded-lg mx-auto md:mx-0" />
                <Skeleton className="w-full max-w-lg h-4 md:h-5 rounded-md mx-auto md:mx-0" />
                <Skeleton className="w-2/3 max-w-xs h-4 md:h-5 rounded-md mx-auto md:mx-0" />
              </div>
            </div>
            <Skeleton className="w-full md:w-48 h-14 md:h-16 rounded-full" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <Skeleton className="w-40 h-8 rounded-lg" />
            <Skeleton className="w-24 h-4 rounded-md" />
          </div>
          <Skeleton className="w-32 h-10 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4 md:space-y-6">
              <Skeleton className="aspect-square rounded-[2rem] md:rounded-[3rem]" />
              <div className="space-y-2 md:space-y-3 px-2">
                <Skeleton className="w-16 h-3 md:w-24 md:h-4 rounded-md" />
                <Skeleton className="w-full h-6 md:h-8 rounded-lg" />
                <Skeleton className="w-20 h-4 md:w-32 md:h-6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

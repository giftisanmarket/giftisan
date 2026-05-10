import { Skeleton } from "@/components/skeleton";

export default function ArtisanDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Profile Header Skeleton */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 bg-cream relative overflow-hidden min-h-[400px] md:min-h-[450px] flex items-end">
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar Skeleton */}
            <Skeleton className="w-32 h-32 md:w-52 md:h-52 rounded-[2rem] md:rounded-[3.5rem] border-4 border-white shadow-2xl flex-shrink-0" />
            
            {/* Info Skeleton */}
            <div className="flex-1 space-y-4 md:space-y-6 w-full text-center md:text-start">
              <div className="space-y-2">
                <Skeleton className="w-48 h-8 md:w-96 md:h-14 rounded-xl mx-auto md:mx-0" />
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-5 md:gap-8">
                <Skeleton className="w-24 h-4 md:w-32 md:h-5 rounded-md" />
                <Skeleton className="w-28 h-4 md:w-36 md:h-5 rounded-md" />
              </div>

              <div className="space-y-2 md:space-y-3">
                <Skeleton className="w-full max-w-xl h-4 md:h-5 rounded-md mx-auto md:mx-0" />
                <Skeleton className="w-4/5 max-w-lg h-4 md:h-5 rounded-md mx-auto md:mx-0" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 pt-4">
                <Skeleton className="w-36 h-12 md:w-56 md:h-16 rounded-full" />
                <div className="flex gap-2 md:gap-3">
                  <Skeleton className="w-11 h-11 md:w-16 md:h-16 rounded-full" />
                  <Skeleton className="w-11 h-11 md:w-16 md:h-16 rounded-full" />
                  <Skeleton className="w-11 h-11 md:w-16 md:h-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <div className="border-y border-primary/5 bg-white py-8 md:py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="w-12 h-8 md:w-20 md:h-12 rounded-lg mx-auto" />
              <Skeleton className="w-16 h-3 md:w-24 md:h-4 rounded-md mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Grid Skeleton */}
      <section className="py-16 md:py-32 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
          <div className="space-y-2 w-full md:w-auto">
            <Skeleton className="w-48 h-8 md:w-72 md:h-12 rounded-xl" />
            <Skeleton className="w-32 h-4 md:w-48 md:h-5 rounded-md" />
          </div>
          <div className="flex gap-4 md:gap-6 border-b border-primary/5 pb-2 w-full md:w-auto">
            <Skeleton className="w-16 h-5 rounded-md" />
            <Skeleton className="w-16 h-5 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden mb-4 md:mb-8">
                <Skeleton className="w-full h-full rounded-inherit" />
              </div>
              <Skeleton className="w-3/4 h-5 md:h-7 rounded-lg" />
              <Skeleton className="w-20 h-4 md:w-28 md:h-6 rounded-md" />
            </div>
          ))}
          
          {/* Custom Request Card Skeleton */}
          <div className="aspect-[4/5] rounded-[2rem] md:rounded-[3.5rem] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-cream/5 space-y-4">
            <Skeleton className="w-12 h-12 md:w-20 md:h-20 rounded-full" />
            <Skeleton className="w-24 h-5 md:w-36 md:h-7 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-2/3 h-4 rounded-md" />
            <Skeleton className="w-20 h-3 md:w-28 md:h-4 rounded-md pt-2" />
          </div>
        </div>
      </section>
    </div>
  );
}

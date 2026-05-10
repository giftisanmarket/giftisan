import { Skeleton } from "@/components/skeleton";

export default function ArtisansLoading() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="container mx-auto px-4 pt-40 pb-20">
        {/* Header Skeleton */}
        <div className="text-center mb-20 space-y-6">
          <Skeleton className="w-48 h-8 rounded-full mx-auto" />
          <Skeleton className="w-full max-w-2xl h-14 md:h-20 rounded-2xl mx-auto" />
          <Skeleton className="w-full max-w-xl h-5 rounded-md mx-auto" />
        </div>

        {/* Artisans Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              className="bg-white rounded-[3rem] p-10 border border-primary/5 space-y-8 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Avatar skeleton */}
                <Skeleton className="w-28 h-28 rounded-full shadow-lg" />
                
                {/* Name & Location */}
                <div className="space-y-2">
                  <Skeleton className="w-56 h-8 rounded-lg" />
                  <Skeleton className="w-24 h-4 rounded-md" />
                </div>
                
                {/* Bio paragraph lines */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-full h-4 rounded-md" />
                  <Skeleton className="w-3/4 h-4 rounded-md" />
                </div>
              </div>
              
              {/* Bottom bar row */}
              <div className="pt-8 border-t border-primary/5 flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="w-16 h-3 rounded-md" />
                  <Skeleton className="w-12 h-4 rounded-md" />
                </div>
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

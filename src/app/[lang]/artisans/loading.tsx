import { Skeleton } from "@/components/skeleton";

export default function ArtisansLoading() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Navbar Skeleton */}
      <div className="h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="py-24 bg-white border-b border-primary/5">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Skeleton className="w-24 h-6 rounded-full mx-auto" />
          <Skeleton className="w-96 h-12 rounded-lg mx-auto" />
          <Skeleton className="w-full max-w-lg h-5 rounded-md mx-auto" />
        </div>
      </div>

      {/* Search/Filter Bar Skeleton */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 shadow-xl shadow-primary/5 border border-primary/5">
          <Skeleton className="w-full h-14 rounded-2xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i}
              className="bg-white rounded-[3rem] p-8 border border-primary/5 space-y-6"
            >
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-32 h-4 rounded-md" />
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
  );
}

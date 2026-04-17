import { Skeleton } from "@/components/skeleton";

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar Skeleton */}
      <div className="h-20 border-b border-primary/5 px-4 flex items-center justify-between container mx-auto">
        <Skeleton className="w-32 h-10 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <Skeleton className="w-64 h-12 rounded-lg" />
            <Skeleton className="w-full max-w-lg h-5 rounded-md" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-primary/5 flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="w-48 h-6 rounded-md" />
                  <Skeleton className="w-32 h-4 rounded-sm" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
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
